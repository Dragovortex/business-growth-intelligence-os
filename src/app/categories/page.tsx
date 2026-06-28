import { getCategories } from "@/features/rules/actions";
import { GlassCard } from "@/components/shared/GlassCard";
import { Folder, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Categories</h1>
        <p className="text-muted-foreground">Browse rules by specific business domains.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-auto pb-10">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/rules?category=${encodeURIComponent(cat.name)}`}>
            <GlassCard className="h-full hover:-translate-y-1 transition-transform cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/20">
                  <Folder className="w-6 h-6 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors">
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-black" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mt-6 mb-2">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">
                {cat.count.toLocaleString()} actionable rules
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
