# Focused Project Presentation Implementation Plan

> **For agentic workers:** Execute this plan task-by-task. Recommended path:
> dispatch a fresh subagent per task, review each result with `review-quality`,
> then continue. For complex multi-agent splits, use
> `parallel-feature-development`, `team-composition-patterns`, and
> `team-communication-protocols`. Steps use checkbox (`- [ ]`) syntax for
> tracking.

**Goal:** Make Projects and Tools feel curated and easy to scan by leading with featured work, demoting the rest into compact archives, and reducing visible tag noise.

**Architecture:** Keep the existing API/schema unchanged. Derive the presentation hierarchy in React from existing `featured`, `kind`, `stack`, and order data. Add one small shared stack-cue component so cards and tests share the “2–3 tags + +N” behavior instead of duplicating tag-soup rendering.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Tailwind utility classes.

---

## Confirmed Direction

- Primary goal: focused narrative.
- Structure: featured first, archive second.
- Tag treatment: hide most tags on cards; show 2–3 curated stack cues and a `+N` indicator.
- Persistence mode: repo file only.
- Route: lightweight plan, then implementation after approval.

## File Structure

- Create `web/src/components/StackCueList.tsx`
  - Shared compact stack display.
  - Shows a configurable number of stack items and a `+N` count.
  - Keeps accessible label text while reducing visual noise.
- Create `web/src/components/StackCueList.test.tsx`
  - Verifies visible items, `+N`, and accessible label.
- Modify `web/src/components/ProjectCard.tsx`
  - Replace the current `project.stack.slice(0, 8)` chip wall with `StackCueList`.
  - Add a `density?: 'featured' | 'archive'` prop so archive cards can be calmer and featured cards can stay substantial.
- Modify `web/src/components/ToolCard.tsx`
  - Replace the current 8-chip stack row with `StackCueList`.
  - Add a `density?: 'featured' | 'archive'` prop.
- Modify `web/src/pages/ProjectsPage.tsx`
  - Split case studies into `featuredCaseStudies` and `archiveCaseStudies`.
  - Render a featured section first with only featured projects.
  - Render a compact “More case studies” archive below.
  - Remove the full dynamic tag-filter button wall from the default experience.
  - Keep simple counts and scanning copy.
- Modify `web/src/pages/ToolsPage.tsx`
  - Mirror the featured/archive presentation for tools.
  - Use the first 2–3 tools as featured if tools do not have `featured: true`.
  - Remove the full dynamic tag-filter button wall from the default experience.
- Modify tests:
  - `web/src/components/ProjectCard.test.tsx`
  - `web/src/components/ToolCard.test.tsx`
  - `web/src/pages/ProjectsPage.test.tsx`
  - `web/src/pages/ToolsPage.test.tsx`
  - Keep existing behavior tests for loading/error/empty states.

## Presentation Rules

Use these rules exactly unless the user approves a different direction:

1. **Projects page**
   - Header should explain the page as a curated case-study library, not a filter-first archive.
   - Top section label: `Start Here` or `Featured Case Studies`.
   - Featured projects: `caseStudies.filter(project => project.featured)`.
   - Archive projects: all other case studies.
   - Featured grid: bigger cards, `ProjectCard density="featured"`, keep `order` numbers.
   - Archive grid/list: smaller/calmer cards, `ProjectCard density="archive"`, no noisy filter controls.

2. **Tools page**
   - Header should explain tools as a compact source-code shelf.
   - Featured tools: tools with `featured === true`; if none exist, use `tools.slice(0, 3)`.
   - Archive tools: all other tools.
   - Cards continue linking directly to repositories.

3. **Tag/stack display**
   - Featured cards show at most 3 stack cues.
   - Archive cards show at most 2 stack cues.
   - If hidden stack items remain, show one final `+N` chip.
   - Full stack remains available on project detail pages; do not change detail pages in this pass unless tests require copy updates.

4. **No data/model changes**
   - Do not add migrations.
   - Do not edit `db/seed/portfolio.json` unless a specific featured flag adjustment is explicitly needed.
   - Do not change API response shape.

---

