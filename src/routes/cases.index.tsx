import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ScanLine, ArrowRight, FolderSearch, X } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/ui/button";
import { useCases } from "@/features/cases/context";
import { CaseTable } from "@/features/cases/case-table";
export const Route = createFileRoute("/cases/")({
  head: () => ({
    meta: [
      { title: "Case register — ExamGuard" },
      {
        name: "description",
        content:
          "Search and filter suspected exam-leak cases by subject, source and review status.",
      },
      { property: "og:title", content: "Case register — ExamGuard" },
      {
        property: "og:description",
        content: "A structured register of suspected examination leaks and review outcomes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CasesPage,
});
function CasesPage() {
  const { cases } = useCases();
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState("All statuses"),
    [subject, setSubject] = useState("All subjects");
  const filtered = useMemo(
    () =>
      cases.filter(
        (item) =>
          (status === "All statuses" || item.status === status) &&
          (subject === "All subjects" || item.subject === subject) &&
          `${item.subject} ${item.title} ${item.id} ${item.source}`
            .toLowerCase()
            .includes(search.trim().toLowerCase()),
      ),
    [cases, search, status, subject],
  );
  function clear() {
    setSearch("");
    setStatus("All statuses");
    setSubject("All subjects");
  }
  return (
    <>
      <PageHeading
        eyebrow="Academic integrity / Case register"
        title="Follow the evidence."
        description="Every signal, documented. Find a case and take a closer look."
        action={
          <Button asChild>
            <Link to="/comparison">
              <ScanLine size={15} />
              Compare evidence
              <ArrowRight size={15} />
            </Link>
          </Button>
        }
      />
      <div className="filter-bar">
        <label className="search-field">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects, sources, or case IDs…"
            aria-label="Search cases"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </Button>
          )}
        </label>
        <select
          className="select-control"
          aria-label="Filter by review status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["All statuses", "Needs review", "Investigating", "Resolved"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="select-control"
          aria-label="Filter by subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option>All subjects</option>
          {[...new Set(cases.map((c) => c.subject))].sort().map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <span className="filter-count">
          {filtered.length} OF {cases.length} CASES
        </span>
      </div>
      {filtered.length ? (
        <CaseTable cases={filtered} />
      ) : (
        <div className="empty-state">
          <FolderSearch size={32} strokeWidth={1.2} />
          <h2>No cases found.</h2>
          <p>Try a different search or broaden your filters.</p>
          <Button variant="outline" onClick={clear}>
            Clear filters
          </Button>
        </div>
      )}
    </>
  );
}
