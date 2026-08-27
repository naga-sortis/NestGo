import { useState } from 'react'
import { routines } from '../data/routines'

export function SocialTab() {
  const [joined, setJoined] = useState<Set<string>>(new Set())

  function join(id: string) {
    setJoined((prev) => new Set(prev).add(id))
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Neighborhood routine loops</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Small groups of 4–6 people, matched by weekly habit and a 2km radius —
        not a one-off mixer.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {routines.map((routine) => {
          const isJoined = joined.has(routine.id)
          const filled = isJoined
            ? Math.min(routine.spotsFilled + 1, routine.spotsTotal)
            : routine.spotsFilled
          const full = filled >= routine.spotsTotal

          return (
            <div
              key={routine.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-medium">{routine.title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {routine.neighborhood}, {routine.city} · {routine.schedule}
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-emerald-700"
                  style={{ width: `${(filled / routine.spotsTotal) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {filled}/{routine.spotsTotal} spots filled
                </span>
                <button
                  onClick={() => join(routine.id)}
                  disabled={isJoined || full}
                  className="rounded-lg bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-900 disabled:opacity-60"
                >
                  {isJoined ? 'Joined ✓' : full ? 'Full' : 'Join loop'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
