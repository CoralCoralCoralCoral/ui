// @ts-nocheck

"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import SidebarUI from "@/components/ui/sidebar-ui"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import CreateGameButton from "./create-game"
import { ArrowLeft } from "lucide-react"
import { globalJurisdiction, updateJurisdiction } from "@/store/navigation"
import features from "../../features.json"
import { newPolicy, Policy, updatePolicy } from "@/store/policy"
import { useGameContext } from "@/game/GameContext"
import Oracle from "../Oracle"
import { Switch } from "@radix-ui/themes"
import PolicySettings from "../PolicySettings"
import MetricsPlotV2 from "../MetricsPlotV2"

export default function Overview() {
    const { sendCommand } = useGameContext()
    const dispatch = useAppDispatch()
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )

    const selectedLad = useAppSelector(store => store.navigation.selectedLad)
    const selectedMsoa = useAppSelector(store => store.navigation.selectedMsoa)

    const policy = useAppSelector(
        store => store.policy[selectedJurisdiction.code]
    )

    const parentJurisdiction = useMemo(() => {
        const parent = features.find(
            feature => feature.properties.code == selectedJurisdiction.parent
        )?.properties

        return parent || globalJurisdiction
    }, [selectedJurisdiction])

    const handleBack = useCallback(() => {
        dispatch(updateJurisdiction(parentJurisdiction))
    }, [parentJurisdiction, dispatch])

    useEffect(() => {
        console.log(policy)
    }, [policy])

    const handleApplyLockdown = useCallback(() => {
        sendCommand({
            type: "apply_policy_update",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                is_lockdown: true
            }
        })
    }, [selectedJurisdiction, sendCommand])

    const handleRemoveLockdown = useCallback(() => {
        sendCommand({
            type: "apply_policy_update",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                is_lockdown: false
            }
        })
    }, [selectedJurisdiction, sendCommand])

    const handleApplyMaskMandate = useCallback(() => {
        sendCommand({
            type: "apply_policy_update",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                is_mask_mandate: true
            }
        })
    }, [selectedJurisdiction, sendCommand])

    const handleRemoveMaskMandate = useCallback(() => {
        sendCommand({
            type: "apply_policy_update",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                is_mask_mandate: false
            }
        })
    }, [selectedJurisdiction, sendCommand])

    return (
        <div className="relative w-96">
            <div className="absolute inset-y-0 w-96 bg-gray-100 p-4 border-l border-gray-300 flex flex-col gap-4 z-20 h-full">
                <div className="flex flex-col h-full">
                    <div className="flex items-center">
                        {selectedJurisdiction.parent && (
                            <ArrowLeft onClick={handleBack} />
                        )}
                        <div className="flex flex-grow justify-center items-center pt-2 pb-2">
                            <h2 className="text-xl font-bold text-black">
                                {selectedJurisdiction.name}
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-grow flex-col space-y-4 overflow-scroll">
                        <MetricsPlotV2
                            title="New Cases"
                            x={{ metric: "day", label: "Day" }}
                            y={[
                                {
                                    metric: "new_positive_tests",
                                    label: "New Positive Tests",
                                    colour: "#ff9830"
                                }
                            ]}
                        />

                        <MetricsPlotV2
                            title="Cumulative Cases"
                            x={{
                                metric: "day",
                                label: "day"
                            }}
                            y={[
                                {
                                    metric: "total_positive_tests",
                                    label: "Detected Cases",
                                    colour: "#de4014"
                                }
                            ]}
                        />

                        <MetricsPlotV2
                            title="Daily Test Capacity and Backlog"
                            x={{ metric: "day", label: "Day" }}
                            y={[
                                {
                                    metric: "test_capacity",
                                    label: "Test Capacity"
                                },
                                {
                                    metric: "new_tests",
                                    label: "Tests Conducted",
                                    colour: "#04ba65"
                                },
                                {
                                    metric: "test_backlog",
                                    label: "Test Backlog",
                                    colour: "#d90000"
                                }
                            ]}
                        />

                        <MetricsPlotV2
                            title="Hospitalizations and Deaths"
                            x={{ metric: "day", label: "Day" }}
                            y={[
                                {
                                    metric: "hospitalized_population",
                                    label: "Currently Hospitalized",
                                    colour: "#fa8d11"
                                },
                                {
                                    metric: "dead_population",
                                    label: "Total Deaths",
                                    colour: "#d90404"
                                }
                            ]}
                        />
                    </div>

                    <div>
                        <PolicySettings
                            jurisdictionId={selectedJurisdiction.code}
                        />
                    </div>

                    <Oracle />
                </div>
            </div>
        </div>
    )
}
