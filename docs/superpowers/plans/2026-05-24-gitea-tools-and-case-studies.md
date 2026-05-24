# Gitea Tools and Case Studies Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Recommended path:
> dispatch a fresh subagent per task, review each result with `review-quality`,
> then continue. For complex multi-agent splits, use
> `parallel-feature-development`, `team-composition-patterns`, and
> `team-communication-protocols`. Steps use checkbox (`- [ ]`) syntax for
> tracking.

**Goal:** Add selected public Gitea repositories to the portfolio as either full case studies or compact tools, with accurate Gitea links and an updated asset production brief.

**Architecture:** Extend the existing project/content pipeline with a lightweight `kind` discriminator so `case-study` and `tool` items can share seed/API plumbing while rendering through different UI surfaces. Keep `/projects` focused on full case studies and add a dedicated `/tools` route for compact tooling entries. Update generated SEO/sitemap inputs rather than hand-editing generated artifacts.

**Tech Stack:** Go API, PostgreSQL migrations, JSON seed data, React + TypeScript + Vite, React Router, Helmet SEO, Vitest, Playwright-compatible routing, static public assets/docs.

---

## Approved Scope

### Full case studies

Add or promote these as full project case studies:

- `llama-line` — `https://git.subcult.tv/PatrickFanella/llama-line`
- `open-pilot` — `https://git.subcult.tv/PatrickFanella/open-pilot`
- `edda` — `https://git.subcult.tv/subculture-collective/edda`
- `paqr` — `https://git.subcult.tv/PatrickFanella/paqr`

### Compact tools listing

Add these to a dedicated tools listing, not full case studies:

- `tmux-popups` — `https://git.subcult.tv/PatrickFanella/tmux-popups`
- `super-productivity-mcp` — `https://git.subcult.tv/PatrickFanella/super-productivity-mcp`
- `ocq` — `https://git.subcult.tv/PatrickFanella/ocq`
- `patrickfanella-co` — `https://git.subcult.tv/PatrickFanella/patrickfanella-co`
- `artemis` — `https://git.subcult.tv/subculture-collective/artemis`
- `discord-spywatcher` — `https://git.subcult.tv/subculture-collective/discord-spywatcher`
- `vod-tender` — `https://git.subcult.tv/subculture-collective/vod-tender`

### Explicit asset decision

Do not generate image assets in this pass. Update `docs/photo-asset-production-brief.md` with exact required filenames and shot-list guidance for the four new case studies and seven tools.

### Worktree warning

Before implementation, inspect the dirty worktree. Current known hazards from planning discovery:

- `docker-compose.yml` is conflicted (`UU`).
- `docker-compose.override.yml` is untracked.
- Existing modified files include `api/cmd/server/main.go`, `api/internal/store/store.go`, `db/seed/portfolio.json`, `web/src/pages/HomePage.tsx`, and `web/src/pages/ProjectDetailPage.tsx`.
- Do not overwrite unrelated local work. Use `git diff -- <file>` before editing any already-modified file.

---

## File Structure

### Database/API/content

- Modify `db/migrations/0004_project_kind.sql`
  - Add `kind TEXT NOT NULL DEFAULT 'case-study'` to `projects`.
  - Add a check constraint limiting values to `case-study` and `tool`.
- Modify `db/seed/portfolio.json`
  - Add `kind` to every project entry.
  - Update existing `repoUrl` values from GitHub to Gitea where Gitea repos exist.
  - Add four new case studies and seven tools.
- Modify `api/internal/seed/seed.go`
  - Add `Kind string` to the seed `Project` struct.
  - Insert/update `kind`, defaulting missing/empty values to `case-study` for safety.
- Modify `api/internal/models/models.go`
  - Add `Kind string \`json:"kind"\`` to `models.Project`.
- Modify `api/internal/store/store.go`
  - Select and scan `p.kind`.
  - Add helper query methods only if needed by handlers; prefer client-side filtering if current API surface stays `/api/projects`.
- Modify tests under `api/internal/...` if compile/test failures require fixture updates.

### Frontend

- Modify `web/src/lib/api.ts`
  - Add `kind: 'case-study' | 'tool'` to `Project`.
- Modify `web/src/test/fixtures.ts`
  - Add `kind: 'case-study'` to existing fixtures.
- Modify `web/src/pages/ProjectsPage.tsx`
  - Filter to `project.kind === 'case-study'`.
  - Update copy to avoid claiming tools are full case studies.
