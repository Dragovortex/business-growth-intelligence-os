'use client'

import { useEffect, useState } from "react";
import { getRulesByIds } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Bookmark, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Rule } from "@prisma/client";

export default function BookmarksPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const stored = localStorage.getItem('bio_bookmarks');
        if (stored) {
          const displayIds = JSON.parse(stored);
          const data = await getRulesByIds(displayIds);
          setRules(data);
        }
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bookmarks</h1>
        <p className="text-muted-foreground">Your personal collection of saved business rules.</p>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading bookmarks...
        </div>
      ) : rules.length === 0 ? (
        <GlassCard className="flex-1 flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 bg-primary/20 rounded-2xl border border-primary/20 mb-6">
            <Bookmark className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No bookmarks yet</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            You haven't saved any rules to your collection yet. Browse the database and click the bookmark icon to save rules here for quick reference.
          </p>
          <Link href="/rules" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
            Browse Rules
          </Link>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto pb-10">
          {rules.map((rule) => (
            <Link key={rule.displayId} href={`/rules/${rule.displayId}`}>
              <GlassCard className="h-full hover:-translate-y-1 transition-transform cursor-pointer group flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-2 py-1 bg-white/10 text-white rounded-md text-xs font-medium uppercase tracking-wider">
                    {rule.displayId}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-bold">{rule.confidenceScore}%</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-4 line-clamp-3 flex-1">
                  {rule.rule}
                </h3>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                  <span className="text-xs text-muted-foreground">{rule.category}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
