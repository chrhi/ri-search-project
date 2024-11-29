"use client";

import { Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Textarea
          placeholder="Search anything..."
          className="pl-10 pr-4 min-h-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          value={query}
          rows={3}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}