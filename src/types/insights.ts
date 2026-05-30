export type InsightCategory = 'protein' | 'calories' | 'hydration' | 'consistency' | 'fat' | 'carbs' | 'streak';
export type InsightSeverity = 'info' | 'warning' | 'success' | 'tip';

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  message: string;
  action?: string;
  icon: string;
  priority: number; // higher = more important
}
