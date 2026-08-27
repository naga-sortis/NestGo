import { useTrip } from '../lib/tripState'

export function ActivityTimeline() {
  const { state } = useTrip()

  if (state.activityLog.length === 0) return null

  return (
    <details className="mx-auto mt-8 max-w-3xl rounded-xl border border-slate-200 bg-white p-4 text-left dark:border-slate-800 dark:bg-slate-900">
      <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
        Your case file — every step logged, like a caseworker would track it (
        {state.activityLog.length})
      </summary>
      <ul className="mt-3 space-y-2 border-l border-slate-200 pl-4 dark:border-slate-800">
        {state.activityLog.map((entry) => (
          <li key={entry.id} className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {new Date(entry.at).toLocaleString()}
            </span>{' '}
            — {entry.label}
          </li>
        ))}
      </ul>
    </details>
  )
}
