import { describe, it, expect } from 'vitest';
import { compareTexts } from './similarity';
describe('normalized word n-gram similarity', () => {
  it('normalizes capitalization and punctuation', () => { expect(compareTexts('Find the derivative, of X.', 'FIND the derivative of x').score).toBe(100); });
  it('returns zero for unrelated and empty documents', () => { expect(compareTexts('one two three', 'four five six').score).toBe(0); expect(compareTexts('', 'test').score).toBe(0); });
  it('calculates Dice overlap from actual three-word grams', () => { const result = compareTexts('a b c d', 'a b c e'); expect(result.score).toBe(50); expect(result.sharedCount).toBe(1); expect(result.rangesA).toEqual([{ start: 0, end: 5 }]); });
  it('supports short inputs and does not inflate repeated phrases', () => { expect(compareTexts('a b', 'A B').score).toBe(100); expect(compareTexts('a a a a', 'a a a').score).toBe(100); });
  it('merges overlapping highlighted phrases', () => { expect(compareTexts('a b c d e', 'a b c d x').rangesA).toEqual([{ start: 0, end: 7 }]); });
});
