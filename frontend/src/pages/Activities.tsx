import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import type { Activity } from '../types';
import { PlusCircle, Search, Trash2, AlertCircle, Calendar, Zap, Leaf, ShoppingBag, Car, Utensils, Activity as ActivityIcon } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'transport': return <Car className="h-4 w-4 text-blue-400" />;
    case 'food': return <Utensils className="h-4 w-4 text-emerald-400" />;
    case 'electricity': return <Zap className="h-4 w-4 text-amber-400" />;
    case 'shopping': return <ShoppingBag className="h-4 w-4 text-purple-400" />;
    case 'waste': return <Leaf className="h-4 w-4 text-rose-400" />;
    default: return <ActivityIcon className="h-4 w-4 text-[var(--text-muted)]" />;
  }
};

export const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchActivities = async () => {
    try {
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    try {
      await activityService.delete(id);
      setActivities(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert('Failed to delete activity');
    }
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(a => {
      const matchesSearch = (a.activity_type.toLowerCase().includes(search.toLowerCase()) || 
                            (a.description || '').toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = filterCategory ? a.category === filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [activities, search, filterCategory]);

  const categories = ['transport', 'food', 'electricity', 'shopping', 'waste'];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Your Activities</h1>
        <Link to="/add-activity">
          <LiquidButton variant="primary" className="pl-4">
            <PlusCircle className="h-4 w-4" />
            Log Activity
          </LiquidButton>
        </Link>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl flex items-center text-sm font-medium">
          <AlertCircle className="mr-3 h-5 w-5" />
          {error}
        </div>
      )}

      {/* Filters */}
      <LiquidCard className="p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search activities..."
            className="glass-input w-full pl-10 pr-4 py-2.5 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
          <button
            onClick={() => setFilterCategory('')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors border ${
              filterCategory === '' 
                ? 'bg-white/[0.1] border-white/[0.15] text-[var(--text)]' 
                : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-white/[0.05]'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors border flex items-center gap-2 ${
                filterCategory === cat 
                  ? 'bg-white/[0.1] border-white/[0.15] text-[var(--text)]' 
                  : 'bg-transparent border-transparent text-[var(--text-muted)] hover:bg-white/[0.05]'
              }`}
            >
              {getCategoryIcon(cat)}
              {cat}
            </button>
          ))}
        </div>
      </LiquidCard>

      {/* List */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <LiquidCard className="p-12 text-center flex flex-col items-center justify-center border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 border border-white/[0.05]">
              <Search className="h-6 w-6 text-[var(--text-muted)] opacity-50" />
            </div>
            <p className="text-[var(--text-muted)] font-medium">No activities found.</p>
          </LiquidCard>
        ) : (
          filteredActivities.map((act) => (
            <LiquidCard key={act.id} className="p-4 sm:p-5 group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  {getCategoryIcon(act.category)}
                </div>
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--text)] capitalize tracking-tight">{act.activity_type}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[13px] text-[var(--text-muted)]">
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      {new Date(act.activity_date).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.2]"></span>
                    <span>{act.quantity} {act.unit}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-16 sm:pl-0">
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {act.carbon_emission} kg CO₂
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(act.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-400 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  title="Delete Activity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </LiquidCard>
          ))
        )}
      </div>
    </div>
  );
};
