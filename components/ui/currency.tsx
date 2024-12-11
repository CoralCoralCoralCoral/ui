import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useEffect } from 'react';

import {increment} from "../../store/currency"

const CurrencyMonitor = () => {
  const currencyStore = useAppSelector(store => store.currency)
  const testCost: number = 1.99

  const metrics = useAppSelector(store => store.metrics['GLOBAL'])
  const policy = useAppSelector(store => store.policy)

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(increment(-testCost * metrics[metrics.length -1].new_tests))
  }, [metrics])

  useEffect(() => {
    
  }, [policy])

  return (
    <div>
      <span>
        Currency Remaining: £{currencyStore.currency.toLocaleString()}
      </span>
    </div>
  )
}


export default CurrencyMonitor;