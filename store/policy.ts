import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface PolicyState {
    [key: string]: Policy
}

export interface Policy {
    is_mask_mandate: boolean
    is_self_isolation_mandate: boolean
    is_self_reporting_mandate: boolean
    is_lockdown: boolean
    test_strategy: "none" | "symptomatic" | "everyone"
    test_capacity_multiplier: number
    compliance_probability: number
}

export interface PolicyUpdate {
    jurisdiction_id: string
    policy: Policy
}

const initialState: PolicyState = {}

export const policiesSlice = createSlice({
    name: "policies",
    initialState,
    reducers: {
        updatePolicy: (state, action: PayloadAction<PolicyUpdate>) => {
            state[action.payload.jurisdiction_id] = action.payload.policy
        },
        clearPolicies: state => initialState
    }
})

// Action creators are generated for each case reducer function
export const { updatePolicy, clearPolicies } = policiesSlice.actions

export default policiesSlice.reducer
