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
import MetricsPlot from "../MetricsPlot"
import { newPolicy, Policy, updatePolicy } from "@/store/policy"
import { useGameContext } from "@/game/GameContext"
import Oracle from "../Oracle"
import { Switch } from "@radix-ui/themes"
import PolicySettings from "../PolicySettings"

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

    return (
        <div className="relative w-96">
            {/* <div className="absolute inset-y-0 z-10">
                <SidebarUI />
            </div> */}
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
                        <h2 className="text-lg">Metrics</h2>
                        <MetricsPlot
                            metric="infected_population"
                            title="Infected"
                        />

                        <MetricsPlot
                            metric="new_infections"
                            title="New Infections"
                        />

                        <MetricsPlot metric="new_tests" title="New Tests" />
                        <MetricsPlot
                            metric="test_capacity"
                            title="Test Capacity"
                        />
                        <MetricsPlot
                            metric="test_backlog"
                            title="Test Backlog"
                        />

                        <MetricsPlot
                            metric="new_positive_tests"
                            title="New Positive Tests"
                        />

                        <MetricsPlot metric="total_tests" title="Total Tests" />

                        <MetricsPlot
                            metric="total_positive_tests"
                            title="Total Detected Cases"
                        />

                        <MetricsPlot
                            metric="hospitalized_population"
                            title="Hospitalized Population"
                        />

                        <MetricsPlot metric="dead_population" title="Deaths" />
                    </div>

                    {/* <div className="flex flex-col py-4">
                        <h2 className="text-lg">Policies in Effect</h2>
                        {policy ? (
                            <div className="flex flex-col space-y-2">
                                {policy.is_lockdown && (
                                    <span className="text-sm">
                                        Active Lockdown
                                    </span>
                                )}
                                {policy.is_mask_mandate && (
                                    <span className="text-sm">
                                        Active Mask Mandate
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span>No policies in effect</span>
                        )}
                    </div> */}

                    {/* Actions */}
                    {/* <div className="flex flex-col gap-4">
                        <Button>Social Policy</Button>
                        <Button>Upgrade Infrastructure</Button>
                        {policy && policy.is_mask_mandate ? (
                            <Button
                                onClick={handleRemoveMaskMandate}
                                className="bg-amber-500 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Lift Mask Mandate
                            </Button>
                        ) : (
                            <Button
                                onClick={handleApplyMaskMandate}
                                className="bg-amber-500 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Apply Mask Mandate
                            </Button>
                        )}
                        {policy && policy.is_lockdown ? (
                            <Button
                                onClick={handleRemoveLockdown}
                                className="bg-red-500 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Lift Lockdown
                            </Button>
                        ) : (
                            <Button
                                onClick={handleApplyLockdown}
                                className="bg-red-500 text-white font-medium py-2 px-4 rounded-md"
                            >
                                Lockdown
                            </Button>
                        )}
                    </div> */}

                    <div>
                        <PolicySettings
                            jurisdictionId={selectedJurisdiction.code}
                        />
                    </div>

                    {/* <div className="flex w-full mt-8">
                        <Oracle />
                    </div> */}
                    {/* <Oracle /> */}
                </div>
            </div>
        </div>
    )
}
