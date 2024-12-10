// @ts-nocheck

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import features from "../features.json"

export interface Metrics {
    new_infections: number
    new_hospitalizations: number
    new_recoveries: number
    new_deaths: number
    infected_population: number
    infectious_population: number
    hospitalized_population: number
    immune_population: number
    dead_population: number
    new_tests: number
    new_positive_tests: number
    total_tests: number
    total_positive_tests: number
    test_backlog: number
    test_capacity: number
}

export interface MetricsState {
    [key: string]: Metrics[]
}

export interface MetricsUpdate {
    [key: string]: Metrics
}

const newMetrics: () => Metrics = () => ({
    new_infections: 0,
    new_hospitalizations: 0,
    new_recoveries: 0,
    new_deaths: 0,
    infected_population: 0,
    infectious_population: 0,
    hospitalized_population: 0,
    immune_population: 0,
    dead_population: 0,
    new_tests: 0,
    new_positive_tests: 0,
    total_tests: 0,
    total_positive_tests: 0,
    test_backlog: 0,
    test_capacity: 0
})

const initialState: () => MetricsState = () => features.reduce(
    (acc, feature) => {
        acc[feature.properties.code] = [newMetrics()]
        return acc
    },
    {
        GLOBAL: [newMetrics()]
    }
)

export const metricsSlice = createSlice({
    name: "metrics",
    initialState: initialState(),
    reducers: {
        updateMetrics: (state, action: PayloadAction<MetricsUpdate>) => {
            Object.entries(action.payload).forEach(([key, metrics]) => {
                state[key].push(metrics)

                // retain the most recent thirty days of metrics
                if (state[key].length > 30) {
                    state[key].shift()
                }
            })
        },
        clearMetrics: state => initialState()
    }
})

// Action creators are generated for each case reducer function
export const { updateMetrics, clearMetrics } = metricsSlice.actions

export default metricsSlice.reducer
