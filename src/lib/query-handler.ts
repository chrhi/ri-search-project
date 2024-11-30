import { PorterStemmer } from "natural";
import { stoplist } from "@/config/stop-list";

/**
 * Normalize terms by removing stopwords and applying stemming.
 * @param term - The raw term to normalize.
 * @returns The normalized term.
 */
function normalizeTerm(term: string): string {
  return PorterStemmer.stem(term.toLowerCase());
}

/**
 * Enhance a raw query into a normalized logical expression.
 * @param query - The input query string.
 * @returns An object containing the terms and the logical expression.
 */
export function enhanceQuery(query: string): {
  terms: string[];
  expression: string;
} {
  const terms: string[] = [];
  let expression = "";
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < query.length; i++) {
    const char = query[i];

    if (char === '"') {
      insideQuotes = !insideQuotes;
      if (!insideQuotes && current.trim()) {
        // Handle quoted phrase
        const phraseTerms = current
          .trim()
          .split(/\s+/)
          .map(normalizeTerm)
          .filter((term) => !stoplist.includes(term));

        if (phraseTerms.length > 0) {
          terms.push(...phraseTerms);
          expression += `(${phraseTerms.join(" AND ")}) `;
        }
        current = "";
      }
    } else if (/\s/.test(char) && !insideQuotes) {
      if (current.trim()) {
        // Add single term
        const normalized = normalizeTerm(current.trim());
        if (!stoplist.includes(normalized)) {
          terms.push(normalized);
          expression += `${normalized} `;
        }
        current = "";
      }
      // Add default logical connector (OR)
      if (char === " ") {
        expression += "OR ";
      }
    } else {
      current += char;
    }
  }

  // Handle the last term outside quotes
  if (current.trim()) {
    const normalized = normalizeTerm(current.trim());
    if (!stoplist.includes(normalized)) {
      terms.push(normalized);
      expression += `${normalized} `;
    }
  }

  // Clean up extra operators
  expression = expression
    .trim()
    .replace(/(AND|OR)$/, "")
    .trim();

  return { terms, expression };
}
