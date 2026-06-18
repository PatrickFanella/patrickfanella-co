DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'patrickfanella') THEN
    GRANT USAGE ON SCHEMA public TO patrickfanella;

    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
      public.projects,
      public.project_tags,
      public.project_tag_map
    TO patrickfanella;

    GRANT USAGE, SELECT ON SEQUENCE
      public.projects_id_seq,
      public.project_tags_id_seq
    TO patrickfanella;

    GRANT INSERT ON TABLE public.contact_messages TO patrickfanella;
    GRANT USAGE, SELECT ON SEQUENCE public.contact_messages_id_seq TO patrickfanella;
  END IF;
END $$;
