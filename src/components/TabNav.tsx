export type TabId = 'secure' | 'settle' | 'social'

const TABS: { id: TabId; label: string; blurb: string }[] = [
  { id: 'secure', label: 'Secure', blurb: 'Bureaucracy, handled' },
  { id: 'settle', label: 'Settle', blurb: 'Hand-off marketplace' },
  { id: 'social', label: 'Social', blurb: 'Neighborhood routines' },
]

export function TabNav({
  active,
  onChange,
  lockedTabs = [],
}: {
  active: TabId
  onChange: (id: TabId) => void
  lockedTabs?: TabId[]
}) {
  return (
    <div className="mx-auto flex max-w-xl gap-2 rounded-xl border border-slate-200 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-900">
      {TABS.map((tab) => {
        const locked = lockedTabs.includes(tab.id)
        return (
          <button
            key={tab.id}
            onClick={() => !locked && onChange(tab.id)}
            disabled={locked}
            title={locked ? 'Complete your visa checklist first' : undefined}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              locked
                ? 'cursor-not-allowed text-slate-300 dark:text-slate-600'
                : active === tab.id
                  ? 'bg-emerald-800 text-white'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <div>
              {locked && '🔒 '}
              {tab.label}
            </div>
            <div
              className={`text-xs font-normal ${
                active === tab.id && !locked ? 'text-emerald-100' : 'text-slate-400'
              }`}
            >
              {tab.blurb}
            </div>
          </button>
        )
      })}
    </div>
  )
}
