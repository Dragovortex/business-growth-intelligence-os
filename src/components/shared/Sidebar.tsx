'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Database, 
  FolderTree, 
  Trophy, 
  Search, 
  Bookmark, 
  Settings, 
  Library,
  Upload,
  Download
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Rules Database", href: "/rules", icon: Database },
  { name: "Categories", href: "/categories", icon: FolderTree },
  { name: "Rankings", href: "/rankings", icon: Trophy },
  { name: "Evidence Library", href: "/evidence", icon: Library },
  { name: "Advanced Search", href: "/search", icon: Search },
];

const secondaryNav = [
  { name: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { name: "Import", href: "/import", icon: Upload },
  { name: "Export", href: "/export", icon: Download },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full flex flex-col glass border-r border-white/5 relative z-10">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tighter text-gradient flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <span className="leading-none">Business<br/><span className="text-sm font-medium text-muted-foreground tracking-normal">Intelligence OS</span></span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
        <div>
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Core Data</p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab" 
                        className="absolute inset-0 bg-white/10 rounded-lg" 
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                    <span className="text-sm font-medium relative z-10">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personal</p>
          <ul className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative group ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab2" 
                        className="absolute inset-0 bg-white/10 rounded-lg" 
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-primary' : 'group-hover:text-primary transition-colors'}`} />
                    <span className="text-sm font-medium relative z-10">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto">
        <div className="glass-panel p-3 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <div className="text-xs">
            <p className="text-white font-medium">System Online</p>
            <p className="text-muted-foreground">1M+ Rules Synced</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
