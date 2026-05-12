
ALTER TABLE public.cities
  ADD CONSTRAINT cities_name_not_blank    CHECK (btrim(name)    <> ''),
  ADD CONSTRAINT cities_country_not_blank CHECK (btrim(country) <> ''),
  ADD CONSTRAINT cities_id_not_blank      CHECK (btrim(id)      <> '');
