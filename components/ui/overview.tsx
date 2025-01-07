// @ts-nocheck

"use client"

import React, { useCallback, useEffect, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import SidebarUI from "@/components/ui/sidebar-ui"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { ArrowLeft } from "lucide-react"
import { globalJurisdiction, updateJurisdiction } from "@/store/navigation"
import features from "../../features.json"
import { Policy, updatePolicy } from "@/store/policy"
import { useGameContext } from "@/game/GameContext"
import Oracle from "../Oracle"
import { Box, Switch, Tabs, Text } from "@radix-ui/themes"
import PolicySettings from "../PolicySettings"
import MetricsPlot from "../MetricsPlot"

export default function Overview() {
    const { sendCommand, isInitialized } = useGameContext()
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
    }, [parentJurisdiction])

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

    if (!isInitialized) {
        return null
    }

    return (
        <div className="relative w-full h-full">
            <div className="w-full p-4 border-l border-gray-300 flex flex-col gap-4 z-20 h-full">
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

                    {/* Test Tabs */}
                    <Tabs.Root defaultValue="metrics">
                        <Tabs.List>
                            <Tabs.Trigger value="metrics">Metrics</Tabs.Trigger>
                            <Tabs.Trigger value="policy">Policies</Tabs.Trigger>
                        </Tabs.List>

                        <div className="flex flex-col h-full pt-8">
                            <Tabs.Content value="metrics">
                                <div className="flex flex-col space-y-4">
                                    <MetricsPlot
                                        title="Newly Detected Cases"
                                        x={{ metric: "day", label: "Day" }}
                                        y={[
                                            {
                                                metric: "new_cases",
                                                label: "New Cases",
                                                colour: "#ff9830"
                                            }
                                        ]}
                                    />

                                    <MetricsPlot
                                        title="Total Detected Cases"
                                        x={{
                                            metric: "day",
                                            label: "day"
                                        }}
                                        y={[
                                            {
                                                metric: "total_cases",
                                                label: "Detected Cases",
                                                colour: "#de4014"
                                            }
                                        ]}
                                    />

                                    {/* <MetricsPlot
                                        title="Oracle Data"
                                        x={{
                                            metric: "day",
                                            label: "day"
                                        }}
                                        y={[
                                            {
                                                metric: "infected_population",
                                                label: "Infected Population"
                                            },
                                            {
                                                metric: "infectious_population",
                                                label: "Infectious Population",
                                                colour: "#de4014"
                                            }
                                        ]}
                                    /> */}

                                    <MetricsPlot
                                        title="Daily Tests and Backlog"
                                        x={{ metric: "day", label: "Day" }}
                                        y={[
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

                                    <MetricsPlot
                                        title="Daily TestCapacity"
                                        x={{ metric: "day", label: "Day" }}
                                        y={[
                                            {
                                                metric: "test_capacity",
                                                label: "Daily Test Capacity"
                                            }
                                        ]}
                                    />

                                    <MetricsPlot
                                        title="Hospitalizations"
                                        x={{ metric: "day", label: "Day" }}
                                        y={[
                                            {
                                                metric: "hospitalized_population",
                                                label: "Currently Hospitalized",
                                                colour: "#fa8d11"
                                            }
                                        ]}
                                    />
                                    <MetricsPlot
                                        title="Deaths"
                                        x={{ metric: "day", label: "Day" }}
                                        y={[
                                            {
                                                metric: "dead_population",
                                                label: "Total Deaths",
                                                colour: "#d90404"
                                            }
                                        ]}
                                    />
                                </div>
                            </Tabs.Content>

                            <Tabs.Content value="policy">
                                <div className="flex">
                                    <PolicySettings
                                        jurisdictionId={
                                            selectedJurisdiction.code
                                        }
                                    />
                                </div>
                            </Tabs.Content>
                        </div>
                    </Tabs.Root>
                </div>
            </div>
        </div>
    )
}
