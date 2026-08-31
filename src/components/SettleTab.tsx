import { useEffect, useMemo, useState } from 'react'
import type { Listing } from '../data/listings'
import { fetchListings, subscribeToListings } from '../lib/repos/listingsRepo'
import { ListingModal } from './ListingModal'
import { useTrip } from '../lib/tripState'

export function SettleTab() {
  const { state, setHousingPrefs, logActivity } = useTrip()
  const trip = state.trip!
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [reserved, setReserved] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    function load() {
      fetchListings().then((data) => {
        if (!cancelled) setAllListings(data)
      })
    }
    load()
    const unsubscribe = subscribeToListings(load)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const localMatches = useMemo(
    () => allListings.filter((l) => l.city.toLowerCase() === trip.destinationCity.toLowerCase()),
    [allListings, trip.destinationCity],
  )
  const hasLocalListings = localMatches.length > 0
  const cityListings = hasLocalListings ? localMatches : allListings

  const zones = useMemo(
    () => ['all', ...new Set(cityListings.map((l) => l.neighborhood))],
    [cityListings],
  )

  const visible = useMemo(() => {
    let result = cityListings
    if (state.housingPrefs.zone !== 'all') {
      result = result.filter((l) => l.neighborhood === state.housingPrefs.zone)
    }
    if (state.housingPrefs.maxPrice) {
      result = result.filter((l) => l.price <= state.housingPrefs.maxPrice!)
    }
    return [...result].sort((a, b) =>
      state.housingPrefs.sortBy === 'price-asc' ? a.price - b.price : b.price - a.price,
    )
  }, [cityListings, state.housingPrefs])

  const webSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `apartments for rent in ${trip.destinationCity}`,
  )}`

  return (
    <div className="relative">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">
            Hand-off marketplace — {trip.destinationCity}
          </h2>
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

      {!hasLocalListings && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          No hand-off listings in {trip.destinationCity} yet — showing example listings from
          other cities. Try the web search below, or be the first to list one.
        </p>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
        <label className="flex items-center gap-2">
          Zone
          <select
            value={state.housingPrefs.zone}
            onChange={(e) => setHousingPrefs({ zone: e.target.value })}
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z === 'all' ? 'All zones' : z}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2">
          Max price
          <input
            type="number"
            placeholder="Any"
            value={state.housingPrefs.maxPrice ?? ''}
            onChange={(e) =>
              setHousingPrefs({ maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="flex items-center gap-2">
          Sort
          <select
            value={state.housingPrefs.sortBy}
            onChange={(e) =>
              setHousingPrefs({ sortBy: e.target.value as 'price-asc' | 'price-desc' })
            }
            className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </label>

        <a
          href={webSearchUrl}
          target="_blank"
          rel="noreferrer"
          onClick={() => logActivity(`Searched the web for housing in ${trip.destinationCity}`)}
          className="ml-auto rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
        >
          🔎 Search the web instead
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((listing) => (
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
            <p className="mt-3 text-xs text-slate-400">Move-in: {listing.moveDate}</p>
            <button
              onClick={() => {
                setReserved(listing.id)
                logActivity(`Reserved hand-off in ${listing.neighborhood} via escrow`)
              }}
              disabled={reserved === listing.id}
              className="mt-4 w-full rounded-lg border border-emerald-700 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-50 disabled:opacity-60 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              {reserved === listing.id ? 'Reserved via escrow ✓' : 'Secure via escrow'}
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ListingModal
          city={trip.destinationCity}
          country={trip.destinationCountry}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
