import { NextResponse } from "next/server";
import { normalizeTerms } from "@/lib/text-processing"; // Assuming this is where normalization is defined
import { getInvertedIndex } from "@/lib/db-functions";

interface InvertedIndexEntry {
  docId: string;
  positions: number[];
}

// Type for Inverted Index Result
interface InvertedIndexResult {
  term: string;
  documents: InvertedIndexEntry[];
}

// Boolean retrieval function
async function performBooleanSearch(query: string): Promise<string[]> {
  // Normalize the query terms
  const normalizedTerms = normalizeTerms(query);

  // ali is here -> ['ali' , 'here"]

  console.log("these are the normalize terms ");
  console.log(normalizedTerms);
  // Retrieve inverted index for all normalized terms
  const termResults: (InvertedIndexResult | null)[] = await Promise.all(
    normalizedTerms.map((term) => getInvertedIndex(term))
  );

  console.log("these are the termresults ");

  console.log(termResults);
  // Filter out null results
  const validResults = termResults.filter(
    (result): result is InvertedIndexResult => result !== null
  );

  if (validResults.length === 0) {
    return []; // No matching documents
  }

  // Extract document IDs for each term
  const documentSets = validResults?.map(
    (result) => new Set(result?.documents?.map((entry) => entry.docId))
  );

  console.log(documentSets);

  // Perform intersection of document sets (AND operation)
  const relevantDocuments = documentSets.reduce((acc, currentSet) => {
    return new Set([...acc].filter((docId) => currentSet.has(docId)));
  }, documentSets[0]);

  return Array.from(relevantDocuments);
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

    console.log("thses are the final results");
    console.log(results);

    // Return results
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
