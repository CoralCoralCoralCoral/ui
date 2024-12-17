// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface CurrencyState {
    currency: number
}

const initialState: CurrencyState = {
    currency: 1000000
}

export const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {
        resetCurrency: state => initialState,
        setCurrency: (state, action: PayloadAction<number>) => {
            state.currency = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { increment, resetCurrency, setCurrency } = currencySlice.actions

export default currencySlice.reducer
