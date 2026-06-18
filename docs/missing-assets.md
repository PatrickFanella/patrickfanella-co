# Missing visual assets

## Summary

| Type | Count |
|---|---:|
| infographic | 14 |
| screenshot | 46 |
| diagram | 24 |
| motion (mp4/webm/gif) | 16 |
| **Total** | **100** |

| Priority | Count |
|---|---:|
| P0 | 14 |
| P1 | 24 |
| P2 | 46 |
| P3 | 16 |

> **Motion format guidance:** Prefer `<video autoplay muted loop playsinline>` with **MP4 (h264) + WebM (vp9)** sources over true `.gif`. ~5–10× smaller, sharper, and respects `prefers-reduced-motion`. Cap loops at **≤8s** and **≤2MB** encoded. Use true `.gif` only when video is blocked (rare here — e.g. README on platforms without inline video).

## Home page / Hero carousel

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (clpr)
  - **Asset key/name**: `projects/clpr/hero.webp`
  - **Type**: infographic
  - **Description**: Hero image for a Twitch clip platform. Show the product as a polished dashboard + clip discovery surface, with search, voting, and a mobile companion cue.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (subcorp)
  - **Asset key/name**: `projects/subcorp/hero.webp`
  - **Type**: infographic
  - **Description**: Multi-agent orchestration hero. Depict six agents collaborating in a live command-and-control workspace with debate, memory, and tool execution.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (transcript-create)
  - **Asset key/name**: `projects/transcript-create/hero.webp`
  - **Type**: infographic
  - **Description**: Transcription SaaS hero. Show video ingestion, GPU transcription, diarization, and searchable transcript output in one clean product montage.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (clustr)
  - **Asset key/name**: `projects/clustr/hero.webp`
  - **Type**: infographic
  - **Description**: Community graph hero. Show a dense network visualization with clusters, filters, and a data panel for subreddit analysis.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (galdr)
  - **Asset key/name**: `projects/galdr/hero.webp`
  - **Type**: infographic
  - **Description**: SaaS health scoring hero. Show a customer intelligence dashboard with scoring, signals, and operational status blocks.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (cutroom)
  - **Asset key/name**: `projects/cutroom/hero.webp`
  - **Type**: infographic
  - **Description**: AI video production hero. Depict a seven-stage production pipeline from research to publishing with handoff cards and rendering cues.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (edda)
  - **Asset key/name**: `projects/edda/hero.webp`
  - **Type**: infographic
  - **Description**: Game-master tool hero. Show a TUI + API split with session state, config, and a game board / campaign flow.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (augr)
  - **Asset key/name**: `projects/augr/hero.webp`
  - **Type**: infographic
  - **Description**: Autonomous trading system hero. Show an agent pipeline with analysis, debate, risk scoring, and execution controls.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (llama-line)
  - **Asset key/name**: `projects/llama-line/hero.webp`
  - **Type**: infographic
  - **Description**: Local AI broker hero. Show FIFO queueing, SSE wait-state updates, and a proxied Ollama inference lane.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (open-pilot)
  - **Asset key/name**: `projects/open-pilot/hero.webp`
  - **Type**: infographic
  - **Description**: Issue-to-PR automation hero. Show a webhook, queue, worker, tests, and branch/PR handoff in a single flow.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (super-productivity-mcp)
  - **Asset key/name**: `projects/super-productivity-mcp/hero.webp`
  - **Type**: infographic
  - **Description**: Productivity integration hero. Show an MCP-style bridge between a task app and agentic automation tools.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (tmux-popups)
  - **Asset key/name**: `projects/tmux-popups/hero.webp`
  - **Type**: infographic
  - **Description**: Terminal tooling hero. Show a terminal workspace with popup panels, shortcuts, and command-driven UI overlays.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (ocq)
  - **Asset key/name**: `projects/ocq/hero.webp`
  - **Type**: infographic
  - **Description**: Developer workflow hero. Show a compact automation or queue-management interface with status and operator controls.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (patrickfanella-co)
  - **Asset key/name**: `projects/patrickfanella-co/hero.webp`
  - **Type**: infographic
  - **Description**: Portfolio hero. Show the site itself as a polished editorial portfolio spread with sections, cards, and project highlights.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

