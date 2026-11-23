-- handle_new_user is a SECURITY DEFINER trigger function; it should only run
-- from the on_auth_user_created trigger, never via /rest/v1/rpc.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