- Create `web/src/pages/ToolsPage.tsx`
  - Render compact tool cards for `project.kind === 'tool'`.
  - Include filters by stack/language and direct repository CTAs.
- Create `web/src/components/ToolCard.tsx`
  - Compact card with title, summary, role/category, year, stack tags, and repo link.
  - Do not link to `/projects/:slug` unless detail routes are intentionally added for tools.
- Modify `web/src/layout/SiteLayout.tsx`
  - Add `Tools` nav entry.
- Modify `web/src/App.tsx`
  - Register `/tools` route.
- Modify `web/src/pages/HomePage.tsx`
  - Update repository count/copy.
  - Add a compact tools teaser section or link near Featured Work.
  - Keep full featured cards limited to case studies.
- Modify `web/src/pages/ProjectDetailPage.tsx`
  - Guard against direct `/projects/:slug` visits for tools: show not-found-style route state or redirect link to `/tools`.
  - Keep SEO `CreativeWork` structured data for case studies only.
- Modify tests:
  - `web/src/pages/ProjectsPage.test.tsx`
  - `web/src/pages/HomePage.test.tsx`
  - `web/src/App.test.tsx`
  - Add `web/src/pages/ToolsPage.test.tsx`
  - Add `web/src/components/ToolCard.test.tsx` if component behavior is non-trivial.

### SEO/static generation/docs

- Modify `web/scripts/generate-sitemap.mjs`
  - Include `/tools`.
  - Include only `case-study` items under `/projects/:slug`.
- Modify `web/scripts/generate-route-html.mjs`
  - Include `/tools` in route generation.
  - Only generate project detail routes for `case-study` items.
- Do not hand-edit `web/public/sitemap.xml` except as generated output after running the repo’s sitemap command.
- Modify `docs/photo-asset-production-brief.md`
  - Add new P2/P3 asset requirements for `llama-line`, `open-pilot`, `edda`, `paqr`, and the seven tools.
  - Add a tools-card visual convention if tools later get images.

---

## Data Classification

Use these `kind` values:

```json
{
  "caseStudyKind": "case-study",
  "toolKind": "tool"
}
```

Recommended role labels:

- Case studies: `Full-stack engineer`, `Backend engineer`, or `Systems engineer` depending on repo focus.
- Tools: `Developer tool`, `CLI utility`, `Automation tool`, or `Service tool`.

Initial stack guidance:

| slug | kind | likely stack |
| --- | --- | --- |
| `llama-line` | `case-study` | `Go`, `Ollama`, `SSE`, `HTTP`, `Prometheus`, `Docker` |
| `open-pilot` | `case-study` | `Python`, `Agents`, `Automation`, `CLI`, `LLM` |
| `edda` | `case-study` | `Go`, `LLM`, `Game Systems`, `CLI`, `Agents` |
| `paqr` | `case-study` | `Python`, `CLI`, `Packaging`, `Automation` |
| `tmux-popups` | `tool` | `Shell`, `tmux`, `CLI` |
| `super-productivity-mcp` | `tool` | `JavaScript`, `MCP`, `Super Productivity`, `Node.js` |
| `ocq` | `tool` | `JavaScript`, `OpenCode`, `CLI`, `Automation` |
| `patrickfanella-co` | `tool` | `Go`, `React`, `PostgreSQL`, `Portfolio` |
| `artemis` | `tool` | `TypeScript`, `Automation`, `Agents` |
| `discord-spywatcher` | `tool` | `TypeScript`, `Discord`, `Analytics`, `Automation` |
| `vod-tender` | `tool` | `Go`, `Twitch`, `Video`, `Service` |

Use Gitea descriptions as source material, but verify each repo README before final copy if time permits.

---

## Task 0: Preflight and Worktree Safety

**Files:**
- Inspect only: git status/diffs before editing.

- [ ] **Step 1: Inspect current status**

Run:

```bash
git status --short
```

Expected: Shows existing dirty files, including the known `UU docker-compose.yml` conflict.

- [ ] **Step 2: Inspect diffs for files this plan will modify**

Run:

```bash
git diff -- db/seed/portfolio.json web/src/pages/HomePage.tsx web/src/pages/ProjectDetailPage.tsx api/internal/store/store.go
```

Expected: Existing user/agent changes are visible. Preserve them while applying this plan.

- [ ] **Step 3: Decide conflict handling**