- [ ] **Location**: `web/src/components/HeroCarousel.tsx` — Featured work slide (artemis)
  - **Asset key/name**: `projects/artemis/hero.webp`
  - **Type**: infographic
  - **Description**: Automation or tooling hero. Show a dashboard-like system with actions, jobs, and operator feedback.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Variant**: wide
  - **Priority**: P0

## Projects page / Gallery thumbnails

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (clpr)
  - **Asset key/name**: `projects/clpr/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the Clpr product surface. Emphasize clip discovery, voting, and search in a tight crop.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (subcorp)
  - **Asset key/name**: `projects/subcorp/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the agent console. Show chat, roundtable debate, and agent status in a compact crop.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (transcript-create)
  - **Asset key/name**: `projects/transcript-create/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the transcription dashboard. Show upload, transcript list, and search results in a compact frame.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (clustr)
  - **Asset key/name**: `projects/clustr/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the graph explorer. Show a cluster visualization and sidebar controls.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (galdr)
  - **Asset key/name**: `projects/galdr/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the SaaS health dashboard. Show customer scorecards and integration signals.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (cutroom)
  - **Asset key/name**: `projects/cutroom/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the video pipeline UI. Show stages, assets, and render progress.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (subcults)
  - **Asset key/name**: `projects/subcults/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the music community map. Show map pins, event cards, and audio session cues.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (augr)
  - **Asset key/name**: `projects/augr/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the trading workspace. Show charts, debate panels, and execution status.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (llama-line)
  - **Asset key/name**: `projects/llama-line/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the queue/broker UI. Show request queue state, wait time, and local AI endpoint routing.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (open-pilot)
  - **Asset key/name**: `projects/open-pilot/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the automation dashboard. Show queued issues, worker status, and generated PRs.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (edda)
  - **Asset key/name**: `projects/edda/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the game-master UI. Show the TUI or API console with campaign state.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (paqr)
  - **Asset key/name**: `projects/paqr/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the dataset packaging workflow. Show file ingest, metadata, and searchable package output.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (tmux-popups)
  - **Asset key/name**: `projects/tmux-popups/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of a terminal workspace with popup panes and command shortcuts.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (super-productivity-mcp)
  - **Asset key/name**: `projects/super-productivity-mcp/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of a task-management integration dashboard linking productivity software to agent tooling.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (ocq)
  - **Asset key/name**: `projects/ocq/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of a compact operator workflow or queue interface.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (patrickfanella-co)
  - **Asset key/name**: `projects/patrickfanella-co/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the portfolio itself. Show the homepage or project grid as a branded site preview.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (artemis)
  - **Asset key/name**: `projects/artemis/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of the tool surface. Show a dense operator dashboard with tasks and status.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (discord-spywatcher)
  - **Asset key/name**: `projects/discord-spywatcher/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of a monitoring or moderation workflow for Discord activity.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Gallery card thumbnail (vod-tender)
  - **Asset key/name**: `projects/vod-tender/thumb-square.webp`
  - **Type**: screenshot
  - **Description**: Square thumbnail of a VOD processing or media automation workflow.
  - **Ideal dimensions**: `1200x1200` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

