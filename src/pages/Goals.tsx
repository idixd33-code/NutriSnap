import { useGoalStore } from '../stores/goalStore';
import { Target, Activity, Settings2 } from 'lucide-react';
import { calcCalories } from '../lib/utils';
import { GOAL_PRESETS, GoalType } from '../types/user';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function Goals() {
  const { goals, setGoals } = useGoalStore();
  const [activePreset, setActivePreset] = useState<GoalType>('maintenance');

  const handleSliderChange = (macro: 'protein'|'carbs'|'fat'|'water', value: number) => {
    setActivePreset('custom');
    const newGoals = { ...goals, [macro]: value };
    if (macro !== 'water') {
      newGoals.calories = calcCalories(newGoals.protein, newGoals.carbs, newGoals.fat);
    }
    setGoals(newGoals);
  };

  const applyPreset = (type: GoalType) => {
    setActivePreset(type);
    if (type === 'custom') return;
    
    const preset = GOAL_PRESETS[type];
    const targetCalories = goals.calories; // keep current calories, just adjust ratios
    
    const protein = Math.round((targetCalories * preset.macroRatio.protein) / 4);
    const carbs = Math.round((targetCalories * preset.macroRatio.carbs) / 4);
    const fat = Math.round((targetCalories * preset.macroRatio.fat) / 9);

    setGoals({ ...goals, protein, carbs, fat, calories: targetCalories });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="page-title">Nutrition Goals</h1>
        <p className="page-subtitle">Configure your daily targets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Col - Presets */}
        <div className="flex flex-col gap-4">
          <h3 className="section-title flex items-center gap-2"><Target className="w-5 h-5" /> Goal Presets</h3>
          <div className="flex flex-col gap-3">
            {(Object.entries(GOAL_PRESETS) as [GoalType, typeof GOAL_PRESETS[GoalType]][]).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-200",
                  activePreset === key 
                    ? "bg-emerald-50 border-emerald-500 shadow-glow-sm dark:bg-emerald-900/20" 
                    : "bg-card border-border hover:border-emerald-500/50"
                )}
              >
                <h4 className={cn("font-bold text-sm mb-1", activePreset === key ? "text-emerald-700 dark:text-emerald-400" : "")}>{preset.label}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Col - Sliders */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="card p-6 border-emerald-500/30 shadow-glow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24 text-emerald-500" />
            </div>
            <h3 className="section-title mb-1 relative z-10">Daily Targets</h3>
            <p className="text-sm text-muted-foreground mb-6 relative z-10">Your targets update automatically based on your macros.</p>
            
            <div className="flex items-end gap-4 mb-8 relative z-10">
              <div className="flex flex-col">
                <span className="text-4xl font-black gradient-text tracking-tight">{Math.round(goals.calories)}</span>
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mt-1">Calories</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 relative z-10">
              <MacroSlider label="Protein" value={goals.protein} color="bg-emerald-500" max={400} unit="g" onChange={(v: number) => handleSliderChange('protein', v)} />
              <MacroSlider label="Carbs" value={goals.carbs} color="bg-blue-500" max={600} unit="g" onChange={(v: number) => handleSliderChange('carbs', v)} />
              <MacroSlider label="Fat" value={goals.fat} color="bg-amber-500" max={200} unit="g" onChange={(v: number) => handleSliderChange('fat', v)} />
              
              <div className="h-px bg-border my-2" />
              
              <MacroSlider label="Water Target" value={goals.water} color="bg-cyan-500" max={5000} step={100} unit="ml" onChange={(v: number) => handleSliderChange('water', v)} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MacroSlider({ label, value, color, max, min = 0, step = 1, unit, onChange }: any) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold">{label}</label>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-16 px-2 py-1 bg-surface-100 dark:bg-surface-800 rounded border border-transparent focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-right font-mono text-sm"
          />
          <span className="text-xs font-semibold text-muted-foreground uppercase">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("w-full h-2 rounded-full appearance-none bg-surface-200 dark:bg-surface-800 outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full", 
          // custom color logic for thumb based on color prop
          color === 'bg-emerald-500' ? '[&::-webkit-slider-thumb]:bg-emerald-500' : 
          color === 'bg-blue-500' ? '[&::-webkit-slider-thumb]:bg-blue-500' : 
          color === 'bg-amber-500' ? '[&::-webkit-slider-thumb]:bg-amber-500' : 
          '[&::-webkit-slider-thumb]:bg-cyan-500'
        )}
        style={{
          background: `linear-gradient(to right, var(--tw-gradient-stops))`,
        }}
      />
    </div>
  );
}
