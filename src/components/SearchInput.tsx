"use client";

import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Search } from "lucide-react";
import { Button } from "./ui/button";

interface SearchResult {
  term: string;
  documents: Array<{
    docId: string;
    positions: number[];
  }>;
}

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setSearchResults([]);
    setError(null);
    setIsSearching(true);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative">
        <TextareaAutosize
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          minRows={1}
          maxRows={6}
          placeholder="Enter your search query..."
          className="w-full min-h-[100px] px-12 pl-4 py-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="absolute right-4 bottom-4  flex gap-x-2 text-white hover:text-blue-600 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          search
          <Search size={20} />
        </Button>
      </div>

      {isSearching && (
        <div className="text-center text-gray-500">Searching...</div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      {searchResults.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Search Results</h3>
          {searchResults.map((result, index) => (
            <div key={index} className="mb-3 pb-3 border-b last:border-b-0">
              <div className="font-medium mb-2">Term: {result.term}</div>
              {result.documents.map((doc, docIndex) => (
                <div
                  key={docIndex}
                  className="text-sm text-gray-600 pl-4 before:content-['•'] before:mr-2"
                >
                  Document {doc.docId}: Positions {doc.positions.join(", ")}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
