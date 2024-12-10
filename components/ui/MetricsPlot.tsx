// @ts-nocheck

import { useAppSelector } from "@/store/hooks"
import React from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts"

// Props for the MetricsPlot component
interface MetricsPlotProps {
    metric: string // The metric to plot on the Y-axis
    title?: string // Optional title for the chart
}

const MetricsPlot: React.FC<MetricsPlotProps> = ({ metric, title }) => {
    // Retrieve the data for the given key
    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )
    const data = useAppSelector(
        store => store.metrics[selectedJurisdiction.code]
    )

    // Transform data for plotting
    const plotData = data.map((entry: any, index: number) => ({
        day:  `Day ${entry.day}`, // Generate an X-axis label
        value: entry[metric] // Extract the metric to plot
    }))

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex items-center space-x-2">
                {title && <h3 className="text-sm">{title}</h3>}
                <span>{data[data.length - 1][metric]}</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
                <LineChart data={plotData}>
                    {/* <CartesianGrid /> */}
                    <XAxis dataKey="day" />
                    <YAxis width={40} />
                    <Tooltip />
                    <Line
                        type="natural"
                        dataKey="value"
                        stroke="#8884d8"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default MetricsPlot
