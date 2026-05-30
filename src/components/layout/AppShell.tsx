import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <Topbar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 px-4 py-6 md:px-8 md:py-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
