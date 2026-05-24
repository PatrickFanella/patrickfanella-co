ALTER TABLE projects
ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'case-study';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'projects_kind_check'
  ) THEN
    ALTER TABLE projects
    ADD CONSTRAINT projects_kind_check CHECK (kind IN ('case-study', 'tool'));
  END IF;
END $$;
