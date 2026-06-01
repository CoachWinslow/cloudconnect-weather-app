CREATE TABLE public.request_logs (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  user_agent TEXT,
  ip TEXT,
  cache_status TEXT,
  duration_ms INTEGER,
  rate_limited BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX request_logs_created_at_idx ON public.request_logs (created_at DESC);
CREATE INDEX request_logs_status_idx ON public.request_logs (status_code);

GRANT SELECT ON public.request_logs TO authenticated;
GRANT ALL ON public.request_logs TO service_role;

ALTER TABLE public.request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view request logs"
  ON public.request_logs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-prune: keep only last 7 days
CREATE OR REPLACE FUNCTION public.prune_request_logs()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.request_logs WHERE created_at < now() - interval '7 days';
$$;