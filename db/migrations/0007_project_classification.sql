ALTER TABLE projects
ADD COLUMN IF NOT EXISTS classification TEXT NOT NULL DEFAULT 'archive';

UPDATE projects
SET classification = CASE
  WHEN featured THEN 'flagship'
  WHEN kind = 'highlight' THEN 'experiment'
  ELSE 'archive'
END;

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_classification_check;

ALTER TABLE projects
ADD CONSTRAINT projects_classification_check
CHECK (classification IN ('flagship', 'experiment', 'archive'));
