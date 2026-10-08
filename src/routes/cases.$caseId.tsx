import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { PageHeading } from '@/components/page-heading';
import { Button } from '@/components/ui/button';
import { useCases } from '@/features/cases/context';
import { StatusBadge } from '@/features/cases/case-table';
import { formatTimestamp, type ReviewStatus } from '@/features/cases/data';
import { ComparisonWorkspace } from '@/features/comparison/comparison-workspace';
export const Route = createFileRoute('/cases/$caseId')({ head: ({ params }) => ({ meta: [ { title: `${params.caseId} — Case evidence — ExamGuard` }, { name: 'description', content: `Review documentary evidence and investigation status for ExamGuard case ${params.caseId}.` }, { property: 'og:title', content: `${params.caseId} — ExamGuard case evidence` }, { property: 'og:description', content: 'Compare original examination material with suspected leaked content.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' } ] }), component: CaseDetail });
function CaseDetail() {
  const { caseId } = Route.useParams(); const { cases, updateStatus, loading } = useCases(); const item = cases.find(c => c.id === caseId);
  if (loading) return <p className="section-subtitle">Retrieving evidence…</p>;
  if (!item) return <div className="empty-state"><h1 className="page-title">Case not found.</h1><p>This case is not in the current register.</p><Button asChild variant="outline"><Link to="/cases"><ArrowLeft />Back to cases</Link></Button></div>;
  return <><div className="breadcrumb"><Link to="/cases">Case register</Link><ChevronRight size={12} /><span>{item.id}</span></div><PageHeading eyebrow={`Case file / ${item.id}`} title={item.subject} description={item.title} action={<StatusBadge status={item.status} />} /><dl className="case-metadata"><div><dt>Source</dt><dd>{item.source}</dd></div><div><dt>Evidence origin</dt><dd>{item.sourceType}</dd></div><div><dt>Detected · UTC</dt><dd>{formatTimestamp(item.timestamp)}</dd></div><div><dt>Review status</dt><dd><select className="select-control" aria-label="Update review status" value={item.status} onChange={e => void updateStatus(item.id, e.target.value as ReviewStatus)}>{['Needs review', 'Investigating', 'Resolved'].map(s => <option key={s}>{s}</option>)}</select></dd></div></dl><div className="section-heading"><h2 className="section-title">Documentary evidence</h2><span className="demo-tag">DEMONSTRATION CASE</span></div><ComparisonWorkspace key={item.id} initialA={item.original} initialB={item.suspected} initialResult /></>;
}
