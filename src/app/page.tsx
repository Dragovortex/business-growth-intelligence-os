import { getDashboardStats } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Database, CheckCircle, TrendingUp, Sparkles, Activity } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of the Business Intelligence OS database.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Rules</p>
              <h2 className="text-3xl font-bold text-white">
                {stats.totalRules.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
              <Database className="w-5 h-5 text-primary" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Verified Rules</p>
              <h2 className="text-3xl font-bold text-white">
                {stats.verifiedRules.toLocaleString()}
              </h2>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/20">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Avg Confidence</p>
              <h2 className="text-3xl font-bold text-white">
                {Math.round(stats.avgConfidence)}%
              </h2>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/20">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Categories</p>
              <h2 className="text-3xl font-bold text-white">
                {stats.topCategories.length}+
              </h2>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/20">
              <Activity className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Latest Discoveries
              </h3>
              <Link href="/rules" className="text-sm text-primary hover:underline">
                View all database →
              </Link>
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Database className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-white font-medium mb-2">Explore the rules database</h4>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                You have {stats.totalRules.toLocaleString()} actionable business rules waiting to be explored.
              </p>
              <Link href="/rules" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
                Browse Rules
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Top Categories</h3>
            <div className="space-y-4">
              {stats.topCategories.map((cat, i) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-xs font-medium text-muted-foreground">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-white">{cat.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/10">
                    {cat.count.toLocaleString()} rules
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
