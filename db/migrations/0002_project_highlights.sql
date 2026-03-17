ALTER TABLE projects
ADD COLUMN IF NOT EXISTS highlights TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

CREATE INDEX IF NOT EXISTS idx_projects_featured_sort_order
ON projects (featured DESC, sort_order ASC, year DESC, created_at DESC);
