import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { LayoutDashboard, Utensils, Search, PieChart, User, Info } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { path: '/meals', label: 'Meals', icon: Utensils },
  { path: '/food-search', label: 'Search', icon: Search },
  { path: '/analytics', label: 'Stats', icon: PieChart },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/about', label: 'About', icon: Info },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/60 dark:bg-black/60 backdrop-blur-3xl border-t border-white/50 dark:border-white/10 flex items-center justify-around px-1 z-40 pb-safe shadow-[0_-4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_30px_rgba(0,0,0,0.3)]">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 relative",
            isActive ? "text-emerald-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-emerald-500" />
              )}
              <item.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className={cn("text-[10px] font-semibold transition-all", isActive ? "text-emerald-500" : "")}>{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

