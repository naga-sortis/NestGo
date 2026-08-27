import { useState } from 'react'
import { listings } from '../data/listings'
import { ListingModal } from './ListingModal'

export function SettleTab() {
  const [modalOpen, setModalOpen] = useState(false)
  const [reserved, setReserved] = useState<string | null>(null)

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Hand-off marketplace</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Take over a departing expat's lease, furniture, and utilities —
            escrow-protected.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900"
        >
          + List your hand-off
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                {listing.neighborhood}, {listing.city}
              </span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                {listing.currency}
                {listing.price.toLocaleString()}/mo
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {listing.summary}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {listing.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-slate-400">
              Move-in: {listing.moveDate}
            </p>
            <button
              onClick={() => setReserved(listing.id)}
              disabled={reserved === listing.id}
              className="mt-4 w-full rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              {reserved === listing.id ? 'Reserved via escrow ✓' : 'Secure via escrow'}
            </button>
          </div>
        ))}
      </div>

      {modalOpen && <ListingModal onClose={() => setModalOpen(false)} />}
    </div>
  )
}
