import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes"
import Form, { FieldSchema, FormSection } from "./Form"
import { useCallback, useState } from "react"
import { useGameContext } from "@/game/GameContext"

const globalParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "time_step",
        label: "Time Step",
        description:
            "The duration of time each epoch will simulate in minutes. The smaller this is, the longer it will take to simulate an epoch.",
        defaultValue: 15
    },
    {
        inputType: "text",
        name: "num_agents",
        label: "Number of Agents",
        description:
            "The total number of individual agents to simulate. The higher this is, the longer it will take to simulate an epoch",
        defaultValue: 150000
    }
]

const agentParamsSchema: FieldSchema[] = [
    {
        inputType: "range",
        name: "compliance_probability",
        label: "Compliance Probability",
        description:
            "The probability that an agent will comply with public health policies",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.7
    },
    {
        inputType: "range",
        name: "seeks_treatment_probability",
        label: "Seeks Treatment Probability",
        description:
            "The probability that an infected individual seeks treatment at a healthcare space upon becoming symptomatic",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.4
    },
    {
        inputType: "range",
        name: "mask_filtration_efficiency_mean",
        label: "Mean Mask Filtration Efficiency",
        description:
            "A value between 0 and 1 that represents how efficiently masks filter pathogens on average. For example an N95 mask would have a filtration efficiency of 0.95, while a cloth mask might have an efficiency as low as 0.7",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.75
    },
    {
        inputType: "range",
        name: "mask_filtration_efficiency_sd",
        label: "Standard Deviation of Mask Filtration Efficiency",
        description:
            "A value between 0 and 1 that represents the variance in mask filtration efficiency",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.15
    },
    {
        inputType: "text",
        name: "pulmonary_ventilation_rate_mean",
        label: "Mean Pulmonary Ventilation Rate",
        description:
            "The mean amount of air that moves in and out of the lungs per minute, in cubic metres.",
        defaultValue: 0.36
    },
    {
        inputType: "text",
        name: "pulmonary_ventilation_rate_sd",
        label: "Standard Deviation of Pulmonary Ventilation Rate",
        description:
            "The standard deviation of pulmonary ventilation rate. This is typically low",
        defaultValue: 0.01
    }
]

const pathogenParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "incubation_period_mean",
        label: "Mean Incubation Period",
        description:
            "The average time it takes for an exposed host to develop disease, in days",
        defaultValue: 3
    },
    {
        inputType: "text",
        name: "incubation_period_sd",
        label: "Standard Deviation of Incubation Period",
        description: "The standard deviation of incubation period, in days",
        defaultValue: 0.333
    },
    {
        inputType: "text",
        name: "recovery_period_mean",
        label: "Mean Recovery Period",
        description:
            "The average time it takes for illness to subside, in days",
        defaultValue: 7
    },
    {
        inputType: "text",
        name: "recovery_period_sd",
        label: "Standard Deviation of Recovery Period",
        description: "The standard deviation of recovery period, in days",
        defaultValue: 2
    },
    {
        inputType: "text",
        name: "immunity_period_mean",
        label: "Mean Immunity Period",
        description:
            "The average duration of immunity acquired post recovery, in days",
        defaultValue: 330
    },
    {
        inputType: "text",
        name: "immunity_period_sd",
        label: "Standard Deviation of Immunity Period",
        description: "The standard deviation of immunity period, in days",
        defaultValue: 90
    },
    {
        inputType: "text",
        name: "prehospitalization_period_mean",
        label: "Mean Prehospitalization Period",
        description:
            "The average duration between developing symptoms and becoming hospitalized in the case where agent does become hospitalized, in days",
        defaultValue: 3
    },
    {
        inputType: "text",
        name: "prehospitalization_period_sd",
        label: "Standard Deviation of Prehospitalization Period",
        description:
            "The standard deviation of prehospitalization period, in days",
        defaultValue: 0.333
    },
    {
        inputType: "text",
        name: "hospitalization_period_mean",
        label: "Mean Hospitalization Period",
        description:
            "The average duration of hospitalization for an agent that becomes hospitalized, in days",
        defaultValue: 3
    },
    {
        inputType: "text",
        name: "hospitalization_period_sd",
        label: "Standard Deviation of Hospitalization Period",
        description:
            "The standard deviation of hospitalization period, in days",
        defaultValue: 0.333
    },
    {
        inputType: "text",
        name: "quanta_emission_rate_mean",
        label: "Mean Quanta Emission Rate",
        description:
            "The average amount of quanta emitted by an infectious individual. The unit is quanta per hour as defined in the Wells-Riley model of airbone transmission",
        defaultValue: 500
    },
    {
        inputType: "text",
        name: "quanta_emission_rate_sd",
        label: "Standard Deviation of Quanta Emission Rate",
        description:
            "The standard deviation of quanta emission rate, in quanta per hour",
        defaultValue: 150
    },
    {
        inputType: "range",
        name: "hospitalization_probability",
        label: "Hospitalization Probability",
        description:
            "The probability that an infected individual becomes hospitalized",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.15
    },
    {
        inputType: "range",
        name: "death_probability",
        label: "Death Probability",
        description:
            "The probability that death occurs in a hospitalized individual",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.75
    },
    {
        inputType: "range",
        name: "asymptomatic_probability",
        label: "Asymptomatic Probability",
        description:
            "The probability that an infectious individual does not develop symptoms",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.15
    }
]

const householdParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "household_capacity_mean",
        label: "Mean Household Capacity",
        description: "The mean number of occupants per household",
        defaultValue: 4
    },
    {
        inputType: "text",
        name: "household_capacity_sd",
        label: "Standard Deviation of Household Capacity",
        description: "The standard deviation of household capacity",
        defaultValue: 2
    },
    {
        inputType: "text",
        name: "household_air_change_rate_mean",
        label: "Mean Household Air Change Rate",
        description: "The mean number of air changes per minute",
        defaultValue: 7
    },
    {
        inputType: "text",
        name: "household_air_change_rate_sd",
        label: "Standard Deviation of Household Air Change Rate",
        description: "The standard deviation of household air change rate",
        defaultValue: 1
    },
    {
        inputType: "text",
        name: "household_volume_mean",
        label: "Mean Household Volume",
        description: "The mean volume of a household, in cubic metres",
        defaultValue: 17
    },
    {
        inputType: "text",
        name: "household_volume_sd",
        label: "Standard Deviation of Household Volume",
        description: "The standard deviation of household volume",
        defaultValue: 2
    }
]

const officeParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "office_capacity_mean",
        label: "Mean Office Capacity",
        description: "The mean number of occupants per office",
        defaultValue: 10
    },
    {
        inputType: "text",
        name: "office_capacity_sd",
        label: "Standard Deviation of Office Capacity",
        description: "The standard deviation of office capacity",
        defaultValue: 2
    },
    {
        inputType: "text",
        name: "office_air_change_rate_mean",
        label: "Mean Office Air Change Rate",
        description: "The mean number of air changes per minute",
        defaultValue: 20
    },
    {
        inputType: "text",
        name: "office_air_change_rate_sd",
        label: "Standard Deviation of Office Air Change Rate",
        description: "The standard deviation of office air change rate",
        defaultValue: 5
    },
    {
        inputType: "text",
        name: "office_volume_mean",
        label: "Mean Office Volume",
        description: "The mean volume of an office, in cubic metres",
        defaultValue: 60
    },
    {
        inputType: "text",
        name: "office_volume_sd",
        label: "Standard Deviation of Office Volume",
        description: "The standard deviation of office volume",
        defaultValue: 20
    }
]

const socialSpaceParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "social_space_capacity_mean",
        label: "Mean Social Space Capacity",
        description: "The mean number of occupants per social space",
        defaultValue: 10
    },
    {
        inputType: "text",
        name: "social_space_capacity_sd",
        label: "Standard Deviation of Social Space Capacity",
        description: "The standard deviation of social space capacity",
        defaultValue: 2
    },
    {
        inputType: "text",
        name: "social_space_air_change_rate_mean",
        label: "Mean Social Space Air Change Rate",
        description: "The mean number of air changes per minute",
        defaultValue: 20
    },
    {
        inputType: "text",
        name: "social_space_air_change_rate_sd",
        label: "Standard Deviation of Social Space Air Change Rate",
        description: "The standard deviation of social space air change rate",
        defaultValue: 5
    },
    {
        inputType: "text",
        name: "social_space_volume_mean",
        label: "Mean Social Space Volume",
        description: "The mean volume of a social space, in cubic metres",
        defaultValue: 60
    },
    {
        inputType: "text",
        name: "social_space_volume_sd",
        label: "Standard Deviation of Social Space Volume",
        description: "The standard deviation of social space volume",
        defaultValue: 10
    }
]

