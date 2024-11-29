"use client";
import { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Loader } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface InvertedIndex {
  [term: string]: {
    docId: string;
    positions: number[];
  }[];
}

export default function InvertedIndexDisplay() {
  const [invertedIndex, setInvertedIndex] = useState<InvertedIndex>({});
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    async function fetchInvertedIndex() {
      // Only fetch if we haven't already fetched
      if (!hasFetchedRef.current) {
        try {
          const response = await fetch("/api/text-files");
          await response.json();
          //   setInvertedIndex(data.invertedIndex);
          setIsLoading(false);

          // Mark as fetched to prevent future calls
          hasFetchedRef.current = true;
        } catch (error) {
          console.error("Failed to fetch inverted index:", error);
          setIsLoading(false);
        }
      }
    }

    fetchInvertedIndex();
  }, []); // Empty dependency array ensures it only runs once

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Inverted Index</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="w-4 h-4 animate-spin" />
          </div>
        ) : (
          <Accordion type="single" collapsible>
            {Object.entries(invertedIndex).map(([term, postings]) => (
              <AccordionItem value={term} key={term}>
                <AccordionTrigger>
                  <h2>{term}</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {postings.map(({ docId, positions }) => (
                      <li key={`${term}-${docId}`}>
                        Document {docId}: {positions.join(", ")}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