## Projects page / Directory thumbnails

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (clpr)
  - **Asset key/name**: `projects/clpr/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Clpr. Show the same product, but cropped for a list row.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (subcorp)
  - **Asset key/name**: `projects/subcorp/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Subcorp. Keep the agent chat and orchestration visible in a tighter crop.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (transcript-create)
  - **Asset key/name**: `projects/transcript-create/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Transcript Create. Show upload, transcript, and export UI.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (clustr)
  - **Asset key/name**: `projects/clustr/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Clustr. Prioritize the network graph and cluster legend.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (galdr)
  - **Asset key/name**: `projects/galdr/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Galdr. Show the health score and signal panels.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (cutroom)
  - **Asset key/name**: `projects/cutroom/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Cutroom. Show the pipeline view and render state.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (subcults)
  - **Asset key/name**: `projects/subcults/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Subcults. Show the map and scene discovery panel.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (augr)
  - **Asset key/name**: `projects/augr/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Augr. Show charts, debate streams, and execution controls.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (llama-line)
  - **Asset key/name**: `projects/llama-line/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Llama Line. Show queue state, SSE progress, and broker status.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (open-pilot)
  - **Asset key/name**: `projects/open-pilot/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Open Pilot. Show issue intake, worker execution, and PR output.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (edda)
  - **Asset key/name**: `projects/edda/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Edda. Show a TUI or API surface with game session state.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (paqr)
  - **Asset key/name**: `projects/paqr/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Paqr. Show packaged dataset cards and search-ready metadata.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (tmux-popups)
  - **Asset key/name**: `projects/tmux-popups/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for tmux-popups. Show the popup terminals and command palette in a tight crop.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (super-productivity-mcp)
  - **Asset key/name**: `projects/super-productivity-mcp/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Super Productivity MCP. Show task sync, assistant actions, and productivity signals.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (ocq)
  - **Asset key/name**: `projects/ocq/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for OCQ. Show the operational queue or control panel.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (patrickfanella-co)
  - **Asset key/name**: `projects/patrickfanella-co/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for the portfolio site. Show a condensed project archive or homepage view.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (artemis)
  - **Asset key/name**: `projects/artemis/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Artemis. Show a tool/dashboard surface with compact controls.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (discord-spywatcher)
  - **Asset key/name**: `projects/discord-spywatcher/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for Discord Spywatcher. Show alert cards and moderation signals.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

- [ ] **Location**: `web/src/pages/ProjectsPage.tsx` — Directory thumbnail (vod-tender)
  - **Asset key/name**: `projects/vod-tender/thumb-directory.webp`
  - **Type**: screenshot
  - **Description**: Wide directory thumbnail for VOD Tender. Show media queueing and processing state.
  - **Ideal dimensions**: `960x960` · `1:1` · `webp`
  - **Variant**: square
  - **Priority**: P2

