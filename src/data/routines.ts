export type Routine = {
  id: string
  title: string
  neighborhood: string
  city: string
  schedule: string
  spotsFilled: number
  spotsTotal: number
}

export const routines: Routine[] = [
  {
    id: 'r1',
    title: 'Specialty Coffee Club',
    neighborhood: 'Chamberí',
    city: 'Madrid',
    schedule: 'Tuesdays, 8:30 AM',
    spotsFilled: 4,
    spotsTotal: 5,
  },
  {
    id: 'r2',
    title: 'Sunday Padel Match',
    neighborhood: 'Malasaña',
    city: 'Madrid',
    schedule: 'Sundays, 6:00 PM',
    spotsFilled: 3,
    spotsTotal: 6,
  },
  {
    id: 'r3',
    title: 'Morning Co-working Table',
    neighborhood: 'Koramangala',
    city: 'Bangalore',
    schedule: 'Mon/Wed/Fri, 9:00 AM',
    spotsFilled: 5,
    spotsTotal: 6,
  },
  {
    id: 'r4',
    title: 'Grocery Run + Chat',
    neighborhood: 'Astoria, Queens',
    city: 'New York',
    schedule: 'Thursdays, 7:00 PM',
    spotsFilled: 2,
    spotsTotal: 5,
  },
]
