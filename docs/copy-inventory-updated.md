# Updated Copy Inventory

Updated inventory of all user-facing text on patrickfanella.co.
Each entry has an identifier, the source location, and the verbatim content.

---

## Site Layout (SiteLayout.tsx)

| ID                                | Source            | Content                                                                                                                                                              |
| --------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `layout.skip-link`                | SiteLayout.tsx:15 | Skip to main content                                                                                                                                                 |
| `layout.header.name-badge`        | SiteLayout.tsx:23 | **Patrick Fanella** — Full-Stack Engineer |
| `layout.header.tagline`           | SiteLayout.tsx:28 | I build products that ship and systems that hold up. |
| `layout.header.intro`             | SiteLayout.tsx:31 | Building reliable software across Go, React, Python, and TypeScript—from backend services and search infrastructure to real-time interfaces and AI-enabled products. |
| `layout.header.stack-label`       | SiteLayout.tsx:38 | Core stack |
| `layout.header.stack-description` | SiteLayout.tsx:40 | Go / React / PostgreSQL / Python / TypeScript. APIs, search, AI workflows, developer tooling, and product infrastructure. |
| `layout.nav.home`                 | SiteLayout.tsx:6  | Home                                                                                                                                                                 |
| `layout.nav.projects`             | SiteLayout.tsx:7  | Projects                                                                                                                                                             |
| `layout.nav.contact`              | SiteLayout.tsx:8  | Contact                                                                                                                                                              |
| `layout.footer.left`              | SiteLayout.tsx:72 | Built across Go, TypeScript, Python, and the infrastructure that makes products reliable. |
| `layout.footer.right`             | SiteLayout.tsx:76 | 2026 // SYSTEM ONLINE                                                                                                                                                |

---

## Home Page (HomePage.tsx)

### Hero

| ID                        | Source          | Content                                                                                                                                                                                                          |
| ------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.hero.section-label` | HomePage.tsx:51 | Index / 2026                                                                                                                                                                                                     |
| `home.hero.headline`      | HomePage.tsx:59 | I build products that ship and systems that scale. |
| `home.hero.intro`         | HomePage.tsx:68 | I'm **Patrick Fanella**. I build full-stack products with a backend-first mindset, from real-time systems and AI tooling to search infrastructure, data-intensive interfaces, and production-ready developer platforms. |
| `home.hero.cta-primary`   | HomePage.tsx:78 | View Case Studies |
| `home.hero.cta-secondary` | HomePage.tsx:81 | Get in Touch |

### Philosophy Card

| ID                         | Source          | Content                                                                                                                                                                                                        |
| -------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.philosophy.label`    | HomePage.tsx:88 | Approach |
| `home.philosophy.headline` | HomePage.tsx:90 | Build the hard thing, then make it understandable. |
| `home.philosophy.body`     | HomePage.tsx:93 | I do my best work where systems meet: backend services, search pipelines, AI workflows, real-time interfaces, and the tooling that connects them. I like solving the technical problem and making the result clear for users, teammates, and future maintainers. |

### Competences Card

| ID                        | Source          | Content                 |
| ------------------------- | --------------- | ----------------------- |
| `home.competences.label`  | HomePage.tsx:98 | Core strengths |
| `home.competences.item-1` | HomePage.tsx:17 | Go / Backend Architecture |
| `home.competences.item-2` | HomePage.tsx:17 | React / TypeScript Interfaces |
| `home.competences.item-3` | HomePage.tsx:17 | AI, Search, and Data Pipelines |
| `home.competences.item-4` | HomePage.tsx:17 | Infrastructure / DevOps |

### Featured Case Studies Section

| ID                            | Source           | Content                                                                                                                             |
| ----------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `home.featured.section-label` | HomePage.tsx:117 | Featured Work |
| `home.featured.headline`      | HomePage.tsx:119 | Selected case studies.                                                                                                              |
| `home.featured.access-label`  | HomePage.tsx:124 | What’s inside |
| `home.featured.access-body`   | HomePage.tsx:126 | Each case study covers the product, the architecture behind it, and the trade-offs that shaped the final build. |
| `home.featured.access-link`   | HomePage.tsx:129 | Browse All Projects ↗ |

### Featured — Loading State

| ID                              | Source           | Content                                           |
| ------------------------------- | ---------------- | ------------------------------------------------- |
| `home.featured.loading-label`   | HomePage.tsx:141 | Loading                                           |
| `home.featured.loading-message` | HomePage.tsx:143 | Loading featured projects. |

### Featured — Error State

| ID                             | Source           | Content                                            |
| ------------------------------ | ---------------- | -------------------------------------------------- |
| `home.featured.error-label`    | HomePage.tsx:172 | Unavailable |
| `home.featured.error-headline` | HomePage.tsx:174 | Featured projects are temporarily unavailable. |
| `home.featured.error-fallback` | HomePage.tsx:44  | Featured case studies are temporarily unavailable. |
| `home.featured.error-retry`    | HomePage.tsx:183 | Try Again |
| `home.featured.error-link`     | HomePage.tsx:186 | Browse All Projects ↗ |

