// NestGo doesn't maintain a directory of exact office addresses/emails (they
// change, and getting one wrong could send someone to the wrong place) — it
// builds a scoped search instead, which always resolves to whatever the
// current correct answer is.

const COUNTRY_PORTAL: Record<string, string> = {
  Spain: 'https://www.exteriores.gob.es/',
  India: 'https://www.mha.gov.in/',
  'United States': 'https://travel.state.gov/',
  Germany: 'https://www.auswaertiges-amt.de/',
  'United Kingdom': 'https://www.gov.uk/browse/visas-immigration',
}

export function getOfficialPortal(country: string): string | null {
  return COUNTRY_PORTAL[country] ?? null
}

export function buildProcedureSearchUrl(
  country: string,
  city: string,
  procedureLabel: string,
  online: boolean,
): string {
  const query = online
    ? `${country} official government portal — ${procedureLabel}`
    : `${procedureLabel} office near ${city}, ${country} address`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
