import type { Purpose } from '../types'

export type FormField = {
  id: string
  label: string
  type: 'text' | 'date'
}

export type ChecklistItem = {
  id: string
  label: string
}

export type Requirements = {
  fields: FormField[]
  checklist: ChecklistItem[]
}

const BASE_FIELDS: FormField[] = [
  { id: 'fullName', label: 'Full legal name', type: 'text' },
  { id: 'passportNumber', label: 'Passport number', type: 'text' },
  { id: 'nationality', label: 'Nationality', type: 'text' },
  { id: 'arrivalDate', label: 'Planned arrival date', type: 'date' },
]

const PURPOSE_FIELDS: Record<Purpose, FormField[]> = {
  student: [{ id: 'institution', label: 'School / university name', type: 'text' }],
  employment: [{ id: 'employer', label: 'Employer name', type: 'text' }],
  relocation: [{ id: 'employer', label: 'Employer / relocating entity', type: 'text' }],
  tourist: [{ id: 'returnDate', label: 'Return / onward travel date', type: 'date' }],
}

const PURPOSE_CHECKLIST: Record<Purpose, ChecklistItem[]> = {
  student: [
    { id: 'visa-app', label: 'Student visa application' },
    { id: 'admission-letter', label: 'University admission letter' },
    { id: 'proof-funds', label: 'Proof of sufficient funds' },
    { id: 'health-insurance', label: 'Health insurance coverage' },
    { id: 'accommodation-proof', label: 'Accommodation proof' },
  ],
  employment: [
    { id: 'work-visa', label: 'Work visa / permit application' },
    { id: 'employment-contract', label: 'Signed employment contract' },
    { id: 'credential-check', label: 'Educational/professional credential validation' },
    { id: 'health-insurance', label: 'Health insurance coverage' },
    { id: 'tax-id', label: 'Local tax ID application' },
  ],
  relocation: [
    { id: 'work-visa', label: 'Work / relocation visa application' },
    { id: 'employment-contract', label: 'Signed employment or assignment letter' },
    { id: 'dependent-visa', label: 'Dependent/family visa (if relocating with family)' },
    { id: 'health-insurance', label: 'Health insurance coverage' },
    { id: 'household-goods', label: 'Household goods customs declaration' },
  ],
  tourist: [
    { id: 'visa-app', label: 'Tourist visa application (if required)' },
    { id: 'travel-insurance', label: 'Travel insurance' },
    { id: 'return-ticket', label: 'Return / onward ticket proof' },
    { id: 'accommodation-proof', label: 'Accommodation booking proof' },
  ],
}

const COUNTRY_CHECKLIST: Record<string, ChecklistItem[]> = {
  Spain: [
    { id: 'nie-tie', label: 'NIE / TIE application' },
    { id: 'empadronamiento', label: 'Empadronamiento (city registration)' },
    { id: 'cita-previa', label: 'Cita Previa appointment' },
  ],
  India: [
    { id: 'frro', label: 'FRRO / FRO registration' },
    { id: 'pan-card', label: 'PAN card application' },
  ],
  'United States': [
    { id: 'ssn', label: 'Social Security Number (SSN) application' },
    { id: 'i94', label: 'I-94 arrival record check' },
  ],
}

export function getRequirements(destinationCountry: string, purpose: Purpose): Requirements {
  const countryItems = COUNTRY_CHECKLIST[destinationCountry] ?? [
    { id: 'local-registration', label: 'Local residence/foreigner registration' },
    { id: 'local-id', label: 'Local tax or ID number application' },
  ]

  return {
    fields: [...BASE_FIELDS, ...PURPOSE_FIELDS[purpose]],
    checklist: [...PURPOSE_CHECKLIST[purpose], ...countryItems],
  }
}
