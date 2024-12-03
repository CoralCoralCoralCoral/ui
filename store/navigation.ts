import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import features from "../features.json"

export interface Jurisdiction {
    name: string
    code: string
    parent: string | null
    level: "msoa" | "lad" | "global"
}

export interface NavigationState {
    selectedJurisdiction: Jurisdiction
    selectedLad: string | null
    selectedMsoa: string | null
}

export const globalJurisdiction: Jurisdiction = {
    name: "Global",
    code: "GLOBAL",
    parent: null,
    level: "global"
}

const initialState: NavigationState = {
    selectedJurisdiction: globalJurisdiction,
    selectedLad: null,
    selectedMsoa: null
}

export const navigationSlice = createSlice({
    name: "navigation",
    initialState,
    reducers: {
        updateJurisdiction: (state, action: PayloadAction<Jurisdiction>) => {
            state.selectedJurisdiction = action.payload

            if (action.payload.level == "msoa") {
                state.selectedMsoa = action.payload.code
                state.selectedLad = action.payload.parent
            }

            if (action.payload.level == "lad") {
                state.selectedMsoa = null
                state.selectedLad = action.payload.code
            }

            if (action.payload.level == "global") {
                state.selectedMsoa = null
                state.selectedLad = null
            }
        }
    }
})

// Action creators are generated for each case reducer function
export const { updateJurisdiction } = navigationSlice.actions

export default navigationSlice.reducer
