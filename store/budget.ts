// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface BudgetState {
    budget: number
    day: number
    dailyDelta: number
    weeklyDelta: number
    data: number[7]
}

const initialState: BudgetState = {
    budget: 1000000,
    day: 0,
    data: [0,0,0,0,0,0,0],
    dailyDelta: 0,
    weeklyDelta: 0,
}

export const budgetSlice = createSlice({
    name: "budget",
    initialState,
    reducers: {
        resetBudget: state => initialState,
        setBudget: (state, action: PayloadAction<number>) => {
            state.dailyDelta = action.payload - state.budget
            state.budget = action.payload
            state.day += 1
            state.data[(state.day - 1) % 7] = state.dailyDelta
            state.weeklyDelta = state.data.reduce((total :number, current :number) => total + current, 0) / (Math.min(state.day, 7))
        }
    }
})

// Action creators are generated for each case reducer function
export const { resetBudget, setBudget } = budgetSlice.actions

export default budgetSlice.reducer
