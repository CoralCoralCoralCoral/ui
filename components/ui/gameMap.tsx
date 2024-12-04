// @ts-nocheck

"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Map, { Layer, Source, LayerProps, MapRef } from "react-map-gl"
import features from "../../features.json"
import { MapMouseEvent } from "mapbox-gl"
import bbox from "@turf/bbox"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateJurisdiction } from "@/store/navigation"

// const featureCollection = {
//     type: "FeatureCollection",
//     features
// }

const ladFill: LayerProps = {
    type: "fill",
    paint: {
        "fill-color": "#088",
        "fill-opacity": 0.2
    }
}

const msoaFill: LayerProps = {
    type: "fill",
    paint: {
        "fill-color": "#3d72a6",
        "fill-opacity": 0.2
    }
}

const featureOutline: LayerProps = {
    type: "line",
    paint: {
        "line-width": 1.5,
        "line-color": "#3d72a6"
    }
}

const selectedfeatureOutline: LayerProps = {
    type: "line",
    paint: {
        "line-width": 2,
        "line-color": "#000"
    }
}

const occurrenceLayer = {
    id: "occurrence-layer",
    type: "fill",
    paint: {
        "fill-color": [
            "interpolate",
            ["linear"],
            ["get", "infected_population"],
            0,
            "#f0f0f0", // Light color for 0 occurrences
            10,
            "#ff0000", // Red for 10+ occurrences
            100,
            "#ff8000", // Orange for 100+ occurrences
            1000,
            "#800000" // Dark red for 1000+ occurrences
        ],
        "fill-opacity": 0.3
    }
}

const globalBounds = [
    -0.4314506136112186, 51.289821227010464, 0.17693687630512045,
    51.623185093658435
]

export default function GameMap() {
    const mapRef = useRef<MapRef>()

    const [viewState, setViewState] = useState({
        longitude: -0.17464812922179362,
        latitude: 51.4839333603538,
        zoom: 9
    })

    const dispatch = useAppDispatch()

    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )

    const selectedLad = useAppSelector(store => store.navigation.selectedLad)

    const selectedMsoa = useAppSelector(store => store.navigation.selectedMsoa)

    const metrics = useAppSelector(store => store.metrics)

    const featureCollection = useMemo(() => {
        return {
            type: "FeatureCollection",
            features: features.map(feature => ({
                ...feature,
                properties: {
                    ...feature.properties,
                    ...metrics[feature.properties.code][
                        metrics[feature.properties.code].length - 1
                    ]
                }
            }))
        }
    }, [metrics])

    const selectedJurisdictionFilter = useMemo(() => {
        return ["in", "code", selectedJurisdiction.code]
    }, [selectedJurisdiction])

    const selectedLadChildFilter = useMemo(() => {
        return ["in", "parent", selectedLad || ""]
    }, [selectedLad])

    const onClick = (event: MapMouseEvent) => {
        const feature = event.features ? event.features[0] : undefined

        if (feature) {
            // update jurisdiction
            dispatch(updateJurisdiction(feature.properties))
        }
    }

    useEffect(() => {
        console.log(featureCollection)
    }, [featureCollection])

    useEffect(() => {
        if (!mapRef.current) {
            return
        }

        const feature = features.find(
            feature => feature.properties.code == selectedJurisdiction.code
        )

        if (feature || selectedJurisdiction.code == "GLOBAL") {
            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = feature
                ? bbox(feature)
                : globalBounds

            mapRef.current.fitBounds(
                [
                    [minLng, minLat],
                    [maxLng, maxLat]
                ],
                { padding: 40, duration: 1000 }
            )
        } else {
            console.log(`no feature named ${selectedJurisdiction.code}`)
        }
    }, [selectedJurisdiction])

    return (
        <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            initialViewState={viewState}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={({ viewState }) => setViewState(viewState)}
            onClick={onClick}
            interactiveLayerIds={["msoa-fill", "lad-fill"]}
            // maxBounds={bounds}
        >
            <Source type="geojson" data={featureCollection}>
                <Layer
                    id="lad-fill"
                    beforeId="waterway-label"
                    {...ladFill}
                    filter={["in", "level", "lad"]}
                />
                <Layer
                    id="lad-outline"
                    beforeId="waterway-label"
                    {...featureOutline}
                    filter={["in", "level", "lad"]}
                />
                <Layer beforeId="lad-outline" {...occurrenceLayer} />
                <Layer
                    id="msoa-fill"
                    beforeId="waterway-label"
                    {...msoaFill}
                    filter={selectedLadChildFilter}
                />
                <Layer
                    id="selected-feature-outline"
                    beforeId="waterway-label"
                    {...selectedfeatureOutline}
                    filter={selectedJurisdictionFilter}
                />
                <Layer
                    id="msoa-outline"
                    beforeId="selected-feature-outline"
                    {...featureOutline}
                    filter={selectedLadChildFilter}
                />
            </Source>
        </Map>
    )
}
