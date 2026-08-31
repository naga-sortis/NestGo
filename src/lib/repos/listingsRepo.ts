import { supabase } from '../supabaseClient'
import { listings as staticListings, type Listing } from '../../data/listings'

type ListingRow = {
  id: string
  neighborhood: string
  city: string
  price: number
  currency: string
  move_date: string | null
  items: string[]
  summary: string
}

function fromRow(row: ListingRow): Listing {
  return {
    id: row.id,
    neighborhood: row.neighborhood,
    city: row.city,
    price: row.price,
    currency: row.currency,
    moveDate: row.move_date ?? '',
    items: row.items,
    summary: row.summary,
  }
}

export async function fetchListings(): Promise<Listing[]> {
  if (!supabase) return staticListings

  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) return staticListings
  return data.map(fromRow)
}

export async function submitListing(input: {
  neighborhood: string
  city: string
  price: number
  currency: string
  moveDate: string
  items: string[]
  summary: string
}): Promise<{ ok: boolean; live: boolean }> {
  if (!supabase) {
    // No backend configured — the UI still shows a success state, but
    // nothing is actually persisted or visible to other users.
    return { ok: true, live: false }
  }

  const { error } = await supabase.from('listings').insert({
    neighborhood: input.neighborhood,
    city: input.city,
    price: input.price,
    currency: input.currency,
    move_date: input.moveDate || null,
    items: input.items,
    summary: input.summary,
  })

  return { ok: !error, live: true }
}

export function subscribeToListings(onChange: () => void): () => void {
  const client = supabase
  if (!client) return () => {}

  const channel = client
    .channel('listings-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, onChange)
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}
