
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Anyone can insert logs" ON public.query_logs;
CREATE POLICY "Insert logs with valid text" ON public.query_logs FOR INSERT TO anon, authenticated
  WITH CHECK (query_text IS NOT NULL AND length(query_text) BETWEEN 1 AND 5000);