### Featured — Empty State

| ID                            | Source           | Content                                                                                                                         |
| ----------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `home.featured.empty-label`   | HomePage.tsx:194 | No featured projects yet |
| `home.featured.empty-message` | HomePage.tsx:196 | Featured case studies haven’t been published yet. Browse the full archive to explore the portfolio. |

### Methodology Section

| ID                               | Source           | Content                                                                                                                                                                                                           |
| -------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.methodology.section-label` | HomePage.tsx:212 | How I Work |
| `home.methodology.headline`      | HomePage.tsx:214 | How I like to work.                                                                                                                                                                                               |
| `home.methodology.intro`         | HomePage.tsx:217 | I’m drawn to problems that cross system boundaries: between backend services and the UI, between AI workflows and product experience, between infrastructure decisions and user-facing performance. |

### Working Principles

| ID                       | Source           | Content                                                                                                                                                                                                       |
| ------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `home.principle-1.label` | HomePage.tsx:227 | Principle 1 |
| `home.principle-1.title` | HomePage.tsx:21  | Ship real products |
| `home.principle-1.body`  | HomePage.tsx:23  | The projects here are built for production use, with real deployment, monitoring, CI/CD, and practical constraints. The case studies focus on decisions, trade-offs, and execution—not just features. |
| `home.principle-2.label` | HomePage.tsx:227 | Principle 2 |
| `home.principle-2.title` | HomePage.tsx:26  | Own the whole stack |
| `home.principle-2.body`  | HomePage.tsx:28  | I’m comfortable moving across layers: backend services, frontend product work, infrastructure, search, AI workflows, and developer tooling. Real products rarely stay inside one box. |
| `home.principle-3.label` | HomePage.tsx:227 | Principle 3 |
| `home.principle-3.title` | HomePage.tsx:31  | Engineer for production |
| `home.principle-3.body`  | HomePage.tsx:33  | Observability, performance, testing, security, and deployment are part of the build from the beginning. I treat reliability as product work, not cleanup. |

---

## Projects Page (ProjectsPage.tsx)

### Header

| ID                               | Source              | Content                                                                                                                                      |
| -------------------------------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `projects.header.section-label`  | ProjectsPage.tsx:27 | Project Archive |
| `projects.header.headline`       | ProjectsPage.tsx:29 | Projects |
| `projects.header.intro`          | ProjectsPage.tsx:32 | Browse by stack or problem space, then open each case study for architecture decisions, infrastructure details, and key takeaways. |
| `projects.header.protocol-label` | ProjectsPage.tsx:37 | Filter by |
| `projects.header.protocol-body`  | ProjectsPage.tsx:39 | Explore projects by language, framework, or problem domain. Each card links to the full case study. |

### Loading State

| ID                         | Source              | Content                                 |
| -------------------------- | ------------------- | --------------------------------------- |
| `projects.loading-label`   | ProjectsPage.tsx:47 | Loading                                 |
| `projects.loading-message` | ProjectsPage.tsx:49 | Loading project index. |

### Error State

| ID                        | Source              | Content                                             |
| ------------------------- | ------------------- | --------------------------------------------------- |
| `projects.error-label`    | ProjectsPage.tsx:78 | Unavailable |
| `projects.error-headline` | ProjectsPage.tsx:80 | The project index couldn’t be loaded. |
| `projects.error-fallback` | ProjectsPage.tsx:19 | Please try again in a moment. |
| `projects.error-retry`    | ProjectsPage.tsx:91 | Try Again |

### Empty State

| ID                       | Source               | Content                                                                               |
| ------------------------ | -------------------- | ------------------------------------------------------------------------------------- |
| `projects.empty-label`   | ProjectsPage.tsx:99  | No projects yet |
| `projects.empty-message` | ProjectsPage.tsx:101 | The portfolio is online, but no projects have been published yet. |

### Filters

| ID                         | Source               | Content                                           |
| -------------------------- | -------------------- | ------------------------------------------------- |
| `projects.filters.label`   | ProjectsPage.tsx:111 | Filters                                           |
| `projects.filters.counter` | ProjectsPage.tsx:113 | Showing {count} of {total} projects for {tag}. |
| `projects.filters.reset`   | ProjectsPage.tsx:123 | Clear Filter |
| `projects.filters.all`     | ProjectsPage.tsx:139 | All                                               |

### No Matches State

| ID                            | Source               | Content                                                                |
| ----------------------------- | -------------------- | ---------------------------------------------------------------------- |
| `projects.no-matches-label`   | ProjectsPage.tsx:167 | No matches                                                             |
| `projects.no-matches-message` | ProjectsPage.tsx:169 | No projects match the {tag} filter. Try another tag or clear the filter. |

---

## Project Detail Page (ProjectDetailPage.tsx)

### Loading State

| ID                        | Source                   | Content                                                                         |
| ------------------------- | ------------------------ | ------------------------------------------------------------------------------- |
| `detail.loading-label`    | ProjectDetailPage.tsx:29 | Loading |
| `detail.loading-headline` | ProjectDetailPage.tsx:31 | Loading case study. |
| `detail.loading-message`  | ProjectDetailPage.tsx:34 | Fetching the project details, media, and architecture notes. |

### 404 State

| ID                    | Source                   | Content                                                           |
| --------------------- | ------------------------ | ----------------------------------------------------------------- |
| `detail.404-label`    | ProjectDetailPage.tsx:43 | Not found |
| `detail.404-headline` | ProjectDetailPage.tsx:45 | This case study isn’t available. |
| `detail.404-message`  | ProjectDetailPage.tsx:48 | The route exists, but this case study has not been published yet. |
| `detail.404-link`     | ProjectDetailPage.tsx:51 | Back to Projects |

### Generic Error State

| ID                      | Source                   | Content                                       |
| ----------------------- | ------------------------ | --------------------------------------------- |
| `detail.error-label`    | ProjectDetailPage.tsx:60 | Unavailable |
| `detail.error-headline` | ProjectDetailPage.tsx:62 | Unable to load case study. |
| `detail.error-fallback` | ProjectDetailPage.tsx:64 | The requested case study could not be loaded. |
| `detail.error-retry`    | ProjectDetailPage.tsx:67 | Try Again |
| `detail.error-link`     | ProjectDetailPage.tsx:70 | Back to Projects |

### Project Header

| ID                            | Source                   | Content             |
| ----------------------------- | ------------------------ | ------------------- |
| `detail.header.section-label` | ProjectDetailPage.tsx:85 | Case study / {year} |
| `detail.header.title`         | ProjectDetailPage.tsx:86 | {project.title}     |
| `detail.header.summary`       | ProjectDetailPage.tsx:87 | {project.summary}   |

### Parameters Panel

| ID                                   | Source                    | Content           |
| ------------------------------------ | ------------------------- | ----------------- |
| `detail.params.label`                | ProjectDetailPage.tsx:91  | Project Details |
| `detail.params.assignment-label`     | ProjectDetailPage.tsx:94  | Role |
| `detail.params.timestamp-label`      | ProjectDetailPage.tsx:100 | Year |
| `detail.params.infrastructure-label` | ProjectDetailPage.tsx:108 | Infrastructure    |
| `detail.params.repo-link`            | ProjectDetailPage.tsx:122 | View Repository ↗ |
| `detail.params.live-link`            | ProjectDetailPage.tsx:127 | Visit Project ↗ |

### Overview Section

| ID                              | Source                    | Content               |
| ------------------------------- | ------------------------- | --------------------- |
| `detail.overview.section-label` | ProjectDetailPage.tsx:137 | Overview              |
| `detail.overview.headline`      | ProjectDetailPage.tsx:139 | What I built and why. |
| `detail.overview.body`          | ProjectDetailPage.tsx:142 | {project.description} |

### Key Outcomes

| ID                            | Source                    | Content      |
| ----------------------------- | ------------------------- | ------------ |
| `detail.outcomes.label`       | ProjectDetailPage.tsx:147 | Key outcomes |
| `detail.outcomes.item-prefix` | ProjectDetailPage.tsx:154 | 0{n}         |

### Architecture Section

| ID                                  | Source                    | Content                                                                   |
| ----------------------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `detail.architecture.section-label` | ProjectDetailPage.tsx:166 | Architecture                                                              |
| `detail.architecture.headline`      | ProjectDetailPage.tsx:168 | Technical decisions that mattered. |
| `detail.architecture.description`   | ProjectDetailPage.tsx:172 | A concise look at the architecture behind the shipped product. |
| `detail.architecture.item-prefix`   | ProjectDetailPage.tsx:179 | Choice {n}                                                                |

### Supporting Media Section

| ID                           | Source                    | Content                                                                          |
| ---------------------------- | ------------------------- | -------------------------------------------------------------------------------- |
| `detail.media.section-label` | ProjectDetailPage.tsx:191 | Supporting media                                                                 |
| `detail.media.headline`      | ProjectDetailPage.tsx:193 | Screens and diagrams. |
| `detail.media.description`   | ProjectDetailPage.tsx:197 | Visual references that support the build and the system design. |

### Lessons Learned Section

| ID                             | Source                    | Content                           |
| ------------------------------ | ------------------------- | --------------------------------- |
| `detail.lessons.section-label` | ProjectDetailPage.tsx:208 | Lessons learned                   |
| `detail.lessons.headline`      | ProjectDetailPage.tsx:210 | What I’d keep, change, or improve. |
| `detail.lessons.item-prefix`   | ProjectDetailPage.tsx:217 | Lesson {n}                        |

### Footer

| ID                        | Source                    | Content          |
| ------------------------- | ------------------------- | ---------------- |
| `detail.footer.back-link` | ProjectDetailPage.tsx:227 | ← Back to Projects |

---

## Contact Page (ContactPage.tsx)

### Header

| ID                             | Source              | Content                                                                                                                                                                              |
| ------------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `contact.header.section-label` | ContactPage.tsx:96  | Contact                                                                                                                                                                              |
| `contact.header.headline`      | ContactPage.tsx:98  | Let’s build something useful. |
| `contact.header.intro`         | ContactPage.tsx:101 | I’m a strong fit for full-stack and backend roles, especially on teams building real-time products, AI-enabled tools, developer platforms, or systems that need to perform reliably in production. |

### Best Outreach Card

| ID                        | Source              | Content                                                       |
| ------------------------- | ------------------- | ------------------------------------------------------------- |
| `contact.outreach.label`  | ContactPage.tsx:106 | Helpful context |
| `contact.outreach.item-1` | ContactPage.tsx:108 | 01 Tell me about the role, project, or collaboration. |
| `contact.outreach.item-2` | ContactPage.tsx:109 | 02 Share timing, team context, and any important constraints. |
| `contact.outreach.item-3` | ContactPage.tsx:110 | 03 Link anything relevant—repo, product, brief, or design direction. |

### Alternate Contact Paths

| ID                                | Source             | Content                                                                                                                                  |
| --------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `contact.path-github.title`       | ContactPage.tsx:29 | GitHub profile                                                                                                                           |
| `contact.path-github.url`         | ContactPage.tsx:30 | https://github.com/PatrickFanella                                                                                                        |
| `contact.path-github.description` | ContactPage.tsx:31 | Browse my repositories, commit history, and the practical work behind the case studies across Go, TypeScript, Python, and Solidity. |
| `contact.path-github.cta`         | ContactPage.tsx:32 | Open GitHub ↗                                                                                                                            |
| `contact.path-repo.title`         | ContactPage.tsx:35 | Portfolio source                                                                                                                         |
| `contact.path-repo.url`           | ContactPage.tsx:36 | https://github.com/PatrickFanella/patrickfanella-co                                                                                      |
| `contact.path-repo.description`   | ContactPage.tsx:37 | See how this portfolio was built using the same engineering discipline I bring to production product work. |
| `contact.path-repo.cta`           | ContactPage.tsx:38 | Open repository ↗                                                                                                                        |

### Contact Form

| ID                            | Source              | Content                                                                 |
| ----------------------------- | ------------------- | ----------------------------------------------------------------------- |
| `contact.form.title`          | ContactPage.tsx:133 | Send a message |
| `contact.form.name-label`     | ContactPage.tsx:137 | Name |
| `contact.form.name-error`     | ContactPage.tsx:20  | Please enter at least 2 characters. |
| `contact.form.email-label`    | ContactPage.tsx:147 | Email |
| `contact.form.email-error`    | ContactPage.tsx:21  | Please enter a valid email address. |
| `contact.form.message-label`  | ContactPage.tsx:157 | Message |
| `contact.form.message-error`  | ContactPage.tsx:22  | Please include a bit more context so I can respond helpfully. |
| `contact.form.submit`         | ContactPage.tsx:167 | Send Message |
| `contact.form.submitting`     | ContactPage.tsx:167 | Sending...                                                              |
| `contact.form.error-prefix`   | ContactPage.tsx:141 | Error: |
| `contact.form.success-prefix` | ContactPage.tsx:176 | Success: |
| `contact.form.fail-prefix`    | ContactPage.tsx:176 | Error: |
| `contact.form.network-error`  | ContactPage.tsx:79  | The contact form couldn’t be reached. Please try again in a moment. |
| `contact.form.generic-error`  | ContactPage.tsx:87  | Something went wrong while sending your message. Please try again shortly. |

---

## Project Card Component (ProjectCard.tsx)

| ID                        | Source             | Content                         |
| ------------------------- | ------------------ | ------------------------------- |
| `card.order-badge`        | ProjectCard.tsx:28 | {nn} (zero-padded, e.g. 01, 02) |
| `card.year-badge`         | ProjectCard.tsx:33 | {project.year}                  |
| `card.role-badge`         | ProjectCard.tsx:38 | {project.role}                  |
| `card.featured-indicator` | ProjectCard.tsx:61 | Featured Project |
| `card.cta`                | ProjectCard.tsx:64 | Read Case Study |

---

## Media Gallery Component (ProjectMediaGallery.tsx)

| ID                      | Source                     | Content                                     |
| ----------------------- | -------------------------- | ------------------------------------------- |
| `media.item-label`      | ProjectMediaGallery.tsx:58 | Media {nn} (e.g. Media 01)                  |
| `media.fallback-alt`    | ProjectMediaGallery.tsx:52 | {projectTitle} placeholder artwork |
| `media.default-caption` | ProjectMediaGallery.tsx:71 | Supporting visual for the case study.       |
| `media.fallback-notice` | ProjectMediaGallery.tsx:74 | Placeholder visual in use |

---

## Seed Data — Project Content (portfolio.json)

### Project: Clpr (`clpr`)

| ID                             | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.clpr.title`           | Clpr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `project.clpr.summary`         | Twitch clip discovery platform with community voting, hybrid search, and web + mobile clients, deployed in production at clpr.tv. |
| `project.clpr.description`     | Clpr began as a way to surface great Twitch clips without depending on opaque platform algorithms. I turned that idea into a production content platform with community voting, hybrid search, user collections, and social features across web and mobile. The system runs on a Go API backed by PostgreSQL, Redis, and OpenSearch, with a React frontend and a React Native app built on Expo. It is containerized with Docker, orchestrated with Kubernetes, monitored with Prometheus and Grafana, and deployed through GitHub Actions. |
| `project.clpr.role`            | Full-stack engineer |
| `project.clpr.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `project.clpr.repo`            | https://github.com/subculture-collective/clpr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.clpr.live`            | https://clpr.tv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.clpr.tags`            | Go, React, React Native, PostgreSQL, Redis, OpenSearch, Kubernetes, TypeScript                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `project.clpr.highlight-1`     | Shipped a production web and mobile product with community voting, collections, and hybrid BM25 + semantic search. |
| `project.clpr.highlight-2`     | Built a Go API handling authentication, moderation, feed composition, and search across PostgreSQL, Redis, and OpenSearch. |
| `project.clpr.highlight-3`     | Deployed with Kubernetes, Prometheus/Grafana monitoring, and GitHub Actions CI/CD for repeatable production releases. |
| `project.clpr.arch-1`          | Go API with Gin serving a shared JSON contract for both the React web client and the React Native Expo app. |
| `project.clpr.arch-2`          | Hybrid search pipeline combining OpenSearch BM25 scoring with semantic embeddings to improve discovery quality. |
| `project.clpr.arch-3`          | PostgreSQL as the system of record, Redis for caching and session management, and OpenSearch for indexing and retrieval, all containerized for deployment. |
| `project.clpr.lesson-1`        | Hybrid search justified the extra operational complexity because it surfaced clips users would not have found with text search alone. |
| `project.clpr.lesson-2`        | Supporting web and mobile from the same API forced clearer contracts early, which made the product easier to extend later. |
| `project.clpr.media-1.src`     | /assets/projects/clpr-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `project.clpr.media-1.alt`     | Interface showing Twitch clip discovery with voting, saved collections, and search-driven browsing. |
| `project.clpr.media-1.caption` | Twitch clip discovery across ranking, search, and saved collections. |

