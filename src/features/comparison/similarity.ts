export interface TextRange { start: number; end: number }
export interface ComparisonResult { score: number; sharedCount: number; totalA: number; totalB: number; rangesA: TextRange[]; rangesB: TextRange[]; n: number }
function tokenize(text: string) {
  return Array.from(text.matchAll(/[\p{L}\p{N}]+/gu), match => ({ word: match[0].normalize('NFKC').toLocaleLowerCase('en'), start: match.index, end: match.index + match[0].length }));
}
export function compareTexts(a: string, b: string): ComparisonResult {
  const left = tokenize(a), right = tokenize(b);
  const n = Math.min(3, left.length, right.length);
  if (!n) return { score: 0, sharedCount: 0, totalA: 0, totalB: 0, rangesA: [], rangesB: [], n: 3 };
  const grams = (tokens: ReturnType<typeof tokenize>) => {
    const map = new Map<string, TextRange[]>();
    for (let i = 0; i <= tokens.length - n; i++) {
      const first = tokens[i], last = tokens[i + n - 1];
      if (!first || !last) continue;
      const key = tokens.slice(i, i + n).map(t => t.word).join(' ');
      map.set(key, [...(map.get(key) ?? []), { start: first.start, end: last.end }]);
    }
    return map;
  };
  const ga = grams(left), gb = grams(right);
  const shared = [...ga.keys()].filter(key => gb.has(key));
  const ranges = (map: Map<string, TextRange[]>) => {
    const all = shared.flatMap(key => map.get(key) ?? []).sort((x, y) => x.start - y.start);
    const merged: TextRange[] = [];
    for (const range of all) {
      const previous = merged.at(-1);
      if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
      else merged.push({ ...range });
    }
    return merged;
  };
  return { score: Math.round(200 * shared.length / (ga.size + gb.size)), sharedCount: shared.length, totalA: ga.size, totalB: gb.size, rangesA: ranges(ga), rangesB: ranges(gb), n };
}
