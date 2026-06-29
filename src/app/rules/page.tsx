import { getRules, getCategories } from "@/features/rules/actions";
import { RulesTable } from "@/features/rules/components/RulesTable";
import { GlassCard } from "@/components/shared/GlassCard";

export default async function RulesDatabasePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await search params for Next.js 15+ standard
  const params = await searchParams;

  const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const [data, categories] = await Promise.all([
    getRules({
      page,
      limit: 100, // Load 100 rules at a time
      search,
      category,
    }),
    getCategories(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex-shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Rules Database</h1>
        <p className="text-muted-foreground">The world&apos;s largest actionable business checklist.</p>
      </header>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
        <RulesTable
          initialData={data}
          categories={categories}
          initialCategory={category ?? ''}
        />
      </GlassCard>
    </div>
  );
}
