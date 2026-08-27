function toGCalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

export function buildGoogleCalendarUrl(title: string, details: string, daysFromNow = 3): string {
  const start = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details,
    dates: `${toGCalDate(start)}/${toGCalDate(end)}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
