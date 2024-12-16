/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { handleTerms } from "@/lib/text-processing";
import { getInvertedIndex } from "@/lib/db-functions";

export async function performBooleanSearch(query: string): Promise<string[]> {
  // Step 1: Normalize the query terms
  const termsAndOperators = parseBooleanQuery(query);

  // Step 2: Retrieve inverted index results for all terms
  const termResults: Record<string, Set<string>> = {};
  for (const item of termsAndOperators) {
    if (item.term && !termResults[item.term]) {
      const normalizedTerm = handleTerms(item.term)[0];

      const result = await getInvertedIndex(normalizedTerm);
      const docSet: Set<string> = new Set(
        result?.documents.map((doc: { docId: any }) => doc.docId) || []
      );

      // Merge results for the current term
      termResults[normalizedTerm] = termResults[normalizedTerm]
        ? new Set<string>([...termResults[normalizedTerm], ...docSet])
        : docSet;
    }
  }

  // Step 3: Evaluate the query based on terms and connectors
  let currentResult: Set<string> | null = null;

  for (let i = 0; i < termsAndOperators.length; i++) {
    const item = termsAndOperators[i];

    if (item.term) {
      // Get the document set for this term
      const normalizedTerms = handleTerms(item.term);
      const docSet = normalizedTerms.reduce(
        (acc, term) =>
          new Set([...acc, ...(termResults[term] || new Set<string>())]),
        new Set<string>()
      );

      if (currentResult === null) {
        currentResult = new Set(docSet);
      } else {
        // Default operator is OR (union)
        currentResult = new Set([...currentResult, ...docSet]);
      }
    } else if (item.operator === "AND") {
      // Handle AND operator (intersection with the next term)
      const nextTerm = termsAndOperators[i + 1]?.term;
      if (nextTerm) {
        const normalizedTerms = handleTerms(nextTerm);
        const nextDocSet = normalizedTerms.reduce(
          (acc, term) =>
            new Set([...acc, ...(termResults[term] || new Set<string>())]),
          new Set<string>()
        );

        currentResult = new Set(
          [...currentResult!].filter((docId) => nextDocSet.has(docId))
        );
        i++; // Skip the next term as it's already processed
      }
    }
  }

  return Array.from(currentResult || []);
}

export async function POST(request: Request) {
  try {
    // Parse incoming request
    const { query } = await request.json();

    // Validate query
    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    // Perform boolean search
    const results = await performBooleanSearch(query);

    return NextResponse.json({
      results,
      total: results.length,
    });
  } catch (error) {
    console.error("Error in boolean search:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to perform boolean search",
      },
      { status: 500 }
    );
  }
}

// Helper function to parse the query
function parseBooleanQuery(
  query: string
): Array<{ term?: string; operator?: string }> {
  const parts = query.split(/\s+/);
  const result: Array<{ term?: string; operator?: string }> = [];

  for (const part of parts) {
    if (part.toUpperCase() === "AND") {
      result.push({ operator: "AND" });
    } else {
      result.push({ term: part });
    }
  }

  return result;
}
