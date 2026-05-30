import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

import AppShell      from '../components/layout/AppShell';
import Landing       from '../pages/Landing';
import Login         from '../pages/Login';
import Register      from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import Onboarding    from '../pages/Onboarding';
import Dashboard     from '../pages/Dashboard';
import Meals         from '../pages/Meals';
import FoodSearch    from '../pages/FoodSearch';
import FoodLibrary   from '../pages/FoodLibrary';
import Goals         from '../pages/Goals';
import Analytics     from '../pages/Analytics';
import WaterTracking from '../pages/WaterTracking';
import Settings      from '../pages/Settings';
import Profile       from '../pages/Profile';
import About         from '../pages/About';

const LOADING_TIMEOUT = 10000;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLoadingError, setShowLoadingError] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoadingError(true);
      }
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center animate-bounce-soft">
          <span className="text-xl">🥗</span>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading NutriSnap…</p>
        {showLoadingError && (
          <p className="text-xs text-red-500 mt-4">Taking longer than expected. Please try <button onClick={() => window.location.reload()} className="underline hover:no-underline">refreshing</button>.</p>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user && !user.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const [showLoadingError, setShowLoadingError] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowLoadingError(true);
      }
    }, LOADING_TIMEOUT);

    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-2xl gradient-brand flex items-center justify-center animate-bounce-soft">
          <span className="text-xl">🥗</span>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
        {showLoadingError && (
          <p className="text-xs text-red-500 mt-4">Taking longer than expected. Please try <button onClick={() => window.location.reload()} className="underline hover:no-underline">refreshing</button>.</p>
        )}
      </div>
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.onboarding_complete) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRouter() {
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"               element={<Landing />} />
        <Route path="/login"          element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"       element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/onboarding"     element={<OnboardingRoute><Onboarding /></OnboardingRoute>} />

        {/* Protected — wrapped in AppShell */}
        <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="dashboard"     element={<Dashboard />} />
          <Route path="meals"         element={<Meals />} />
          <Route path="food-search"   element={<FoodSearch />} />
          <Route path="food-library"  element={<FoodLibrary />} />
          <Route path="goals"         element={<Goals />} />
          <Route path="analytics"     element={<Analytics />} />
          <Route path="water"         element={<WaterTracking />} />
          <Route path="settings"      element={<Settings />} />
          <Route path="profile"       element={<Profile />} />
          <Route path="about"         element={<About />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
