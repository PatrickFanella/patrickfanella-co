type IconName = 'mail' | 'github' | 'linkedin' | 'gitea' | 'external' | 'archive' | 'download'

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
    github: <><path d="M9 19c-4.3 1.3-4.3-2-6-2m12 5v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8A5.3 5.3 0 0 0 18.9 5a5 5 0 0 0-.1-3.7S17.6.9 15 2.7a13 13 0 0 0-7 0C5.4.9 4.2 1.3 4.2 1.3A5 5 0 0 0 4.1 5a5.3 5.3 0 0 0-1.4 3.7c0 5.3 3.2 6.5 6.2 6.8A3.4 3.4 0 0 0 8 18.1V22" /></>,
    linkedin: <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M7 10v7m0-10v.1M11 17v-7m0 3c0-4 6-4 6 0v4" /></>,
    gitea: <><path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 1 1 0 6h-2M7 4h8" /><path d="m8 12 4 4m-4 0 4-4" /><circle cx="8" cy="12" r=".6" /><circle cx="12" cy="16" r=".6" /></>,
    external: <><path d="M14 3h7v7m0-7L10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6" /></>,
    archive: <><path d="M4 8h16v13H4zM3 3h18v5H3zM9 12h6" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" /></>,
  }
  return <svg aria-hidden="true" className={`shrink-0 ${className}`} fill="none" focusable="false" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">{paths[name]}</svg>
}
