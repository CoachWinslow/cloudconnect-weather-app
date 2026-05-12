-- Revoke EXECUTE on trigger functions from all roles (triggers run with definer privilege regardless)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.check_max_favorites() FROM public, anon, authenticated;

-- Revoke EXECUTE on has_role from anon; keep for authenticated (RLS policies depend on it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
