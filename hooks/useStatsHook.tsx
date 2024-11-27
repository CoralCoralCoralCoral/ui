'use client'

import { useEffect, useState } from 'react'
import { getLocationStats } from '../api'

interface Location {
    lat: number
    lon: number
}

export default function useStatsHook(location: Location) {
    const [isFetching, setIsFetching] = useState(false)
    const [stats, setStats] = useState<any | null>(null)

    useEffect(() => {
        console.log(location.lat)
        console.log(location.lon)

        let isCancelled = false

        const run = async () => {
            let results
            try {
                results = await getLocationStats()
                if (isCancelled) {
                    return
                }

                console.log(results)

                setStats(results)
            } catch(err) {
                console.error(err)
            } finally {
                setIsFetching(false)
            }
        }

        setIsFetching(true)
        run()

        return function() {
            isCancelled = true
        }
    }, [location.lat, location.lon])

    return [isFetching, stats]
}