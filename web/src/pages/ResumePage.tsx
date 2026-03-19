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
        description="View or download Patrick Fanella's resume: full-stack engineer specializing in Go, React, PostgreSQL, and production systems."
        path="/resume"
        title="Resume"
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.85fr)] lg:items-start border-b-2 border-stroke pb-12 mb-10">
        <div>
          <SectionLabel>Resume</SectionLabel>
          <h1 className={`${pageTitleClass} mt-6 uppercase`}>
            Patrick Fanella
          </h1>
          <p className={pageIntroClass}>
            Full-stack engineer building production systems across Go, React, Python, and TypeScript. View the resume below or download a copy.
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
              Open in New Tab ↗
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
              <span className="text-[1.05rem] text-heading">Full-Stack Engineering</span>
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

        <object
          className="w-full bg-surface"
          data={resumePath}
          type="application/pdf"
          style={{ minHeight: '80vh' }}
          aria-label="Patrick Fanella resume PDF preview"
        >
          <div className="grid gap-6 p-8 text-center">
            <p className="text-ink-soft text-[1.05rem] leading-relaxed">
              Your browser doesn't support embedded PDF previews.
            </p>
            <a
              className={primaryButtonClass}
              href={resumePath}
              download="Patrick_Fanella_Resume.pdf"
            >
              Download Resume PDF
            </a>
          </div>
        </object>
      </div>
    </section>
  )
}
