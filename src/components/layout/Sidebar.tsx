import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Utensils, Search, Target, ChartPie as PieChart, Droplets, Settings, LogOut, ChevronLeft, ChevronRight, Info, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/meals', label: 'Meals', icon: Utensils },
  { path: '/food-search', label: 'Search', icon: Search },
  { path: '/food-library', label: 'Food Library', icon: BookOpen },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: PieChart },
  { path: '/water', label: 'Water', icon: Droplets },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/about', label: 'About', icon: Info },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { signOut } = useAuth();

  return (
    <aside className={cn(
      "h-screen bg-white/40 dark:bg-black/40 backdrop-blur-3xl border-r border-white/50 dark:border-white/10 flex flex-col transition-all duration-300 relative",
      sidebarCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center border-b border-white/20 dark:border-white/10 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/30">
            <img src="/favicon.png" alt="NutriSnap" className="w-full h-full object-cover" />
          </div>
          {!sidebarCollapsed && (
            <span
              className="font-black text-lg tracking-tight whitespace-nowrap overflow-hidden transition-all"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 60%, #047857 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 1px 3px rgba(16,185,129,0.35))',
              }}
            >
              NutriSnap
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1.5 custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
              isActive 
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
                : "text-muted-foreground hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-foreground"
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-border flex flex-col gap-2">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-200 w-full"
          title={sidebarCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!sidebarCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors z-10"
      >
        {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-muted-foreground" /> : <ChevronLeft className="w-4 h-4 text-muted-foreground" />}
      </button>
    </aside>
  );
}
