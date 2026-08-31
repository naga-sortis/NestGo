import { useEffect, useState } from 'react'
import { getCurrency } from '../lib/currency'

// A genuinely live data source (no mock, no backend): the Frankfurter API
// (European Central Bank reference rates, free, no key, CORS-enabled),
// fetched directly from the browser.
export function ExchangeRateWidget({ from, to }: { from: string; to: string }) {
  const fromCurrency = getCurrency(from)
  const toCurrency = getCurrency(to)
  const [rate, setRate] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (fromCurrency.code === toCurrency.code) {
      setRate(1)
      return
    }
    setRate(null)
    setFailed(false)
    let cancelled = false
    fetch(`https://api.frankfurter.app/latest?from=${fromCurrency.code}&to=${toCurrency.code}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return
        const value = data?.rates?.[toCurrency.code]
        if (typeof value === 'number') setRate(value)
        else setFailed(true)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [fromCurrency.code, toCurrency.code])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
        💱 Live exchange rate
      </h3>
      {failed ? (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Couldn't load a live rate right now — try again later.
        </p>
      ) : rate === null ? (
        <p className="mt-1 text-sm text-slate-400">Loading…</p>
      ) : (
        <p className="mt-1 text-lg font-medium text-emerald-800 dark:text-emerald-300">
          1 {fromCurrency.code} = {rate.toFixed(2)} {toCurrency.code}
        </p>
      )}
      <p className="mt-1 text-xs text-slate-400">
        Live from the Frankfurter API (European Central Bank reference rates) —
        fetched directly in your browser, no backend involved.
      </p>
    </div>
  )
}