## Project detail page / Article + infographic layouts

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clpr figure 1
  - **Asset key/name**: `projects/clpr/figure-1.webp`
  - **Type**: diagram
  - **Description**: Overview image of the Clpr system with the main product surface and core architecture cues.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clpr figure 2
  - **Asset key/name**: `projects/clpr/figure-2.webp`
  - **Type**: diagram
  - **Description**: Layered architecture diagram showing client, API, data, and infrastructure tiers.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clpr figure 3
  - **Asset key/name**: `projects/clpr/figure-3.webp`
  - **Type**: diagram
  - **Description**: Feature ecosystem map showing search, moderation, collections, and monetization surfaces.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clpr figure 4
  - **Asset key/name**: `projects/clpr/figure-4.webp`
  - **Type**: diagram
  - **Description**: Tech stack diagram spanning Go, React, mobile, search, and deployment tooling.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clpr figure 5
  - **Asset key/name**: `projects/clpr/figure-5.webp`
  - **Type**: diagram
  - **Description**: Codebase metrics or system scale graphic with service counts, migrations, and deployment facts.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcorp figure 1
  - **Asset key/name**: `projects/subcorp/figure-1.webp`
  - **Type**: diagram
  - **Description**: Overview of the agent system with the Sanctum interface and shared tool layer.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcorp figure 2
  - **Asset key/name**: `projects/subcorp/figure-2.webp`
  - **Type**: diagram
  - **Description**: Full system architecture covering app, agent council, worker, and database layers.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcorp figure 3
  - **Asset key/name**: `projects/subcorp/figure-3.webp`
  - **Type**: diagram
  - **Description**: Feature ecosystem map for debate, memory, governance, and agent tooling.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcorp figure 4
  - **Asset key/name**: `projects/subcorp/figure-4.webp`
  - **Type**: diagram
  - **Description**: Tech stack overview for app, AI orchestration, data, and infrastructure.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcorp figure 5
  - **Asset key/name**: `projects/subcorp/figure-5.webp`
  - **Type**: diagram
  - **Description**: Codebase metrics or ops breakdown showing route count, modules, agents, and scale.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create figure 1
  - **Asset key/name**: `projects/transcript-create/figure-1.webp`
  - **Type**: diagram
  - **Description**: Pipeline overview from video ingestion through GPU transcription and search indexing.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create figure 2
  - **Asset key/name**: `projects/transcript-create/figure-2.webp`
  - **Type**: diagram
  - **Description**: Layered architecture diagram for frontend, API, workers, data, and deployment tiers.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create figure 3
  - **Asset key/name**: `projects/transcript-create/figure-3.webp`
  - **Type**: diagram
  - **Description**: Feature ecosystem map spanning transcription, export, billing, observability, and testing.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create figure 4
  - **Asset key/name**: `projects/transcript-create/figure-4.webp`
  - **Type**: diagram
  - **Description**: Tech stack overview for Python backend, GPU AI/ML, React frontend, and infra.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create figure 5
  - **Asset key/name**: `projects/transcript-create/figure-5.webp`
  - **Type**: diagram
  - **Description**: Metrics graphic showing codebase size, test coverage, and route complexity.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr figure 1
  - **Asset key/name**: `projects/clustr/figure-1.webp`
  - **Type**: diagram
  - **Description**: Network graph visualization of Reddit communities with cluster coloring.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr figure 2
  - **Asset key/name**: `projects/clustr/figure-2.webp`
  - **Type**: diagram
  - **Description**: Full stack architecture showing visualization, Go backend, and observability.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr figure 3
  - **Asset key/name**: `projects/clustr/figure-3.webp`
  - **Type**: diagram
  - **Description**: Feature ecosystem map covering graph engine, crawler, security, and ops.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr figure 4
  - **Asset key/name**: `projects/clustr/figure-4.webp`
  - **Type**: diagram
  - **Description**: Tech stack diagram for Go, WebGL, graph algorithms, and observability.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr figure 5
  - **Asset key/name**: `projects/clustr/figure-5.webp`
  - **Type**: diagram
  - **Description**: Codebase metrics graphic with file counts, handlers, migrations, and rendering pipeline stats.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — internet-id figure 1
  - **Asset key/name**: `projects/internet-id/figure-1.webp`
  - **Type**: diagram
  - **Description**: Provenance flow from hashing and signing through IPFS and on-chain registration.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — soundhash figure 1
  - **Asset key/name**: `projects/soundhash/figure-1.webp`
  - **Type**: diagram
  - **Description**: Audio fingerprinting pipeline from ingestion to cross-platform matching.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — jury-rigged figure 1
  - **Asset key/name**: `projects/jury-rigged/figure-1.webp`
  - **Type**: screenshot
  - **Description**: Ace Attorney-style courtroom scene with AI dialogue and Twitch overlay.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — patchwork figure 1
  - **Asset key/name**: `projects/patchwork/figure-1.webp`
  - **Type**: screenshot
  - **Description**: Map-based mutual aid interface with location markers and privacy controls.
  - **Ideal dimensions**: `1600x900` · `16:9` · `webp`
  - **Priority**: P1

## Motion / GIF candidates

Animation tells the story better than a still. Each entry is a short looping clip — encode as `.mp4` (h264) + `.webm` (vp9), served via `<video autoplay muted loop playsinline>`.

