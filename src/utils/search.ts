/**
 * Advanced Fuzzy Search Matching and Scoring Utility.
 * Evaluates the proximity and matching weight of a query against target strings.
 * Scores matches from 0 (no match) to 100 (exact match).
 */
export const fuzzyMatch = (text: string, query: string): { matches: boolean; score: number } => {
  const normalizedText = text.toLowerCase().trim();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return { matches: true, score: 0 };
  if (!normalizedText) return { matches: false, score: 0 };

  // 1. Exact Match
  if (normalizedText === normalizedQuery) {
    return { matches: true, score: 100 };
  }

  // 2. Starts-With Prefix Match
  if (normalizedText.startsWith(normalizedQuery)) {
    return { matches: true, score: 80 };
  }

  // 3. Substring Containment Match
  if (normalizedText.includes(normalizedQuery)) {
    return { matches: true, score: 60 };
  }

  // 4. Word-by-word token intersections
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const textTokens = normalizedText.split(/\s+/).filter(Boolean);
  let matchedTokens = 0;

  queryTokens.forEach((qt) => {
    if (textTokens.some((tt) => tt.includes(qt) || qt.includes(tt))) {
      matchedTokens += 1;
    }
  });

  if (matchedTokens > 0) {
    const score = Math.round((matchedTokens / queryTokens.length) * 40);
    return { matches: true, score };
  }

  return { matches: false, score: 0 };
};

/**
 * Filter and sort a collection of items based on fuzzy match scores.
 */
export function fuzzySort<T>(
  items: T[],
  query: string,
  keyExtractors: ((item: T) => string)[]
): T[] {
  if (!query.trim()) return items;

  return items
    .map((item) => {
      let bestScore = 0;
      keyExtractors.forEach((extractor) => {
        const text = extractor(item);
        const { score } = fuzzyMatch(text, query);
        if (score > bestScore) {
          bestScore = score;
        }
      });
      return { item, score: bestScore };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}
