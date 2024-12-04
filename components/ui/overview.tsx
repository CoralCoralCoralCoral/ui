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
import MetricsPlot from "./MetricsPlot"
import { newPolicy, Policy, setPolicy } from "@/store/policy"
import { useGameContext } from "@/game/GameContext"

export default function Overview() {
    const { sendCommand } = useGameContext()
    const dispatch = useAppDispatch()
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )

    const selectedLad = useAppSelector(store => store.navigation.selectedLad)
    const selectedMsoa = useAppSelector(store => store.navigation.selectedMsoa)

    const policies = useAppSelector(store => store.policy)

    const policy = useMemo(() => {
        let p = policies["GLOBAL"]

        if (!p && selectedJurisdiction.parent) {
            p = policies[selectedJurisdiction.parent]
        }

        if (!p) {
            p = policies[selectedJurisdiction.code]
        }

        return p
    }, [policies, selectedJurisdiction])

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
        const modifiedPolicy: Policy = policy
            ? { ...policy, is_lockdown: true }
            : { ...newPolicy(), is_lockdown: true }

        sendCommand({
            type: "apply_jurisdiction_policy",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            }
        })

        dispatch(
            setPolicy({
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            })
        )

        // debugging
        console.log({
            type: "apply_jurisdiction_policy",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            }
        })
    }, [policy, selectedJurisdiction])

    const handleRemoveLockdown = useCallback(() => {
        const modifiedPolicy: Policy = policy
            ? { ...policy, is_lockdown: false }
            : { ...newPolicy(), is_lockdown: false }

        sendCommand({
            type: "apply_jurisdiction_policy",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            }
        })

        dispatch(
            setPolicy({
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            })
        )
    }, [policy, selectedJurisdiction])

    const handleApplyMaskMandate = useCallback(() => {
        const modifiedPolicy: Policy = policy
            ? { ...policy, is_mask_mandate: true }
            : { ...newPolicy(), is_mask_mandate: true }

        sendCommand({
            type: "apply_jurisdiction_policy",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            }
        })

        dispatch(
            setPolicy({
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            })
        )
    }, [policy, selectedJurisdiction])

    const handleRemoveMaskMandate = useCallback(() => {
        const modifiedPolicy: Policy = policy
            ? { ...policy, is_mask_mandate: false }
            : { ...newPolicy(), is_mask_mandate: false }

        sendCommand({
            type: "apply_jurisdiction_policy",
            payload: {
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            }
        })

        dispatch(
            setPolicy({
                jurisdiction_id: selectedJurisdiction.code,
                policy: modifiedPolicy
            })
        )
    }, [policy, selectedJurisdiction])

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
                            metric="dead_population"
                            title="Total Detected Cases"
                        />
                    </div>

                    {/* Calendar */}
                    {/* <div className="mb-4">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                    />
                    </div> */}

                    {/* Prog bars*/}
                    {/* <div className="flex flex-col gap-3 mt-0">
                        <div>
                            <p className="text-sm font-medium">Vaccine Research</p>
                            <Progress value={37} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Policy Acceptance</p>
                            <Progress value={14} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                Gov. Approval Rating
                            </p>
                            <Progress value={73} />
                        </div>
                    </div> */}

                    <div className="flex flex-col py-4">
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
                                {/* <div className="flex space-x-2">
                                    <span>Testing Strategy:</span>
                                    <span>
                                        {policy.test_strategy.toUpperCase()}
                                    </span>
                                </div> */}
                            </div>
                        ) : (
                            <span>No policies in effect</span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-4">
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
                        {/* <Button>Vaccine Investment</Button> */}
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
                    </div>
                </div>
            </div>
        </div>
    )
}