const healthcareSpaceParamsSchema: FieldSchema[] = [
    {
        inputType: "text",
        name: "healthcare_space_capacity_mean",
        label: "Mean Healthcare Space Capacity",
        description: "The mean number of occupants per healthcare space",
        defaultValue: 173
    },
    {
        inputType: "text",
        name: "healthcare_space_capacity_sd",
        label: "Standard Deviation of Healthcare Space Capacity",
        description: "The standard deviation of healthcare space capacity",
        defaultValue: 25
    },
    {
        inputType: "text",
        name: "healthcare_space_air_change_rate_mean",
        label: "Mean Healthcare Space Air Change Rate",
        description: "The mean number of air changes per minute",
        defaultValue: 20
    },
    {
        inputType: "text",
        name: "healthcare_space_air_change_rate_sd",
        label: "Standard Deviation of Healthcare Space Air Change Rate",
        description:
            "The standard deviation of healthcare space air change rate",
        defaultValue: 5
    },
    {
        inputType: "text",
        name: "healthcare_space_volume_mean",
        label: "Mean Healthcare Space Volume",
        description: "The mean volume of a healthcare space, in cubic metres",
        defaultValue: 120
    },
    {
        inputType: "text",
        name: "healthcare_space_volume_sd",
        label: "Standard Deviation of Healthcare Space Volume",
        description: "The standard deviation of healthcare space volume",
        defaultValue: 30
    },
    {
        inputType: "text",
        name: "test_capacity_mean",
        label: "Mean Daily Test Capacity",
        description:
            "The mean number of tests that can be turned over per healthcare space per day",
        defaultValue: 300
    },
    {
        inputType: "text",
        name: "test_capacity_sd",
        label: "Standard Deviation of Daily Test Capacity",
        description: "The standard deviation of daily test capacity",
        defaultValue: 150
    },
    {
        inputType: "range",
        name: "test_sensitivity",
        label: "Test Sensitivity",
        description:
            "The probability of getting a true positive result. In other words, the probability that the test result is positive given that the subject is infected",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.7
    },
    {
        inputType: "range",
        name: "test_specificity",
        label: "Test Specificity",
        description:
            "The probability of getting a true negative result. In other words, the probability that the test result is negative given that the subject is not infected",
        rangeMin: 0,
        rangeMax: 1,
        rangeIncrement: 0.01,
        defaultValue: 0.999
    }
]

const formSections: FormSection[] = [
    {
        label: "Global Parameters",
        fields: globalParamsSchema
    },
    {
        label: "Agent Parameters",
        fields: agentParamsSchema
    },
    {
        label: "Pathogen Parameters",
        fields: pathogenParamsSchema
    },
    {
        label: "Household Parameters",
        fields: householdParamsSchema
    },
    {
        label: "Office Parameters",
        fields: officeParamsSchema
    },
    {
        label: "Social Space Parameters",
        fields: socialSpaceParamsSchema
    },
    {
        label: "Healthcare Space Parameters",
        fields: healthcareSpaceParamsSchema
    }
]

export default function NewGame() {
    const { startGame } = useGameContext()
    const [values, setValues] = useState<{ [key: string]: any }>(
        formSections.reduce((acc, section) => {
            acc = {
                ...acc,
                ...section.fields.reduce((facc, field) => {
                    if (typeof field.defaultValue != "undefined") {
                        facc = {
                            ...facc,
                            [field.name]: field.defaultValue
                        }
                    }

                    return facc
                }, {})
            }

            return acc
        }, {})
    )

    const handleUpdate = useCallback(
        ({ name, value }: { name: string; value: any }) => {
            setValues(v => ({
                ...v,
                [name]: value
            }))
        },
        [setValues]
    )

    const handleStart = useCallback(() => {
        const formattedValues = {
            ...values,
            time_step: values.time_step * 60 * 1000,
            incubation_period_mean:
                values.incubation_period_mean * 24 * 60 * 60 * 1000,
            incubation_period_sd:
                values.incubation_period_sd * 24 * 60 * 60 * 1000,
            recovery_period_mean:
                values.recovery_period_mean * 24 * 60 * 60 * 1000,
            recovery_period_sd: values.recovery_period_sd * 24 * 60 * 60 * 1000,
            immunity_period_mean:
                values.immunity_period_mean * 24 * 60 * 60 * 1000,
            immunity_period_sd: values.immunity_period_sd * 24 * 60 * 60 * 1000,
            prehospitalization_period_mean:
                values.prehospitalization_period_mean * 24 * 60 * 60 * 1000,
            prehospitalization_period_sd:
                values.prehospitalization_period_sd * 24 * 60 * 60 * 1000,
            hospitalization_period_mean:
                values.hospitalization_period_mean * 24 * 60 * 60 * 1000,
            hospitalization_period_sd:
                values.hospitalization_period_sd * 24 * 60 * 60 * 1000
        }

        console.log(formattedValues)
        startGame(formattedValues)
    }, [startGame, values])

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>New Game</Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title mb="6">Game Configuration</Dialog.Title>
                <Form
                    sections={formSections}
                    values={values}
                    onUpdate={handleUpdate}
                />
                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray">
                            Cancel
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={handleStart}>Start</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
