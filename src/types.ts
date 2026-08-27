export type Purpose = 'student' | 'employment' | 'relocation' | 'tourist'

export type TripInfo = {
  originCity: string
  originCountry: string
  destinationCity: string
  destinationCountry: string
  purpose: Purpose
}

export type ActivityEntry = {
  id: string
  at: string
  label: string
}

export type HousingPrefs = {
  maxPrice: number | null
  zone: string
  sortBy: 'price-asc' | 'price-desc'
}

export type Feedback = {
  id: string
  at: string
  rating: number
  comment: string
}

export type TripState = {
  trip: TripInfo | null
  formAnswers: Record<string, string>
  signature: string | null
  checklist: Record<string, boolean>
  activityLog: ActivityEntry[]
  housingPrefs: HousingPrefs
  joinedGroups: string[]
  feedback: Feedback[]
}
