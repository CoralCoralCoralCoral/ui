import Form, { FieldSchema, FormSection } from "./Form"
import { useAppSelector } from "@/store/hooks"
import { useGameContext } from "@/game/GameContext"
import { useCallback, useEffect, useState } from "react"
import useDebounce from "@/hooks/useDebounce"

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
        inputType: "switch",
        name: "is_lockdown",
        label: "Lockdown",
        description:
            "Impose a lockdown on the jurisdiction, which restricts all movement",
        defaultValue: false
    },
    {
        inputType: "switch",
        name: "is_mask_mandate",
        label: "Mask Mandate",
        description: "Impose a mask mandate on the jurisdiction",
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

    const [nextUpdate, setNextUpdate] = useState<null | {
        jurisdictionId: string
        name: string
        value: any
    }>(null)

    const nextUpdateDebounced = useDebounce(nextUpdate, 50)

    const handleUpdate = useCallback(
        ({ name, value }: { name: string; value: string }) => {
            setNextUpdate({ jurisdictionId, name, value })
        },
        [jurisdictionId]
    )

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
        <Form values={policy} sections={formSections} onUpdate={handleUpdate} />
    )
}