If `docker-compose.yml` remains conflicted, do not edit it. This plan does not require changing Docker Compose.

---

## Task 1: Add Content Kind to Database and API Contract

**Files:**
- Create: `db/migrations/0004_project_kind.sql`
- Modify: `api/internal/models/models.go`
- Modify: `api/internal/seed/seed.go`
- Modify: `api/internal/store/store.go`
- Modify: `web/src/lib/api.ts`

- [ ] **Step 1: Create migration**

Create `db/migrations/0004_project_kind.sql`:

```sql
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'case-study';

ALTER TABLE projects
DROP CONSTRAINT IF EXISTS projects_kind_check;

ALTER TABLE projects
ADD CONSTRAINT projects_kind_check
CHECK (kind IN ('case-study', 'tool'));
```

- [ ] **Step 2: Update Go API model**

In `api/internal/models/models.go`, update `Project`:

```go
type Project struct {
	Slug         string         `json:"slug"`
	Title        string         `json:"title"`
	Kind         string         `json:"kind"`
	Summary      string         `json:"summary"`
	Description  string         `json:"description"`
	Role         string         `json:"role"`
	Year         int            `json:"year"`
	Stack        []string       `json:"stack"`
	Featured     bool           `json:"featured"`
	RepoURL      string         `json:"repoUrl,omitempty"`
	LiveURL      string         `json:"liveUrl,omitempty"`
	Highlights   []string       `json:"highlights"`
	Architecture []string       `json:"architecture"`
	Lessons      []string       `json:"lessons"`
	Media        []ProjectMedia `json:"media"`
}
```

- [ ] **Step 3: Update seed struct and defaulting**

In `api/internal/seed/seed.go`, add `Kind string \`json:"kind,omitempty"\`` to `Project` after `Title`.

Before marshaling media inside the seed loop, add:

```go
kind := project.Kind
if kind == "" {
	kind = "case-study"
}
```

Update the insert SQL to include `kind`:

```sql
INSERT INTO projects (slug, title, kind, summary, description, role, year, repo_url, live_url, featured, sort_order, highlights, architecture, lessons_learned, media)
VALUES ($1, $2, $3, $4, $5, $6, $7, NULLIF($8, ''), NULLIF($9, ''), $10, $11, $12, $13, $14, $15)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  kind = EXCLUDED.kind,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  role = EXCLUDED.role,
  year = EXCLUDED.year,
  repo_url = EXCLUDED.repo_url,
  live_url = EXCLUDED.live_url,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order,
  highlights = EXCLUDED.highlights,
  architecture = EXCLUDED.architecture,
  lessons_learned = EXCLUDED.lessons_learned,
  media = EXCLUDED.media
RETURNING id
```

Update query arguments to insert `kind` as the third argument.

- [ ] **Step 4: Update store select and scan**

In `api/internal/store/store.go`, add `p.kind` after `p.title` in `projectSelect` and scan into `&project.Kind` after `&project.Title`.

If defensive defaulting is desired after scan, add before return:

```go
if project.Kind == "" {
	project.Kind = "case-study"
}
```

- [ ] **Step 5: Update TypeScript API type**

In `web/src/lib/api.ts`, add:

```ts
export type ProjectKind = 'case-study' | 'tool'
```

Then update `Project`:

```ts
export type Project = {
  slug: string
  title: string
  kind: ProjectKind
  summary: string
  description: string
  role: string
  year: number
  stack: string[]
  featured: boolean
  repoUrl?: string
  liveUrl?: string
  highlights: string[]
  architecture: string[]
  lessons: string[]
  media: ProjectMedia[]
}
```

- [ ] **Step 6: Run focused compile/tests**

Run:

```bash
go test ./api/...
```

Expected: Go tests pass or expose fixtures requiring `kind` updates.

Run:

```bash
cd web && npm run test -- --run
```

Expected: Web tests may fail until fixtures/pages are updated in later tasks.

---

## Task 2: Update Seed Data With Case Studies and Tools

**Files:**
- Modify: `db/seed/portfolio.json`

- [ ] **Step 1: Add `kind` to existing entries**

For every existing full case study entry, add:

```json
"kind": "case-study"
```

Place it after `title` for consistency.

- [ ] **Step 2: Update existing Gitea repo URLs**

Replace GitHub URLs where matching public Gitea repos exist. Examples:

