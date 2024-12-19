// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface BudgetState {
    budget: number
    day: number
    dailyDelta: number
    weeklyDelta: number
    deltaData: number[7]
    weekProjection: number
}

const initialState: BudgetState = {
    budget: 1000000,
    day: 0,
    deltaData: [0,0,0,0,0,0,0],
    dailyDelta: 0,
    weeklyDelta: 0,
    weekProjection: 0,
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
            state.deltaData[(state.day - 1) % 7] = state.dailyDelta
            state.weeklyDelta = state.deltaData.reduce((total :number, current :number) => total + current, 0) / (Math.min(state.day, 7))

            state.weekProjection = state.budget + state.dailyDelta + (0.5 * state.dailyDelta + 0.5 * state.weeklyDelta) + 5 * state.weeklyDelta
        }
    }
})

// Action creators are generated for each case reducer function
export const { resetBudget, setBudget } = budgetSlice.actions

export default budgetSlice.reducer
