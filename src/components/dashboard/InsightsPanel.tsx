import { Insight } from '../../types/insights';
import { cn } from '../../lib/utils';
import { Info, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (!insights.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="section-title px-1">Smart Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: Insight }) {
  const config = {
    info:    { bg: 'bg-blue-50 dark:bg-blue-900/20',     border: 'border-blue-100 dark:border-blue-900/50',       text: 'text-blue-800 dark:text-blue-300',     icon: Info },
    warning: { bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-100 dark:border-amber-900/50',     text: 'text-amber-800 dark:text-amber-300',   icon: AlertTriangle },
    success: { bg: 'bg-emerald-50 dark:bg-emerald-900/20',border: 'border-emerald-100 dark:border-emerald-900/50',text: 'text-emerald-800 dark:text-emerald-300', icon: CheckCircle },
    tip:     { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-900/50',   text: 'text-purple-800 dark:text-purple-300', icon: Lightbulb },
  };

  const style = config[insight.severity];
  const Icon = style.icon;

  return (
    <div className={cn("p-4 rounded-xl border flex gap-3 transition-all", style.bg, style.border)}>
      <div className="text-xl shrink-0 mt-0.5">{insight.icon}</div>
      <div className="flex flex-col gap-1">
        <h4 className={cn("text-sm font-bold", style.text)}>{insight.title}</h4>
        <p className={cn("text-sm opacity-90 leading-relaxed", style.text)}>{insight.message}</p>
        
        {insight.action && (
          <Link 
            to={getActionRoute(insight.category)}
            className={cn("text-xs font-semibold mt-2 inline-flex items-center hover:underline opacity-80", style.text)}
          >
            {insight.action} →
          </Link>
        )}
      </div>
    </div>
  );
}

function getActionRoute(category: string): string {
  if (category === 'hydration') return '/water';
  if (category === 'calories' || category === 'protein') return '/food-search';
  if (category === 'consistency') return '/meals';
  return '/dashboard';
}