```json
"repoUrl": "https://git.subcult.tv/subculture-collective/clpr"
```

Use these replacements:

- `clpr` → `https://git.subcult.tv/subculture-collective/clpr`
- `subcorp` → `https://git.subcult.tv/subculture-collective/subcorp`
- `transcript-create` → `https://git.subcult.tv/subculture-collective/transcript-create`
- `clustr` → `https://git.subcult.tv/subculture-collective/clustr`
- `internet-id` → `https://git.subcult.tv/subculture-collective/internet-id`
- `soundhash` → `https://git.subcult.tv/subculture-collective/soundhash`
- `jury-rigged` → `https://git.subcult.tv/subculture-collective/jury-rigged`
- `patchwork` → `https://git.subcult.tv/subculture-collective/patchwork`
- `galdr` → `https://git.subcult.tv/subculture-collective/galdr`
- `cutroom` → `https://git.subcult.tv/subculture-collective/cutroom`
- `subcults` → `https://git.subcult.tv/subculture-collective/subcults`
- `augr` → `https://git.subcult.tv/subculture-collective/augr`

- [ ] **Step 3: Add new case study entries**

Add JSON objects for `llama-line`, `open-pilot`, `edda`, and `paqr`. Use complete fields matching current seed shape:

```json
{
  "slug": "llama-line",
  "title": "llama-line",
  "kind": "case-study",
  "summary": "Local Ollama broker that serializes GPU inference requests through a priority queue with SSE queue-position updates, transparent proxying, metrics, and admin controls.",
  "description": "llama-line is a local HTTP gateway for coordinating Ollama inference on shared GPU hardware. It accepts Ollama-compatible requests, places them into a priority-aware queue, streams status updates to waiting clients through server-sent events, and proxies final responses transparently. The broker includes an admin API, Prometheus metrics, a lightweight web UI, multi-model routing, and request deduplication/caching so local AI tools can share one constrained inference backend without trampling each other.",
  "role": "Backend engineer",
  "year": 2026,
  "repoUrl": "https://git.subcult.tv/PatrickFanella/llama-line",
  "featured": false,
  "sortOrder": 13,
  "stack": ["Go", "Ollama", "SSE", "HTTP", "Prometheus", "Docker", "Local AI"],
  "highlights": [
    "Built an Ollama-compatible broker that serializes GPU-bound inference requests through a priority queue instead of letting clients contend directly for local resources.",
    "Added server-sent event status updates so waiting clients can see queue position and progress while preserving transparent Ollama response proxying.",
    "Exposed admin controls, Prometheus metrics, a web UI, multi-model routing, and request deduplication/caching for operational visibility."
  ],
  "architecture": [
    "HTTP gateway accepts Ollama-style requests and routes them through a priority queue before forwarding to the backing Ollama service.",
    "SSE status stream reports queue position and waiting state separately from the final proxied inference response.",
    "Admin, metrics, UI, model routing, and cache/deduplication layers sit around the broker core so clients can remain simple."
  ],
  "lessons": [
    "Local AI infrastructure needs backpressure more than raw throughput; a visible queue makes shared GPU constraints understandable to users and clients.",
    "Keeping the public API Ollama-compatible lowers adoption friction because existing tools can point at the broker without deep client rewrites."
  ],
  "media": []
}
```

For `open-pilot`, `edda`, and `paqr`, use repo README/API details where available. If README inspection is not possible during execution, write concise, honest copy from Gitea descriptions and avoid unverifiable metrics.

- [ ] **Step 4: Add tool entries**

Add tool entries with `kind: "tool"`, `featured: false`, `media: []`, and compact but complete `highlights`, `architecture`, and `lessons` arrays. Example pattern:

```json
{
  "slug": "tmux-popups",
  "title": "tmux-popups",
  "kind": "tool",
  "summary": "TSV-driven tmux popup toolkit for launching repeatable terminal workflows from simple configuration files.",
  "description": "tmux-popups is a small shell-based toolkit for turning TSV definitions into repeatable tmux popup commands. It is designed for terminal workflows where speed, muscle memory, and low ceremony matter more than a full application shell.",
  "role": "CLI utility",
  "year": 2026,
  "repoUrl": "https://git.subcult.tv/PatrickFanella/tmux-popups",
  "featured": false,
  "sortOrder": 30,
  "stack": ["Shell", "tmux", "CLI", "Developer Tools"],
  "highlights": [
    "Turns simple TSV configuration into reusable tmux popup launchers.",
    "Keeps terminal automations inspectable and easy to adjust without a heavy framework.",
    "Fits into existing tmux-first development workflows."
  ],
  "architecture": [
    "Shell scripts parse declarative TSV rows and translate them into tmux popup invocations.",
    "The tool stays file-based so workflows can be versioned and reviewed like normal dotfile configuration.",
    "No server or persistent runtime is required; each command executes directly inside the local terminal environment."
  ],
  "lessons": [
    "Small terminal tools are easier to keep using when configuration is plain text and close to the command it drives.",
    "tmux popups are a useful middle ground between one-off shell aliases and full terminal dashboards."
  ],
  "media": []
}
```

