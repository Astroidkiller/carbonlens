import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
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

  // Example mappings for UI hints
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
      // Reset type and unit if category changes
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
      setFormData(prev => ({ ...prev, quantity: '', description: '' })); // Reset some fields
    } catch (err: any) {
      setError(err.response?.data?.detail?.error || err.response?.data?.detail || 'Failed to log activity. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">Log New Activity</h1>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center text-rose-500">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{typeof error === 'string' ? error : JSON.stringify(error)}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 p-4 rounded-xl flex items-center text-emerald-500 border border-emerald-500/20">
          <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      <LiquidCard className="overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Date</label>
              <input
                type="date"
                name="activity_date"
                required
                className="block w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-3 text-[var(--text)] bg-black/20 transition-all"
                value={formData.activity_date}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Category</label>
              <select
                name="category"
                className="block w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-3 text-[var(--text)] bg-black/20 transition-all"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.keys(categoryOptions).map(cat => (
                  <option key={cat} value={cat} className="capitalize">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Activity Type</label>
              <select
                name="activity_type"
                className="block w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-3 text-[var(--text)] bg-black/20 transition-all"
                value={formData.activity_type}
                onChange={handleChange}
              >
                {currentOpts.types.map(t => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="block w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-3 text-[var(--text)] bg-black/20 placeholder:text-[var(--text-muted)] transition-all"
                  value={formData.quantity}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Unit</label>
                <select
                  name="unit"
                  className="block w-full rounded-xl border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] sm:text-sm p-3 text-[var(--text)] bg-black/20 transition-all"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  {currentOpts.units.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[var(--text)] mb-2 tracking-tight">Description (Optional)</label>
              <textarea
                name="description"
                rows={3}
                placeholder="E.g., Commute to work"
                className="block w-full rounded-xl shadow-inner sm:text-sm p-4 resize-none bg-black/20 text-[var(--text)] border border-[var(--border)] outline-none ring-0 focus:ring-2 focus:ring-[var(--brand)] placeholder:text-[var(--text-muted)] transition-all duration-300"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border)] mt-6">
            <button
              type="button"
              onClick={() => navigate('/activities')}
              className="mr-3 px-4 py-2 border border-[var(--border)] shadow-sm text-sm font-medium rounded-full text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-strong)] transition-all"
            >
              Cancel
            </button>
            <LiquidButton
              type="submit"
              disabled={loading}
              gradient={true}
            >
              {loading ? 'Logging...' : 'Save Activity'}
            </LiquidButton>
          </div>
        </form>
      </LiquidCard>
    </div>
  );
};
