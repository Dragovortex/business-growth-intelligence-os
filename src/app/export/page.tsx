'use client'

import { useState } from "react";
import { getAllRules, getRulesByIds } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Download, FileJson, FileSpreadsheet, Database, Bookmark, Loader2 } from "lucide-react";
import { Rule } from "@prisma/client";
import { toast } from "sonner";

const CSV_COLUMNS: (keyof Rule)[] = [
  "displayId", "category", "subcategory", "globalRank", "categoryRank",
  "rule", "expectedImpact", "confidenceScore", "evidenceCount", "tags",
  "sourceType", "status", "companies", "notes", "dateAdded", "lastUpdated",
];

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rulesToCsv(rules: Rule[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = rules.map((rule) =>
    CSV_COLUMNS.map((col) => escapeCsv(rule[col])).join(",")
  );
  return [header, ...rows].join("\n");
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getBookmarkIds(): string[] {
  try {
    const stored = localStorage.getItem("bio_bookmarks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function ExportPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const exportRules = async (
    source: "all" | "bookmarks",
    format: "json" | "csv"
  ) => {
    const key = `${source}-${format}`;
    setLoading(key);
    try {
      let rules: Rule[];
      if (source === "bookmarks") {
        const ids = getBookmarkIds();
        if (ids.length === 0) {
          toast.error("You have no bookmarks to export yet.");
          return;
        }
        rules = await getRulesByIds(ids);
      } else {
        rules = await getAllRules();
      }

      const stamp = new Date().toISOString().slice(0, 10);
      const base = source === "bookmarks" ? "bookmarked-rules" : "all-rules";

      if (format === "json") {
        download(`${base}-${stamp}.json`, JSON.stringify(rules, null, 2), "application/json");
      } else {
        download(`${base}-${stamp}.csv`, rulesToCsv(rules), "text/csv");
      }
      toast.success(`Exported ${rules.length.toLocaleString()} rules as ${format.toUpperCase()}`);
    } catch (e) {
      console.error(e);
      toast.error("Export failed. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const ExportButton = ({
    source, format, label, icon,
  }: {
    source: "all" | "bookmarks";
    format: "json" | "csv";
    label: string;
    icon: React.ReactNode;
  }) => {
    const key = `${source}-${format}`;
    return (
      <button
        onClick={() => exportRules(source, format)}
        disabled={loading !== null}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === key ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
        {label}
      </button>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Export</h1>
        <p className="text-muted-foreground">Download the rules database for use in your own tools.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white">Full Database</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Export every rule with all fields, ordered by global rank.
          </p>
          <div className="flex flex-wrap gap-3">
            <ExportButton source="all" format="csv" label="Download CSV" icon={<FileSpreadsheet className="w-4 h-4" />} />
            <ExportButton source="all" format="json" label="Download JSON" icon={<FileJson className="w-4 h-4" />} />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/20">
              <Bookmark className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">My Bookmarks</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Export only the rules you&apos;ve saved to your personal collection.
          </p>
          <div className="flex flex-wrap gap-3">
            <ExportButton source="bookmarks" format="csv" label="Download CSV" icon={<FileSpreadsheet className="w-4 h-4" />} />
            <ExportButton source="bookmarks" format="json" label="Download JSON" icon={<FileJson className="w-4 h-4" />} />
          </div>
        </GlassCard>
      </div>

      <p className="text-xs text-muted-foreground flex items-center gap-2">
        <Download className="w-3.5 h-3.5" />
        Files are generated in your browser and download instantly — nothing is sent anywhere.
      </p>
    </div>
  );
}
