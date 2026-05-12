-- Revoke has_role from public (which covers all roles by default)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public;

-- Re-grant only to authenticated so RLS policies continue to work
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;