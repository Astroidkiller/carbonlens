import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { activityService } from '../services/activityService';
import type { Activity } from '../types';
import { PlusCircle, Search, Trash2, AlertCircle } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Your Activities</h1>
        <Link to="/add-activity">
          <LiquidButton className="inline-flex items-center">
            <PlusCircle className="mr-2 h-5 w-5" />
            Log Activity
          </LiquidButton>
        </Link>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center text-rose-500">
          <AlertCircle className="mr-3 h-5 w-5" />
          {error}
        </div>
      )}

      <LiquidCard className="overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row gap-4 bg-[var(--surface-strong)]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search activities..."
              className="pl-10 w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-2 text-[var(--text)] bg-black/20 placeholder:text-[var(--text-muted)] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-2 text-[var(--text)] bg-black/20 transition-all"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="transport">Transport</option>
            <option value="food">Food</option>
            <option value="electricity">Electricity</option>
            <option value="shopping">Shopping</option>
            <option value="waste">Waste</option>
          </select>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] bg-black/10">
            <p>No activities found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--border)]">
              <thead className="bg-black/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Emissions</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-black/10 divide-y divide-[var(--border)]">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-[var(--surface-strong)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text)]">
                      {new Date(act.activity_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--text)] capitalize tracking-tight">{act.activity_type}</span>
                        <span className="text-xs text-[var(--text-muted)] capitalize">{act.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-muted)] font-medium">
                      {act.quantity} {act.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">
                        {act.carbon_emission} kg CO₂
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(act.id)}
                        className="text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LiquidCard>
    </div>
  );
};
