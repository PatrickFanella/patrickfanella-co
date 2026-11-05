# Portfolio selection

Reviewed November 5, 2026 for senior full-stack and backend engineering roles.

The authenticated Gitea inventory contained 126 repositories under
[PatrickFanella](https://git.subcult.tv/PatrickFanella) and 88 under
[subculture-collective](https://git.subcult.tv/subculture-collective), including
forks, private repositories, infrastructure, and archives. This was a metadata
review of both accounts followed by README and supporting-document inspection
of the strongest candidates. It was not a code audit or runtime qualification of
every repository.

The selection favors distinct engineering decisions, clear ownership in the
existing portfolio material, public source a reviewer can inspect, and honest
scope. Repository size, commit count, and the presence of a running URL do not
establish product maturity.

## Main case studies

| Order | Project and source | Reason to include | Delivery boundary |
| --- | --- | --- | --- |
| 1 | [Clpr](https://git.subcult.tv/subculture-collective/clpr) | Go services, hybrid retrieval, moderation, and public product operations. | Responsive web app available; native mobile apps are planned. |
| 2 | [HasanAra](https://git.subcult.tv/subculture-collective/hasanara) and its [Rekolekt core](https://git.subcult.tv/subculture-collective/rekolekt) | Python/GPU ingestion, durable job state, timestamped search, and separation of a reusable backend from an archive frontend. | Automatic transcripts can be wrong; links return to the recording. These are one case study, avoiding two entries for the same pipeline. |
| 3 | [Undertow](https://git.subcult.tv/subculture-collective/undertow) | A different technical surface: layered browser rendering, WebGL, and WebCodecs export. | Live beta; codec and export limits depend on browser and hardware. Cloud rendering is in testing; paid billing is off. |
| 4 | [Tadooer](https://git.subcult.tv/subculture-collective/tadooer) | Offline task replay, explicit two-client conflicts, CalDAV ETags, and server-authoritative focus sessions. | Private single-owner use, public source. Calendar and focus commands remain online-only. No platform qualification is inferred from a shell existing in source. |
| 5 | [Patchwork](https://git.subcult.tv/subculture-collective/patchwork) | AT Protocol ingestion, public records, geospatial discovery, and approximate-location privacy. | Development preview, not approved for arranging real help. |
| 6 | [Super Productivity MCP](https://git.subcult.tv/PatrickFanella/super-productivity-mcp) | A Go/JavaScript integration with catalog-driven tools, local IPC, explicit mutation boundaries, and installation/package checks. | Development preview; the in-app plugin bridge must be running. A passing server probe alone does not qualify the integration. |

The first three lead the homepage because each has a public product and existing
product screenshots. The complete six appear on the Projects page. Refreshed screenshots come from the existing public Studio capture selection.
Demo and development captions remain explicit; captures do not establish current
production behavior. See [portfolio-media.md](portfolio-media.md) for provenance.

Supporting source checks included Tadooer's `DEVELOPMENT.md`, Subsets'
`package.json`, and Super Productivity MCP's `Makefile`, alongside the candidate
READMEs. Claims of ownership come from the existing portfolio content; no new
usage, revenue, performance, or adoption metrics were added.

## Focused tools

- [Subsets](https://git.subcult.tv/subculture-collective/subsets): a public alpha
  with a TypeScript/React/Ink terminal interface, npm distribution, ownership-aware
  application plans, drift detection, and checked rollback. Linux is tested;
  macOS remains unverified in its public documentation.
- [tmux-popups](https://git.subcult.tv/PatrickFanella/tmux-popups): a compact example
  of turning one registry into bindings, menus, dependency checks, and diagnostics.
- [twitchdl](https://git.subcult.tv/PatrickFanella/twitchdl): Go orchestration of
  external media tools with explicit download/recording scope. Discovery,
  scheduling, and authenticated media are deferred.

Prichal, Arkhiv, Backline, Kork, Clustr, Subcults, and Switchyard retain their
existing write-ups in the additional-projects archive. They remain useful for a
role-specific discussion, but add more parallel surfaces than a first portfolio
visit needs. Smaller desktop plugins and configuration forks also remain in the
archive. No existing project records or assets were deleted.

## Design and release

The visual direction follows the owner's preference for the original
poster/terminal identity: purple framing, hard offset shadows, bold uppercase
display type, pink and green headline accents, boxed navigation, and monospace
section labels. The larger project screenshots and readable technology names
remain. These are deliberate brand choices; advisory design-scanner matches
must be reviewed in that context rather than used as a reason to flatten the
site's character. Responsive layout, contrast, focus visibility, reduced motion,
and project disclosures remain verification requirements.

Project selection and copy live in `db/seed/portfolio.json`. The web build
publishes a normalized catalog at `/content/projects.json`; the project pages
read that same-origin catalog. Main CI verifies the application before deploying
the web and schema-compatible API images and then compares the public catalog with the merged source.
Design, route metadata, and project content deploy and roll back together.

Content-only edits no longer require a production database reseed. The Go API
still handles contact submissions and retains its database-backed project
endpoints for compatibility; those endpoints follow the separate backup/reseed
procedure in [deployment.md](deployment.md).
