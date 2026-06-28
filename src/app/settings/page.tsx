import { GlassCard } from "@/components/shared/GlassCard";
import { Construction } from "lucide-react";

export default function ComingSoonPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col justify-center items-center">
      <GlassCard className="max-w-md w-full text-center p-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/20 rounded-2xl border border-primary/20">
            <Construction className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Coming Soon</h1>
        <p className="text-muted-foreground">
          This feature is currently under development. Check back later!
        </p>
      </GlassCard>
    </div>
  );
}
