import { getEvidenceStats } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Library, FileText, ShieldCheck, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Evidence Library · Business Intelligence OS",
};

export default async function EvidenceLibraryPage() {
  const { totalEvidence, totalRules, sourceTypeCount, bySource, topEvidenced } =
    await getEvidenceStats();

  const maxSourceCount = Math.max(1, ...bySource.map((s) => s.count));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Evidence Library</h1>
        <p className="text-muted-foreground">
          Every rule is backed by research. Explore the evidence base behind the database.
        </p>
      </header>

      <div className="flex-1 overflow-auto pb-10 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total Evidence Sources</p>
                <h2 className="text-3xl font-bold text-white">{totalEvidence.toLocaleString()}</h2>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
                <Library className="w-5 h-5 text-primary" />
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Avg Sources / Rule</p>
                <h2 className="text-3xl font-bold text-white">
                  {totalRules > 0 ? Math.round(totalEvidence / totalRules).toLocaleString() : 0}
                </h2>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/20">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Source Types</p>
                <h2 className="text-3xl font-bold text-white">{sourceTypeCount}</h2>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/20">
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source type breakdown */}
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Evidence by Source Type</h3>
            <div className="space-y-5">
              {bySource.map((source) => (
                <div key={source.sourceType}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-white">{source.sourceType}</span>
                    <span className="text-xs text-muted-foreground">
                      {source.count.toLocaleString()} rules · {source.avgConfidence}% avg confidence
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                      style={{ width: `${Math.round((source.count / maxSourceCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Most-evidenced rules */}
          <GlassCard className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">Most-Evidenced Rules</h3>
            </div>
            <div>
              {topEvidenced.map((rule) => (
                <Link
                  key={rule.displayId}
                  href={`/rules/${rule.displayId}`}
                  className="flex items-center gap-4 px-6 py-3 border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center w-14 shrink-0">
                    <span className="text-lg font-bold text-primary leading-none">{rule.evidenceCount}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">sources</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{rule.rule}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">{rule.category}</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="flex items-center gap-1 text-yellow-500 text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {rule.confidenceScore}%
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
