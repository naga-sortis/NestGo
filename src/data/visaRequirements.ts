import type { Purpose } from '../types'

export type FormField = {
  id: string
  label: string
  type: 'text' | 'date'
}

export type ChecklistItem = {
  id: string
  label: string
  instructions: string
  online: boolean
  fields: FormField[]
  // Only present when this item came from the live Supabase content table
  // rather than the static fallback below.
  lastVerifiedAt?: string
}

export type Requirements = {
  baseFields: FormField[]
  checklist: ChecklistItem[]
}

const BASE_FIELDS: FormField[] = [
  { id: 'fullName', label: 'Full legal name', type: 'text' },
  { id: 'passportNumber', label: 'Passport number', type: 'text' },
  { id: 'nationality', label: 'Nationality', type: 'text' },
  { id: 'arrivalDate', label: 'Planned arrival date', type: 'date' },
]

const PURPOSE_CHECKLIST: Record<Purpose, ChecklistItem[]> = {
  student: [
    {
      id: 'visa-app',
      label: 'Student visa application',
      instructions:
        'Submit your student visa application through the destination country\'s official immigration portal, along with your passport, admission letter, and proof of funds.',
      online: true,
      fields: [{ id: 'visaAppRef', label: 'Visa application reference number', type: 'text' }],
    },
    {
      id: 'admission-letter',
      label: 'University admission letter',
      instructions:
        'Have your university admission/acceptance letter ready — most consulates want the original or a certified copy.',
      online: false,
      fields: [{ id: 'institution', label: 'School / university name', type: 'text' }],
    },
    {
      id: 'proof-funds',
      label: 'Proof of sufficient funds',
      instructions:
        'Provide a bank statement or scholarship letter showing you can cover tuition and living costs.',
      online: false,
      fields: [{ id: 'fundsAmount', label: 'Funds available (approx.)', type: 'text' }],
    },
    {
      id: 'health-insurance',
      label: 'Health insurance coverage',
      instructions: 'Arrange health insurance valid in the destination country for your full stay.',
      online: true,
      fields: [{ id: 'insuranceProvider', label: 'Insurance provider', type: 'text' }],
    },
    {
      id: 'accommodation-proof',
      label: 'Accommodation proof',
      instructions: 'Provide proof of accommodation — a lease, dorm confirmation, or invitation letter.',
      online: false,
      fields: [{ id: 'accommodationAddress', label: 'Accommodation address', type: 'text' }],
    },
  ],
  employment: [
    {
      id: 'work-visa',
      label: 'Work visa / permit application',
      instructions:
        'Apply for your work visa/permit via the destination country\'s immigration portal, submitting your employment contract and passport.',
      online: true,
      fields: [{ id: 'visaAppRef', label: 'Visa application reference number', type: 'text' }],
    },
    {
      id: 'employment-contract',
      label: 'Signed employment contract',
      instructions: 'Have your signed employment contract ready — most consulates require an original or certified copy.',
      online: false,
      fields: [{ id: 'employer', label: 'Employer name', type: 'text' }],
    },
    {
      id: 'credential-check',
      label: 'Educational/professional credential validation',
      instructions: 'Get your credentials validated or recognized locally if required for your role.',
      online: true,
      fields: [{ id: 'credentialBody', label: 'Validating authority', type: 'text' }],
    },
    {
      id: 'health-insurance',
      label: 'Health insurance coverage',
      instructions: 'Arrange health insurance valid in the destination country for your full stay.',
      online: true,
      fields: [{ id: 'insuranceProvider', label: 'Insurance provider', type: 'text' }],
    },
    {
      id: 'tax-id',
      label: 'Local tax ID application',
      instructions: 'Register for a local tax ID once you arrive — needed for payroll and banking.',
      online: true,
      fields: [],
    },
  ],
  relocation: [
    {
      id: 'work-visa',
      label: 'Work / relocation visa application',
      instructions:
        'Apply for your relocation visa via the destination country\'s immigration portal, submitting your employment/assignment letter and passport.',
      online: true,
      fields: [{ id: 'visaAppRef', label: 'Visa application reference number', type: 'text' }],
    },
    {
      id: 'employment-contract',
      label: 'Signed employment or assignment letter',
      instructions: 'Have your signed employment/assignment letter ready for the consulate.',
      online: false,
      fields: [{ id: 'employer', label: 'Employer / relocating entity', type: 'text' }],
    },
    {
      id: 'dependent-visa',
      label: 'Dependent/family visa (if relocating with family)',
      instructions: 'Apply for dependent/family visas for any accompanying family members.',
      online: true,
      fields: [{ id: 'dependentNames', label: 'Dependent name(s)', type: 'text' }],
    },
    {
      id: 'health-insurance',
      label: 'Health insurance coverage',
      instructions: 'Arrange health insurance valid in the destination country for your full stay.',
      online: true,
      fields: [{ id: 'insuranceProvider', label: 'Insurance provider', type: 'text' }],
    },
    {
      id: 'household-goods',
      label: 'Household goods customs declaration',
      instructions: 'File a customs declaration for household goods being shipped — check duty-free allowances for relocating households.',
      online: false,
      fields: [{ id: 'shipmentRef', label: 'Shipment/customs reference', type: 'text' }],
    },
  ],
  tourist: [
    {
      id: 'visa-app',
      label: 'Tourist visa application (if required)',
      instructions: 'Check whether your nationality needs a tourist visa, and apply via the official portal if so.',
      online: true,
      fields: [],
    },
    {
      id: 'travel-insurance',
      label: 'Travel insurance',
      instructions: 'Arrange travel insurance covering your full trip, including medical coverage.',
      online: true,
      fields: [{ id: 'insuranceProvider', label: 'Insurance provider', type: 'text' }],
    },
    {
      id: 'return-ticket',
      label: 'Return / onward ticket proof',
      instructions: 'Have proof of a return or onward ticket ready — commonly checked at the border.',
      online: false,
      fields: [{ id: 'returnDate', label: 'Return / onward travel date', type: 'date' }],
    },
    {
      id: 'accommodation-proof',
      label: 'Accommodation booking proof',
      instructions: 'Have a booking confirmation for your accommodation ready to show if asked.',
      online: false,
      fields: [{ id: 'accommodationAddress', label: 'Accommodation address', type: 'text' }],
    },
  ],
}