## Task 1: Add Shared StackCueList Component

**Files:**
- Create: `web/src/components/StackCueList.tsx`
- Create: `web/src/components/StackCueList.test.tsx`

- [ ] **Step 1: Write the failing component test**

Create `web/src/components/StackCueList.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react'

import { StackCueList } from './StackCueList'

describe('StackCueList', () => {
  it('shows only the requested number of stack cues and a remaining count', () => {
    render(
      <StackCueList
        ariaLabel="Example technology stack"
        items={['Go', 'PostgreSQL', 'React', 'Docker', 'OpenCode']}
        maxVisible={3}
      />,
    )

    const list = screen.getByRole('list', { name: 'Example technology stack' })
    expect(within(list).getByText('Go')).toBeInTheDocument()
    expect(within(list).getByText('PostgreSQL')).toBeInTheDocument()
    expect(within(list).getByText('React')).toBeInTheDocument()
    expect(within(list).getByText('+2')).toBeInTheDocument()
    expect(within(list).queryByText('Docker')).not.toBeInTheDocument()
    expect(within(list).queryByText('OpenCode')).not.toBeInTheDocument()
  })

  it('does not show a remaining count when every item is visible', () => {
    render(
      <StackCueList
        ariaLabel="Small technology stack"
        items={['TypeScript', 'Vite']}
        maxVisible={3}
      />,
    )

    const list = screen.getByRole('list', { name: 'Small technology stack' })
    expect(within(list).getByText('TypeScript')).toBeInTheDocument()
    expect(within(list).getByText('Vite')).toBeInTheDocument()
    expect(within(list).queryByText(/^\+/)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the focused test and confirm it fails**

Run:

```bash
cd web && npm run test -- --run src/components/StackCueList.test.tsx
```

Expected: FAIL because `StackCueList` does not exist yet.

- [ ] **Step 3: Implement the component**

Create `web/src/components/StackCueList.tsx`:

```tsx
import { tagCompactClass } from '../lib/styles'

type StackCueListProps = {
  ariaLabel: string
  items: string[]
  maxVisible?: number
  className?: string
}

