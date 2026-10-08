import { createFileRoute } from "@tanstack/react-router";
import { Link } from '@tanstack/react-router';
import { ArrowRight, ScanLine, FolderOpen, Flag, Search, CircleCheck, ShieldCheck, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/page-heading';
import { CaseTable } from '@/features/cases/case-table';
import { useCases } from '@/features/cases/context';
import documentsImage from '@/assets/exam-documents.jpg';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Overview — ExamGuard' },
    { name: 'description', content: 'Review suspected examination leaks, track investigations, and compare documentary evidence in ExamGuard.' },
    { property: 'og:title', content: 'Overview — ExamGuard' },
    { property: 'og:description', content: 'An evidence-led academic integrity investigation workspace.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
function Index() {
  const { cases } = useCases();
  const statistics = [
    { label: 'Total cases', value: cases.length, detail: 'In the current workspace', icon: FolderOpen },
    { label: 'Needs review', value: cases.filter(c => c.status === 'Needs review').length, detail: 'Awaiting an initial assessment', icon: Flag },
    { label: 'Investigating', value: cases.filter(c => c.status === 'Investigating').length, detail: 'Under active examination', icon: Search },
    { label: 'Resolved', value: cases.filter(c => c.status === 'Resolved').length, detail: 'Review completed', icon: CircleCheck },
  ];
  return <><Eyebrow>Academic integrity / Overview</Eyebrow><section className="overview-intro"><div><h1 className="page-title overview-title">Integrity starts<br />with <span className="title-accent">evidence.</span></h1><p className="page-description">A considered approach to exam-leak detection.<br />Review signals, connect the evidence, and protect what matters.</p><div className="intro-actions"><Button asChild><Link to="/comparison"><ScanLine size={15} />Compare evidence<ArrowRight size={15} /></Link></Button><Button asChild variant="outline"><Link to="/cases">Explore cases<ArrowRight size={15} /></Link></Button></div></div><figure className="editorial-image"><img src={documentsImage} alt="Examination papers on a cobalt folder, ready for careful review" width={1024} height={768} /><figcaption className="image-caption"><span>Clarity over conjecture.</span><span>ExamGuard / 01</span></figcaption></figure></section>
  <section className="statistics" aria-label="Case statistics">{statistics.map(stat => <div className="stat" key={stat.label}><div className="stat-label"><stat.icon size={14} strokeWidth={1.5} />{stat.label}</div><div className={`stat-number ${stat.label === 'Needs review' ? 'text-primary' : ''}`}>{String(stat.value).padStart(2, '0')}</div><div className="stat-detail">{stat.detail}</div></div>)}</section>
  <section><div className="section-heading"><div><h2 className="section-title">Recent suspected incidents</h2><p className="section-subtitle">The latest signals. A starting point for a closer look.</p></div><Button asChild variant="link" size="sm"><Link to="/cases">All cases<ArrowRight size={14} /></Link></Button></div><CaseTable cases={cases.slice(0, 4)} compact /></section>
  <section className="overview-bottom"><div className="principle"><Fingerprint size={21} strokeWidth={1.4} /><div><h3>Signals, not verdicts.</h3><p>Textual similarity is an indicator, not a conclusion. Every flagged incident deserves context and human review.</p></div></div><div className="principle"><ShieldCheck size={21} strokeWidth={1.4} /><div><h3>Your evidence stays yours.</h3><p>Document comparisons are processed locally. Your pasted examination text never leaves this browser.</p></div></div></section></>;
}
