// @ts-nocheck

import { useGameContext } from "@/game/GameContext"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useCallback, useEffect, useState, useMemo } from "react"
import * as AlertDialog from "@radix-ui/react-alert-dialog"
import features from "../../features.json"
import { useDispatch } from "react-redux"
import { Button } from "./button"
import { updateJurisdiction } from "@/store/navigation"

const lads = features.reduce((acc, feature) => {
    if (feature.properties.level == "lad") {
        acc[feature.properties.code] = feature
    }

    return acc
}, {})

interface NextAlert {
    id: string
    type: string
    feature: any
}

export default function Oracle() {
    const { pauseGame } = useGameContext()
    const dispatch = useAppDispatch()
    const [dismissedAlerts, setDismissedAlerts] = useState({})

    const metrics = useAppSelector(store => store.metrics)

    const nextAlert: NextAlert | null = useMemo(() => {
        for (const [code, featureMetrics] of Object.entries(metrics)) {
            if (!lads[code]) {
                continue
            }

            if (featureMetrics.length == 0) {
                return
            }

            const metric = featureMetrics[featureMetrics.length - 1]
            if (
                metric.infected_population > 0 &&
                !dismissedAlerts[`${code}-spread`]
            ) {
                return {
                    id: `${code}-spread`,
                    type: "spread",
                    feature: lads[code]
                }
            }

            if (
                metric.dead_population > 0 &&
                !dismissedAlerts[`${code}-dead`]
            ) {
                return {
                    id: `${code}-dead`,
                    type: "dead",
                    feature: lads[code]
                }
            }
        }

        return null
    }, [metrics, dismissedAlerts])

    const handleDismiss = useCallback(() => {
        if (nextAlert) {
            setDismissedAlerts(dismissed => ({
                ...dismissed,
                [nextAlert.id]: true
            }))
        }
    }, [nextAlert, setDismissedAlerts])

    useEffect(() => {
        if (nextAlert) {
            // debugging
            console.log("ORACLE IS TRIGGERED")
            console.log(nextAlert)

            pauseGame()
            dispatch(updateJurisdiction(nextAlert.feature.properties))
        }
    }, [nextAlert, pauseGame])

    // return nextAlert && nextAlert.type == "spread" ? (
    //     <InfectionSpreadAlert
    //         feature={nextAlert.feature}
    //         dismiss={handleDismiss}
    //     />
    // ) : nextAlert && nextAlert.type == "dead" ? (
    //     <FirstDeathAlert feature={nextAlert.feature} dismiss={handleDismiss} />
    // ) : null

    return nextAlert ? (
        <div className="fixed inset-0">
            <div className="relative w-full h-full">
                <div className="aboslute inset-0 opacity-30 bg-gray-900 w-full h-full" />
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <OracleAlert
                        type={nextAlert.type}
                        feature={nextAlert.feature}
                        dismiss={handleDismiss}
                    />
                </div>
            </div>
        </div>
    ) : null
}

function OracleAlert({
    type,
    feature,
    dismiss
}: {
    type: "spread" | "dead"
    feature: any
    dismiss: () => void
}) {
    const title =
        type == "dead"
            ? `${feature.properties.name} has recorded the first death`
            : `Infection has spread to ${feature.properties.name}`
    const description =
        type == "spread"
            ? "You may want to consider increased testing in this area. Infection control measures such as mask mandates and ultimately lockdown may also be considered"
            : "Consider prioritising this area in terms of infection control and surveillance"

    return (
        <div className="max-w-md flex flex-col space-y-8 p-4 rounded-md bg-white">
            <h1 className="text-xl">{title}</h1>
            <p className="">{description}</p>

            <div className="w-full flex justify-end">
                <Button
                    onClick={dismiss}
                    className="bg-orange-500 text-white font-medium py-2 px-4 rounded-md"
                >
                    Dismiss
                </Button>
            </div>
        </div>
    )
}