### Project: Subcorp (`subcorp`)

| ID                                | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.subcorp.title`           | Subcorp                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.subcorp.summary`         | Self-hosted multi-agent AI system where autonomous agents propose, debate, and execute work through a real-time chat interface. |
| `project.subcorp.description`     | Subcorp is a self-hosted experiment in multi-agent coordination. I built a system where six distinct agents can propose missions, debate approaches, and execute tasks using a shared toolbox. The platform runs on Next.js and React, backed by PostgreSQL with pgvector for semantic memory. Agents communicate through a WebSocket-based interface with routing, whisper channels, and structured roundtable modes, while sandboxed tools provide controlled access to execution, file operations, web search, and memory retrieval. |
| `project.subcorp.role`            | Full-stack engineer |
| `project.subcorp.year`            | 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `project.subcorp.repo`            | https://github.com/subculture-collective/subcorp                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `project.subcorp.live`            | https://subcorp.subcult.tv                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `project.subcorp.tags`            | Next.js, React, TypeScript, PostgreSQL, WebSocket, Docker, AI Agents, pgvector                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `project.subcorp.highlight-1`     | Built a live multi-agent system where distinct agents can propose missions, debate approaches, and execute tasks with minimal human hand-holding. |
| `project.subcorp.highlight-2`     | Designed a real-time chat interface with @mention routing, whisper channels, and structured roundtable modes for coordinated work. |
| `project.subcorp.highlight-3`     | Added a sandboxed tool environment that gives agents controlled access to execution, file operations, web search, and semantic memory. |
| `project.subcorp.arch-1`          | Next.js and React frontend backed by PostgreSQL with pgvector for structured memory, relationships, and mission state. |
| `project.subcorp.arch-2`          | WebSocket layer handles agent-to-agent and agent-to-user communication, including routing, private whispers, and synchronized conversation modes. |
| `project.subcorp.arch-3`          | Sandboxed container provides tools for bash, Python, Node.js, file I/O, and search with resource limits and host isolation. |
| `project.subcorp.lesson-1`        | Agent quality depends as much on role boundaries, memory, and permissions as it does on the underlying model. |
| `project.subcorp.lesson-2`        | Real-time multi-agent systems expose ordering and coordination bugs quickly, so deterministic state handling matters. |
| `project.subcorp.media-1.src`     | /assets/projects/subcorp-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.subcorp.media-1.alt`     | Diagram of six named agents coordinating through real-time chat and a shared sandboxed tool layer. |
| `project.subcorp.media-1.caption` | Multi-agent coordination architecture with real-time chat and sandboxed execution. |

### Project: Transcript Create (`transcript-create`)

| ID                                          | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.transcript-create.title`           | Transcript Create                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.transcript-create.summary`         | GPU-accelerated transcription SaaS with Whisper, speaker diarization, full-text search, and SDKs for Python and TypeScript. |
| `project.transcript-create.description`     | Transcript Create turns video into searchable, exportable transcripts at production scale. I built a FastAPI backend that coordinates GPU-accelerated Whisper workers, with optional speaker diarization through pyannote. Transcripts are stored in PostgreSQL, indexed in OpenSearch, and exported in SRT, VTT, and PDF formats. The product also includes OAuth, Stripe billing, a React frontend, monitoring, and published SDKs—giving both end users and developers a clean way to work with the system. |
| `project.transcript-create.role`            | Full-stack engineer |
| `project.transcript-create.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `project.transcript-create.repo`            | https://github.com/subculture-collective/transcript-create                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `project.transcript-create.tags`            | Python, FastAPI, React, PostgreSQL, OpenSearch, Whisper AI, Docker, TypeScript                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `project.transcript-create.highlight-1`     | Built a GPU-backed transcription pipeline with Whisper and optional pyannote diarization, designed to scale horizontally. |
| `project.transcript-create.highlight-2`     | Published Python and TypeScript SDKs so external developers could integrate with the transcription and search API cleanly. |
| `project.transcript-create.highlight-3`     | Shipped a complete SaaS stack with OAuth, Stripe billing, search, exports, monitoring, and end-to-end test coverage. |
| `project.transcript-create.arch-1`          | FastAPI backend orchestrates GPU transcription workers through a PostgreSQL SKIP LOCKED queue, letting workers scale independently. |
| `project.transcript-create.arch-2`          | PostgreSQL stores transcript data while OpenSearch powers full-text retrieval across channels, videos, and exported artifacts. |
| `project.transcript-create.arch-3`          | Product infrastructure includes OAuth, billing, monitoring, Dockerized deployment, and reproducible release workflows. |
| `project.transcript-create.lesson-1`        | A Postgres-backed SKIP LOCKED queue reduced operational overhead while still providing reliable job coordination. |
| `project.transcript-create.lesson-2`        | Publishing typed SDKs early forced the API contract to stabilize faster and made downstream integration better. |
| `project.transcript-create.media-1.src`     | /assets/projects/transcript-create-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.transcript-create.media-1.alt`     | Pipeline showing video ingestion, GPU transcription, speaker diarization, and searchable transcript indexing. |
| `project.transcript-create.media-1.caption` | Transcription pipeline from ingestion to searchable, exportable output. |

### Project: Clustr (`clustr`)

| ID                               | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.clustr.title`           | Clustr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `project.clustr.summary`         | Reddit community analysis platform with graph algorithms, community detection, and interactive 2D/3D visualization. |
| `project.clustr.description`     | Clustr maps relationships between online communities and makes those relationships explorable through interactive graphs. I built a Go backend for crawling, API serving, and graph precalculation, with PostgreSQL as the primary data store and sqlc-generated query code for type safety. On the frontend, React and WebGL power 2D and 3D graph views, dashboards, and community detection workflows. The project also includes the production engineering work that makes analysis tools usable in practice: monitoring, load testing, profiling, and security review. |
| `project.clustr.role`            | Full-stack engineer |
| `project.clustr.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `project.clustr.repo`            | https://github.com/subculture-collective/clustr                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `project.clustr.tags`            | Go, React, PostgreSQL, WebGL, Graph Algorithms, TypeScript, Docker                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `project.clustr.highlight-1`     | Implemented community detection to surface non-obvious relationships between subreddits from crawled graph data. |
| `project.clustr.highlight-2`     | Built interactive 2D and 3D graph views with drill-down workflows for exploration, clustering, and analysis. |
| `project.clustr.highlight-3`     | Treated it like a production system with monitoring, load testing, profiling, and security review. |
| `project.clustr.arch-1`          | Go backend handles crawling, API serving, and graph precalculation as separate concerns that can be reasoned about independently. |
| `project.clustr.arch-2`          | PostgreSQL stores graph entities and relationships, with sqlc-generated queries providing type-safe access patterns. |
| `project.clustr.arch-3`          | React and WebGL power interactive graph rendering across multiple visualization modes and dashboard views. |
| `project.clustr.lesson-1`        | Precomputing graph relationships was essential for a responsive interface; doing the heavy work ahead of time made the product feel instant. |
| `project.clustr.lesson-2`        | Early load testing exposed bottlenecks in connection handling that would have been much harder to fix later. |
| `project.clustr.media-1.src`     | /assets/projects/clustr-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `project.clustr.media-1.alt`     | Visualization of subreddit relationships rendered as an interactive network graph with highlighted community clusters. |
| `project.clustr.media-1.caption` | Interactive community graph with clustering and exploration views. |

### Project: Internet-ID (`internet-id`)

| ID                                    | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.internet-id.title`           | Internet-ID                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `project.internet-id.summary`         | Content provenance system that anchors creator ownership on-chain with Solidity, IPFS, and one-click browser verification. |
| `project.internet-id.description`     | Internet-ID is a provenance system for the AI era. It lets creators hash their work, sign a provenance manifest, store metadata on IPFS, and register ownership on-chain through a Solidity contract. I built the system across a Next.js frontend, an Express API, asynchronous processing with BullMQ, and a cross-browser extension for verification directly on sites like YouTube and X/Twitter. The result is a full-stack product that combines web development, blockchain infrastructure, browser tooling, and accessibility-minded product work. |
| `project.internet-id.role`            | Full-stack engineer |
| `project.internet-id.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.internet-id.repo`            | https://github.com/subculture-collective/internet-id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.internet-id.tags`            | Solidity, Next.js, TypeScript, IPFS, Express, PostgreSQL, Browser Extension, Web3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `project.internet-id.highlight-1`     | Designed a provenance workflow that hashes content, signs a manifest, stores metadata on IPFS, and anchors ownership on-chain. |
| `project.internet-id.highlight-2`     | Built a cross-browser extension for one-click verification directly on platforms like YouTube and X/Twitter. |
| `project.internet-id.highlight-3`     | Backed the product with contract auditing, accessibility-minded frontend work, and end-to-end testing across the stack. |
| `project.internet-id.arch-1`          | Solidity registry contract deployed through a Hardhat + TypeScript toolchain with static analysis for contract security. |
| `project.internet-id.arch-2`          | Next.js frontend, Express API, Prisma data layer, BullMQ queue, and Redis caching support the submission and verification flow. |
| `project.internet-id.arch-3`          | Browser extension injects verification UI into supported sites and communicates with the API through secure cross-context messaging. |
| `project.internet-id.lesson-1`        | Trust in provenance systems depends on operational reliability as much as blockchain design, especially around storage and verification. |
| `project.internet-id.lesson-2`        | Cross-browser extension support is easiest to manage when the shared logic stays centralized and platform-specific code remains thin. |
| `project.internet-id.media-1.src`     | /assets/projects/internet-id-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `project.internet-id.media-1.alt`     | Flow diagram showing content hashing, IPFS storage, on-chain registration, and browser-based verification. |
| `project.internet-id.media-1.caption` | Provenance flow from creator submission to on-page verification. |

