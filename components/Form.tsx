import useDebounce from "@/hooks/useDebounce"
import { Flex, Select, Slider, Switch, Text, TextField } from "@radix-ui/themes"
import { useCallback, useEffect, useState } from "react"

export interface SelectOption {
    label: string
    value: any
}

export interface FieldSchema {
    inputType: "text" | "select" | "switch" | "range"
    name: string
    label: string
    description?: string
    selectOptions?: SelectOption[]
    rangeMin?: number
    rangeMax?: number
    rangeIncrement?: number
    defaultValue?: any
}

export interface FormSection {
    label: string
    fields: FieldSchema[]
}

export interface FormProps {
    sections: FormSection[]
    onUpdate: ({ name, value }: { name: string; value: any }) => void
    values: {
        [key: string]: any
    }
}

export default function Form({ sections, onUpdate, values }: FormProps) {
    return (
        <Flex direction="column" gap="8">
            {sections.map(section => (
                <Flex key={section.label} direction="column">
                    <Text as="label" weight="bold" size="4" mb="4">
                        {section.label}
                    </Text>
                    <Flex direction="column" gap="4">
                        {section.fields.map(field => (
                            <Field
                                key={field.name}
                                value={values[field.name]}
                                schema={field}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}

export interface FieldProps {
    value: any
    schema: FieldSchema
    onUpdate: ({ name, value }: { name: string; value: any }) => void
}

function Field({ value, schema, onUpdate }: FieldProps) {
    return (
        <Flex direction="column" gap="1">
            <Flex direction="column" gap="1" mb="1">
                <Text as="div" size="2" weight="medium">
                    {schema.label}
                </Text>
                {typeof schema.description != undefined && (
                    <Text as="div" size="1" weight="light">
                        {schema.description}
                    </Text>
                )}
            </Flex>

            {schema.inputType == "range" && (
                <Flex align="center" gap="6">
                    <Slider
                        min={schema.rangeMin}
                        max={schema.rangeMax}
                        step={schema.rangeIncrement}
                        value={[Number(value)]}
                        onValueChange={v =>
                            onUpdate({ name: schema.name, value: v[0] })
                        }
                    />
                    <Flex width="50px">
                        <Text size="2">{value}</Text>
                    </Flex>
                </Flex>
            )}

            {schema.inputType == "switch" && (
                <Switch
                    checked={value}
                    onCheckedChange={v =>
                        onUpdate({ name: schema.name, value: v })
                    }
                />
            )}

            {schema.inputType == "text" && (
                <TextField.Root
                    value={value}
                    onChange={e =>
                        onUpdate({ name: schema.name, value: e.target.value })
                    }
                />
            )}

            {schema.inputType == "select" && (
                <Select.Root
                    value={value}
                    onValueChange={v =>
                        onUpdate({ name: schema.name, value: v })
                    }
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Group>
                            {schema.selectOptions?.map(option => (
                                <Select.Item
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            )}
        </Flex>
    )
}
