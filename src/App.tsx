import { useState } from 'react'
import { Hero } from './components/Hero'
import { TabNav, type TabId } from './components/TabNav'
import { SecureTab } from './components/SecureTab'
import { SettleTab } from './components/SettleTab'
import { SocialTab } from './components/SocialTab'

function App() {
  const [tab, setTab] = useState<TabId>('secure')

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

      <Hero />

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <TabNav active={tab} onChange={setTab} />
        <div className="mt-8">
          {tab === 'secure' && <SecureTab />}
          {tab === 'settle' && <SettleTab />}
          {tab === 'social' && <SocialTab />}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400 dark:border-slate-800">
        NestGo — Secure, Settle, Social. Built for anyone moving abroad.
      </footer>
    </div>
  )
}

export default App
