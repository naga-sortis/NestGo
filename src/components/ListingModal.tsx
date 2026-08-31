import { useState } from 'react'
import { submitListing } from '../lib/repos/listingsRepo'
import { getCurrency } from '../lib/currency'

export function ListingModal({
  city,
  country,
  onClose,
}: {
  city: string
  country: string
  onClose: () => void
}) {
  const currency = getCurrency(country)
  const [neighborhood, setNeighborhood] = useState('')
  const [price, setPrice] = useState('')
  const [itemsText, setItemsText] = useState('')
  const [moveDate, setMoveDate] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | { live: boolean }>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('submitting')
    const result = await submitListing({
      neighborhood,
      city,
      price: Number(price),
      currency: currency.symbol,
      moveDate,
      items: itemsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      summary: `${neighborhood} hand-off listed by a NestGo user.`,
    })
    setStatus({ live: result.live })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">List your hand-off</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {typeof status === 'object' ? (
          <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            {status.live
              ? "Listed — it's live in the marketplace for everyone right now."
              : 'Saved locally for this demo — connect Supabase (see README) to make listings visible to other users.'}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Neighborhood"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <input
              required
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={`Monthly rent (${currency.symbol})`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <textarea
              required
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder="Items included, comma-separated (furniture, Wi-Fi contract, etc.)"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <input
              type="date"
              required
              value={moveDate}
              onChange={(e) => setMoveDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 font-medium text-white hover:bg-emerald-900 disabled:opacity-60"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit listing'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
