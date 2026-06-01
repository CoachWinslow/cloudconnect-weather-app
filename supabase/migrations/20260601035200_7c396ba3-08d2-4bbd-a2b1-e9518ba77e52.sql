REVOKE EXECUTE ON FUNCTION public.prune_request_logs() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_request_logs() TO service_role;