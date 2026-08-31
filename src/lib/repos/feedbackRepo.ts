import { supabase } from '../supabaseClient'

export async function submitFeedbackRemote(rating: number, comment: string): Promise<boolean> {
  if (!supabase) return false
  const { error } = await supabase.from('feedback').insert({ rating, comment: comment || null })
  return !error
}

export async function fetchFeedbackSummary(): Promise<{ average: number; count: number } | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .rpc('feedback_summary')
    .single<{ average: number; count: number }>()
  if (error || !data || data.count === 0) return null
  return { average: Number(data.average), count: Number(data.count) }
}
