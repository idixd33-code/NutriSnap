import { Droplets, Plus } from 'lucide-react';
import { MacroProgress } from '../../types/nutrition';
import { formatWater } from '../../lib/utils';
import { useWaterStore } from '../../stores/waterStore';

export function WaterWidget({ progress }: { progress: MacroProgress }) {
  const { addWater } = useWaterStore();

  const handleQuickAdd = (amount: number) => {
    addWater(amount);
  };

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="section-title flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          Hydration
        </h3>
        <span className="text-sm font-medium text-muted-foreground">
          {formatWater(progress.consumed)} / {formatWater(progress.goal)}
        </span>
      </div>

      <div className="w-full h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(progress.percentage, 100)}%` }}
        />
      </div>

      <div className="flex justify-between gap-2 mt-2">
        {[250, 500].map(amount => (
          <button
            key={amount}
            onClick={() => handleQuickAdd(amount)}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm font-medium active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {amount}ml
          </button>
        ))}
      </div>
    </div>
  );
}
