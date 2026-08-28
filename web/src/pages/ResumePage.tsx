import { Seo } from '../components/Seo'
import { SectionLabel } from '../components/SectionLabel'
import {
  monoLabelClass,
  pageIntroClass,
  pageSectionClass,
  pageTitleClass,
  primaryButtonClass,
  surfaceCardClass,
  textLinkClass,
} from '../lib/styles'

const resumePath = '/assets/patrick_fanella_resume.pdf'

export function ResumePage() {
  return (
    <section className={`${pageSectionClass} pt-4`}>
      <Seo
        description="Download Patrick Fanella's one-page resume for senior full-stack and backend engineering roles."
        path="/resume"
        title="Resume | Senior full-stack and backend engineer"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.85fr)] lg:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Resume</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Patrick Fanella
          </h1>
          <p className={pageIntroClass}>
            My one-page resume covers my senior full-stack and backend work. Download it or open it in a new tab.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              className={primaryButtonClass}
              href={resumePath}
              download="Patrick_Fanella_Resume.pdf"
            >
              Download PDF
            </a>
            <a
              className={textLinkClass}
              href={resumePath}
              rel="noreferrer"
              target="_blank"
            >
              Open in new tab ↗
            </a>
          </div>
        </div>

        <aside className={`${surfaceCardClass} h-fit bg-panel p-8`} aria-label="Resume details">
          <p className={monoLabelClass}>Document</p>
          <div className="mt-6 grid gap-4">
            <p className="border-2 border-stroke bg-surface px-5 py-4 text-ink-soft grid gap-2">
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                Format
              </span>
              <span className="text-[1.05rem] text-heading">PDF</span>
            </p>
            <p className="border-2 border-stroke bg-surface px-5 py-4 text-ink-soft grid gap-2">
              <span className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-green font-bold">
                Focus
              </span>
              <span className="text-[1.05rem] text-heading">Senior full-stack / backend</span>
            </p>
          </div>
        </aside>
      </div>

      <div className={`${surfaceCardClass} overflow-hidden bg-panel`}>
        <div className="border-b-2 border-stroke bg-surface px-5 py-4 flex items-center justify-between flex-wrap gap-4">
          <p className={monoLabelClass}>Preview</p>
          <a
            className={textLinkClass}
            href={resumePath}
            download="Patrick_Fanella_Resume.pdf"
          >
            Download ↗
          </a>
        </div>

        <a href={resumePath} target="_blank" rel="noreferrer" aria-label="Open Patrick Fanella's one-page résumé PDF in a new tab">
          <img
            alt="Preview of Patrick Fanella's one-page senior full-stack and backend engineering résumé"
            className="h-auto w-full bg-white"
            decoding="async"
            height="1584"
            loading="lazy"
            src="/assets/patrick_fanella_resume.webp"
            width="1224"
          />
        </a>
      </div>
    </section>
  )
}
