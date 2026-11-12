/** Route transition: each page fades up slightly on navigation (CSS only, so it never waits for JS). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-[page-in_260ms_var(--ease-out-soft)_backwards]">{children}</div>;
}
