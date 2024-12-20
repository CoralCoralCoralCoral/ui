// @ts-nocheck

import { useAppSelector } from "@/store/hooks"
import { Metrics } from "@/store/metrics"
import React from "react"

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

interface XConfig {
    metric: string
    label: string
}

interface YConfig {
    metric: string
    label: string
    colour?: string
}

// Props for the MetricsPlot component
interface MetricsPlotV2Props {
    x: XConfig
    y: YConfig[]
    title?: string // Optional title for the chart
}

const MetricsPlot: React.FC<MetricsPlotV2Props> = ({ x, y, title }) => {
    // Retrieve the data for the given key
    const selectedJurisdiction = useAppSelector(
        store => store.navigation.selectedJurisdiction
    )
    const data = useAppSelector(
        store => store.metrics[selectedJurisdiction.code]
    )

    const plotData = {
        labels: data.map(d => d[x.metric]), // x-axis labels
        datasets: y.map(m => ({
            label: m.label,
            data: data.map(d => d[m.metric]), // y-axis data
            borderColor: m.colour || "#8884d8",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4 // Smooth line
        }))
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
                    text: x.label
                }
            },
            y: {
                title: {
                    display: false
                    // text: metric
                },
                beginAtZero: true
            }
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full flex items-center space-x-2">
                {title && <h3 className="text-sm">{title}</h3>}
                {/* <span>{data[data.length - 1][metric]}</span> */}
            </div>
            <div className="w-full h-48">
                <Line data={plotData} options={options} />
            </div>
        </div>
    )
}

export default MetricsPlot
