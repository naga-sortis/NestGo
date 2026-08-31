export type CurrencyInfo = { code: string; symbol: string }

const COUNTRY_CURRENCY: Record<string, CurrencyInfo> = {
  Spain: { code: 'EUR', symbol: '€' },
  Germany: { code: 'EUR', symbol: '€' },
  'United Kingdom': { code: 'GBP', symbol: '£' },
  India: { code: 'INR', symbol: '₹' },
  'United States': { code: 'USD', symbol: '$' },
}

export function getCurrency(country: string): CurrencyInfo {
  return COUNTRY_CURRENCY[country] ?? { code: 'USD', symbol: '$' }
}
