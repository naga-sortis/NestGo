import { useEffect, useMemo, useState } from 'react'
import type { Routine } from '../data/routines'
import { fetchRoutines, joinRoutine, subscribeToRoutines } from '../lib/repos/routinesRepo'
import { getCommunityGroups } from '../data/communityGroups'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { useTrip } from '../lib/tripState'

export function SocialTab() {
  const { state, toggleGroup, logActivity } = useTrip()
  const trip = state.trip!
  const [allRoutines, setAllRoutines] = useState<Routine[]>([])
  const [joinedLoops, setJoinedLoops] = useState<Set<string>>(new Set())
  const [joiningId, setJoiningId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    function load() {
      fetchRoutines().then((data) => {
        if (!cancelled) setAllRoutines(data)
      })
    }
    load()
    const unsubscribe = subscribeToRoutines(load)
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const groups = useMemo(() => getCommunityGroups(trip.destinationCity), [trip.destinationCity])

  const localRoutines = useMemo(
    () => allRoutines.filter((r) => r.city.toLowerCase() === trip.destinationCity.toLowerCase()),
    [allRoutines, trip.destinationCity],
  )
  const visibleRoutines = localRoutines.length > 0 ? localRoutines : allRoutines

  async function join(routine: Routine) {
    setJoiningId(routine.id)
    if (isSupabaseConfigured) {
      const updated = await joinRoutine(routine.id)
      if (updated) {
        setJoinedLoops((prev) => new Set(prev).add(routine.id))
        logActivity(`Joined a routine loop in ${trip.destinationCity}`)
      }
    } else {
      setJoinedLoops((prev) => new Set(prev).add(routine.id))
      logActivity(`Joined a routine loop in ${trip.destinationCity}`)
    }
    setJoiningId(null)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">
          Community groups in {trip.destinationCity}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pick the groups you want to join — these link out to Facebook,
          Meetup, and WhatsApp searches for your destination.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {groups.map((group) => {
            const joined = state.joinedGroups.includes(group.id)
            return (
              <div
                key={group.id}
                className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                  {group.platform}
                </span>
                <p className="mt-1 text-sm">{group.name}</p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={group.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
                  >
                    Open
                  </a>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                      joined
                        ? 'bg-emerald-800 text-white'
                        : 'border border-emerald-700 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300'
                    }`}
                  >
                    {joined ? 'Joined ✓' : 'Join'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Neighborhood routine loops</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Small groups of 4–6 people, matched by weekly habit and a 2km radius
          in {trip.destinationCity} — easier to follow than a city-wide feed.
        </p>

        {localRoutines.length === 0 && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            No routine loops in {trip.destinationCity} yet — showing example loops from
            other cities.
          </p>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {visibleRoutines.map((routine) => {
            const isJoined = joinedLoops.has(routine.id)
            // Without a live backend, nothing else updates spotsFilled, so
            // bump it optimistically. With one, join_routine() already
            // persisted the real count and the realtime subscription above
            // will refresh it.
            const filled =
              isJoined && !isSupabaseConfigured
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
                    onClick={() => join(routine)}
                    disabled={isJoined || full || joiningId === routine.id}
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
    </div>
  )
}
