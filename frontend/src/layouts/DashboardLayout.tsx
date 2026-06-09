import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LiquidCard } from '../components/ui/LiquidCard';
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
    <div className="min-h-screen relative overflow-hidden flex flex-col md:flex-row bg-[#f8f9fa]">
      {/* Pastel Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#d8b4fe] blur-[120px] opacity-40 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#67e8f9] blur-[120px] opacity-40 rounded-full pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] bg-[#fda4af] blur-[120px] opacity-40 rounded-full pointer-events-none" />

      {/* Sidebar - Docked Panel */}
      <div className="w-full md:w-64 flex-shrink-0 p-4 md:p-6 z-10">
        <LiquidCard className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-black/5 px-4">
            <Leaf className="h-6 w-6 text-indigo-500 mr-2 drop-shadow-sm" />
            <span className="text-xl font-bold text-slate-800 tracking-tight">CarbonLens</span>
          </div>
          
          <div className="p-4 border-b border-black/5 bg-white/10">
            <p className="text-sm font-semibold text-slate-800">{user?.full_name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            <div className="mt-2 text-xs font-semibold text-indigo-700 bg-indigo-100/50 border border-indigo-200 inline-block px-3 py-1 rounded-full shadow-sm">
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
                      ? 'bg-white/60 text-indigo-700 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_6px_rgba(0,0,0,0.02)] border border-white/80'
                      : 'text-slate-600 hover:bg-white/40 hover:text-slate-900 hover:-translate-y-0.5'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/40">
            <button
              onClick={logout}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-rose-600 bg-white/40 border border-white/60 rounded-full hover:bg-white/70 hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] active:scale-95"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </LiquidCard>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10">
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 text-slate-800">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
