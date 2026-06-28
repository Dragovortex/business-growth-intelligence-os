import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/shared/GlassCard";
import { Trophy, Star, BookOpen, Activity, Calendar, Tag, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { BookmarkButton } from "@/components/shared/BookmarkButton";

export default async function RuleDetailsPage({
  params,
}: {
  params: Promise<{ displayId: string }>
}) {
  const { displayId } = await params;
  
  const rule = await prisma.rule.findUnique({
    where: { displayId },
  });

  if (!rule) {
    notFound();
  }

  let tags = [];
  try {
    tags = JSON.parse(rule.tags);
  } catch (e) {}

  let companies = [];
  try {
    companies = rule.companies ? JSON.parse(rule.companies) : [];
  } catch (e) {}

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto h-full overflow-y-auto pb-20">
      <div className="flex items-center justify-between">
        <Link href="/rules" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Database
        </Link>
        <BookmarkButton displayId={rule.displayId} />
      </div>
      
      <GlassCard className="p-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium uppercase tracking-wider">
              {rule.displayId}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{rule.status}</span>
              <span className="text-sm text-muted-foreground">{new Date(rule.dateAdded).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight">
            {rule.rule}
          </h1>

          {rule.notes && (
            <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/50 pl-4 mt-2">
              {rule.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-sm flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {companies.length > 0 && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Building2 className="w-4 h-4" /> Utilized by:
              </span>
              <div className="flex gap-2">
                {companies.map((company: string) => (
                  <span key={company} className="text-sm font-bold text-white bg-white/5 px-2 py-1 rounded">
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-500/20 shrink-0">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Confidence</p>
              <h3 className="text-2xl font-bold text-white">{rule.confidenceScore}%</h3>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/20 shrink-0">
              <Trophy className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Global Rank</p>
              <h3 className="text-2xl font-bold text-white">#{rule.globalRank}</h3>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/20 shrink-0">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Expected Impact</p>
              <h3 className="text-xl font-bold text-green-400">{rule.expectedImpact}</h3>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Categorization
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Category</span>
              <span className="text-white font-medium">{rule.category}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Subcategory</span>
              <span className="text-white font-medium">{rule.subcategory}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Category Rank</span>
              <span className="text-white font-medium">#{rule.categoryRank}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Evidence & Sources
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Source Type</span>
              <span className="text-white font-medium">{rule.sourceType}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-muted-foreground">Evidence Count</span>
              <span className="text-white font-medium">{rule.evidenceCount} sources</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
