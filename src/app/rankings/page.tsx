import { getRankings } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Trophy, Star, ArrowRight, Medal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Rankings · Business Intelligence OS",
};

const PODIUM_STYLES = [
  { ring: "border-yellow-500/40", badge: "bg-yellow-500/20 text-yellow-400", glow: "shadow-[0_0_30px_rgba(234,179,8,0.15)]" },
  { ring: "border-zinc-300/30", badge: "bg-zinc-300/20 text-zinc-200", glow: "shadow-[0_0_30px_rgba(212,212,216,0.12)]" },
  { ring: "border-amber-700/40", badge: "bg-amber-700/20 text-amber-500", glow: "shadow-[0_0_30px_rgba(180,83,9,0.12)]" },
];

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const activeCategory = typeof params.category === "string" ? params.category : "";

  const { topRules, categories, totalRanked } = await getRankings(activeCategory);

  const podium = topRules.slice(0, 3);
  const rest = topRules.slice(3);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Rankings</h1>
        <p className="text-muted-foreground">
          The highest-impact rules, ranked by global authority
          {activeCategory ? <> in <span className="text-white font-medium">{activeCategory}</span></> : null}.
        </p>
      </header>

      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2 flex-shrink-0">
        <Link
          href="/rankings"
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeCategory === ""
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/rankings?category=${encodeURIComponent(cat.name)}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeCategory === cat.name
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="flex-1 overflow-auto pb-10 space-y-6">
        {/* Podium */}
        {podium.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {podium.map((rule, i) => (
              <Link key={rule.displayId} href={`/rules/${rule.displayId}`}>
                <GlassCard className={`h-full border ${PODIUM_STYLES[i].ring} ${PODIUM_STYLES[i].glow} hover:-translate-y-1 transition-transform cursor-pointer group`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${PODIUM_STYLES[i].badge}`}>
                      <Medal className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-white">#{rule.globalRank}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-3 line-clamp-3 min-h-[3.75rem]">
                    {rule.rule}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-xs text-muted-foreground">{rule.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">{rule.confidenceScore}%</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}

        {/* Ranked list */}
        {rest.length > 0 && (
          <GlassCard className="p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Leaderboard
              </h3>
              <span className="text-xs text-muted-foreground">
                Showing top {topRules.length.toLocaleString()} of {totalRanked.toLocaleString()}
              </span>
            </div>
            <div>
              {rest.map((rule) => (
                <Link
                  key={rule.displayId}
                  href={`/rules/${rule.displayId}`}
                  className="flex items-center gap-4 px-5 py-3 border-b border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="font-mono text-sm font-bold text-primary w-12 shrink-0">#{rule.globalRank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{rule.rule}</p>
                  </div>
                  <span className="hidden sm:inline px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-muted-foreground shrink-0">
                    {rule.category}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-500 shrink-0 w-12 justify-end">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold">{rule.confidenceScore}%</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </GlassCard>
        )}

        {topRules.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No ranked rules found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
