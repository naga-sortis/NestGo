import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import {
  getRequirements as getStaticRequirements,
  getPurposeChecklist,
  getCountryChecklist,
  type ChecklistItem,
  type Requirements,
} from '../../data/visaRequirements'
import type { Purpose } from '../../types'

type ChecklistItemRow = {
  scope: 'purpose' | 'country'
  scope_key: string
  item_id: string
  label: string
  instructions: string
  online: boolean
  fields: ChecklistItem['fields']
  last_verified_at: string
}

function fromRow(row: ChecklistItemRow): ChecklistItem & { lastVerifiedAt?: string } {
  return {
    id: row.item_id,
    label: row.label,
    instructions: row.instructions,
    online: row.online,
    fields: row.fields,
    lastVerifiedAt: row.last_verified_at,
  }
}

// Composes each scope independently: a scope only comes from Supabase once
// it actually has rows for that purpose/country, otherwise that scope falls
// back to the static list. This avoids the case where seeding just the
// country-specific items (say) silently wipes out the purpose-specific ones.
export async function fetchRequirements(
  destinationCountry: string,
  purpose: Purpose,
): Promise<Requirements> {
  const fallback = getStaticRequirements(destinationCountry, purpose)
  if (!supabase) return fallback

  const { data, error } = await supabase
    .from('visa_checklist_items')
    .select('*')
    .or(`and(scope.eq.purpose,scope_key.eq.${purpose}),and(scope.eq.country,scope_key.eq.${destinationCountry})`)

  if (error || !data) return fallback

  const rows = data as ChecklistItemRow[]
  const purposeRows = rows.filter((r) => r.scope === 'purpose')
  const countryRows = rows.filter((r) => r.scope === 'country')

  return {
    baseFields: fallback.baseFields,
    checklist: [
      ...(purposeRows.length > 0 ? purposeRows.map(fromRow) : getPurposeChecklist(purpose)),
      ...(countryRows.length > 0 ? countryRows.map(fromRow) : getCountryChecklist(destinationCountry)),
    ],
  }
}

// Renders synchronously with the static baseline, then swaps in the live
// Supabase content if/when it resolves — so gating logic and the checklist
// UI never see an empty or loading state.
export function useRequirements(destinationCountry: string, purpose: Purpose): Requirements {
  const [requirements, setRequirements] = useState<Requirements>(() =>
    getStaticRequirements(destinationCountry, purpose),
  )

  useEffect(() => {
    setRequirements(getStaticRequirements(destinationCountry, purpose))
    let cancelled = false
    fetchRequirements(destinationCountry, purpose).then((result) => {
      if (!cancelled) setRequirements(result)
    })
    return () => {
      cancelled = true
    }
  }, [destinationCountry, purpose])

  return requirements
}
