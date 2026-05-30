import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUpdateGoals } from '../hooks/useGoalsQuery';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, Target, Droplets, User, Check, Loader as Loader2 } from 'lucide-react';
import { ACTIVITY_LEVELS, ActivityLevel, GoalType, GOAL_PRESETS } from '../types/user';
import { calcCalories } from '../lib/utils';
import { cn } from '../lib/utils';

const STEPS = ['profile', 'goals', 'activity', 'complete'] as const;
type Step = typeof STEPS[number];

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const updateGoals = useUpdateGoals();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('profile');
  const [loading, setLoading] = useState(false);

  // Form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderately_active');
  const [goalType, setGoalType] = useState<GoalType>('maintenance');
  const [calorieTarget, setCalorieTarget] = useState(2000);

  const currentStepIndex = STEPS.indexOf(step);
  const canGoBack = currentStepIndex > 0;
  const canGoNext = currentStepIndex < STEPS.length - 1;

  const handleNext = async () => {
    if (step === 'profile') {
      // Save profile
      setLoading(true);
      try {
        await supabase.from('profiles').update({
          full_name: fullName,
          weight_kg: weight ? parseFloat(weight) : null,
          height_cm: height ? parseFloat(height) : null,
        }).eq('id', user?.id);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
      setStep('goals');
    } else if (step === 'goals') {
      setStep('activity');
    } else if (step === 'activity') {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setStep(STEPS[currentStepIndex - 1]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Calculate macros based on goal type
      const preset = GOAL_PRESETS[goalType];
      const protein = Math.round((calorieTarget * preset.macroRatio.protein) / 4);
      const carbs = Math.round((calorieTarget * preset.macroRatio.carbs) / 4);
      const fat = Math.round((calorieTarget * preset.macroRatio.fat) / 9);
      const water = 2500;

      // Save goals
      await updateGoals.mutateAsync({
        calories: calorieTarget,
        protein,
        carbs,
        fat,
        water,
      });

      // Save activity level and mark onboarding complete
      await supabase.from('profiles').update({
        activity_level: activityLevel,
        onboarding_complete: true,
      }).eq('id', user?.id);

      // Refresh profile
      await refreshProfile();

      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface-200 dark:bg-surface-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-brand-500 transition-all duration-500"
          style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pt-12">
        <div className="w-full max-w-lg">
          {/* Step indicator */}
          <div className="flex justify-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i <= currentStepIndex ? "bg-emerald-500" : "bg-surface-300 dark:bg-surface-700"
                )}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="glass-card p-8 animate-fade-in">
            {step === 'profile' && (
              <ProfileStep
                fullName={fullName}
                setFullName={setFullName}
                weight={weight}
                setWeight={setWeight}
                height={height}
                setHeight={setHeight}
              />
            )}

            {step === 'goals' && (
              <GoalsStep
                goalType={goalType}
                setGoalType={setGoalType}
                calorieTarget={calorieTarget}
                setCalorieTarget={setCalorieTarget}
              />
            )}

            {step === 'activity' && (
              <ActivityStep
                activityLevel={activityLevel}
                setActivityLevel={setActivityLevel}
              />
            )}

            {step === 'complete' && (
              <CompleteStep />
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4 mt-8">
              <button
                onClick={handleBack}
                disabled={!canGoBack}
                className={cn(
                  "btn-secondary",
                  !canGoBack && "opacity-0 pointer-events-none"
                )}
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={handleNext}
                disabled={loading}
                className="btn-primary flex-1 max-w-[200px] ml-auto"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : step === 'activity' ? (
                  <>
                    Complete Setup <Check className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step Components ────────────────────────────────────────────────────────────────

function ProfileStep({ fullName, setFullName, weight, setWeight, height, setHeight }: {
  fullName: string;
  setFullName: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
  height: string;
  setHeight: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
          <User className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold">Let's set up your profile</h2>
        <p className="text-sm text-muted-foreground text-center">This helps us personalize your experience</p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-base"
            placeholder="Enter your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Weight (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-base"
              placeholder="70"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Height (cm)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-base"
              placeholder="175"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalsStep({ goalType, setGoalType, calorieTarget, setCalorieTarget }: {
  goalType: GoalType;
  setGoalType: (v: GoalType) => void;
  calorieTarget: number;
  setCalorieTarget: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold">What's your goal?</h2>
        <p className="text-sm text-muted-foreground text-center">We'll adjust your macro targets accordingly</p>
      </div>

      <div className="flex flex-col gap-3">
        {(Object.entries(GOAL_PRESETS) as [GoalType, typeof GOAL_PRESETS[GoalType]][]).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => setGoalType(key)}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              goalType === key
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 border-2"
                : "bg-surface-50 dark:bg-surface-800 border-border hover:border-emerald-500/50"
            )}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className={cn("font-bold text-sm mb-1", goalType === key && "text-emerald-700 dark:text-emerald-400")}>
                  {preset.label}
                </h4>
                <p className="text-xs text-muted-foreground">{preset.description}</p>
              </div>
              {goalType === key && <Check className="w-5 h-5 text-emerald-500" />}
            </div>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Daily Calorie Target</label>
        <input
          type="range"
          min={1200}
          max={4000}
          step={50}
          value={calorieTarget}
          onChange={(e) => setCalorieTarget(parseInt(e.target.value))}
          className="w-full accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>1200</span>
          <span className="text-lg font-bold text-foreground">{calorieTarget} kcal</span>
          <span>4000</span>
        </div>
      </div>
    </div>
  );
}

function ActivityStep({ activityLevel, setActivityLevel }: {
  activityLevel: ActivityLevel;
  setActivityLevel: (v: ActivityLevel) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3 mb-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <span className="text-3xl">🏃</span>
        </div>
        <h2 className="text-2xl font-bold">How active are you?</h2>
        <p className="text-sm text-muted-foreground text-center">This helps fine-tune your calorie targets</p>
      </div>

      <div className="flex flex-col gap-3">
        {(Object.entries(ACTIVITY_LEVELS) as [ActivityLevel, typeof ACTIVITY_LEVELS[ActivityLevel]][]).map(([key, level]) => (
          <button
            key={key}
            onClick={() => setActivityLevel(key)}
            className={cn(
              "p-4 rounded-xl border text-left transition-all",
              activityLevel === key
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 border-2"
                : "bg-surface-50 dark:bg-surface-800 border-border hover:border-emerald-500/50"
            )}
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className={cn("font-bold text-sm mb-1", activityLevel === key && "text-emerald-700 dark:text-emerald-400")}>
                  {level.label}
                </h4>
                <p className="text-xs text-muted-foreground">{level.description}</p>
              </div>
              {activityLevel === key && <Check className="w-5 h-5 text-emerald-500" />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-brand-500 flex items-center justify-center animate-bounce-soft">
        <Check className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
        <p className="text-muted-foreground">Your personalized nutrition plan is ready. Let's start tracking!</p>
      </div>
    </div>
  );
}
