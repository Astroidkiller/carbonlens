import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, List, PlusCircle, Lightbulb, LogOut, Leaf, Bot } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Activities', path: '/activities', icon: List },
    { name: 'Log Activity', path: '/add-activity', icon: PlusCircle },
    { name: 'AI Diary', path: '/diary', icon: Bot },
    { name: 'AI Insights', path: '/insights', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col md:flex-row">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-500/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />

      {/* Sidebar - Docked Panel */}
      <div className="w-full md:w-64 flex-shrink-0 p-4 md:p-6 z-10">
        <GlassCard className="h-full flex flex-col border border-white/20">
          <div className="flex items-center justify-center h-16 border-b border-white/10 px-4">
            <Leaf className="h-6 w-6 text-emerald-400 mr-2 drop-shadow-md" />
            <span className="text-xl font-bold text-white drop-shadow-md">CarbonLens</span>
          </div>
          
          <div className="p-4 border-b border-white/10 bg-white/5">
            <p className="text-sm font-medium text-white">{user?.full_name}</p>
            <p className="text-xs text-slate-300 truncate">{user?.email}</p>
            <div className="mt-2 text-xs font-semibold text-emerald-200 bg-emerald-500/20 border border-emerald-500/30 inline-block px-2 py-1 rounded">
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
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white shadow-inner border border-white/10'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-400 rounded-md hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-red-400" />
              Sign out
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
