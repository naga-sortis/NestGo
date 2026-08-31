import { supabase } from '../supabaseClient'
import { routines as staticRoutines, type Routine } from '../../data/routines'

type RoutineRow = {
  id: string
  title: string
  neighborhood: string
  city: string
  schedule: string
  spots_total: number
  spots_filled: number
}

function fromRow(row: RoutineRow): Routine {
  return {
    id: row.id,
    title: row.title,
    neighborhood: row.neighborhood,
    city: row.city,
    schedule: row.schedule,
    spotsTotal: row.spots_total,
    spotsFilled: row.spots_filled,
  }
}

export async function fetchRoutines(): Promise<Routine[]> {
  if (!supabase) return staticRoutines

  const { data, error } = await supabase.from('routines').select('*')
  if (error || !data || data.length === 0) return staticRoutines
  return data.map(fromRow)
}

// Returns null when there's no live backend (caller keeps its own local
// "joined" state, matching pre-Supabase behavior) or when the loop is full.
export async function joinRoutine(routineId: string): Promise<Routine | null> {
  if (!supabase) return null

  const { data, error } = await supabase.rpc('join_routine', { routine_id: routineId })
  if (error || !data) return null
  return fromRow(data)
}

export function subscribeToRoutines(onChange: () => void): () => void {
  const client = supabase
  if (!client) return () => {}

  const channel = client
    .channel('routines-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'routines' }, onChange)
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}
