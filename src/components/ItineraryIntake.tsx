import { useState } from 'react'
import { useTrip } from '../lib/tripState'
import type { Purpose } from '../types'

const COUNTRIES = ['Spain', 'India', 'United States', 'Germany', 'United Kingdom', 'Other']

const PURPOSES: { id: Purpose; label: string; blurb: string }[] = [
  { id: 'student', label: 'Student', blurb: 'Studying abroad' },
  { id: 'employment', label: 'Employment', blurb: 'Taking up a job' },
  { id: 'relocation', label: 'On-site relocation', blurb: 'Corporate transfer, often with family' },
  { id: 'tourist', label: 'Tourist', blurb: 'Visiting, no local work/study' },
]

export function ItineraryIntake() {
  const { startTrip } = useTrip()
  const [originCity, setOriginCity] = useState('')
  const [originCountry, setOriginCountry] = useState('')
  const [destinationCity, setDestinationCity] = useState('')
  const [destinationCountry, setDestinationCountry] = useState(COUNTRIES[0])
  const [purpose, setPurpose] = useState<Purpose | null>(null)

  const canSubmit = originCity && originCountry && destinationCity && destinationCountry && purpose

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit || !purpose) return
    startTrip({ originCity, originCountry, destinationCity, destinationCountry, purpose })
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <div className="text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          Let's set up your move
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Where are you starting, and where are you headed?
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          NestGo tailors your paperwork, housing options, and community groups
          to this trip.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              From (city)
            </label>
            <input
              required
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder="e.g. Bangalore"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              From (country)
            </label>
            <input
              required
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              placeholder="e.g. India"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              To (city)
            </label>
            <input
              required
              value={destinationCity}
              onChange={(e) => setDestinationCity(e.target.value)}
              placeholder="e.g. Madrid"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
              To (country)
            </label>
            <select
              value={destinationCountry}
              onChange={(e) => setDestinationCountry(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Purpose of visit
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {PURPOSES.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  purpose === p.id
                    ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-slate-200 hover:border-emerald-600 dark:border-slate-700'
                }`}
              >
                <div className="font-medium">{p.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{p.blurb}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-lg bg-emerald-800 px-4 py-2.5 font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          Start my NestGo case
        </button>
      </form>
    </section>
  )
}
