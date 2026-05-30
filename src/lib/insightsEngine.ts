import { Insight, InsightCategory, InsightSeverity } from '../types/insights';
import { DailyProgress } from '../types/nutrition';
import { WeeklyStats } from '../types/analytics';

function makeInsight(
  category: InsightCategory,
  severity: InsightSeverity,
  title: string,
  message: string,
  icon: string,
  priority: number,
  action?: string
): Insight {
  return { id: `${category}_${Date.now()}`, category, severity, title, message, icon, priority, action };
}

// ─── Daily insight rules ─────────────────────────────────────────────────────
export function generateDailyInsights(progress: DailyProgress, hour: number = new Date().getHours()): Insight[] {
  const insights: Insight[] = [];

  // Protein insights
  if (progress.protein.percentage < 50 && hour >= 18) {
    insights.push(makeInsight('protein', 'warning', 'Low Protein Intake',
      `You've only hit ${progress.protein.percentage}% of your protein goal. Add ${progress.protein.remaining}g more today.`,
      '💪', 90, 'Search high-protein foods'));
  } else if (progress.protein.percentage >= 100) {
    insights.push(makeInsight('protein', 'success', 'Protein Goal Reached!',
      `Great job! You've hit your ${progress.protein.goal}g protein target.`,
      '✅', 60));
  }

  // Calorie insights
  if (progress.calories.percentage > 115) {
    insights.push(makeInsight('calories', 'warning', 'Over Calorie Goal',
      `You're ${progress.calories.consumed - progress.calories.goal} kcal over your goal. Consider lighter options.`,
      '⚠️', 95));
  } else if (progress.calories.percentage < 40 && hour >= 20) {
    insights.push(makeInsight('calories', 'warning', 'Very Low Calorie Intake',
      `You've only consumed ${progress.calories.percentage}% of your calories. Make sure you're eating enough!`,
      '🍽️', 85, 'Log a meal'));
  } else if (progress.calories.percentage >= 90 && progress.calories.percentage <= 105) {
    insights.push(makeInsight('calories', 'success', 'On Track with Calories',
      'Perfect! Your calorie intake is right on target today.',
      '🎯', 50));
  }

  // Hydration insights
  if (progress.water.percentage < 50 && hour >= 14) {
    insights.push(makeInsight('hydration', 'warning', 'Stay Hydrated',
      `Only ${progress.water.percentage}% hydrated. Drink ${progress.water.remaining}ml more to reach your goal.`,
      '💧', 88, 'Log water'));
  } else if (progress.water.percentage < 25 && hour >= 10) {
    insights.push(makeInsight('hydration', 'warning', 'Start Drinking Water',
      "You've barely had any water today. Start drinking now to avoid dehydration.",
      '🚰', 92, 'Log water'));
  } else if (progress.water.percentage >= 100) {
    insights.push(makeInsight('hydration', 'success', 'Hydration Goal Reached!',
      "Excellent! You've met your daily water intake goal.",
      '💦', 55));
  }

  // Fat insights
  if (progress.fat.percentage > 130) {
    insights.push(makeInsight('fat', 'warning', 'High Fat Intake',
      `Your fat intake is ${Math.round(progress.fat.percentage - 100)}% over goal. Try leaner food options.`,
      '🧈', 80));
  }

  // Carb insights
  if (progress.carbs.percentage > 130) {
    insights.push(makeInsight('carbs', 'info', 'High Carb Day',
      `Carbs are ${Math.round(progress.carbs.percentage - 100)}% over target. Balance with protein and fiber.`,
      '🌾', 70));
  }

  // Tip for new day
  if (hour < 9 && progress.calories.consumed === 0) {
    insights.push(makeInsight('consistency', 'tip', 'Start Strong Today',
      "Log your breakfast to kick off a consistent tracking day.",
      '🌅', 75, 'Log breakfast'));
  }

  // Sort by priority desc, return top 4
  return insights.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

// ─── Weekly insight rules ────────────────────────────────────────────────────
export function generateWeeklyInsights(stats: WeeklyStats): Insight[] {
  const insights: Insight[] = [];

  if (stats.consistency_score < 50) {
    insights.push(makeInsight('consistency', 'warning', 'Improve Your Consistency',
      `You only logged ${stats.consistency_score}% of days this week. Daily tracking leads to better results.`,
      '📅', 90));
  } else if (stats.consistency_score >= 90) {
    insights.push(makeInsight('consistency', 'success', 'Outstanding Consistency!',
      `You logged ${stats.consistency_score}% of days this week. Keep it up!`,
      '🏆', 70));
  }

  if (stats.goal_completion_rate >= 80) {
    insights.push(makeInsight('calories', 'success', 'Excellent Goal Adherence',
      `You hit your calorie goal ${stats.goal_completion_rate}% of the time this week!`,
      '🎯', 65));
  } else if (stats.goal_completion_rate < 40) {
    insights.push(makeInsight('calories', 'tip', 'Improve Goal Adherence',
      "Try to stay within 10% of your calorie goal each day for best results.",
      '💡', 80));
  }

  if (stats.avg_protein < 80) {
    insights.push(makeInsight('protein', 'warning', 'Weekly Protein Low',
      `Your average protein was ${Math.round(stats.avg_protein)}g/day this week. Aim to increase it.`,
      '💪', 85));
  }

  if (stats.avg_water < 1500) {
    insights.push(makeInsight('hydration', 'warning', 'Chronic Under-Hydration',
      `You averaged only ${Math.round(stats.avg_water)}ml of water per day this week. Aim for at least 2L.`,
      '💧', 88));
  }

  if (stats.streak >= 7) {
    insights.push(makeInsight('streak', 'success', `${stats.streak}-Day Streak! 🔥`,
      "You're on fire! Keep logging daily to maintain your streak.",
      '🔥', 60));
  }

  return insights.sort((a, b) => b.priority - a.priority).slice(0, 4);
}
