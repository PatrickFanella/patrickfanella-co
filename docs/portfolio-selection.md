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
product screenshots. The complete six appear on the Projects page. Existing
screenshots retain captions identifying synthetic fixtures where applicable;
they do not establish current production behavior.

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

The dark palette and existing locally hosted fonts remain. Sentence-case type,
thin rules, readable technology names, and large screenshot rows put the work
before interface decoration. A native technology select lists only technologies
present in the published selection. The quieter shared navigation, buttons, form
controls, and section labels carry through the resume, contact, and detail pages.

The advisory `ui-cliche-audit` scanner is a review aid. Keeping the existing
Space Grotesk face, accent color, and external-link indicators is deliberate;
scanner findings are not accessibility verdicts.

Project selection and copy live in `db/seed/portfolio.json`. Deploying only the
frontend does not update the API's stored projects. Follow the backup and reseed
procedure in [deployment.md](deployment.md) before publishing the matching
frontend. Check the API's three featured projects and six flagship projects, then
check the homepage, project list, and newly selected case-study routes against
that same content revision. Local and PR validation use a disposable database;
production publication needs the matching reseed and frontend release.
