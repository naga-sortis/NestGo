// Stores signups in the browser for the demo build. Swap this module's body
// for a Supabase `insert` call once a project is wired up — the call sites
// in WaitlistForm/ListingModal don't need to change.
const KEY = 'nestgo:waitlist'

export function saveEmail(email: string): void {
  const existing = loadEmails()
  if (existing.includes(email)) return
  localStorage.setItem(KEY, JSON.stringify([...existing, email]))
}

export function loadEmails(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}
