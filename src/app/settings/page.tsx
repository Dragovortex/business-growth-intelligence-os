'use client'

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Bookmark, Trash2, Download, Database } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsPage() {
  const [bookmarkCount, setBookmarkCount] = useState<number | null>(null);

  const refresh = () => {
    try {
      const stored = localStorage.getItem("bio_bookmarks");
      const ids = stored ? JSON.parse(stored) : [];
      setBookmarkCount(Array.isArray(ids) ? ids.length : 0);
    } catch {
      setBookmarkCount(0);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const clearBookmarks = () => {
    if (!window.confirm("Remove all of your saved bookmarks? This cannot be undone.")) return;
    try {
      localStorage.removeItem("bio_bookmarks");
      refresh();
      toast.success("All bookmarks cleared");
    } catch {
      toast.error("Failed to clear bookmarks");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your local data and preferences.</p>
      </header>

      <div className="space-y-6 max-w-3xl">
        {/* Bookmarks management */}
        <GlassCard>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/20 shrink-0">
                <Bookmark className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bookmarks</h3>
                <p className="text-sm text-muted-foreground">
                  {bookmarkCount === null
                    ? "Loading…"
                    : `You have ${bookmarkCount.toLocaleString()} saved rule${bookmarkCount === 1 ? "" : "s"}.`}
                </p>
              </div>
            </div>
            <button
              onClick={clearBookmarks}
              disabled={!bookmarkCount}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </GlassCard>

        {/* Data / export */}
        <GlassCard>
          <div className="flex items-start gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl border border-primary/20 shrink-0">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Bookmarks are stored locally in your browser. Export them any time.
              </p>
            </div>
          </div>
          <Link
            href="/export"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Go to Export
          </Link>
        </GlassCard>

        {/* About */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">About</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Application</span>
              <span className="text-white font-medium">Business Intelligence OS</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Theme</span>
              <span className="text-white font-medium">Dark</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Database</span>
              <span className="text-white font-medium">PostgreSQL (Supabase)</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
