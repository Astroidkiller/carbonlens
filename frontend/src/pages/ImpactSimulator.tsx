import React, { useState, useMemo } from 'react';
import { Sprout, TreePine, Leaf, Bike, Sun, ArrowRight, Activity as ActivityIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiquidCard } from '../components/ui/LiquidCard';

export const ImpactSimulator: React.FC = () => {
  const { user } = useAuth();
  
  const currentScore = user?.current_carbon_score || 0;

  const [trees, setTrees] = useState<number>(0);
  const [veganDays, setVeganDays] = useState<number>(0);
  const [bikeKm, setBikeKm] = useState<number>(0);
  const [solarKwh, setSolarKwh] = useState<number>(0);

  const TREE_COEFFICIENT = 1.75;
  const VEGAN_COEFFICIENT = 8.8;
  const BIKE_COEFFICIENT = 1.04;
  const SOLAR_COEFFICIENT = 0.4;

  const totalSaved = useMemo(() => {
    return (
      (trees * TREE_COEFFICIENT) +
      (veganDays * VEGAN_COEFFICIENT) +
      (bikeKm * BIKE_COEFFICIENT) +
      (solarKwh * SOLAR_COEFFICIENT)
    );
  }, [trees, veganDays, bikeKm, solarKwh]);

  const projectedScore = Math.max(0, currentScore - totalSaved);
  const percentReduction = currentScore > 0 ? (totalSaved / currentScore) * 100 : 0;

  const getSliderStyle = (val: number, max: number, color: string) => ({
    background: `linear-gradient(to right, ${color} ${(val / max) * 100}%, rgba(255,255,255,0.05) ${(val / max) * 100}%)`
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 relative z-10">
      <div className="flex items-center space-x-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)]">
          <Sprout className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Impact Simulator</h1>
          <p className="text-[15px] text-[var(--text-muted)] mt-1 tracking-tight">Discover how lifestyle changes can shrink your footprint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Current Score */}
        <LiquidCard className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">Current Emissions</p>
          <div className="text-4xl font-semibold text-[var(--text)] tracking-tight">
            {currentScore.toFixed(1)} <span className="text-[16px] font-medium text-[var(--text-muted)]">kg CO₂</span>
          </div>
        </LiquidCard>

        {/* Projection Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-white/[0.05] flex items-center justify-center bg-white/[0.02]">
            <ArrowRight className="h-5 w-5 text-[var(--text-muted)] opacity-50" />
          </div>
        </div>

        {/* Projected Score */}
        <LiquidCard className={`p-8 flex flex-col items-center justify-center text-center transition-all duration-700 ${totalSaved > 0 ? 'bg-gradient-to-br from-[var(--surface)] to-emerald-900/20 border-emerald-500/20' : ''}`}>
          <p className="text-[12px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center">
            {totalSaved > 0 && <Sprout className="h-3.5 w-3.5 text-emerald-400 mr-2" />}
            Projected Impact
          </p>
          <div className={`text-4xl font-semibold tracking-tight transition-all duration-700 ${totalSaved > 0 ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'text-[var(--text)]'}`}>
            {projectedScore.toFixed(1)} <span className="text-[16px] font-medium text-[var(--text-muted)]">kg CO₂</span>
          </div>
          {totalSaved > 0 && (
            <p className="mt-4 text-[12px] font-bold text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-fade-in uppercase tracking-wider">
              -{percentReduction.toFixed(1)}% Reduction
            </p>
          )}
        </LiquidCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Trees */}
        <LiquidCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                <TreePine className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] tracking-tight">Plant Trees</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">Absorbs ~1.75 kg/mo each</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--text)] tracking-tight bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05] min-w-[3rem] text-center">{trees}</div>
          </div>
          <div className="pt-2 relative">
            <input 
              type="range" 
              min="0" max="100" 
              value={trees} 
              onChange={(e) => setTrees(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.5)]"
              style={getSliderStyle(trees, 100, '#34d399')}
            />
          </div>
        </LiquidCard>

        {/* Diet */}
        <LiquidCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] tracking-tight">Plant-Based Diet</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">Saves ~8.8 kg/mo per weekly day</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--text)] tracking-tight bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05] min-w-[3rem] text-center">{veganDays}</div>
          </div>
          <div className="pt-2 relative">
            <input 
              type="range" 
              min="0" max="7" 
              value={veganDays} 
              onChange={(e) => setVeganDays(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={getSliderStyle(veganDays, 7, '#fb7185')}
            />
          </div>
        </LiquidCard>

        {/* Commute */}
        <LiquidCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Bike className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] tracking-tight">Bike Commute</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">Saves ~1.04 kg/mo per km</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--text)] tracking-tight bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05] min-w-[3rem] text-center">{bikeKm}</div>
          </div>
          <div className="pt-2 relative">
            <input 
              type="range" 
              min="0" max="100" 
              step="5"
              value={bikeKm} 
              onChange={(e) => setBikeKm(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(96,165,250,0.5)]"
              style={getSliderStyle(bikeKm, 100, '#60a5fa')}
            />
          </div>
        </LiquidCard>

        {/* Solar */}
        <LiquidCard className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text)] tracking-tight">Solar Energy</h3>
                <p className="text-[12px] text-[var(--text-muted)] mt-1">Saves ~0.4 kg/mo per kWh</p>
              </div>
            </div>
            <div className="text-2xl font-semibold text-[var(--text)] tracking-tight bg-white/[0.03] px-3 py-1 rounded-lg border border-white/[0.05] min-w-[3rem] text-center">{solarKwh}</div>
          </div>
          <div className="pt-2 relative">
            <input 
              type="range" 
              min="0" max="500" 
              step="10"
              value={solarKwh} 
              onChange={(e) => setSolarKwh(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(251,191,36,0.5)]"
              style={getSliderStyle(solarKwh, 500, '#fbbf24')}
            />
          </div>
        </LiquidCard>
      </div>

      {totalSaved > 0 && (
        <LiquidCard className="p-8 mt-4 bg-gradient-to-r from-emerald-500/10 to-[var(--brand)]/10 border-emerald-500/20 text-center animate-slide-up">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <ActivityIcon className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-semibold text-[var(--text)] tracking-tight mb-3">Amazing Potential!</h2>
          <p className="text-[15px] text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            By committing to these changes, you would prevent <strong className="text-[var(--text)] font-semibold">{totalSaved.toFixed(1)} kg</strong> of CO₂ from entering the atmosphere every month. 
            That's equivalent to the carbon absorbed by <strong className="text-emerald-400 font-semibold">{Math.ceil(totalSaved / 1.75)} mature trees</strong>!
          </p>
        </LiquidCard>
      )}

    </div>
  );
};
