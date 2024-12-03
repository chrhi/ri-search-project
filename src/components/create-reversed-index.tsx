"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

const GenerateInvertedIndexButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const generateInvertedIndex = async () => {
    setIsLoading(true);
    setStatus("idle");

    try {
      const response = await fetch("/api/inverted-index", {
        method: "GET",
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error generating inverted index:", error);
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={generateInvertedIndex}
        disabled={true}
        className="font-bold p-4 rounded-xl flex items-center"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          "Generate Reversed Index"
        )}
      </Button>

      {status === "success" && (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle2 className="h-5 w-5" />
          <span>Inverted Index generated successfully!</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <span>Failed to generate the inverted index.</span>
        </div>
      )}
    </div>
  );
};

export default GenerateInvertedIndexButton;
