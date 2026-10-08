import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageHeading } from '@/components/page-heading';
import { ComparisonWorkspace } from '@/features/comparison/comparison-workspace';
import { demoCases } from '@/features/cases/data';
import { FileText } from 'lucide-react';
import { useState } from 'react';
export const Route = createFileRoute('/comparison')({ head: () => ({ meta: [ { title: 'Evidence comparison — ExamGuard' }, { name: 'description', content: 'Compare original exam text and suspected leaked content locally with normalized word n-gram similarity.' }, { property: 'og:title', content: 'Evidence comparison — ExamGuard' }, { property: 'og:description', content: 'Calculate actual text overlap and examine matching passages side by side.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' } ] }), component: ComparisonPage });
function ComparisonPage() {
  const [sample, setSample] = useState(false), [generation, setGeneration] = useState(0); const firstCase = demoCases[0];
  return <><PageHeading eyebrow="Academic integrity / Evidence comparison" title="Put the texts side by side." description="Examine the overlap between an original examination and suspected leaked content." action={<Button variant="outline" onClick={() => { setSample(true); setGeneration(v => v + 1); }}><FileText size={15} />Load demonstration texts</Button>} /><ComparisonWorkspace key={generation} initialA={sample ? firstCase?.original : ''} initialB={sample ? firstCase?.suspected : ''} />{sample && <p className="table-note">Demonstration text loaded. These fictional examination documents are for evaluation only.</p>}</>;
}
