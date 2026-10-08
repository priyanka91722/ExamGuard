import { useState, type ReactNode } from "react";
import { FileText, ScanLine, Pencil, RotateCcw, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { compareTexts, type TextRange, type ComparisonResult } from "./similarity";
interface Props {
  initialA?: string;
  initialB?: string;
  initialResult?: boolean;
}
function HighlightedText({ text, ranges }: { text: string; ranges: TextRange[] }) {
  const parts: ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, i) => {
    parts.push(text.slice(cursor, range.start));
    parts.push(<mark key={i}>{text.slice(range.start, range.end)}</mark>);
    cursor = range.end;
  });
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
function wordCount(text: string) {
  return text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}
export function ComparisonWorkspace({
  initialA = "",
  initialB = "",
  initialResult = false,
}: Props) {
  const [a, setA] = useState(initialA),
    [b, setB] = useState(initialB);
  const [result, setResult] = useState<ComparisonResult | null>(() =>
    initialResult ? compareTexts(initialA, initialB) : null,
  );
  const [error, setError] = useState("");
  function compare() {
    if (!wordCount(a) || !wordCount(b)) {
      setError("Add text with at least one word to both documents before comparing.");
      return;
    }
    setError("");
    setResult(compareTexts(a, b));
  }
  function reset() {
    setA("");
    setB("");
    setResult(null);
    setError("");
  }
  return (
    <>
      <div className="comparison-toolbar">
        <div className="section-subtitle flex items-center gap-2">
          <Info size={13} />
          {result
            ? "Matching passages are highlighted in both documents."
            : "Two documents. One evidence-based comparison."}
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reset} title="Clear both documents">
            <RotateCcw size={14} />
            Clear
          </Button>
          {result ? (
            <Button variant="outline" onClick={() => setResult(null)}>
              <Pencil size={14} />
              Edit documents
            </Button>
          ) : (
            <Button onClick={compare}>
              <ScanLine size={15} />
              Compare documents
              <ArrowRight size={14} />
            </Button>
          )}
        </div>
      </div>
      {error && (
        <div role="alert" className="error-notice">
          {error}
        </div>
      )}
      <div className="document-grid">
        {[
          {
            text: a,
            setText: setA,
            label: "Original examination",
            type: "REFERENCE",
            ranges: result?.rangesA ?? [],
            placeholder: "Paste the original examination text here…",
          },
          {
            text: b,
            setText: setB,
            label: "Suspected leaked content",
            type: "EVIDENCE",
            ranges: result?.rangesB ?? [],
            placeholder: "Paste the suspected leaked content here…",
          },
        ].map((doc) => (
          <section className="document-panel" key={doc.type}>
            <div className="document-header">
              <FileText size={16} />
              {doc.label}
              <span className="document-label">{doc.type}</span>
            </div>
            {result ? (
              <div className="document-content" aria-label={`${doc.label} matching phrases`}>
                <HighlightedText text={doc.text} ranges={doc.ranges} />
              </div>
            ) : (
              <textarea
                className="document-textarea"
                aria-label={doc.label}
                value={doc.text}
                onChange={(event) => doc.setText(event.target.value)}
                placeholder={doc.placeholder}
                spellCheck={false}
              />
            )}
            <div className="document-footer">
              <span>{wordCount(doc.text)} WORDS</span>
              <span>{doc.text.length.toLocaleString()} CHARACTERS</span>
            </div>
          </section>
        ))}
      </div>
      {result && (
        <section className="result-band" aria-label="Comparison result">
          <div>
            <div className="eyebrow mb-2">Text similarity</div>
            <div className="result-value">
              {result.score}
              <small>%</small>
            </div>
          </div>
          <div>
            <h2 className="result-title">
              {result.score >= 70
                ? "Substantial textual overlap."
                : result.score >= 30
                  ? "Partial textual overlap."
                  : result.score > 0
                    ? "Limited textual overlap."
                    : "No matching phrases found."}
            </h2>
            <p className="result-description">
              The documents share{" "}
              <strong className="text-foreground">
                {result.sharedCount} unique {result.n}-word{" "}
                {result.sharedCount === 1 ? "phrase" : "phrases"}
              </strong>{" "}
              across {result.totalA} reference and {result.totalB} evidence phrases.{" "}
              {result.score >= 70
                ? "The overlap warrants careful review of the source and timing."
                : "Review the highlighted context and source before drawing a conclusion."}{" "}
              Similarity alone is not proof of a leak.
            </p>
          </div>
          <span className="match-key">
            <span className="match-swatch" />
            Matching text
          </span>
        </section>
      )}
      <div className="result-method">
        <span>
          <span className="font-medium text-foreground">Method</span> · Normalized, case-insensitive
          word n-grams · Sørensen–Dice similarity
          <br />
          Punctuation is ignored. Three-word phrases are used, with shorter phrases for documents
          under three words.
        </span>
        <span className="flex items-start gap-2">
          <ScanLine size={13} className="mt-1 shrink-0" />
          Comparison runs locally in your browser.
        </span>
      </div>
    </>
  );
}
