import { cn } from '../../lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("card p-4 flex flex-col gap-3", className)}>
      <div className="w-1/3 h-5 bg-surface-200 dark:bg-surface-800 rounded-md shimmer" />
      <div className="w-full h-20 bg-surface-100 dark:bg-surface-800 rounded-xl shimmer" />
      <div className="flex gap-2">
        <div className="w-16 h-6 bg-surface-100 dark:bg-surface-800 rounded-full shimmer" />
        <div className="w-16 h-6 bg-surface-100 dark:bg-surface-800 rounded-full shimmer" />
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex items-center justify-center p-4">
      <div className={cn(
        "border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin",
        sizeMap[size]
      )} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, actionText, onAction }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-50/50 dark:bg-surface-900/50 rounded-2xl border border-dashed border-border w-full">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{message}</p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: any) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/50">
      <div className="text-4xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">{title}</h3>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-red-600 dark:text-red-400">
          Try Again
        </button>
      )}
    </div>
  );
}
