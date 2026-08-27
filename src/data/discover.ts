export type DestinationGuide = {
  bestSeason: string
  transport: string[]
  culturalHighlights: string[]
  soloTripIdeas: string[]
  familyTripIdeas: string[]
}

const GUIDES: Record<string, DestinationGuide> = {
  Spain: {
    bestSeason: 'Spring (Apr–Jun) and fall (Sep–Oct) — mild weather, fewer crowds than summer.',
    transport: [
      'AVE high-speed rail connects major cities fast',
      'City metros (Madrid, Barcelona) are cheap and extensive',
      'Regional buses (ALSA) cover smaller towns',
    ],
    culturalHighlights: [
      'Prado Museum and Retiro Park (Madrid)',
      'Sagrada Família and Park Güell (Barcelona)',
      'The Alhambra (Granada)',
      'Flamenco shows in Andalusia',
    ],
    soloTripIdeas: [
      'Tapas crawl through a historic city center',
      'Rooftop bars and live-music venues',
      'A weekend in Ibiza or San Sebastián',
    ],
    familyTripIdeas: [
      'Parque del Retiro and science museums in Madrid',
      'Beach towns along the Costa del Sol',
      'Local fiestas and food markets',
    ],
  },
  India: {
    bestSeason: 'Winter (Nov–Feb) — cooler and dry across most of the country.',
    transport: [
      'IRCTC trains connect most cities affordably',
      'Metro systems in Delhi, Bangalore, Mumbai for city travel',
      'Ride-hailing apps (Ola/Uber) widely available',
    ],
    culturalHighlights: [
      'The Taj Mahal (Agra)',
      'Local temples and heritage bazaars',
      'Street food markets in every major city',
      'Backwaters of Kerala',
    ],
    soloTripIdeas: [
      'Backpacking Rajasthan\'s forts and palaces',
      'Goa\'s beach and nightlife scene',
      'A trek in the Himalayan foothills',
    ],
    familyTripIdeas: [
      'Heritage sites with guided tours',
      'Wildlife sanctuaries and national parks',
      'Hill stations for cooler family getaways',
    ],
  },
  'United States': {
    bestSeason: 'Spring and fall for most regions; check individual states — climate varies widely.',
    transport: [
      'A car is often necessary outside major cities',
      'Amtrak connects some regional corridors',
      'City subways/buses in NYC, Chicago, DC, SF',
    ],
    culturalHighlights: [
      'National parks (Yellowstone, Grand Canyon)',
      'Museums and Broadway in New York City',
      'Live music scenes in Nashville and New Orleans',
    ],
    soloTripIdeas: [
      'A national park road trip',
      'City nightlife in Austin, Miami, or NYC',
      'Music festivals depending on season',
    ],
    familyTripIdeas: [
      'National and state parks',
      'Science and children\'s museums',
      'Theme parks (Orlando, Southern California)',
    ],
  },
  Germany: {
    bestSeason: 'Late spring to early fall (May–Sep); December for Christmas markets.',
    transport: [
      'Deutsche Bahn rail network connects nearly everywhere',
      'City U-Bahn/S-Bahn systems are extensive',
      'Cycling infrastructure is strong in most cities',
    ],
    culturalHighlights: [
      'Neuschwanstein Castle',
      'Christmas markets (Nov–Dec)',
      'Berlin\'s museums and history sites',
      'Oktoberfest in Munich (Sep–Oct)',
    ],
    soloTripIdeas: [
      'Berlin\'s nightlife and art scene',
      'A Rhine valley cycling trip',
      'Oktoberfest with friends',
    ],
    familyTripIdeas: [
      'Fairy-tale castles and countryside towns',
      'Christmas markets in December',
      'Science and technology museums',
    ],
  },
  'United Kingdom': {
    bestSeason: 'Late spring to early fall (May–Sep) for milder, drier weather.',
    transport: [
      'National Rail connects cities across the country',
      'The London Underground for city travel',
      'Regional coach networks for budget travel',
    ],
    culturalHighlights: [
      'The British Museum and historic palaces (London)',
      'Edinburgh Castle and the Scottish Highlands',
      'Traditional afternoon tea and pub culture',
    ],
    soloTripIdeas: [
      'A London pub and live-music crawl',
      'A Scottish Highlands road trip',
      'Music festivals in summer',
    ],
    familyTripIdeas: [
      'Museums and parks in London',
      'Castles and countryside day trips',
      'Coastal towns in Cornwall or Wales',
    ],
  },
}

const GENERIC_GUIDE: DestinationGuide = {
  bestSeason: 'Varies by destination — check the shoulder seasons (spring/fall) for milder weather and fewer crowds.',
  transport: [
    'Check whether the destination has strong public transit or if a car is more practical',
    'Look into rail passes or regional transit cards for cost savings',
  ],
  culturalHighlights: [
    'Look up the destination\'s national museums and historic sites',
    'Local food markets are a good way to explore culture affordably',
  ],
  soloTripIdeas: ['Explore the nightlife and social scene in the city center'],
  familyTripIdeas: ['Look for museums, parks, and family-friendly day trips'],
}

export function getDestinationGuide(country: string): DestinationGuide {
  return GUIDES[country] ?? GENERIC_GUIDE
}
