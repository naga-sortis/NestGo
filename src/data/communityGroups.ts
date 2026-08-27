export type CommunityGroup = {
  id: string
  platform: 'Facebook' | 'WhatsApp' | 'Meetup'
  name: string
  url: string
}

// These are search links, not specific group invites — NestGo doesn't have a
// directory of real private groups yet, so it points the user at the right
// search instead of fabricating a group that may not exist.
export function getCommunityGroups(destinationCity: string): CommunityGroup[] {
  const q = encodeURIComponent(`${destinationCity} expats`)
  return [
    {
      id: 'fb-expats',
      platform: 'Facebook',
      name: `Search Facebook groups for "${destinationCity} expats"`,
      url: `https://www.facebook.com/groups/search/groups_home/?q=${q}`,
    },
    {
      id: 'meetup-expats',
      platform: 'Meetup',
      name: `Search Meetup groups in ${destinationCity}`,
      url: `https://www.meetup.com/find/?keywords=${q}`,
    },
    {
      id: 'whatsapp-communities',
      platform: 'WhatsApp',
      name: `Search WhatsApp communities for ${destinationCity}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(`"${destinationCity}" expats WhatsApp community join link`)}`,
    },
  ]
}
