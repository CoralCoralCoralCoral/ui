// @ts-nocheck

import { useAppSelector } from "@/store/hooks"
import { Metrics } from "@/store/metrics"
import React from "react"

// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     ResponsiveContainer
// } from "recharts"
// import { ResponsiveLine } from "@nivo/line"

import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js"
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
)

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
    // const plotData = data.map((entry: Metrics, index: number) => ({
    //     day: `${entry["day"]}`, // Generate an X-axis label
    //     value: entry[metric] // Extract the metric to plot
    // }))

    const plotData = {
        labels: data.map(d => d["day"]), // x-axis labels
        datasets: [
            {
                label: metric,
                data: data.map(d => d[metric]), // y-axis data
                borderColor: "#8884d8",
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4 // Smooth line
            }
        ]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: context => `Value: ${context.raw}`
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Day"
                }
            },
            y: {
                title: {
                    display: true,
                    text: metric
                },
                beginAtZero: true
            }
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex items-center space-x-2">
                {title && <h3 className="text-sm">{title}</h3>}
                <span>{data[data.length - 1][metric]}</span>
            </div>
            {/* <ResponsiveContainer width="100%" height={150}>
                <LineChart data={plotData}>
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
            </ResponsiveContainer> */}
            <div className="w-full h-48">
                {/* <ResponsiveLine
                    data={[
                        {
                            id: "value",
                            data: plotData.map(d => ({
                                x: d.day,
                                y: d.value
                            }))
                        }
                    ]}
                    margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                    xScale={{ type: "point" }}
                    yScale={{
                        type: "linear",
                        min: "auto",
                        max: "auto",
                        stacked: false
                    }}
                    curve="monotoneX"
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Day",
                        legendOffset: 36
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: "Value",
                        legendOffset: -40
                    }}
                    colors={{ scheme: "nivo" }}
                    lineWidth={2}
                    dotSize={0}
                    enableDotLabel={false}
                    tooltip={({ point }) => (
                        <div>
                            <strong>{point.serieId}</strong>
                            <br />
                            {point.data.xFormatted}: {point.data.yFormatted}
                        </div>
                    )}
                    useMesh={true}
                /> */}
                <Line data={plotData} options={options} />
            </div>
        </div>
    )
}

export default MetricsPlot
