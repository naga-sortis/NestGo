import { useEffect, useState } from 'react'
import { useTrip } from '../lib/tripState'
import { getDestinationGuide } from '../data/discover'
import {
  fetchDestinationGuide,
  type DestinationGuideWithMeta,
} from '../lib/repos/destinationGuideRepo'
import { ExchangeRateWidget } from './ExchangeRateWidget'

type TripStyle = 'solo' | 'family'

export function DiscoverTab() {
  const { state } = useTrip()
  const trip = state.trip!
  const [guide, setGuide] = useState<DestinationGuideWithMeta>(() =>
    getDestinationGuide(trip.destinationCountry),
  )
  const [style, setStyle] = useState<TripStyle>('solo')

  useEffect(() => {
    let cancelled = false
    setGuide(getDestinationGuide(trip.destinationCountry))
    fetchDestinationGuide(trip.destinationCountry).then((result) => {
      if (!cancelled) setGuide(result)
    })
    return () => {
      cancelled = true
    }
  }, [trip.destinationCountry])

  const ideas = style === 'solo' ? guide.soloTripIdeas : guide.familyTripIdeas

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Explore {trip.destinationCountry} — beyond the paperwork
          </h2>
          {guide.lastVerifiedAt && (
            <span className="text-xs text-slate-400">Verified {guide.lastVerifiedAt}</span>
          )}
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          General starting points — confirm current details (hours, prices, exact
          season) before you travel.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
              🗓️ Best season to visit
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{guide.bestSeason}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
              🚆 Getting around
            </h3>
            <ul className="mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              {guide.transport.map((t) => (
                <li key={t}>• {t}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
            🏛️ Cultural & traditional highlights
          </h3>
          <ul className="mt-1 grid gap-1 text-sm text-slate-600 sm:grid-cols-2 dark:text-slate-300">
            {guide.culturalHighlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        </div>
      </div>

      <ExchangeRateWidget from={trip.originCountry} to={trip.destinationCountry} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trip ideas</h2>
          <div className="flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
            <button
              onClick={() => setStyle('solo')}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                style === 'solo'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Solo / bachelor trip
            </button>
            <button
              onClick={() => setStyle('family')}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                style === 'family'
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Family trip
            </button>
          </div>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
          {ideas.map((idea) => (
            <li
              key={idea}
              className="rounded-lg border border-slate-100 px-3 py-2 dark:border-slate-800"
            >
              {idea}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
