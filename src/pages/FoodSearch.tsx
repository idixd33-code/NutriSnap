import { useState } from 'react';
import { Search, Loader2, Plus, Info } from 'lucide-react';
import { useFoodSearch } from '../hooks/useFoodSearch';
import { useMealStore } from '../stores/mealStore';
import { useSearchParams } from 'react-router-dom';
import { FoodItem } from '../types/food';
import { MealType } from '../types/meal';
import { EmptyState, ErrorState, SkeletonCard } from '../components/shared/UXStates';
import { cn } from '../lib/utils';

export default function FoodSearch() {
  const { query, results, loading, error, search, clearSearch } = useFoodSearch();
  const [searchParams] = useSearchParams();
  const initialMealType = searchParams.get('mealType') as MealType | null;

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState<MealType>(initialMealType || 'snack');
  
  const { addMeal, addFoodToMeal, getMealsByDate, selectedDate } = useMealStore();

  const handleAddFood = () => {
    if (!selectedFood) return;

    // Find or create meal for today
    const todaysMeals = getMealsByDate(selectedDate);
    let meal = todaysMeals.find(m => m.type === mealType);
    
    if (!meal) {
      meal = addMeal(mealType, `${mealType} on ${selectedDate}`, '', selectedDate);
    }

    addFoodToMeal(meal.id, {
      food_id: selectedFood.id,
      name: selectedFood.name,
      quantity,
      unit: selectedFood.serving_unit,
      serving_size: selectedFood.serving_size,
      calories: selectedFood.nutrition_per_serving.calories * quantity,
      protein: selectedFood.nutrition_per_serving.protein * quantity,
      carbs: selectedFood.nutrition_per_serving.carbs * quantity,
      fat: selectedFood.nutrition_per_serving.fat * quantity,
    });

    setSelectedFood(null);
    setQuantity(1);
    clearSearch();
  };

  return (
    <div className="flex flex-col h-full gap-4 md:gap-6 animate-fade-in relative">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Food Search</h1>
        <p className="page-subtitle">Search USDA & Open Food Facts database</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="input-base pl-11 py-3 text-base shadow-sm"
          placeholder="Search for any food, brand, or scan barcode..."
          value={query}
          onChange={(e) => search(e.target.value)}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Loader2 className="h-5 w-5 text-emerald-500 animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {error ? (
          <ErrorState message={error} />
        ) : !query && results.length === 0 ? (
          <EmptyState 
            icon={Search} 
            title="Search to add food" 
            message="Type a food name like 'Apple', 'Chicken Breast', or 'Oatmeal' to get started." 
          />
        ) : loading && results.length === 0 ? (
          <div className="flex flex-col gap-3">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((food) => (
              <div 
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="card-hover p-4 flex items-center justify-between group"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm truncate">{food.name}</h4>
                    {food.brand && <span className="text-[10px] bg-surface-100 dark:bg-surface-800 px-2 py-0.5 rounded uppercase font-bold text-muted-foreground">{food.brand}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate flex items-center gap-2">
                    <span>{food.serving_size}{food.serving_unit} serving</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">{food.nutrition_per_serving.calories} kcal</span>
                  </p>
                </div>
                <button className="w-8 h-8 rounded-full bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-muted-foreground group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/30 transition-colors shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Food Modal overlay */}
      {selectedFood && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-card w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl border border-border flex flex-col animate-slide-up overflow-hidden">
            
            <div className="p-6 border-b border-border">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold pr-4">{selectedFood.name}</h2>
                <button onClick={() => setSelectedFood(null)} className="p-2 -mr-2 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 rounded-full">
                  ✕
                </button>
              </div>
              {selectedFood.brand && <p className="text-sm text-muted-foreground mb-4">{selectedFood.brand}</p>}
              
              <div className="flex items-center gap-4 py-3 px-4 bg-surface-50 dark:bg-surface-800/50 rounded-xl">
                <div className="flex-1 text-center">
                  <span className="block text-2xl font-bold text-emerald-500">{Math.round(selectedFood.nutrition_per_serving.calories * quantity)}</span>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Calories</span>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 flex justify-around text-center">
                  <div>
                    <span className="block font-bold">{Math.round(selectedFood.nutrition_per_serving.protein * quantity)}g</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">Pro</span>
                  </div>
                  <div>
                    <span className="block font-bold">{Math.round(selectedFood.nutrition_per_serving.carbs * quantity)}g</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">Carb</span>
                  </div>
                  <div>
                    <span className="block font-bold">{Math.round(selectedFood.nutrition_per_serving.fat * quantity)}g</span>
                    <span className="text-[10px] font-semibold text-muted-foreground">Fat</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-6">
              <div>
                <label className="text-sm font-semibold mb-2 block">Meal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={cn(
                        "py-2.5 rounded-xl text-sm font-semibold capitalize border transition-all",
                        mealType === type 
                          ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                          : "bg-surface-50 border-border text-muted-foreground hover:bg-surface-100"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">Servings ({selectedFood.serving_size}{selectedFood.serving_unit} each)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.5" max="10" step="0.5"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-500"
                  />
                  <div className="w-16 h-10 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center font-bold font-mono">
                    {quantity}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={handleAddFood} className="btn-primary w-full py-3 text-base">
                  Log {Math.round(selectedFood.nutrition_per_serving.calories * quantity)} kcal to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
