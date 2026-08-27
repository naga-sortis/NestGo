import { useState } from 'react'
import { saveEmail } from '../lib/waitlist'

export function Hero() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    saveEmail(email)
    setJoined(true)
  }

  return (
    <section className="mx-auto max-w-4xl px-6 pt-20 pb-14 text-center">
      <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
        The Expat Operating System
      </span>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        Land smoothly. Settle instantly. Connect naturally.
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        NestGo automates local bureaucracy, matches departing and incoming
        expats for apartment hand-offs, and groups you into neighborhood
        routines&nbsp;— all in one place, wherever you're moving.
      </p>

      {joined ? (
        <p className="mx-auto mt-8 max-w-md rounded-lg bg-emerald-50 px-4 py-3 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
          You're on the list — we'll email you when your city goes live.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-base focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-800 px-5 py-2.5 font-medium text-white hover:bg-emerald-900"
          >
            Join the waitlist
          </button>
        </form>
      )}
    </section>
  )
}
