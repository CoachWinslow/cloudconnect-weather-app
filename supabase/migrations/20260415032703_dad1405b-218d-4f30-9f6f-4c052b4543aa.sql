
-- 1. Unique constraint on (user_id, city_id) to prevent duplicate favorites
ALTER TABLE public.favorites
ADD CONSTRAINT favorites_user_city_unique UNIQUE (user_id, city_id);

-- 2. Index on user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

-- 3. Trigger to enforce max 50 favorites per user
CREATE OR REPLACE FUNCTION public.check_max_favorites()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.favorites WHERE user_id = NEW.user_id) >= 50 THEN
    RAISE EXCEPTION 'Maximum of 50 favorites per user reached';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_max_favorites
BEFORE INSERT ON public.favorites
FOR EACH ROW
EXECUTE FUNCTION public.check_max_favorites();
