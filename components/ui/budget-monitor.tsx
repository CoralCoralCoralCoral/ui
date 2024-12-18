import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { styleText } from 'util';

const BudgetMonitor = () => {
  const budgetStore = useAppSelector(store => store.budget)

  const formatBudget = (budget: number) => {
    if (budget >= 0) {
      return "+£" + budget.toLocaleString()
    } else {
      return "-£" + budget.toLocaleString().substring(1)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <span>
        Current Budget: {formatBudget(budgetStore.budget)}
      </span>
      <div className="flex-stack">
        <span> 
          Daily Delta: {formatBudget(budgetStore.dailyDelta)}
        </span>
        <span>
          7 Day Delta: {formatBudget(budgetStore.weeklyDelta)}
        </span>
      </div>
    </div>
  )
}

export default BudgetMonitor;