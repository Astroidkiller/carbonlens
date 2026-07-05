import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

export const AddActivity: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    activity_date: new Date().toISOString().split('T')[0],
    category: 'transport',
    activity_type: 'car',
    quantity: '',
    unit: 'km',
    description: ''
  });

  const categoryOptions: Record<string, { types: string[], units: string[] }> = {
    transport: { types: ['car', 'motorcycle', 'bus', 'train', 'bicycle'], units: ['km', 'miles', 'meters'] },
    food: { types: ['beef meal', 'chicken meal', 'vegetarian meal'], units: ['meals'] },
    electricity: { types: ['generic'], units: ['kWh', 'Wh'] },
    shopping: { types: ['clothing item', 'electronics item'], units: ['items'] },
    waste: { types: ['plastic waste', 'paper waste'], units: ['kg', 'grams', 'lbs'] }
  };

  const currentOpts = categoryOptions[formData.category] || categoryOptions['transport'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'category') {
        const newOpts = categoryOptions[value];
        next.activity_type = newOpts.types[0];
        next.unit = newOpts.units[0];
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        activity_date: new Date(formData.activity_date).toISOString(),
        quantity: parseFloat(formData.quantity)
      };

      const res = await activityService.create(payload);
      setSuccess(`Successfully logged! Emitted ${res.carbon_emission} kg CO2. (${res.calculation_explanation})`);
      setFormData(prev => ({ ...prev, quantity: '', description: '' }));
    } catch (err: any) {
      setError(err.response?.data?.detail?.error || err.response?.data?.detail || 'Failed to log activity. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/activities')}
          className="w-10 h-10 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] flex items-center justify-center text-[var(--text)] transition-colors border border-white/[0.05]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight">Log Activity</h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center text-rose-400 font-medium text-sm">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>{typeof error === 'string' ? error : JSON.stringify(error)}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 p-4 rounded-2xl flex items-center text-emerald-400 border border-emerald-500/20 font-medium text-sm">
          <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <LiquidCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2">
              <label htmlFor="activity_date" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Date</label>
              <input
                id="activity_date"
                type="date"
                name="activity_date"
                required
                className="glass-input w-full px-4 py-3 sm:text-sm"
                value={formData.activity_date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Category</label>
              <select
                id="category"
                name="category"
                className="glass-input w-full px-4 py-3 sm:text-sm capitalize appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em] [&]:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237a8599%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.keys(categoryOptions).map(cat => (
                  <option key={cat} value={cat} className="bg-[var(--surface-strong)] text-[var(--text)]">{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="activity_type" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Activity Type</label>
              <select
                id="activity_type"
                name="activity_type"
                className="glass-input w-full px-4 py-3 sm:text-sm capitalize appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em] [&]:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237a8599%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                value={formData.activity_type}
                onChange={handleChange}
              >
                {currentOpts.types.map(t => (
                  <option key={t} value={t} className="bg-[var(--surface-strong)] text-[var(--text)]">{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="quantity" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="glass-input w-full px-4 py-3 sm:text-sm"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  className="glass-input w-full px-4 py-3 sm:text-sm appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em] [&]:bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237a8599%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')]"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  {currentOpts.units.map(u => (
                    <option key={u} value={u} className="bg-[var(--surface-strong)] text-[var(--text)]">{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label htmlFor="description" className="block text-[13px] font-medium text-[var(--text-muted)] ml-1">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="E.g., Commute to work"
                className="glass-input w-full px-4 py-3 sm:text-sm resize-none rounded-2xl"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 mt-6 border-t border-white/[0.05]">
            <LiquidButton
              type="button"
              variant="ghost"
              onClick={() => navigate('/activities')}
              className="mr-3"
            >
              Cancel
            </LiquidButton>
            <LiquidButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Logging...' : 'Save Activity'}
            </LiquidButton>
          </div>
        </form>
      </LiquidCard>
    </div>
  );
};
