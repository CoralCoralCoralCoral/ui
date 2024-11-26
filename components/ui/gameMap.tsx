'use client'

import { useEffect, useMemo, useState } from "react";
import Map, { Layer, LngLat, LngLatBounds, Source, LayerProps } from "react-map-gl";
import msoa from "../../msoas.json"

const polygonFill: LayerProps = {
    type: "fill",
    paint: {
      "fill-color": "#088",
      "fill-opacity": 0.5,
    },
  };

const polygonOutline: LayerProps = {
    type: "line",
    paint: {
        "line-color": "#000",
        "line-width": 1
    } 
}

export default function GameMap() {
    const [viewState, setViewState] = useState({
        longitude: -0.17464812922179362,
        latitude: 51.4839333603538,
        zoom: 12
    })

    const featureCollections = useMemo(() => {
        return msoa.map(data => data.AdditionalData).slice(0, 50)
    }, [])

    useEffect(() => {
        console.log(viewState)

        console.log(featureCollections)
    }, [viewState, featureCollections])

    const bounds =[
        [-0.4314506136112186, 51.289821227010464],
        [0.17693687630512045, 51.623185093658435]
    ]

    return (
        <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
            initialViewState={viewState}
            style={{width: "100%", height: "100%"}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            onMove={({ viewState }) => setViewState(viewState)}
            // maxBounds={bounds}
    >
        {featureCollections.map((collection, index) => {
            console.log(collection)
            return <Source key={index} type="geojson" data={collection}>
            <Layer id={`${index}-fill`} key={`${index}-fill`} {...polygonFill} />
            <Layer id={`${index}-outline`} key={`${index}-outline`} {...polygonOutline} />
        </Source>
        })}
        {/* <Source key={'blah'} type="geojson" data={featureCollections[100]}>
            <Layer {...polygonLayerStyle} />
        </Source> */}
    </Map> 
    
    )
}

