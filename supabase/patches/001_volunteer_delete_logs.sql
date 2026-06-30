-- Run in Supabase SQL Editor if volunteer delete within 24h is not yet enabled.
-- Required for Phase 3 volunteer delete flow.

create policy "Delete own recent logs"
  on public.hour_logs for delete
  using (
    auth.uid() = volunteer_id
    and created_at > now() - interval '24 hours'
  );