export function StackCueList({ ariaLabel, items, maxVisible = 3, className = '' }: StackCueListProps) {
  const visibleItems = items.slice(0, maxVisible)
  const hiddenCount = Math.max(items.length - visibleItems.length, 0)

  if (items.length === 0) {
    return null
  }

  return (
    <ul className={["flex list-none flex-wrap gap-1.5 p-0", className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {visibleItems.map((item) => (
        <li key={item} className={tagCompactClass}>
          {item}
        </li>
      ))}
      {hiddenCount > 0 ? (
        <li className={`${tagCompactClass} text-accent-purple`} aria-label={`${hiddenCount} more technologies`}>
          +{hiddenCount}
        </li>
      ) : null}
    </ul>
  )
}
```

- [ ] **Step 4: Run the focused test and confirm it passes**

Run:

```bash
cd web && npm run test -- --run src/components/StackCueList.test.tsx
```

Expected: PASS.

---

## Task 2: Reduce Tag Noise in Cards

**Files:**
- Modify: `web/src/components/ProjectCard.tsx:1-73`
- Modify: `web/src/components/ToolCard.tsx:1-69`
- Test: `web/src/components/ProjectCard.test.tsx`
- Test: `web/src/components/ToolCard.test.tsx`

- [ ] **Step 1: Update card tests for reduced stack cues**

In `web/src/components/ProjectCard.test.tsx`, add or update a test so it asserts the card hides most stack chips:

```tsx
it('shows a focused stack cue list instead of the full stack', () => {
  renderWithRouter(<ProjectCard project={projectFixture} density="featured" />)

  expect(screen.getByText(projectFixture.stack[0])).toBeInTheDocument()
  expect(screen.getByText(projectFixture.stack[1])).toBeInTheDocument()
  expect(screen.getByText(projectFixture.stack[2])).toBeInTheDocument()
  expect(screen.queryByText(projectFixture.stack[3])).not.toBeInTheDocument()
  expect(screen.getByText(`+${projectFixture.stack.length - 3}`)).toBeInTheDocument()
})
```

In `web/src/components/ToolCard.test.tsx`, add or update a similar test for archive density:

```tsx
it('shows only two stack cues in archive density', () => {
  render(<ToolCard project={toolProject} density="archive" />)

  expect(screen.getByText(toolProject.stack[0])).toBeInTheDocument()
  expect(screen.getByText(toolProject.stack[1])).toBeInTheDocument()
  expect(screen.queryByText(toolProject.stack[2])).not.toBeInTheDocument()
  expect(screen.getByText(`+${toolProject.stack.length - 2}`)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run the focused card tests and confirm they fail**

Run:

```bash
cd web && npm run test -- --run src/components/ProjectCard.test.tsx src/components/ToolCard.test.tsx
```

Expected: FAIL because `density` is not implemented and the cards still show up to 8 tags.

- [ ] **Step 3: Update `ProjectCard`**

Modify `web/src/components/ProjectCard.tsx`:

```tsx
import { Link } from 'react-router-dom'

import type { Project } from '../lib/api'
import { monoLabelClass, secondaryButtonClass, surfaceCardClass } from '../lib/styles'
import { StackCueList } from './StackCueList'

type ProjectCardProps = {
  order?: number
  project: Project
  density?: 'featured' | 'archive'
}

export function ProjectCard({ order, project, density = 'featured' }: ProjectCardProps) {
  const orderLabel = order ? order.toString().padStart(2, '0') : null
  const isArchive = density === 'archive'
  const maxVisibleStack = isArchive ? 2 : 3

  return (
    <article
      className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-7'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
    >
      <div className={`${isArchive ? 'mb-3 gap-4 pb-4' : 'mb-4 gap-5 pb-4'} grid border-b-2 border-stroke`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {orderLabel ? (
              <p className="border-2 border-heading bg-heading px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-paper">
                {orderLabel}
              </p>
            ) : null}
            <p className="border-2 border-stroke bg-panel px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
              {project.year}
            </p>
          </div>

          {!isArchive ? (
            <p className="border-2 border-stroke bg-surface px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
              {project.role}
            </p>
          ) : null}
        </div>

        <div>
          <h3 className={`${isArchive ? 'max-w-[18ch] text-[1.75rem] md:text-[2rem]' : 'max-w-[14ch] text-[2.25rem] md:text-[2.5rem]'} font-display font-bold leading-[0.92] tracking-[-0.05em] text-heading`}>
            {project.title}
          </h3>
          <p className={`${isArchive ? 'mt-2 text-[0.98rem]' : 'mt-3 text-[1.05rem]'} max-w-[42ch] leading-relaxed text-ink-soft`}>
            {project.summary}
          </p>
        </div>
      </div>

      <StackCueList
        ariaLabel={`${project.title} technology stack`}
        items={project.stack}
        maxVisible={maxVisibleStack}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
        {project.featured ? <p className={monoLabelClass}>Featured Project</p> : isArchive ? <p className={monoLabelClass}>Case Study</p> : <span />}

        <Link className={secondaryButtonClass} to={`/projects/${project.slug}`}>
          Read Case Study
        </Link>
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Update `ToolCard`**

Modify `web/src/components/ToolCard.tsx`:

```tsx
import type { Project } from '../lib/api'
import { monoLabelClass, surfaceCardClass, textLinkClass } from '../lib/styles'
import { StackCueList } from './StackCueList'

type ToolCardProps = {
  project: Project
  density?: 'featured' | 'archive'
}

export function ToolCard({ project, density = 'featured' }: ToolCardProps) {
  const isArchive = density === 'archive'
  const maxVisibleStack = isArchive ? 2 : 3
  const cardContent = (
    <>
      <div className={`${isArchive ? 'gap-4' : 'gap-5'} grid border-b-2 border-stroke pb-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          {!isArchive ? (
            <p className="border-2 border-stroke bg-panel px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-accent-pink">
              {project.role}
            </p>
          ) : null}
          <p className="border-2 border-stroke bg-surface px-3 py-1 font-mono text-[0.72rem] font-bold uppercase tracking-[0.15em] text-heading">
            {project.year}
          </p>
        </div>

        <div>
          <h3 className={`${isArchive ? 'max-w-[18ch] text-[1.6rem]' : 'max-w-[16ch] text-[2rem]'} font-display font-bold leading-[0.92] tracking-[-0.05em] text-heading`}>
            {project.title}
          </h3>
          <p className={`${isArchive ? 'mt-2 text-[0.95rem]' : 'mt-3 text-[0.98rem]'} max-w-[42ch] leading-relaxed text-ink-soft`}>
            {project.summary}
          </p>
        </div>
      </div>

      <StackCueList
        ariaLabel={`${project.title} technology stack`}
        className="mt-4"
        items={project.stack}
        maxVisible={maxVisibleStack}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t-2 border-stroke pt-4">
        <p className={monoLabelClass}>{isArchive ? 'Repository' : 'Tool'}</p>
        {project.repoUrl ? <span className={textLinkClass}>Open {project.title} Repository ↗</span> : null}
      </div>
    </>
  )

  if (project.repoUrl) {
    return (
      <a
        aria-label={`Open ${project.title} repository`}
        className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-6'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}
        href={project.repoUrl}
        rel="noreferrer"
        target="_blank"
      >
        {cardContent}
      </a>
    )
  }

  return (
    <article className={`${surfaceCardClass} group flex h-full flex-col justify-between ${isArchive ? 'p-5' : 'p-6'} hover:-translate-x-1 hover:-translate-y-1 hover:border-accent-green hover:shadow-brutal-green`}>
      {cardContent}
    </article>
  )
}
```

- [ ] **Step 5: Run card tests and fix only test-driven issues**

Run:

```bash
cd web && npm run test -- --run src/components/StackCueList.test.tsx src/components/ProjectCard.test.tsx src/components/ToolCard.test.tsx
```

Expected: PASS.

---

## Task 3: Reframe Projects Page as Featured First + Archive

**Files:**
- Modify: `web/src/pages/ProjectsPage.tsx:1-200`
- Test: `web/src/pages/ProjectsPage.test.tsx`

- [ ] **Step 1: Update ProjectsPage tests**

Add tests that confirm the page no longer leads with a filter wall:

```tsx
it('leads with featured case studies before the archive', async () => {
  mockProjectsSuccess(projectsFixture)
  renderWithRouter(<ProjectsPage />)

  expect(await screen.findByRole('heading', { name: /featured case studies/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /more case studies/i })).toBeInTheDocument()
})

it('does not render every stack value as a filter button', async () => {
  mockProjectsSuccess(projectsFixture)
  renderWithRouter(<ProjectsPage />)

  await screen.findByRole('heading', { name: /featured case studies/i })
  expect(screen.queryByRole('button', { name: 'All' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: projectsFixture[0].stack[0] })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run ProjectsPage tests and confirm they fail**

Run:

```bash
cd web && npm run test -- --run src/pages/ProjectsPage.test.tsx
```

Expected: FAIL because the current page still renders the filter controls and one grid.

- [ ] **Step 3: Replace filter-first layout with featured/archive sections**

Modify `web/src/pages/ProjectsPage.tsx` with these behavior changes:

```tsx
const caseStudies = projects.filter((project) => project.kind === 'case-study')
const featuredCaseStudies = caseStudies.filter((project) => project.featured)
const archiveCaseStudies = caseStudies.filter((project) => !project.featured)
const caseStudyNoun = caseStudies.length === 1 ? 'case study' : 'case studies'
```

Replace the intro aside copy with:

```tsx
<aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
  <p className={monoLabelClass}>Start here</p>
  <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
    The first row is the curated path. The archive below keeps the breadth available without making every stack tag compete for attention.
  </p>
</aside>
```

Replace the success block with:

```tsx
{status === 'success' && caseStudies.length > 0 ? (
  <div className="grid gap-14">
    <section className="grid gap-6" aria-labelledby="featured-case-studies">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className={monoLabelClass}>Start Here</p>
          <h2 id="featured-case-studies" className="font-display text-[2.4rem] font-bold uppercase leading-none tracking-[-0.05em] text-heading md:text-[3rem]">
            Featured Case Studies
          </h2>
        </div>
        <p className="max-w-[34rem] text-[1.02rem] leading-relaxed text-ink-soft">
          {featuredCaseStudies.length} strongest reads from {caseStudies.length} {caseStudyNoun}. Each card keeps stack cues short so the problem and outcome stay visible.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {featuredCaseStudies.map((project, index) => (
          <ProjectCard key={project.slug} density="featured" order={index + 1} project={project} />
        ))}
      </div>
    </section>

    {archiveCaseStudies.length > 0 ? (
      <section className="grid gap-6" aria-labelledby="more-case-studies">
        <div className={`${surfaceCardClass} grid gap-3 bg-panel p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end`}>
          <div>
            <p className={monoLabelClass}>Archive</p>
            <h2 id="more-case-studies" className="font-display text-[2rem] font-bold uppercase leading-none tracking-[-0.05em] text-heading md:text-[2.5rem]">
              More Case Studies
            </h2>
          </div>
          <p className="max-w-[32rem] text-[1rem] leading-relaxed text-ink-soft">
            {archiveCaseStudies.length} additional builds, presented as a quieter shelf for scanning.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archiveCaseStudies.map((project) => (
            <ProjectCard key={project.slug} density="archive" project={project} />
          ))}
        </div>
      </section>
    ) : null}
  </div>
) : null}
```

Remove these now-unused imports/state from `ProjectsPage.tsx`:

```tsx
import { useMemo, useState } from 'react'
compactButtonClass
```

- [ ] **Step 4: Run ProjectsPage tests**

Run:

```bash
cd web && npm run test -- --run src/pages/ProjectsPage.test.tsx
```

Expected: PASS.

---

## Task 4: Reframe Tools Page as Featured Tools + Source Archive

**Files:**
- Modify: `web/src/pages/ToolsPage.tsx:1-194`
- Test: `web/src/pages/ToolsPage.test.tsx`

- [ ] **Step 1: Update ToolsPage tests**

Add tests that confirm tools are grouped and no longer expose all tags as buttons:

```tsx
it('leads with featured tools before the source archive', async () => {
  mockProjectsSuccess(projectsFixture)
  renderWithRouter(<ToolsPage />)

  expect(await screen.findByRole('heading', { name: /featured tools/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /source archive/i })).toBeInTheDocument()
})

it('does not render every tool stack value as a filter button', async () => {
  mockProjectsSuccess(projectsFixture)
  renderWithRouter(<ToolsPage />)

  await screen.findByRole('heading', { name: /featured tools/i })
  expect(screen.queryByRole('button', { name: 'All' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: toolProject.stack[0] })).not.toBeInTheDocument()
})
```

- [ ] **Step 2: Run ToolsPage tests and confirm they fail**

Run:

```bash
cd web && npm run test -- --run src/pages/ToolsPage.test.tsx
```

Expected: FAIL because the current page still renders filter controls and one grid.

- [ ] **Step 3: Replace filter-first layout with featured/archive sections**

Modify `web/src/pages/ToolsPage.tsx` with these behavior changes:

```tsx
const tools = projects.filter((project) => project.kind === 'tool')
const explicitlyFeaturedTools = tools.filter((project) => project.featured)
const featuredTools = explicitlyFeaturedTools.length > 0 ? explicitlyFeaturedTools : tools.slice(0, 3)
const featuredToolSlugs = new Set(featuredTools.map((project) => project.slug))
const archiveTools = tools.filter((project) => !featuredToolSlugs.has(project.slug))
const toolNoun = tools.length === 1 ? 'tool' : 'tools'
```

Replace the intro aside copy with:

```tsx
<aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Reading protocol">
  <p className={monoLabelClass}>Source shelf</p>
  <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-soft">
    A few tools are surfaced first. The rest stay available as a quieter repository archive without a wall of stack filters.
  </p>
</aside>
```

Replace the success block with:

```tsx
{status === 'success' && tools.length > 0 ? (
  <div className="grid gap-14">
    <section className="grid gap-6" aria-labelledby="featured-tools">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div>
          <p className={monoLabelClass}>Start Here</p>
          <h2 id="featured-tools" className="font-display text-[2.4rem] font-bold uppercase leading-none tracking-[-0.05em] text-heading md:text-[3rem]">
            Featured Tools
          </h2>
        </div>
        <p className="max-w-[34rem] text-[1.02rem] leading-relaxed text-ink-soft">
          {featuredTools.length} quick entries from {tools.length} public {toolNoun}; each links directly to source.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {featuredTools.map((project) => (
          <ToolCard key={project.slug} density="featured" project={project} />
        ))}
      </div>
    </section>

    {archiveTools.length > 0 ? (
      <section className="grid gap-6" aria-labelledby="source-archive">
        <div className={`${surfaceCardClass} grid gap-3 bg-panel p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end`}>
          <div>
            <p className={monoLabelClass}>Archive</p>
            <h2 id="source-archive" className="font-display text-[2rem] font-bold uppercase leading-none tracking-[-0.05em] text-heading md:text-[2.5rem]">
              Source Archive
            </h2>
          </div>
          <p className="max-w-[32rem] text-[1rem] leading-relaxed text-ink-soft">
            {archiveTools.length} additional utilities kept compact for scanning.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {archiveTools.map((project) => (
            <ToolCard key={project.slug} density="archive" project={project} />
          ))}
        </div>
      </section>
    ) : null}
  </div>
) : null}
```

Remove these now-unused imports/state from `ToolsPage.tsx`:

```tsx
import { useMemo, useState } from 'react'
compactButtonClass
```

- [ ] **Step 4: Run ToolsPage tests**

Run:

```bash
cd web && npm run test -- --run src/pages/ToolsPage.test.tsx
```

Expected: PASS.

---

## Task 5: Keep Homepage Aligned with the New Reading Path

**Files:**
- Modify: `web/src/pages/HomePage.tsx:219-460`
- Test: `web/src/pages/HomePage.test.tsx`

- [ ] **Step 1: Update homepage assertions**

Update `web/src/pages/HomePage.test.tsx` so homepage copy points users toward a curated reading path. Add an assertion like:

```tsx
expect(await screen.findByText(/start with focused case studies/i)).toBeInTheDocument()
```

- [ ] **Step 2: Run HomePage tests and confirm the new assertion fails**

Run:

```bash
cd web && npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: FAIL because the copy does not yet mention the focused reading path.

- [ ] **Step 3: Update homepage link/copy only**

In `web/src/pages/HomePage.tsx`, keep the existing page structure. Change the Projects CTA/supporting copy near the featured work section so it says:

```tsx
Start with focused case studies, then browse the quieter archive when you want breadth.
```

Do not add more cards to the homepage in this task.

- [ ] **Step 4: Run HomePage tests**

Run:

```bash
cd web && npm run test -- --run src/pages/HomePage.test.tsx
```

Expected: PASS.

---

## Task 6: Final Verification

**Files:**
- Verify all files touched in Tasks 1–5.

- [ ] **Step 1: Run web lint**

Run:

```bash
cd web && npm run lint
```

Expected: PASS.

- [ ] **Step 2: Run web tests**

Run:

```bash
cd web && npm run test -- --run
```

Expected: PASS.

- [ ] **Step 3: Run production build**

Run:

```bash
cd web && npm run build
```

Expected: PASS. A Vite chunk-size warning is acceptable if unchanged from the previous deployment.

- [ ] **Step 4: Check diff cleanliness**

Run:

```bash
git diff --check
```

Expected: no whitespace errors.

---

## Self-Review

- Spec coverage: focused narrative is covered by Projects/Tools featured sections; featured/archive structure is covered in Tasks 3–4; hidden tags are covered by Tasks 1–2; homepage alignment is covered by Task 5.
- Placeholder scan: no unresolved placeholders, vague edge-case instructions, or unbounded implementation notes remain.
- Type consistency: `density?: 'featured' | 'archive'` is used consistently by `ProjectCard` and `ToolCard`; `StackCueList` accepts `ariaLabel`, `items`, `maxVisible`, and optional `className`.
