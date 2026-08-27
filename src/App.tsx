import { useEffect, useRef, useState } from 'react'
import { Hero } from './components/Hero'
import { TabNav, type TabId } from './components/TabNav'
import { SecureTab } from './components/SecureTab'
import { SettleTab } from './components/SettleTab'
import { SocialTab } from './components/SocialTab'
import { ItineraryIntake } from './components/ItineraryIntake'
import { ActivityTimeline } from './components/ActivityTimeline'
import { TripProvider, useTrip } from './lib/tripState'
import { getRequirements } from './data/visaRequirements'

function AppShell() {
  const { state } = useTrip()
  const [tab, setTab] = useState<TabId>('secure')
  const hasAutoAdvanced = useRef(false)

  const trip = state.trip
  const checklist = trip ? getRequirements(trip.destinationCountry, trip.purpose).checklist : []
  const allChecklistDone =
    checklist.length > 0 && checklist.every((item) => state.checklist[item.id])

  useEffect(() => {
    if (allChecklistDone && !hasAutoAdvanced.current) {
      hasAutoAdvanced.current = true
      setTab('settle')
    }
  }, [allChecklistDone])

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-800 text-sm text-white"
              aria-hidden="true"
            >
              N
            </span>
            NestGo
          </div>
          <a
            href="https://github.com/naga-sortis/NestGo"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
          >
            View source
          </a>
        </div>
      </header>

      {!trip ? (
        <>
          <Hero />
          <ItineraryIntake />
        </>
      ) : (
        <main className="mx-auto max-w-5xl px-6 pb-24 pt-10">
          <TabNav
            active={tab}
            onChange={setTab}
            lockedTabs={allChecklistDone ? [] : ['settle']}
          />
          <div className="mt-8">
            {tab === 'secure' && <SecureTab />}
            {tab === 'settle' && <SettleTab />}
            {tab === 'social' && <SocialTab />}
          </div>
          <ActivityTimeline />
        </main>
      )}

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
        NestGo — Secure, Settle, Social. Built for anyone moving abroad.
      </footer>
    </div>
  )
}

function App() {
  return (
    <TripProvider>
      <AppShell />
    </TripProvider>
  )
}

export default App
