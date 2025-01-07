import Form, { FieldSchema, FormSection } from "./Form"
import { useAppSelector } from "@/store/hooks"
import { useGameContext } from "@/game/GameContext"
import { useCallback, useEffect, useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import { Policy } from "@/store/policy"

const policySchema: FieldSchema[] = [
    {
        inputType: "select",
        name: "test_strategy",
        label: "Test Strategy",
        description: "How to carry out testing in healthcare spaces",
        defaultValue: "none",
        selectOptions: [
            {
                value: "none",
                label: "No Testing"
            },
            {
                value: "symptomatic",
                label: "Test Symptomatic"
            },
            {
                value: "everyone",
                label: "Test Everyone"
            }
        ]
    },
    {
        inputType: "range",
        name: "test_capacity_multiplier",
        label: "Test Capacity Multiplier",
        description: "The factor to multiply a jurisdiction's test capacity by",
        defaultValue: 1,
        rangeMin: 1,
        rangeMax: 10,
        rangeIncrement: 0.1
    },
    {
        inputType: "range",
        name: "compliance_probability",
        label: "Target Compliance",
        description: "The target compliance probability",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01
    },
    {
        inputType: "switch",
        name: "is_self_reporting_mandate",
        label: "Self Reporting Mandate",
        description:
            "Require symptomatic individuals to report to a healthcare space to get tested",
        defaultValue: false
    },
    {
        inputType: "switch",
        name: "is_self_isolation_mandate",
        label: "Self Isolation Mandate",
        description:
            "Require symptomatic individuals to self isolate at home until they recover",
        defaultValue: false
    },
    {
        inputType: "switch",
        name: "is_mask_mandate",
        label: "Mask Mandate",
        description: "Impose a mask mandate on the jurisdiction",
        defaultValue: false
    },
    {
        inputType: "switch",
        name: "is_lockdown",
        label: "Lockdown",
        description:
            "Impose a lockdown on the jurisdiction, which restricts all movement",
        defaultValue: false
    }
]

const formSections: FormSection[] = [
    {
        label: "Policies",
        fields: policySchema
    }
]

export default function PolicySettings({
    jurisdictionId
}: {
    jurisdictionId: string
}) {
    const { sendCommand } = useGameContext()
    const policy = useAppSelector(store => store.policy[jurisdictionId])
    const [values, setValues] = useState<Policy>(policy)

    const [nextUpdate, setNextUpdate] = useState<null | {
        jurisdictionId: string
        name: string
        value: any
    }>(null)

    const nextUpdateDebounced = useDebounce(nextUpdate, 500)

    const handleUpdate = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            setValues(current => ({
                ...current,
                [name]: value
            }))
            setNextUpdate({ jurisdictionId, name, value })
        },
        [jurisdictionId]
    )

    useEffect(() => {
        setValues(policy)
    }, [policy])

    useEffect(() => {
        if (nextUpdateDebounced == null) {
            return
        }

        sendCommand({
            type: "apply_policy_update",
            payload: {
                jurisdiction_id: nextUpdateDebounced.jurisdictionId,
                [nextUpdateDebounced.name]: nextUpdateDebounced.value
            }
        })
    }, [sendCommand, nextUpdateDebounced])

    return (
        <Form values={values} sections={formSections} onUpdate={handleUpdate} />
    )
}
