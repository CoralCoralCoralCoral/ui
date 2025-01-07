// @ts-nocheck

import { Metrics, MetricsState } from "@/store/metrics"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable
} from "@tanstack/react-table"
import features from "../features.json"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useCallback, useMemo, useState } from "react"
import { Table } from "@radix-ui/themes"
import { updateJurisdiction } from "@/store/navigation"

interface RowData {
    id: string
    type: "lad" | "msoa"
    name: string
    metrics: Metrics[]
}

const columns: ColumnDef<RowData>[] = [
    {
        id: "name",
        header: "Jurisdiction",
        accessorFn: row => row.name,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "total_cases",
        header: "Total Cases",
        accessorFn: row => row.metrics[row.metrics.length - 1].total_cases,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "new_cases",
        header: "New Cases",
        accessorFn: row => row.metrics[row.metrics.length - 1].new_cases,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "test_backlog",
        header: "Test Backlog",
        accessorFn: row => row.metrics[row.metrics.length - 1].test_backlog,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "hospitalized_population",
        header: "Hospitalized",
        accessorFn: row =>
            row.metrics[row.metrics.length - 1].hospitalized_population,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "deaths",
        header: "Deaths",
        accessorFn: row => row.metrics[row.metrics.length - 1].dead_population,
        cell: info => info.getValue(),
        enableSorting: true
    },
    {
        id: "ema",
        header: "7-Day Average",
        cell: ({ row }) => {
            const emas = exponentialMovingAverage(
                row.original.metrics.map(metric => metric.new_cases),
                7
            )

            // Get the latest 7 values
            let values = emas.slice(-7)

            if (values.length == 0) {
                values = [0, 0, 0, 0, 0, 0, 0]
            }

            return (
                <div className="flex gap-1">
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className={`h-4 w-4 rounded`}
                            style={{
                                backgroundColor:
                                    value >= 0
                                        ? interpolateColor(
                                              value,
                                              [0, 10, 100, 1000],
                                              [
                                                  "#f0f0f0",
                                                  "#ff8000",
                                                  "#ff0000",
                                                  "#800000"
                                              ]
                                          )
                                        : "white"
                            }}
                        />
                    ))}
                </div>
            )
        }
    }
]

const generateRowData: (state: MetricsState) => RowData[] = state => {
    return features
        .filter(feature => feature.properties.level == "lad")
        .map(feature => ({
            id: feature.properties.code,
            type: feature.properties.level,
            name: feature.properties.name,
            metrics: state[feature.properties.code]
        }))
}

export default function TableView() {
    const metricsState = useAppSelector(store => store.metrics)

    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )

    const [sorting, setSorting] = useState<SortingState>([])

    const data: RowData[] = useMemo(() => {
        return generateRowData(metricsState)
    }, [metricsState])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting
        }
    })

    const dispatch = useAppDispatch()

    const handleClick = (id: string) => {
        console.log(`this is the feature code selected: ${id}`)

        const feature = features.filter(f => f.properties.code == id)[0]

        dispatch(updateJurisdiction(feature.properties))
    }

    return (
        <div className="p-4">
            <Table.Root>
                <Table.Header>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Table.Row key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <Table.ColumnHeaderCell key={header.id}>
                                    <div
                                        className={
                                            header.column.getCanSort()
                                                ? "cursor-pointer select-none"
                                                : ""
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                        title={
                                            header.column.getCanSort()
                                                ? header.column.getNextSortingOrder() ===
                                                  "asc"
                                                    ? "Sort ascending"
                                                    : header.column.getNextSortingOrder() ===
                                                      "desc"
                                                    ? "Sort descending"
                                                    : "Clear sort"
                                                : undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: " 🔼",
                                            desc: " 🔽"
                                        }[
                                            header.column.getIsSorted() as string
                                        ] ?? null}
                                    </div>
                                </Table.ColumnHeaderCell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Header>
                <Table.Body>
                    {table.getRowModel().rows.map(row => (
                        <Table.Row
                            className={`cursor-pointer ${
                                row.original.id == selectedJurisdiction.code ||
                                row.original.id == selectedJurisdiction.parent
                                    ? "bg-slate-100"
                                    : ""
                            }`}
                            key={row.id}
                            onClick={() => handleClick(row.original.id)}
                        >
                            {row.getVisibleCells().map(cell => (
                                <Table.Cell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </Table.Cell>
                            ))}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </div>
    )
}

function simpleMovingAverage(prices, window = 5, n = Infinity) {
    if (!prices || prices.length < window) {
        return []
    }

    let index = window - 1
    const length = prices.length + 1

    const simpleMovingAverages = []

    let numberOfSMAsCalculated = 0

    while (++index < length && numberOfSMAsCalculated++ < n) {
        const windowSlice = prices.slice(index - window, index)
        const sum = windowSlice.reduce((prev, curr) => prev + curr, 0)
        simpleMovingAverages.push(sum / window)
    }

    return simpleMovingAverages
}

function exponentialMovingAverage(prices, window = 7) {
    if (!prices || prices.length < window) {
        return []
    }

    let index = window - 1
    let previousEmaIndex = 0
    const length = prices.length
    const smoothingFactor = 2 / (window + 1)

    const exponentialMovingAverages = []

    const [sma] = simpleMovingAverage(prices, window, 1)
    exponentialMovingAverages.push(sma)

    while (++index < length) {
        const value = prices[index]
        const previousEma = exponentialMovingAverages[previousEmaIndex++]
        const currentEma = (value - previousEma) * smoothingFactor + previousEma
        exponentialMovingAverages.push(currentEma)
    }

    return exponentialMovingAverages
}

function interpolateColor(value, thresholds, colors) {
    // Ensure that the thresholds and colors arrays are of the same length
    if (thresholds.length !== colors.length) {
        throw new Error(
            "Thresholds and colors arrays must be of the same length."
        )
    }

    // If value is less than the first threshold, return the first color
    if (value <= thresholds[0]) {
        return colors[0]
    }

    // If value is greater than the last threshold, return the last color
    if (value >= thresholds[thresholds.length - 1]) {
        return colors[colors.length - 1]
    }

    // Find the correct segment for the value
    for (let i = 1; i < thresholds.length; i++) {
        if (value < thresholds[i]) {
            // Calculate linear interpolation between the two surrounding thresholds
            const minThreshold = thresholds[i - 1]
            const maxThreshold = thresholds[i]
            const minColor = hexToRgb(colors[i - 1])
            const maxColor = hexToRgb(colors[i])

            // Calculate the ratio between the value and the threshold range
            const ratio = (value - minThreshold) / (maxThreshold - minThreshold)

            // Interpolate the RGB components
            const r = Math.round(minColor.r + (maxColor.r - minColor.r) * ratio)
            const g = Math.round(minColor.g + (maxColor.g - minColor.g) * ratio)
            const b = Math.round(minColor.b + (maxColor.b - minColor.b) * ratio)

            return rgbToHex(r, g, b)
        }
    }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
    hex = hex.replace("#", "")
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    }
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
        .toString(16)
        .slice(1)
        .toUpperCase()}`
}
