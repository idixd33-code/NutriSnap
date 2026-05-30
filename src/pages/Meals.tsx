import { Plus } from 'lucide-react';
import { useDailyProgress } from '../hooks/useDailyProgress';
import { useMealStore } from '../stores/mealStore';
import { MealType, MEAL_TYPE_CONFIG } from '../types/meal';
import { Link } from 'react-router-dom';

export default function Meals() {
  const { meals } = useDailyProgress();
  const selectedDate = useMealStore(s => s.selectedDate);

  const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Meals</h1>
          <p className="page-subtitle">Manage your food intake for the day</p>
        </div>
        <Link to="/food-search" className="btn-primary md:hidden">
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {mealTypes.map(type => {
          const typeMeals = meals.filter(m => m.type === type);
          const config = MEAL_TYPE_CONFIG[type];
          
          return (
            <div key={type} className="card overflow-hidden flex flex-col h-full">
              <div className="p-4 bg-surface-50 dark:bg-surface-900/50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{config.emoji}</span>
                  <div>
                    <h3 className="font-bold text-base capitalize">{config.label}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{config.time}</p>
                  </div>
                </div>
                <Link to={`/food-search?mealType=${type}`} className="btn-ghost !px-3 !py-1.5 text-emerald-600 dark:text-emerald-400">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Add Food</span>
                </Link>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-3">
                {typeMeals.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Nothing logged yet</p>
                  </div>
                ) : (
                  typeMeals.map(meal => (
                    <div key={meal.id} className="flex flex-col gap-2">
                      {meal.foods.map(food => (
                        <div key={food.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 dark:bg-surface-800/30 group hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-semibold text-sm truncate">{food.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {food.quantity} {food.unit} • {food.serving_size}g each
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-sm block">{Math.round(food.calories)} kcal</span>
                            <span className="text-[10px] text-muted-foreground font-medium flex gap-1.5">
                              <span className="text-[#10b981]">{Math.round(food.protein)}p</span>
                              <span className="text-[#3b82f6]">{Math.round(food.carbs)}c</span>
                              <span className="text-[#f59e0b]">{Math.round(food.fat)}f</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
