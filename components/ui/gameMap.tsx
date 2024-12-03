"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Map, { Layer, Source, LayerProps, MapRef } from "react-map-gl"
import features from "../../features.json"
import { MapMouseEvent } from "mapbox-gl"
import bbox from "@turf/bbox"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { updateJurisdiction } from "@/store/navigation"

const featureCollection = {
    type: "FeatureCollection",
    features
}

const ladFill: LayerProps = {
    type: "fill",
    paint: {
        "fill-color": "#088",
        "fill-opacity": 0.4
    }
}

const msoaFill: LayerProps = {
    type: "fill",
    paint: {
        "fill-color": "#3d72a6",
        "fill-opacity": 0.4
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

// const bounds = [
//     [-0.4314506136112186, 51.289821227010464],
//     [0.17693687630512045, 51.623185093658435]
// ]

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

    const selectedJurisdictionFilter = useMemo(() => {
        return ["in", "code", selectedJurisdiction.code]
    }, [selectedJurisdiction])

    const selectedLadChildFilter = useMemo(() => {
        return ["in", "parent", selectedLad]
    }, [selectedLad])

    useEffect(() => {
        if (!mapRef.current) {
            return
        }

        const feature = features.find(
            feature => feature.properties.code == selectedJurisdiction.code
        )

        if (feature) {
            // calculate the bounding box of the feature
            const [minLng, minLat, maxLng, maxLat] = bbox(feature)

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

    const onClick = (event: MapMouseEvent) => {
        const feature = event.features ? event.features[0] : undefined

        if (feature) {
            // update jurisdiction
            dispatch(updateJurisdiction(feature.properties))
        }
    }

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
                <Layer
                    id="msoa-fill"
                    beforeId="waterway-label"
                    {...msoaFill}
                    filter={selectedLadChildFilter}
                />
                <Layer
                    id="msoa-outline"
                    beforeId="selected-feature-outline"
                    {...featureOutline}
                    filter={selectedLadChildFilter}
                />
                <Layer
                    id="selected-feature-outline"
                    beforeId="waterway-label"
                    {...selectedfeatureOutline}
                    filter={selectedJurisdictionFilter}
                />
            </Source>
        </Map>
    )
}
