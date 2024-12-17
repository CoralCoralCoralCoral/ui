import { useAppSelector } from '@/store/hooks';
import React from 'react';

const CurrencyMonitor = () => {
  const currencyStore = useAppSelector(store => store.currency)

  return (
    <div>
      <span>
        Currency Remaining: £{currencyStore.currency.toLocaleString()}
      </span>
    </div>
  )
}

export default CurrencyMonitor;