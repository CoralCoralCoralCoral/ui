// @ts-nocheck

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import features from "../features.json"

export interface PolicyState {
    [key: string]: Policy
}

export interface Policy {
    is_mask_mandate: boolean
    is_lockdown: boolean
    test_strategy: "none" | "symptomatic" | "everyone"
    test_capacity_multiplier: number
}

export interface PolicyUpdate {
    jurisdiction_id: string
    is_mask_mandate: boolean
    is_lockdown: boolean
    test_strategy: "none" | "symptomatic" | "everyone"
    test_capacity_multiplier: number
}

export const newPolicy: () => Policy = () => ({
    is_mask_mandate: false,
    is_lockdown: false,
    test_strategy: "none",
    test_capacity_multiplier: 0
})

const initialState: () => PolicyState = () =>
    features.reduce(
        (acc, feature) => {
            acc[feature.properties.code] = newPolicy()
            return acc
        },
        {
            GLOBAL: newPolicy()
        }
    )

export const policiesSlice = createSlice({
    name: "policies",
    initialState: initialState(),
    reducers: {
        updatePolicy: (state, action: PayloadAction<PolicyUpdate>) => {
            state[action.payload.jurisdiction_id] = {
                is_mask_mandate: action.payload.is_mask_mandate,
                is_lockdown: action.payload.is_lockdown,
                test_strategy: action.payload.test_strategy,
                test_capacity_multiplier:
                    action.payload.test_capacity_multiplier
            }
        },
        clearPolicies: state => initialState()
    }
})

// Action creators are generated for each case reducer function
export const { updatePolicy, clearPolicies } = policiesSlice.actions

export default policiesSlice.reducer
