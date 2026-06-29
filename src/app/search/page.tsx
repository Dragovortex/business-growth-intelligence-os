'use client'

import { useState, useEffect } from "react";
import { getRules } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Search as SearchIcon, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Rule } from "@prisma/client";

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Rule[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const performSearch = async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        // Fetch top 20 matches instantly
        const data = await getRules({ search, limit: 20 });
        setResults(data.rules);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    };
    performSearch();
  }, [search]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <div className="relative max-w-3xl mx-auto w-full mt-10">
        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
          <SearchIcon className="w-8 h-8 text-primary/60" />
        </div>
        <input
          type="text"
          className="w-full bg-black/40 border border-white/10 rounded-full py-6 pl-20 pr-8 text-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-xl shadow-2xl transition-all"
          placeholder="What are you trying to grow?"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoFocus
        />
        
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto max-w-4xl mx-auto w-full pb-20">
        {results.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground px-2">Top results for &ldquo;{search}&rdquo;</p>
            {results.map((rule) => (
              <Link key={rule.displayId} href={`/rules/${rule.displayId}`}>
                <GlassCard className="hover:bg-white/[0.05] transition-colors cursor-pointer group mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex gap-2 items-center mb-2">
                        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {rule.displayId}
                        </span>
                        <span className="text-xs text-muted-foreground">{rule.category}</span>
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">{rule.rule}</h3>
                      <p className="text-sm text-green-400">Impact: {rule.expectedImpact}</p>
                    </div>
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary transition-colors shrink-0">
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-black" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        ) : search.trim() !== '' && !isSearching ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No rules found matching &ldquo;{search}&rdquo;</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
