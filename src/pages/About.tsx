import { ExternalLink, Mail, Code as Code2, Zap, Heart, Shield, Cpu, Globe, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const TECH_STACK = [
  { name: 'React 18', desc: 'UI Framework', color: 'text-cyan-400' },
  { name: 'TypeScript', desc: 'Type Safety', color: 'text-blue-400' },
  { name: 'Vite', desc: 'Build Tool', color: 'text-purple-400' },
  { name: 'Tailwind CSS', desc: 'Styling', color: 'text-teal-400' },
  { name: 'Zustand', desc: 'State Management', color: 'text-orange-400' },
  { name: 'Supabase', desc: 'Backend & Auth', color: 'text-emerald-400' },
  { name: 'Gemini AI', desc: 'Food Vision AI', color: 'text-rose-400' },
  { name: 'Recharts', desc: 'Analytics Charts', color: 'text-yellow-400' },
];

export default function About() {
  return (
    <div className="flex flex-col gap-10 animate-fade-in max-w-4xl mx-auto py-4">

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-8 md:p-12 text-center shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
        {/* Background Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* App Icon */}
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/40 dark:border-white/20">
            <img src="/favicon.png" alt="NutriSnap" className="w-full h-full object-cover" />
          </div>

          {/* App Name - Deep Liquid Glass Text */}
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 30%, #047857 60%, #065f46 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 8px rgba(16,185,129,0.4))',
                textShadow: 'none',
              }}
            >
              NutriSnap
            </h1>
            <p className="text-lg font-semibold text-foreground/80 mt-2 tracking-wide">
              Smart AI-Powered Nutrition Tracker
            </p>
          </div>

          {/* Version Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Version 2.0 — 2026</span>
          </div>
        </div>
      </div>

      {/* Built With Bolt.new Banner */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-6 md:p-8 flex items-center justify-between gap-4 shadow-[0_8px_32px_rgba(99,102,241,0.15)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.25)] transition-all duration-500 hover:-translate-y-1"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5 group-hover:from-violet-500/10 group-hover:to-blue-500/10 transition-all duration-500 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-1">Proudly Built With</p>
            <h2
              className="text-2xl md:text-3xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 1px 4px rgba(139,92,246,0.5))',
              }}
            >
              Bolt.new ⚡
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered full-stack development platform — <span className="font-semibold text-violet-500">bolt.new</span>
            </p>
          </div>
        </div>
        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-violet-500 transition-colors shrink-0" />
      </a>

      {/* Tech Stack */}
      <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-6 md:p-8 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-black">Technology Stack</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TECH_STACK.map((tech) => (
            <div key={tech.name} className="p-4 rounded-2xl bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-xl">
              <span className={`text-sm font-black ${tech.color}`}>{tech.name}</span>
              <p className="text-xs text-muted-foreground mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Contact Card */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/40 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-6 md:p-10 shadow-[0_8px_32px_rgba(16,185,129,0.1)]">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          {/* Developer Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Developer Note</p>
              <h2 className="text-xl font-black">A Message from the Developer</h2>
            </div>
          </div>

          {/* Message to Bolt team - Deep Liquid Glass Typography */}
          <div className="rounded-2xl bg-white/10 dark:bg-white/5 border border-white/30 dark:border-white/10 p-6 mb-6">
            <p
              className="text-xl md:text-2xl font-black leading-relaxed"
              style={{
                background: 'linear-gradient(135deg, #065f46 0%, #047857 30%, #059669 60%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 1px 6px rgba(16,185,129,0.3))',
              }}
            >
              "Hello — I'm the developer. I built this entire app with Bolt.new and I'd love to join your team. I'm passionate about building real, production-grade products fast. Let's connect!"
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:88mustfa44@gmail.com"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all hover:shadow-[0_4px_20px_rgba(16,185,129,0.4)] active:scale-[0.98]"
            >
              <Mail className="w-5 h-5" />
              88mustfa44@gmail.com
            </a>
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold hover:bg-violet-500/20 transition-all"
            >
              <Zap className="w-5 h-5" />
              Bolt.new Team
            </a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Cpu, title: 'AI-Powered', desc: 'Gemini 1.5 Flash recognizes food from photos in seconds', color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { icon: Shield, title: 'Privacy First', desc: 'Your data is protected with Supabase Row Level Security', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: Globe, title: 'Vast Food DB', desc: '1M+ foods via USDA & Open Food Facts databases', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((f) => (
          <div key={f.title} className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-6 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
            <div className={`w-10 h-10 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
              <f.icon className={`w-5 h-5 ${f.color}`} />
            </div>
            <h3 className="font-black text-base mb-2">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Legal / Copyright */}
      <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-[40px] p-6 md:p-8 shadow-[0_8px_32px_rgba(31,38,135,0.05)]">
        <h2 className="text-lg font-black mb-5 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Legal & Rights
        </h2>
        <div className="flex flex-col gap-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            <span className="font-bold text-foreground">© 2026 NutriSnap.</span> All rights reserved. Unauthorized reproduction or distribution of any part of this application is prohibited.
          </p>
          <p>
            <span className="font-bold text-foreground">Built with Bolt.new:</span> This application was entirely designed and developed using{' '}
            <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="text-violet-500 font-bold hover:underline">
              Bolt.new ↗
            </a>
            , StackBlitz's AI-powered full-stack development platform.
          </p>
          <p>
            <span className="font-bold text-foreground">Food Data:</span> Nutrition data is sourced from the USDA FoodData Central and Open Food Facts, both free and open databases.
          </p>
          <p>
            <span className="font-bold text-foreground">AI Vision:</span> Food recognition is powered by Google Gemini 1.5 Flash. AI estimates may not be 100% accurate — always consult a nutritionist for medical advice.
          </p>
          <p>
            <span className="font-bold text-foreground">Authentication:</span> User accounts and data storage are managed via Supabase, a secure open-source backend platform compliant with GDPR and SOC 2 standards.
          </p>
          <p>
            <span className="font-bold text-foreground">Disclaimer:</span> NutriSnap is intended for general wellness and informational purposes only. It is not a substitute for professional medical, dietary, or nutritional advice.
          </p>
        </div>
      </div>

      {/* Back link */}
      <div className="text-center pb-4">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-500 font-semibold transition-colors">
          ← Back to Dashboard
        </Link>
      </div>

    </div>
  );
}
