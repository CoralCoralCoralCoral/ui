// @ts-nocheck

import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import features from "../features.json"

export interface PolicyState {
    [key: string]: Policy | null
}

export interface Policy {
    is_mask_mandate: boolean
    is_lockdown: boolean
    test_strategy: "none" | "symptomatic" | "everyone"
}

export interface ApplyJurisdictionPolicyCommand {
    jurisdiction_id: string
    policy: Policy | null
}

const initialState: PolicyState = features.reduce(
    (acc, feature) => {
        acc[feature.properties.code] = null
        return acc
    },
    {
        GLOBAL: null
    }
)

export const newPolicy: () => Policy = () => ({
    is_mask_mandate: false,
    is_lockdown: false,
    test_strategy: "everyone"
})

export const policiesSlice = createSlice({
    name: "policies",
    initialState,
    reducers: {
        setPolicy: (
            state,
            action: PayloadAction<ApplyJurisdictionPolicyCommand>
        ) => {
            state[action.payload.jurisdiction_id] = action.payload.policy
        },
        clearPolicy: state => {
            state = initialState
        }
    }
})

// Action creators are generated for each case reducer function
export const { setPolicy, clearPolicy } = policiesSlice.actions

export default policiesSlice.reducer