### Tier 1 — motion is the product

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — tmux-popups detail
  - **Asset key/name**: `projects/tmux-popups/demo.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Terminal showing popup spawn → action → dismiss cycle. Demonstrate the whole product loop end-to-end.
  - **Ideal dimensions**: `800x500` · `8:5` · ≤6s · ≤1.5MB
  - **Priority**: P0

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — clustr detail
  - **Asset key/name**: `projects/clustr/graph.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Force-directed graph settling into clusters, then user pans/zooms. Convey scale + interactivity.
  - **Ideal dimensions**: `1200x750` · `8:5` · ≤8s · ≤2MB
  - **Priority**: P0

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — jury-rigged detail
  - **Asset key/name**: `projects/jury-rigged/reactive.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: AI visuals reacting to live audio/input in real time. Highlight responsiveness.
  - **Ideal dimensions**: `1200x675` · `16:9` · ≤6s · ≤2MB
  - **Priority**: P0

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — cutroom detail
  - **Asset key/name**: `projects/cutroom/timeline.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Clip selection on a video timeline — scrub, mark in/out, extract.
  - **Ideal dimensions**: `1280x720` · `16:9` · ≤8s · ≤2MB
  - **Priority**: P0

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — galdr detail
  - **Asset key/name**: `projects/galdr/workflow.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Workflow surface in motion — drag, transition, completion state.
  - **Ideal dimensions**: `1200x720` · `5:3` · ≤6s · ≤2MB
  - **Priority**: P0

### Tier 2 — motion strongly preferred over still

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — transcript-create detail
  - **Asset key/name**: `projects/transcript-create/streaming.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Live transcription streaming in word-by-word with speaker diarization.
  - **Ideal dimensions**: `1100x620` · `16:9` · ≤6s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — llama-line detail
  - **Asset key/name**: `projects/llama-line/queue.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: SSE queue-position counter ticking down, then LLM response streaming token-by-token.
  - **Ideal dimensions**: `1000x600` · `5:3` · ≤7s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — augr detail
  - **Asset key/name**: `projects/augr/reasoning.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Agent reasoning steps appearing sequentially with tool calls + results.
  - **Ideal dimensions**: `1000x620` · `5:3` · ≤6s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — edda detail
  - **Asset key/name**: `projects/edda/agent-flow.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Multi-step agent flow with intermediate state visible.
  - **Ideal dimensions**: `1000x620` · `5:3` · ≤6s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — vod-tender detail
  - **Asset key/name**: `projects/vod-tender/scrub.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: VOD scrub + automatic clip extraction in action.
  - **Ideal dimensions**: `1280x720` · `16:9` · ≤6s · ≤2MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — subcults detail
  - **Asset key/name**: `projects/subcults/feed.mp4` (+ `.webm`)
  - **Type**: motion (screen capture, mobile portrait)
  - **Description**: Feed scroll + interaction (like, comment, navigate).
  - **Ideal dimensions**: `900x1600` · `9:16` · ≤5s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — patchwork detail
  - **Asset key/name**: `projects/patchwork/feed.mp4` (+ `.webm`)
  - **Type**: motion (screen capture, mobile portrait)
  - **Description**: Community feed scrolling with content + moderation surface.
  - **Ideal dimensions**: `900x1600` · `9:16` · ≤5s · ≤1.5MB
  - **Priority**: P1

- [ ] **Location**: `web/src/pages/ProjectDetailPage.tsx` — discord-spywatcher detail
  - **Asset key/name**: `projects/discord-spywatcher/detection.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Detection event firing → pipeline → alert surfaced.
  - **Ideal dimensions**: `1100x620` · `16:9` · ≤5s · ≤1.5MB
  - **Priority**: P1

### Tier 3 — site/UX showcase motion

- [ ] **Location**: `README.md` / OG share / `web/src/pages/HomePage.tsx`
  - **Asset key/name**: `site/hero-carousel.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Coverflow hero rotating through curated set with group selector swap mid-loop.
  - **Ideal dimensions**: `1400x700` · `2:1` · ≤5s · ≤1.5MB
  - **Priority**: P3

- [ ] **Location**: `README.md` / `web/src/pages/ProjectDetailPage.tsx` ambient demo
  - **Asset key/name**: `site/detail-layout-toggle.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Project detail toggling between infographic and article layouts.
  - **Ideal dimensions**: `1200x680` · `16:9` · ≤4s · ≤1MB
  - **Priority**: P3

- [ ] **Location**: `README.md` / `web/src/pages/ResumePage.tsx` ambient demo
  - **Asset key/name**: `site/resume-layout-toggle.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Resume toggling between infographic and traditional layouts.
  - **Ideal dimensions**: `1200x680` · `16:9` · ≤4s · ≤1MB
  - **Priority**: P3

- [ ] **Location**: `README.md` / `web/src/pages/DevlogPage.tsx` ambient demo
  - **Asset key/name**: `site/devlog-scroll.mp4` (+ `.webm`)
  - **Type**: motion (screen capture)
  - **Description**: Devlog feed scrolling through day groupings + tag interactions.
  - **Ideal dimensions**: `1100x700` · `11:7` · ≤4s · ≤1MB
  - **Priority**: P3

## Notes

- `web/src/components/WorkMediaPlaceholder.tsx` is the placeholder source for all of the above.
- `web/public/` already contains a few unrelated assets (`favicon.svg`, `icons.svg`, `project-fallback.svg`, `patrick_fanella_resume.pdf`, etc.); none of them satisfy the missing project visuals above.
- Motion assets should be paired with a still poster frame (`<video poster="...">`) so the placeholder reads cleanly before playback / under reduced-motion.
