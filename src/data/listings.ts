export type Listing = {
  id: string
  neighborhood: string
  city: string
  price: number
  currency: string
  moveDate: string
  items: string[]
  summary: string
}

export const listings: Listing[] = [
  {
    id: 'l1',
    neighborhood: 'Malasaña',
    city: 'Madrid',
    price: 1200,
    currency: '€',
    moveDate: '2026-09-15',
    items: ['1-bed flat lease', 'Queen bed', 'Desk + chair', 'Fiber Wi-Fi contract'],
    summary: 'Full flat lease + IKEA furniture pack, departing for Bangalore.',
  },
  {
    id: 'l2',
    neighborhood: 'Chamberí',
    city: 'Madrid',
    price: 950,
    currency: '€',
    moveDate: '2026-09-01',
    items: ['Studio lease', 'Sofa bed', 'Washing machine'],
    summary: 'Studio near metro, moving back to London next month.',
  },
  {
    id: 'l3',
    neighborhood: 'Koramangala',
    city: 'Bangalore',
    price: 28000,
    currency: '₹',
    moveDate: '2026-09-20',
    items: ['2BHK lease', 'AC unit', 'Scooter', 'Kitchen setup'],
    summary: 'Full 2BHK hand-off including scooter, relocating to Madrid.',
  },
  {
    id: 'l4',
    neighborhood: 'Astoria, Queens',
    city: 'New York',
    price: 1800,
    currency: '$',
    moveDate: '2026-10-01',
    items: ['1-bed lease', 'Furniture set', 'Internet contract'],
    summary: 'Tech worker relocating to Berlin, full apartment package available.',
  },
]
