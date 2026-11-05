# Portfolio selection

Reviewed November 5, 2026. The main Projects page contains 25 selected projects,
grouped by the work they do. Fifteen earlier projects remain in the searchable
archive. The homepage still leads with Clpr, HasanAra, and Undertow; six projects
retain the longer case-study treatment.

## Main collection

| Group | Projects |
| --- | --- |
| Community & Media | Clpr, Chatty Cat, Commons, Backline, Kork, Patchwork |
| Archives & Research | HasanAra, Rekolekt, Arkhiv, Headcount, Left Field |
| Tools & Workflows | Tadooer, Subsets, Patstack, Metronome + Tuner, Super Productivity MCP, ytclip, twitchdl, tmux-popups |
| AT Protocol & Events | Prichal, Pirs, Subcult OS |
| Games & Creative | Undertow, Clustr Galaxy, The Common House |

Every selected entry has a detail page, thumbnail or brand cover, delivery status,
and component-flow diagram. Tools now open their own pages. Public source buttons
appear only when repository visibility was checked as public; private-source
projects still have portfolio pages and public product links where available.

The relationships are explicit in both directions:

- HasanAra is the archive frontend; Rekolekt is its reusable headless core.
- Subsets selects skill working sets from sources such as Patstack. Patstack's
  portable pack is distinct from the private working stack.
- Prichal hosts the upstream PDS. Pirs is a separate PDS experiment; its isolated
  host tests do not establish a production integration with Prichal.

Arkhiv includes six independently branded collection frontends: Anarchist Archive,
Riot Grrrl Zine Archive, Dedhed, Lineage, Bill Nye TV, and Democracy Now! TV. Their
cards link to the public collection sites. Media access and source credits remain
specific to each collection; a public catalog does not imply permission to reuse
its recordings or files.

The owner confirmed that the requested “Common Room” means **The Common House**.
Clustr Galaxy is included because it appears in the explicit inclusion list; the
older Clustr entry is removed.

## Removed entries

The catalog and generated detail routes omit Subcults, Redstring, Echo Trails,
Nearbody, One-Block Cinema, Pocket Civilization, VOD Tender, Magic Playlists,
Internet ID, Soundhash, PAQR, Galdr, Llama Line, Artemis, and Clustr. Requests for
their former detail routes return 404. This removes portfolio entries and their
now-unused covers; it does not delete any source repository or production data.

## Evidence and scope

The selection uses repository metadata, candidate READMEs, architecture notes,
and approved Studio guides. `project-source-evidence.json` records the repository
visibility review. This is a portfolio content review, not a code audit or runtime
qualification of every project. Ownership follows the existing portfolio material;
Chatty Cat also credits the upstream Chatty design by mxmilkiib.

Captions identify public interfaces, marketing pages, sample demonstrations, and
preview states. Today's captures and exact asset hashes are documented in
[portfolio-media.md](portfolio-media.md). No usage, revenue, performance, or
adoption metrics were invented. Headcount's signals are not proof of botting;
Left Field's research priorities are not electoral forecasts or endorsements.

## Design and release

The visual direction follows the owner's preference for the original
poster/terminal identity: purple framing, hard offset shadows, bold uppercase
display type, pink and green accents, boxed navigation, and monospace labels.
Advisory design-scanner flags must be reviewed against that established identity.
Responsive layout, contrast, keyboard focus, reduced motion, and project
disclosures remain verification requirements.

Project selection and copy live in `db/seed/portfolio.json`. The web build publishes
the normalized catalog at `/content/projects.json`; the pages read that same-origin
catalog. Main CI verifies the application before deploying the web and
schema-compatible API images, then compares the public catalog with merged source.
Design, route metadata, and project content deploy and roll back together.

Content edits do not require a production database reseed. The Go API handles
contact submissions and retains its database-backed project endpoints for
compatibility. Those endpoints follow the separate backup/reseed procedure in
[deployment.md](deployment.md).