- [ ] **Step 5: Validate JSON**

Run:

```bash
python -m json.tool db/seed/portfolio.json >/tmp/portfolio.json.validated
```

Expected: command exits 0.

---

## Task 3: Build Tools UI Surface

**Files:**
- Create: `web/src/components/ToolCard.tsx`
- Create: `web/src/pages/ToolsPage.tsx`
- Modify: `web/src/App.tsx`
- Modify: `web/src/layout/SiteLayout.tsx`
- Modify: `web/src/test/fixtures.ts`

- [ ] **Step 1: Update fixtures**

Add `kind: 'case-study'` to existing fixture projects in `web/src/test/fixtures.ts`. Add a tool fixture:

```ts
export const toolProject = {
  ...featuredProject,
  slug: 'tmux-popups',
  title: 'tmux-popups',
  kind: 'tool' as const,
  summary: 'TSV-driven tmux popup toolkit for repeatable terminal workflows.',
  role: 'CLI utility',
  repoUrl: 'https://git.subcult.tv/PatrickFanella/tmux-popups',
  featured: false,
  stack: ['Shell', 'tmux', 'CLI'],
}
```

- [ ] **Step 2: Create compact card component**

Create `web/src/components/ToolCard.tsx`:

```tsx
import type { Project } from '../lib/api'
import { monoLabelClass, surfaceCardClass, tagCompactClass, textLinkClass } from '../lib/styles'

type ToolCardProps = {
  tool: Project
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className={`${surfaceCardClass} grid gap-5 bg-surface p-6 hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-purple hover:shadow-brutal-purple`}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-stroke pb-4">
        <div>
          <p className={monoLabelClass}>{tool.role}</p>
          <h3 className="mt-4 font-display text-[2rem] font-bold leading-[0.92] tracking-[-0.05em] text-heading">
            {tool.title}
          </h3>
        </div>
        <p className="border-2 border-stroke bg-panel px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
          {tool.year}
        </p>
      </div>

      <p className="text-[1.02rem] leading-relaxed text-ink-soft">{tool.summary}</p>

      <ul className="flex list-none flex-wrap gap-1.5 p-0" aria-label={`${tool.title} technology stack`}>
        {tool.stack.slice(0, 8).map((item) => (
          <li key={item} className={tagCompactClass}>{item}</li>
        ))}
      </ul>

      {tool.repoUrl ? (
        <a className={textLinkClass} href={tool.repoUrl} rel="noreferrer" target="_blank">
          Open Repository ↗
        </a>
      ) : null}
    </article>
  )
}
```

- [ ] **Step 3: Create Tools page**

Create `web/src/pages/ToolsPage.tsx` with `useProjects`, filtering, and route states matching `ProjectsPage` patterns. The core filtering should be:

```ts
const tools = projects.filter((project) => project.kind === 'tool')
const availableTags = useMemo(
  () => [...new Set(tools.flatMap((tool) => tool.stack))].sort((left, right) => left.localeCompare(right)),
  [tools],
)
const visibleTools = activeTag ? tools.filter((tool) => tool.stack.includes(activeTag)) : tools
```

Use `<Seo title="Tools" path="/tools" description="Compact index of Patrick Fanella's public developer tools, services, CLIs, and automation utilities on Gitea." />`.

- [ ] **Step 4: Register route and nav**

In `web/src/App.tsx`, import and add route:

```tsx
import { ToolsPage } from './pages/ToolsPage'
```

```tsx
<Route path="tools" element={<ToolsPage />} />
```

In `web/src/layout/SiteLayout.tsx`, update navigation:

```ts
const navigation = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/tools', label: 'Tools' },
  { to: '/resume', label: 'Resume' },
  { to: '/contact', label: 'Contact' },
]
```

