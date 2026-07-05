
import { LiquidCard } from '../components/ui/LiquidCard';
import { Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05]">
          <SettingsIcon className="h-6 w-6 text-[var(--text-muted)]" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Settings</h1>
          <p className="text-[15px] text-[var(--text-muted)] mt-1 tracking-tight">Manage your account preferences</p>
        </div>
      </div>
      
      <LiquidCard className="p-12 flex flex-col items-center justify-center text-center border-dashed">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-4 border border-white/[0.03]">
          <SettingsIcon className="h-8 w-8 text-[var(--text-muted)] opacity-50" />
        </div>
        <p className="text-[15px] font-medium text-[var(--text-muted)]">Settings panel coming soon.</p>
      </LiquidCard>
    </div>
  );
}
