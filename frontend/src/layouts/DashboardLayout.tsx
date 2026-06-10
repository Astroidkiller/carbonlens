import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LiquidCard } from '../components/ui/LiquidCard';
import { NatureBackground } from '../components/layout/NatureBackground';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, PlusCircle, Lightbulb, LogOut, Leaf, Bot, Sprout } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Activities', path: '/activities', icon: List },
    { name: 'Log Activity', path: '/add-activity', icon: PlusCircle },
    { name: 'AI Diary', path: '/diary', icon: Bot },
    { name: 'AI Insights', path: '/insights', icon: Lightbulb },
    { name: 'Impact Simulator', path: '/simulator', icon: Sprout },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col md:flex-row">
      {/* Dynamic Background Noise is applied via body::before in index.css */}
      <NatureBackground />

      {/* Sidebar - Docked Panel */}
      <div className="w-full md:w-64 flex-shrink-0 p-4 md:p-6 z-10">
        <LiquidCard className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-[var(--border)] px-4">
            <Leaf className="h-6 w-6 text-[var(--brand)] mr-2 drop-shadow-sm" />
            <span className="text-xl font-bold text-[var(--text)] tracking-tight">CarbonLens</span>
          </div>
          
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-strong)]">
            <p className="text-sm font-semibold text-[var(--text)]">{user?.full_name}</p>
            <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
            <div className="mt-2 text-xs font-semibold text-[var(--text)] bg-[var(--border-light)] border border-[var(--border)] inline-block px-3 py-1 rounded-full shadow-sm">
              Score: {user?.current_carbon_score || 0}
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isActive
                      ? 'bg-[var(--border-light)] text-[var(--text)] border border-[var(--border)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-[var(--border)] hover:text-[var(--text)] hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-[var(--brand)]' : 'text-[var(--text-muted)]'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-[var(--border)]">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-rose-500 bg-[var(--surface-strong)] border border-[var(--border)] rounded-full hover:bg-[var(--border)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </LiquidCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 text-[var(--text)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
