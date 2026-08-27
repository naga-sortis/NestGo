import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ActivityEntry, Feedback, HousingPrefs, TripInfo, TripState } from '../types'

const KEY = 'nestgo:trip-state'

const DEFAULT_STATE: TripState = {
  trip: null,
  formAnswers: {},
  signature: null,
  checklist: {},
  activityLog: [],
  housingPrefs: { maxPrice: null, zone: 'all', sortBy: 'price-asc' },
  joinedGroups: [],
  feedback: [],
}

function load(): TripState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

type TripContextValue = {
  state: TripState
  startTrip: (trip: TripInfo) => void
  resetTrip: () => void
  setFormAnswer: (id: string, value: string) => void
  setSignature: (dataUrl: string) => void
  toggleChecklistItem: (id: string, label: string) => void
  logActivity: (label: string) => void
  setHousingPrefs: (prefs: Partial<HousingPrefs>) => void
  toggleGroup: (id: string) => void
  submitFeedback: (rating: number, comment: string) => void
}

const TripContext = createContext<TripContextValue | null>(null)

export function TripProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TripState>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  function logActivity(label: string) {
    const entry: ActivityEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
      label,
    }
    setState((prev) => ({ ...prev, activityLog: [entry, ...prev.activityLog] }))
  }

  function startTrip(trip: TripInfo) {
    setState((prev) => ({ ...prev, trip }))
    logActivity(
      `Trip started: ${trip.originCity} → ${trip.destinationCity} (${trip.purpose})`,
    )
  }

  function resetTrip() {
    localStorage.removeItem(KEY)
    setState(DEFAULT_STATE)
  }

  function setFormAnswer(id: string, value: string) {
    setState((prev) => ({ ...prev, formAnswers: { ...prev.formAnswers, [id]: value } }))
  }

  function setSignature(dataUrl: string) {
    setState((prev) => ({ ...prev, signature: dataUrl }))
    logActivity('Signature captured')
  }

  function toggleChecklistItem(id: string, label: string) {
    setState((prev) => {
      const done = !prev.checklist[id]
      return { ...prev, checklist: { ...prev.checklist, [id]: done } }
    })
    logActivity(`${state.checklist[id] ? 'Unchecked' : 'Completed'}: ${label}`)
  }

  function setHousingPrefs(prefs: Partial<HousingPrefs>) {
    setState((prev) => ({ ...prev, housingPrefs: { ...prev.housingPrefs, ...prefs } }))
  }

  function toggleGroup(id: string) {
    setState((prev) => {
      const joined = prev.joinedGroups.includes(id)
      return {
        ...prev,
        joinedGroups: joined
          ? prev.joinedGroups.filter((g) => g !== id)
          : [...prev.joinedGroups, id],
      }
    })
  }

  function submitFeedback(rating: number, comment: string) {
    const entry: Feedback = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      at: new Date().toISOString(),
      rating,
      comment,
    }
    setState((prev) => ({ ...prev, feedback: [entry, ...prev.feedback] }))
    logActivity(`Submitted feedback (${rating}/5)`)
  }

  return (
    <TripContext.Provider
      value={{
        state,
        startTrip,
        resetTrip,
        setFormAnswer,
        setSignature,
        toggleChecklistItem,
        logActivity,
        setHousingPrefs,
        toggleGroup,
        submitFeedback,
      }}
    >
      {children}
    </TripContext.Provider>
  )
}

export function useTrip() {
  const ctx = useContext(TripContext)
  if (!ctx) throw new Error('useTrip must be used within TripProvider')
  return ctx
}