const COUNTRY_CHECKLIST: Record<string, ChecklistItem[]> = {
  Spain: [
    {
      id: 'nie-tie',
      label: 'NIE / TIE application',
      instructions: 'Book a Cita Previa, then apply for your NIE (foreigner ID number) or TIE (residence card) at the designated police station.',
      online: true,
      fields: [{ id: 'citaDate', label: 'Cita Previa date', type: 'date' }],
    },
    {
      id: 'empadronamiento',
      label: 'Empadronamiento (city registration)',
      instructions: 'Register at your local town hall (Ayuntamiento) with proof of address to get your padrón certificate.',
      online: false,
      fields: [{ id: 'ayuntamiento', label: 'Town hall (Ayuntamiento)', type: 'text' }],
    },
    {
      id: 'cita-previa',
      label: 'Cita Previa appointment',
      instructions: 'Book your immigration appointment online via the Spanish government\'s Cita Previa system.',
      online: true,
      fields: [],
    },
  ],
  India: [
    {
      id: 'frro',
      label: 'FRRO / FRO registration',
      instructions: 'Register with the FRRO/FRO within 14 days of arrival if your visa category requires it.',
      online: true,
      fields: [{ id: 'frroOffice', label: 'FRRO office city', type: 'text' }],
    },
    {
      id: 'pan-card',
      label: 'PAN card application',
      instructions: 'Apply for a PAN card — needed for tax filing and most banking in India.',
      online: true,
      fields: [],
    },
  ],
  'United States': [
    {
      id: 'ssn',
      label: 'Social Security Number (SSN) application',
      instructions: 'Apply for an SSN at your local SSA office once you have valid visa status.',
      online: false,
      fields: [],
    },
    {
      id: 'i94',
      label: 'I-94 arrival record check',
      instructions: 'Check your I-94 arrival/departure record online to confirm your authorized stay.',
      online: true,
      fields: [],
    },
  ],
}

const GENERIC_COUNTRY_CHECKLIST: ChecklistItem[] = [
  {
    id: 'local-registration',
    label: 'Local residence/foreigner registration',
    instructions: 'Requirements vary by country — check the official immigration portal for your destination.',
    online: true,
    fields: [],
  },
  {
    id: 'local-id',
    label: 'Local tax or ID number application',
    instructions: 'Apply for a local tax or ID number if required for banking, employment, or renting.',
    online: true,
    fields: [],
  },
]

export function getPurposeChecklist(purpose: Purpose): ChecklistItem[] {
  return PURPOSE_CHECKLIST[purpose]
}

export function getCountryChecklist(destinationCountry: string): ChecklistItem[] {
  return COUNTRY_CHECKLIST[destinationCountry] ?? GENERIC_COUNTRY_CHECKLIST
}

export function getRequirements(destinationCountry: string, purpose: Purpose): Requirements {
  return {
    baseFields: BASE_FIELDS,
    checklist: [...getPurposeChecklist(purpose), ...getCountryChecklist(destinationCountry)],
  }
}
