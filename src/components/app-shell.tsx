import { Link } from "@tanstack/react-router";
import { LayoutGrid, FolderOpen, ScanLine, ShieldCheck, Search, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CasesProvider, useCases } from "@/features/cases/context";
import { isDemonstration } from "@/services/api";
import type { ReactNode } from "react";
function WorkspaceStatus() {
  const { error, loading } = useCases();
  return (
    <>
      {error && (
        <div role="alert" className="error-notice">
          {error}
        </div>
      )}
      {loading && (
        <p className="section-subtitle" role="status">
          Loading case records…
        </p>
      )}
    </>
  );
}
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <CasesProvider>
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="ExamGuard home">
            <ShieldCheck className="brand-mark" strokeWidth={1.7} />
            <span className="brand-name">
              ExamGuard<span className="text-primary">.</span>
            </span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="nav-link"
              activeProps={{ className: "nav-link active" }}
            >
              <LayoutGrid size={15} />
              Overview
            </Link>
            <Link to="/cases" className="nav-link" activeProps={{ className: "nav-link active" }}>
              <FolderOpen size={16} />
              Cases
            </Link>
            <Link
              to="/comparison"
              className="nav-link"
              activeProps={{ className: "nav-link active" }}
            >
              <ScanLine size={16} />
              Evidence comparison
            </Link>
          </nav>
          <div className="header-end">
            <span className="demo-tag">
              <span className="demo-dot" />
              {isDemonstration ? "DEMO WORKSPACE" : "LIVE WORKSPACE"}
            </span>
            <Button asChild variant="ghost" size="icon" title="Search cases">
              <Link to="/cases" aria-label="Search cases">
                <Search size={17} />
              </Link>
            </Button>
            <span className="avatar-initials" title="Investigation workspace">
              EG
            </span>
          </div>
        </div>
      </header>
      <main className="workspace">
        <WorkspaceStatus />
        {children}
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <span className="footer-signature">
            <ShieldCheck size={13} />
            ExamGuard · Protecting the integrity of every exam.
          </span>
          <span className="footer-version flex items-center gap-2">
            <LockKeyhole size={11} /> LOCAL TEXT ANALYSIS <span className="text-border">/</span>{" "}
            V.1.0
          </span>
        </div>
      </footer>
    </CasesProvider>
  );
}