### Project: SoundHash (`soundhash`)

| ID                                  | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.soundhash.title`           | SoundHash                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.soundhash.summary`         | Audio fingerprinting system that matches clips across social platforms using spectral analysis, FastAPI, and automated monitoring. |
| `project.soundhash.description`     | SoundHash identifies audio by turning recordings into compact fingerprints that remain useful even after compression, re-encoding, or clipping. I built the matching pipeline around STFT-based spectral analysis and peak detection, exposed it through a FastAPI service, and stored fingerprints and metadata in PostgreSQL. The system also included automated bots for platform monitoring, authentication, documentation, and alerting—combining DSP-heavy backend work with practical operational concerns. |
| `project.soundhash.role`            | Full-stack engineer |
| `project.soundhash.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `project.soundhash.repo`            | https://github.com/subculture-collective/soundhash                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `project.soundhash.tags`            | Python, FastAPI, PostgreSQL, Signal Processing, DSP, Authentication                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `project.soundhash.highlight-1`     | Built a fingerprinting pipeline designed to stay useful even after compression, clipping, or re-encoding. |
| `project.soundhash.highlight-2`     | Exposed the matching system through a FastAPI service and connected it to automated monitoring workflows. |
| `project.soundhash.highlight-3`     | Combined DSP-heavy backend work with authentication, documentation, alerting, and production-ready operational concerns. |
| `project.soundhash.arch-1`          | STFT-based spectral analysis extracts stable peaks that are hashed into compact fingerprints for similarity matching. |
| `project.soundhash.arch-2`          | FastAPI API handles ingestion, processing, authentication, and retrieval across the fingerprinting workflow. |
| `project.soundhash.arch-3`          | Monitoring and bot integrations route likely matches into alerting flows for practical detection across platforms. |
| `project.soundhash.lesson-1`        | Robustness mattered more than theoretical precision because real-world media almost never arrives in pristine form. |
| `project.soundhash.lesson-2`        | External platform constraints shaped the system as much as the DSP work, especially around batching, rate limits, and alert routing. |
| `project.soundhash.media-1.src`     | /assets/projects/soundhash-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `project.soundhash.media-1.alt`     | Diagram of audio extraction, spectral analysis, fingerprint generation, and match detection across platforms. |
| `project.soundhash.media-1.caption` | Audio fingerprinting pipeline from ingestion to cross-platform matching. |

### Project: Jury-Rigged (`jury-rigged`)

| ID                                    | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.jury-rigged.title`           | Jury-Rigged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `project.jury-rigged.summary`         | Real-time AI courtroom simulation with multi-agent roles, deterministic replay, Twitch interaction, and Ace Attorney-style rendering. |
| `project.jury-rigged.description`     | Jury-Rigged is an interactive courtroom simulator where AI agents take on roles like judge, prosecutor, defense attorney, and witness. I built the backend around deterministic phase progression and streaming updates, then paired it with a PixiJS visual layer and an operator dashboard for controlling case flow. Sessions can be replayed deterministically from logs, and Twitch viewers can influence proceedings through chat commands. The result sits at the intersection of product engineering, real-time systems, AI orchestration, and entertainment UX. |
| `project.jury-rigged.role`            | Full-stack engineer |
| `project.jury-rigged.year`            | 2026                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `project.jury-rigged.repo`            | https://github.com/subculture-collective/jury-rigged                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `project.jury-rigged.tags`            | TypeScript, Node.js, React, PixiJS, WebSocket, AI Agents, Twitch API                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `project.jury-rigged.highlight-1`     | Built a multi-agent courtroom simulation with deterministic phase progression, streamed updates, and audience participation mechanics. |
| `project.jury-rigged.highlight-2`     | Created an Ace Attorney-inspired visual presentation with character animation, dialogue pacing, and scene transitions. |
| `project.jury-rigged.highlight-3`     | Added Twitch chat interaction and deterministic replay so sessions could be both entertaining and debuggable. |
| `project.jury-rigged.arch-1`          | Node.js and TypeScript backend coordinates AI roles through explicit state transitions and event-driven session flow. |
| `project.jury-rigged.arch-2`          | PixiJS rendering layer turns system output into courtroom visuals for viewers, including dialogue boxes, sprites, and transitions. |
| `project.jury-rigged.arch-3`          | Separate viewer and operator interfaces support live presentation on stream while keeping moderation and session control manageable. |
| `project.jury-rigged.lesson-1`        | Deterministic replay became essential for debugging multi-agent behavior because it removed model variance from the investigation. |
| `project.jury-rigged.lesson-2`        | Audience interaction made the experience stronger, but it also required careful guardrails around pacing and control. |
| `project.jury-rigged.media-1.src`     | /assets/projects/jury-rigged-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `project.jury-rigged.media-1.alt`     | Ace Attorney-style courtroom interface showing AI dialogue, character sprites, and audience interaction overlays. |
| `project.jury-rigged.media-1.caption` | Real-time courtroom simulation with AI roles and interactive audience input. |