- [ ] **Step 5: Run web tests**

Run:

```bash
cd web && npm run test -- --run
```

Expected: Failures identify pages/tests still assuming every project is a case study. Fix in Tasks 4 and 5.

---

## Task 4: Keep Projects and Detail Pages Case-Study Focused

**Files:**
- Modify: `web/src/pages/ProjectsPage.tsx`
- Modify: `web/src/pages/ProjectDetailPage.tsx`
- Modify: `web/src/components/ProjectCard.tsx` only if card copy needs case-study specificity.

- [ ] **Step 1: Filter Projects page**

In `ProjectsPage`, define:

```ts
const caseStudies = projects.filter((project) => project.kind === 'case-study')
```

Then compute tags and visible projects from `caseStudies`, not `projects`.

Update count copy:

```tsx
Showing {visibleProjects.length} of {caseStudies.length} case studies{activeTag ? ` for ${activeTag}.` : '.'}
```

- [ ] **Step 2: Update empty states**

Use “case studies” language instead of generic “projects” where appropriate:

```tsx
description="The portfolio is online, but no case studies have been published yet."
title="The case-study archive is empty."
```

- [ ] **Step 3: Guard detail route for tools**

In `ProjectDetailPage`, after the `!project` check and before case-study render, add:

```tsx
if (project.kind === 'tool') {
  return (
    <section className={pageSectionClass}>
      <Seo
        description={`${project.title} is listed in the tools archive.`}
        includeCanonical={false}
        includeSocialUrl={false}
        path={`/projects/${project.slug}`}
        robots="noindex,follow"
        title={`${project.title} tool listing`}
      />
      <RouteState
        actions={(
          <Link className={primaryButtonClass} to="/tools">
            Browse Tools
          </Link>
        )}
        description="This repository is part of the compact tools archive rather than a full case study."
        headingLevel="h1"
        label="Tool listing"
        title="Open this in the tools archive."
      />
    </section>
  )
}
```

- [ ] **Step 4: Run focused page tests**

Run:

```bash
cd web && npm run test -- --run src/pages/ProjectsPage.test.tsx src/pages/ProjectDetailPage.test.tsx
```

Expected: Tests pass after fixture expectations include `kind`.

---

## Task 5: Update Homepage Positioning and Counts

**Files:**
- Modify: `web/src/pages/HomePage.tsx`

- [ ] **Step 1: Keep featured projects case-study-only**

Change:

```ts
const featuredProjects = projects.filter((project) => project.featured)
```

To:

```ts
const caseStudies = projects.filter((project) => project.kind === 'case-study')
const tools = projects.filter((project) => project.kind === 'tool')
const featuredProjects = caseStudies.filter((project) => project.featured)
```

- [ ] **Step 2: Add tools teaser**

Add a small CTA near Featured Work copy:

```tsx
<Link className={textLinkClass} to="/tools">
  Browse Developer Tools ↗
</Link>
```

If adding a new homepage section, keep it compact and reuse `ToolCard` for the first 3 tools.

- [ ] **Step 3: Update repository count language**

Avoid hard-coded “thirteen repositories” unless updated to match seeded count. Prefer dynamic or broader language:

```tsx
Cross-cutting views across the public portfolio: aggregate metrics, architecture patterns, and the PostgreSQL backbone that ties the largest systems together.
```

- [ ] **Step 4: Update structured data sameAs**

Change `sameAs` to include Gitea:

```ts
sameAs: ['https://git.subcult.tv/PatrickFanella', 'https://github.com/PatrickFanella'],
```

- [ ] **Step 5: Run homepage tests**

Run:

```bash
cd web && npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: Tests pass after assertions account for tools/case-study split.

---

## Task 6: SEO and Static Route Generation

**Files:**
- Modify: `web/scripts/generate-sitemap.mjs`
- Modify: `web/scripts/generate-route-html.mjs`
- Generated/verify: `web/public/sitemap.xml`

- [ ] **Step 1: Update sitemap route list**

Add `/tools` to static routes in `generate-sitemap.mjs`.

Filter project routes:

```js
const projectRoutes = portfolio.projects
  .filter((project) => (project.kind || 'case-study') === 'case-study')
  .map((project) => `/projects/${project.slug}`)
