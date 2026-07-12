BEGIN;

UPDATE public.cities
SET connection_emoji = '/__l5e/assets-v1/fab8c5e3-3f85-49eb-915a-6228814204e0/steelers-logo.svg',
    updated_at = now()
WHERE id = 'pittsburgh';

UPDATE public.cities
SET connection_emoji = '/__l5e/assets-v1/f0e82e4b-2a03-4b16-af75-0502a3fdba2f/nfl-logo.svg',
    updated_at = now()
WHERE id = 'new-york-city';

COMMIT;