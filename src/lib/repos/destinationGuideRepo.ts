import { supabase } from '../supabaseClient'
import { getDestinationGuide as getStaticGuide, type DestinationGuide } from '../../data/discover'

type GuideRow = {
  best_season: string
  transport: string[]
  cultural_highlights: string[]
  solo_trip_ideas: string[]
  family_trip_ideas: string[]
  last_verified_at: string
}

export type DestinationGuideWithMeta = DestinationGuide & { lastVerifiedAt?: string }

export async function fetchDestinationGuide(country: string): Promise<DestinationGuideWithMeta> {
  const fallback = getStaticGuide(country)
  if (!supabase) return fallback

  const { data, error } = await supabase
    .from('destination_guides')
    .select('*')
    .eq('country', country)
    .maybeSingle<GuideRow>()

  if (error || !data) return fallback

  return {
    bestSeason: data.best_season,
    transport: data.transport,
    culturalHighlights: data.cultural_highlights,
    soloTripIdeas: data.solo_trip_ideas,
    familyTripIdeas: data.family_trip_ideas,
    lastVerifiedAt: data.last_verified_at,
  }
}
