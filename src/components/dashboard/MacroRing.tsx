import { MacroProgress } from '../../types/nutrition';
import { getMacroColor } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function MacroRing({ protein, carbs, fat, size = 200 }: { protein: MacroProgress, carbs: MacroProgress, fat: MacroProgress, size?: number }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate segments
  const totalMacros = (protein.consumed || 0) + (carbs.consumed || 0) + (fat.consumed || 0);
  
  const getOffset = (prevTotal: number) => {
    return circumference - (prevTotal / Math.max(totalMacros, 1)) * circumference;
  };

  const pPct = totalMacros ? (protein.consumed / totalMacros) * 100 : 0;
  const cPct = totalMacros ? (carbs.consumed / totalMacros) * 100 : 0;
  const fPct = totalMacros ? (fat.consumed / totalMacros) * 100 : 0;

  return (
    <div className="card p-5 flex flex-col items-center justify-center gap-6">
      <h3 className="section-title w-full text-left">Macros</h3>
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Ring */}
        <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="currentColor" strokeWidth={strokeWidth}
            className="text-surface-100 dark:text-surface-800"
          />
          {totalMacros > 0 && (
            <>
              {/* Fat */}
              <circle
                cx={center} cy={center} r={radius}
                fill="none" stroke={getMacroColor('fat')} strokeWidth={strokeWidth}
                strokeDasharray={`${(fPct / 100) * circumference} ${circumference}`}
                strokeDashoffset={0}
                className="transition-all duration-1000 ease-out"
              />
              {/* Carbs */}
              <circle
                cx={center} cy={center} r={radius}
                fill="none" stroke={getMacroColor('carbs')} strokeWidth={strokeWidth}
                strokeDasharray={`${(cPct / 100) * circumference} ${circumference}`}
                strokeDashoffset={-((fPct / 100) * circumference)}
                className="transition-all duration-1000 ease-out"
              />
              {/* Protein */}
              <circle
                cx={center} cy={center} r={radius}
                fill="none" stroke={getMacroColor('protein')} strokeWidth={strokeWidth}
                strokeDasharray={`${(pPct / 100) * circumference} ${circumference}`}
                strokeDashoffset={-(((fPct + cPct) / 100) * circumference)}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </>
          )}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold">{Math.round(totalMacros)}g</span>
          <span className="text-xs text-muted-foreground mt-1">Total Macros</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex justify-between gap-2">
        <MacroLegend label="Protein" progress={protein} type="protein" />
        <MacroLegend label="Carbs" progress={carbs} type="carbs" />
        <MacroLegend label="Fat" progress={fat} type="fat" />
      </div>
    </div>
  );
}

function MacroLegend({ label, progress, type }: { label: string, progress: MacroProgress, type: 'protein'|'carbs'|'fat' }) {
  const colorMap = {
    protein: 'bg-[#10b981]',
    carbs:   'bg-[#3b82f6]',
    fat:     'bg-[#f59e0b]'
  };

  return (
    <div className="flex flex-col items-center p-2 rounded-xl bg-surface-50 dark:bg-surface-800/50 flex-1">
      <div className="flex items-center gap-1.5 mb-1">
        <div className={cn("w-2 h-2 rounded-full", colorMap[type])} />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-bold">{progress.consumed}g</span>
      <span className="text-[10px] text-muted-foreground">/ {progress.goal}g</span>
    </div>
  );
}
