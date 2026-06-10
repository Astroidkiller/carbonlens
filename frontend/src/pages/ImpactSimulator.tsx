import React, { useState, useMemo } from 'react';
import { Sprout, TreePine, Leaf, Bike, Sun, ArrowRight, Activity as ActivityIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LiquidCard } from '../components/ui/LiquidCard';

export const ImpactSimulator: React.FC = () => {
  const { user } = useAuth();
  
  // Current score is from Auth Context
  const currentScore = user?.current_carbon_score || 0;

  // Simulator States
  const [trees, setTrees] = useState<number>(0);
  const [veganDays, setVeganDays] = useState<number>(0);
  const [bikeKm, setBikeKm] = useState<number>(0);
  const [solarKwh, setSolarKwh] = useState<number>(0);

  // Constants (kg CO2 saved per unit)
  // Trees: ~21 kg/year -> 1.75 kg/month per tree
  const TREE_COEFFICIENT = 1.75;
  // Vegan: ~2.2 kg/day -> * 4 weeks = 8.8 kg/month per day/week chosen
  const VEGAN_COEFFICIENT = 8.8;
  // Bike: ~0.26 kg/km -> * 4 weeks = 1.04 kg/month per weekly km
  const BIKE_COEFFICIENT = 1.04;
  // Solar: ~0.4 kg/kWh
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 relative z-10">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-[var(--brand)]/10 rounded-lg">
          <Sprout className="h-6 w-6 text-[var(--brand)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Impact Simulator</h1>
          <p className="text-[var(--text-muted)] tracking-tight">Discover how lifestyle changes can shrink your carbon footprint.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Score */}
        <LiquidCard className="p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Current Emissions</p>
          <div className="text-4xl font-light text-[var(--text)]">
            {currentScore.toFixed(1)} <span className="text-base text-[var(--text-muted)]">kg CO₂</span>
          </div>
        </LiquidCard>

        {/* Projection Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <ArrowRight className="h-12 w-12 text-[var(--border)] animate-pulse" />
        </div>

        {/* Projected Score */}
        <LiquidCard className={`p-6 flex flex-col items-center justify-center text-center transition-colors duration-500 ${totalSaved > 0 ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}>
          <p className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center">
            {totalSaved > 0 && <Sprout className="h-4 w-4 text-emerald-500 mr-2" />}
            Projected Impact
          </p>
          <div className={`text-4xl font-bold transition-colors duration-500 ${totalSaved > 0 ? 'text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'text-[var(--text)]'}`}>
            {projectedScore.toFixed(1)} <span className="text-base text-[var(--text-muted)] font-light">kg CO₂</span>
          </div>
          {totalSaved > 0 && (
            <p className="mt-2 text-sm text-emerald-600 font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              -{percentReduction.toFixed(1)}% Reduction
            </p>
          )}
        </LiquidCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trees */}
        <LiquidCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                <TreePine className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[var(--text)]">Plant Trees</h3>
            </div>
            <span className="text-2xl font-light text-[var(--text)]">{trees}</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Trees planted (Absorbs ~1.75 kg/mo each)</p>
          <input 
            type="range" 
            min="0" max="100" 
            value={trees} 
            onChange={(e) => setTrees(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
          />
        </LiquidCard>

        {/* Diet */}
        <LiquidCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                <Leaf className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[var(--text)]">Plant-Based Diet</h3>
            </div>
            <span className="text-2xl font-light text-[var(--text)]">{veganDays} <span className="text-base font-normal">days/wk</span></span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Meat-free days per week (Saves ~8.8 kg/mo each day)</p>
          <input 
            type="range" 
            min="0" max="7" 
            value={veganDays} 
            onChange={(e) => setVeganDays(parseInt(e.target.value))}
            className="w-full accent-rose-500 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
          />
        </LiquidCard>

        {/* Commute */}
        <LiquidCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Bike className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[var(--text)]">Bike Commute</h3>
            </div>
            <span className="text-2xl font-light text-[var(--text)]">{bikeKm} <span className="text-base font-normal">km/wk</span></span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Kilometers biked instead of driven (Saves ~1.04 kg/mo per km)</p>
          <input 
            type="range" 
            min="0" max="100" 
            step="5"
            value={bikeKm} 
            onChange={(e) => setBikeKm(parseInt(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
          />
        </LiquidCard>

        {/* Solar */}
        <LiquidCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Sun className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-[var(--text)]">Solar Energy</h3>
            </div>
            <span className="text-2xl font-light text-[var(--text)]">{solarKwh} <span className="text-base font-normal">kWh/mo</span></span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">Solar power generated (Saves ~0.4 kg/mo per kWh)</p>
          <input 
            type="range" 
            min="0" max="500" 
            step="10"
            value={solarKwh} 
            onChange={(e) => setSolarKwh(parseInt(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer"
          />
        </LiquidCard>
      </div>

      {totalSaved > 0 && (
        <LiquidCard className="p-6 bg-gradient-to-r from-emerald-500/10 to-[var(--brand)]/10 border-emerald-500/20 text-center animate-in slide-in-from-bottom-4 duration-500">
          <ActivityIcon className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-[var(--text)]">Amazing Potential!</h2>
          <p className="mt-2 text-[var(--text-muted)] max-w-2xl mx-auto">
            By committing to these changes, you would prevent <strong>{totalSaved.toFixed(1)} kg</strong> of CO₂ from entering the atmosphere every month. 
            That's equivalent to the carbon absorbed by <strong>{Math.ceil(totalSaved / 1.75)} mature trees</strong>!
          </p>
        </LiquidCard>
      )}

    </div>
  );
};
