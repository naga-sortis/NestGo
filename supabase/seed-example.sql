-- Optional example rows — enough to see the shape of each table and confirm
-- the app is reading from Supabase instead of its static fallback. This is
-- NOT a full replacement for src/data/*.ts; add your own real, verified rows
-- through the Supabase Studio table editor (or more INSERTs like these).
-- Safe to skip entirely: the app falls back to static data until any of
-- these tables actually has rows.

insert into public.listings (neighborhood, city, price, currency, move_date, items, summary)
values (
  'Chueca',
  'Madrid',
  1100,
  '€',
  current_date + interval '30 days',
  array['1-bed flat lease', 'Desk + chair', 'Fiber Wi-Fi contract'],
  'Example listing seeded from Supabase — edit or delete me.'
);

insert into public.routines (title, neighborhood, city, schedule, spots_total, spots_filled)
values (
  'Tuesday Coworking Table',
  'Chueca',
  'Madrid',
  'Tuesdays, 9:00 AM',
  6,
  2
);

insert into public.destination_guides
  (country, best_season, transport, cultural_highlights, solo_trip_ideas, family_trip_ideas, last_verified_at)
values (
  'Spain',
  'Spring (Apr-Jun) and fall (Sep-Oct) - mild weather, fewer crowds than summer.',
  array['AVE high-speed rail connects major cities fast', 'City metros (Madrid, Barcelona) are cheap and extensive'],
  array['Prado Museum and Retiro Park (Madrid)', 'The Alhambra (Granada)'],
  array['Tapas crawl through a historic city center'],
  array['Parque del Retiro and science museums in Madrid'],
  current_date
)
on conflict (country) do nothing;

insert into public.visa_checklist_items
  (scope, scope_key, item_id, label, instructions, online, fields, last_verified_at)
values (
  'country',
  'Spain',
  'nie-tie',
  'NIE / TIE application',
  'Book a Cita Previa, then apply for your NIE (foreigner ID number) or TIE (residence card) at the designated police station.',
  true,
  '[{"id":"citaDate","label":"Cita Previa date","type":"date"}]'::jsonb,
  current_date
)
on conflict (scope, scope_key, item_id) do nothing;
