import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <span className="font-bold text-xl tracking-tight gradient-text">NutriSnap</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors hidden sm:block">Log in</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-12 md:mt-24 mb-32">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          NutriSnap 2.0 is live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-balance leading-tight mb-6 animate-slide-up">
          Track your nutrition with <span className="gradient-text">beautiful simplicity.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance animate-slide-up" style={{ animationDelay: '100ms' }}>
          Stop guessing and start measuring. NutriSnap gives you the premium tools you need to hit your macro goals, track hydration, and build lasting habits.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Link to="/register" className="btn-primary px-8 py-4 text-base h-auto w-full sm:w-auto">
            Start tracking for free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <p className="text-sm text-muted-foreground">No credit card required.</p>
        </div>

        {/* Features list */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 text-left w-full animate-slide-up" style={{ animationDelay: '300ms' }}>
          <Feature title="Smart Macros" desc="Real-time macro breakdown with dynamic charts." />
          <Feature title="Vast Database" desc="Powered by USDA & Open Food Facts." />
          <Feature title="AI Insights" desc="Rules-based recommendations to keep you on track." />
        </div>
      </main>
    </div>
  );
}

function Feature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-3 p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-900/30 border">
      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
