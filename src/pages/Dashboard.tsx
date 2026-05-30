import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWaterStore } from '../stores/waterStore';
import { useGoalStore } from '../stores/goalStore';
import { useDailyProgress } from '../hooks/useDailyProgress';
import { useInsights } from '../hooks/useInsights';
import { useStreak } from '../hooks/useStreak';
import { useMealStore } from '../stores/mealStore';
import { format } from 'date-fns';

import { StatsRow } from '../components/dashboard/StatsRow';
import { MacroRing } from '../components/dashboard/MacroRing';
import { WaterWidget } from '../components/dashboard/WaterWidget';
import { InsightsPanel } from '../components/dashboard/InsightsPanel';
import { Plus, Target, Flame, ChevronRight, Droplets, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import CameraModal from '../components/dashboard/CameraModal';
import { FoodItem } from '../types/food';

export default function Dashboard() {
  const { user } = useAuth();
  const { totalToday, entries: waterEntries, addWater } = useWaterStore();
  const { goals } = useGoalStore();
  const { progress, meals } = useDailyProgress();
  const { dailyInsights } = useInsights();
  const { streak } = useStreak();
  const [showCamera, setShowCamera] = useState(false);
  const { addMeal, addFoodToMeal, getMealsByDate, selectedDate } = useMealStore();

  const handleScanResult = (food: FoodItem) => {
    setShowCamera(false);
    
    // Add to today's lunch by default for quick scanning
    const todaysMeals = getMealsByDate(selectedDate);
    let meal = todaysMeals.find(m => m.type === 'lunch');
    
    if (!meal) {
      meal = addMeal('lunch', `Lunch on ${selectedDate}`, '', selectedDate);
    }

    addFoodToMeal(meal.id, {
      food_id: food.id,
      name: food.name,
      quantity: 1,
      unit: food.serving_unit,
      serving_size: food.serving_size,
      calories: food.nutrition_per_serving.calories,
      protein: food.nutrition_per_serving.protein,
      carbs: food.nutrition_per_serving.carbs,
      fat: food.nutrition_per_serving.fat,
    });
    
    alert(`Successfully added ${food.name} (${food.nutrition_per_serving.calories} kcal) to your meals!`);
  };

  const isToday = selectedDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1">
          <h1 className="page-title">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!</h1>
          <p className="page-subtitle">Here's your nutrition summary for {isToday ? 'today' : format(new Date(selectedDate), 'MMM d, yyyy')}</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setShowCamera(true)}
            className="btn-secondary flex-1 sm:flex-none border border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          >
            <Camera className="w-4 h-4" /> Scan Food
          </button>
          <Link to="/food-search" className="btn-primary flex-1 sm:flex-none">
            <Plus className="w-4 h-4" /> Quick Add
          </Link>
        </div>
      </div>

      <StatsRow progress={progress} streak={streak} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-6">
          <InsightsPanel insights={dailyInsights} />
          
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-title">Today's Meals</h3>
              <Link to="/meals" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All →</Link>
            </div>
            
            {meals.length === 0 ? (
              <div className="text-center py-8 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-dashed">
                <p className="text-sm text-muted-foreground mb-3">No meals logged yet today.</p>
                <Link to="/food-search" className="btn-secondary">Log your first meal</Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {meals.map(meal => (
                  <div key={meal.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <div>
                      <h4 className="font-semibold text-sm capitalize">{meal.type}</h4>
                      <p className="text-xs text-muted-foreground">{meal.foods.length} items • {Math.round(meal.foods.reduce((acc, f) => acc + f.calories, 0))} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <MacroRing protein={progress.protein} carbs={progress.carbs} fat={progress.fat} />
          <WaterWidget progress={progress.water} />
        </div>
      </div>

      {showCamera && (
        <CameraModal 
          onClose={() => setShowCamera(false)} 
          onResult={handleScanResult} 
        />
      )}
    </div>
  );
}
