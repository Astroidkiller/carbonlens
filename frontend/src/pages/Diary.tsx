import React, { useState } from 'react';
import { activityService } from '../services/activityService';
import { Bot, Sparkles, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';
import { LiquidCard } from '../components/ui/LiquidCard';
import { LiquidButton } from '../components/ui/LiquidButton';

export const Diary: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [previewData, setPreviewData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleExtract = async () => {
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }
    
    setError('');
    setSuccess('');
    setLoading(true);
    setPreviewData(null);

    try {
      const data = await activityService.extractDiary(text);
      setPreviewData(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to extract activities from the text.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData || !previewData.activities) return;
    
    setSaving(true);
    setError('');
    
    try {
      const payload = previewData.activities.map((item: any) => item.activity);
      await activityService.bulkCreate(payload);
      
      setSuccess(`Successfully saved ${previewData.activities_created} activities!`);
      setText('');
      setPreviewData(null);
    } catch (err: any) {
      setError('Failed to save activities.');
    } finally {
      setSaving(false);
    }
  };

  const removeActivityFromPreview = (index: number) => {
    const updatedActivities = [...previewData.activities];
    updatedActivities.splice(index, 1);
    
    const newTotal = updatedActivities.reduce((sum, item) => sum + item.carbon_emission, 0);
    
    setPreviewData({
      ...previewData,
      activities: updatedActivities,
      activities_created: updatedActivities.length,
      total_carbon_emission: newTotal.toFixed(2)
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text)] tracking-tight flex items-center">
            <Sparkles className="h-6 w-6 text-[var(--brand)] mr-3" />
            AI Carbon Diary
          </h1>
          <p className="text-[var(--text-muted)] mt-2 tracking-tight">
            Describe your day naturally. Our Hybrid AI will extract your footprint.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center text-rose-400 font-medium text-sm">
          <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 p-4 rounded-2xl flex items-center text-emerald-400 border border-emerald-500/20 font-medium text-sm">
          <CheckCircle2 className="mr-3 h-5 w-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <LiquidCard className="p-6 sm:p-8">
        <label className="block text-[13px] font-medium text-[var(--text-muted)] mb-3 ml-1 tracking-tight">
          How was your day?
        </label>
        <textarea
          rows={5}
          placeholder="e.g., Today I drove 15 km to college, ate a chicken biryani for lunch, used about 5 kWh of electricity, and bought a T-shirt."
          className="glass-input w-full p-4 resize-none rounded-2xl text-[15px] leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading || saving}
        />
        <div className="mt-6 flex justify-end">
          <LiquidButton
            onClick={handleExtract}
            variant="primary"
            disabled={loading || !text.trim()}
            className="px-6"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="h-[18px] w-[18px] mr-2" />
                Extract Footprint
              </>
            )}
          </LiquidButton>
        </div>
      </LiquidCard>

      {previewData && previewData.activities.length > 0 && (
        <div className="animate-slide-up mt-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-semibold text-[var(--text)] tracking-tight">Extracted Activities</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/[0.05] text-[var(--brand)] border border-white/[0.1]">
              {previewData.extraction_method === 'gemini' ? 'Gemini AI' : 'Rule Engine'}
            </span>
          </div>
          
          <div className="space-y-3">
            {previewData.activities.map((item: any, idx: number) => (
              <LiquidCard key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between group">
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--text)] capitalize tracking-tight">{item.activity.activity_type}</span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.2]"></span>
                    <span className="text-[13px] font-medium text-[var(--text-muted)]">{item.activity.quantity} {item.activity.unit}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] mt-1.5 capitalize font-medium uppercase tracking-wider">{item.activity.category}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-white/[0.05] sm:border-0 pt-4 sm:pt-0 mt-4 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <span className="block font-semibold text-rose-400">{item.carbon_emission.toFixed(2)} kg CO₂</span>
                    <span className="block text-[11px] text-[var(--text-muted)] mt-1 max-w-[200px] truncate" title={item.calculation_explanation}>
                      {item.calculation_explanation}
                    </span>
                  </div>
                  <button 
                    onClick={() => removeActivityFromPreview(idx)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-rose-500/10 hover:text-rose-400 transition-all sm:opacity-0 sm:group-hover:opacity-100 shrink-0"
                    title="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </LiquidCard>
            ))}
          </div>

          <LiquidCard className="p-6 mt-6 bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-[13px] font-medium text-[var(--text-muted)] mb-1">Total estimated impact</p>
              <p className="text-3xl font-semibold text-rose-400 tracking-tight">{previewData.total_carbon_emission} <span className="text-[15px] font-medium opacity-80">kg CO₂</span></p>
            </div>
            <LiquidButton
              onClick={handleConfirm}
              variant="primary"
              disabled={saving || previewData.activities.length === 0}
              className="w-full sm:w-auto px-8"
            >
              {saving ? 'Saving...' : 'Confirm & Save'}
              {!saving && <ArrowRight className="ml-2 h-4 w-4 opacity-70" />}
            </LiquidButton>
          </LiquidCard>
        </div>
      )}
      
      {previewData && previewData.activities.length === 0 && (
        <LiquidCard className="p-8 mt-8 border-amber-500/20 bg-amber-500/5 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
            <Bot className="h-6 w-6 text-amber-400" />
          </div>
          <p className="text-amber-400/90 font-medium text-[15px] max-w-md">
            We couldn't extract any valid carbon-emitting activities from your entry. Try being more specific about transport, food, or electricity usage.
          </p>
        </LiquidCard>
      )}
    </div>
  );
};
