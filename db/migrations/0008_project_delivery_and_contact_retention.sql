ALTER TABLE projects
ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'Archive';

ALTER TABLE projects
ADD COLUMN IF NOT EXISTS period_label TEXT NOT NULL DEFAULT '';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'patrickfanella') THEN
    GRANT DELETE ON TABLE public.contact_messages TO patrickfanella;
    GRANT SELECT (id, created_at) ON TABLE public.contact_messages TO patrickfanella;
  END IF;
END
$$;