### Project: Patchwork (`patchwork`)

| ID                                  | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `project.patchwork.title`           | Patchwork                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `project.patchwork.summary`         | AT Protocol-native mutual aid platform with map-based discovery, moderation, and privacy-aware location handling. |
| `project.patchwork.description`     | Patchwork is a mutual aid platform built on the AT Protocol, with a focus on community safety and decentralized identity. I built a TypeScript-based system that ingests Bluesky Jetstream data, indexes community posts, and surfaces them through a map interface designed around geoprivacy. The architecture separates concerns into a web client, query API, ingestion pipeline, and moderation worker, making it easier to scale the product while keeping trust and safety features central to the design. |
| `project.patchwork.role`            | Full-stack engineer |
| `project.patchwork.year`            | 2025                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `project.patchwork.repo`            | https://github.com/subculture-collective/patchwork                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `project.patchwork.tags`            | TypeScript, React, PostgreSQL, AT Protocol, Bluesky, Vitest, Playwright                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.patchwork.highlight-1`     | Built on the AT Protocol to use decentralized identity and social graph data instead of re-creating those systems from scratch. |
| `project.patchwork.highlight-2`     | Designed geoprivacy controls that preserve local discovery without exposing exact user locations. |
| `project.patchwork.highlight-3`     | Separated moderation into its own service so safety and community health remained first-class concerns. |
| `project.patchwork.arch-1`          | TypeScript monorepo organizes the web client, query API, ingestion pipeline, and moderation worker as distinct services. |
| `project.patchwork.arch-2`          | Bluesky Jetstream ingestion feeds indexed community data into PostgreSQL for discovery and retrieval. |
| `project.patchwork.arch-3`          | Geoprivacy layer fuzzes coordinates before persistence, while the web client renders map-based exploration through privacy-aware tiles. |
| `project.patchwork.lesson-1`        | Building on the AT Protocol simplified some identity work while raising the bar for interoperability and moderation design. |
| `project.patchwork.lesson-2`        | Location privacy requires deliberate engineering; naïve rounding looks simple but can still leak too much structure. |
| `project.patchwork.media-1.src`     | /assets/projects/patchwork-overview.svg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `project.patchwork.media-1.alt`     | Map interface showing community aid posts with privacy-protected location markers and decentralized identity metadata. |
| `project.patchwork.media-1.caption` | Mutual aid discovery with geoprivacy controls and AT Protocol-native identity. |