```

- [ ] **Step 2: Update route HTML generation**

Add `/tools` to generated routes in `generate-route-html.mjs`.

When deriving project detail routes, use the same case-study filter:

```js
const projectRoutes = portfolio.projects
  .filter((project) => (project.kind || 'case-study') === 'case-study')
  .map((project) => `/projects/${project.slug}`)
```

- [ ] **Step 3: Regenerate SEO artifacts**

Run the repo’s existing build/generation command. If scripts are separate, run:

```bash
cd web && npm run build
```

Expected: `web/public/sitemap.xml` includes `/tools`, `/resume`, existing case studies, and the four new case studies; it does not include `/projects/tmux-popups` or other tool slugs.

---

## Task 7: Update Asset Production Brief

**Files:**
- Modify: `docs/photo-asset-production-brief.md`

- [ ] **Step 1: Update current implementation contract**

Add note that tools can use the shared fallback unless a future tools visual set is commissioned:

```markdown
- Tools listing: compact cards do not require per-tool media in the current implementation; use `/assets/projects/project-fallback.svg` for social/default fallback.
```

- [ ] **Step 2: Add case-study assets needed**

Add to P2 full case-study coverage:

```markdown
- `llama-line-overview.svg` — broker queue + Ollama + SSE status stream + metrics/admin UI
- `open-pilot-overview.svg` — agent execution/control loop with local automation boundaries
- `edda-overview.svg` — LLM dungeon-master loop with game state, player input, and generated narration
- `paqr-overview.svg` — Python CLI/package automation flow with inputs, operations, and output artifacts
```

- [ ] **Step 3: Add optional tools visual set**

Add a new section:

```markdown
### [P3] Optional tools listing visuals

The `/tools` page is designed to work without images. If richer cards are desired later, produce small 16:10 or square SVG spot illustrations for:

- `tmux-popups-tool.svg`
- `super-productivity-mcp-tool.svg`
- `ocq-tool.svg`
- `patrickfanella-co-tool.svg`
- `artemis-tool.svg`
- `discord-spywatcher-tool.svg`
- `vod-tender-tool.svg`

Keep these simpler than case-study media: one icon-like system metaphor, no dense architecture text.
```

- [ ] **Step 4: Update shot list table**

Append rows for all four new case-study assets and optional seven tools assets.

---

## Task 8: Tests, Verification, and Review

**Files:**
- Modify test files as needed.
- No unrelated file edits.

- [ ] **Step 1: Run Go tests**

Run:

```bash
go test ./api/...
```

Expected: PASS.

- [ ] **Step 2: Run web lint/tests/build**

Run:

```bash
cd web && npm run lint && npm run test -- --run && npm run build
```

Expected: PASS.

- [ ] **Step 3: Run full repo verify if available**

Run:

```bash
make verify
```

Expected: PASS unless blocked by the pre-existing `docker-compose.yml` conflict or missing local services. If blocked, record the exact blocker.

- [ ] **Step 4: Inspect generated sitemap**

Verify:

```bash
python - <<'PY'
from pathlib import Path
sitemap = Path('web/public/sitemap.xml').read_text()
required = ['/tools', '/projects/llama-line', '/projects/open-pilot', '/projects/edda', '/projects/paqr']
for route in required:
    assert route in sitemap, route
for route in ['/projects/tmux-popups', '/projects/ocq', '/projects/vod-tender']:
    assert route not in sitemap, route
print('sitemap ok')
PY
```

Expected: `sitemap ok`.

- [ ] **Step 5: Manual browser QA**

Run the app locally and check:

- `/projects` shows case studies only.
- `/tools` shows the seven compact tools.
- `/projects/llama-line`, `/projects/open-pilot`, `/projects/edda`, `/projects/paqr` render full case studies.
- `/projects/tmux-popups` shows a noindex route-state directing users to `/tools`.
- Header nav fits at desktop and mobile widths after adding `Tools`.

---

## Self-Review

- Spec coverage: The plan includes all 11 requested repos, with `paqr` moved into the full case-study group per the user’s correction. It includes a separate Tools page, no asset generation, and an asset brief update.
- Placeholder scan: No implementation task depends on an unspecified future decision. Repo copy for `open-pilot`, `edda`, and `paqr` must be sourced from READMEs/Gitea during Task 2 rather than invented metrics.
- Type consistency: The plan uses one discriminator name, `kind`, with values `'case-study'` and `'tool'` across SQL, Go, TypeScript, seed JSON, and generated routes.
