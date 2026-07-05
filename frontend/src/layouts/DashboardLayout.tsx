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
    { name: 'Simulator', path: '/simulator', icon: Sprout },
  ];

  // Generate avatar initials
  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col md:flex-row">
      <NatureBackground />

      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 p-3 md:p-5 z-10">
        <LiquidCard className="h-full flex flex-col" hover={false}>
          {/* Brand */}
          <div className="flex items-center justify-center h-14 px-5">
            <Leaf className="h-5 w-5 text-[var(--brand)] mr-2" />
            <span className="text-lg font-semibold text-[var(--text)] tracking-tight">CarbonLens</span>
          </div>
          
          {/* User info */}
          <div className="mx-4 p-3 rounded-2xl bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)] truncate">{user?.full_name}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center px-4 py-2.5 text-[13px] font-medium rounded-xl
                    transition-all duration-300 ease-out
                    ${isActive
                      ? 'bg-white/[0.08] text-[var(--text)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-white/[0.04] hover:text-[var(--text)]'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-[18px] w-[18px] ${isActive ? 'text-[var(--brand)]' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Sign out */}
          <div className="p-3">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-2 text-[13px] font-medium text-[var(--text-muted)] rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </LiquidCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
