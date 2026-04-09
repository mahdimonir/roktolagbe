'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/lib/api/axios';
import { Search, MapPin, Droplets, User, Building2, Activity, Loader2 } from 'lucide-react';

interface Suggestion {
  text: string;
  type: 'blood_group' | 'district' | 'thana' | 'donor' | 'hospital' | 'condition' | 'compound';
  count: number | null;
}

interface SearchSuggestionsProps {
  query: string;
  context: 'donors' | 'requests' | 'organizations';
  onSelect: (text: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_CONFIG: Record<string, { icon: any; label: string; color: string }> = {
  blood_group: { icon: Droplets, label: 'Blood Group', color: 'text-red-500' },
  district: { icon: MapPin, label: 'District', color: 'text-blue-500' },
  thana: { icon: MapPin, label: 'Thana', color: 'text-emerald-500' },
  donor: { icon: User, label: 'Donor', color: 'text-gray-500' },
  hospital: { icon: Building2, label: 'Hospital', color: 'text-purple-500' },
  condition: { icon: Activity, label: 'Condition', color: 'text-amber-500' },
  compound: { icon: Search, label: 'Matched', color: 'text-red-600' },
};

export default function SearchSuggestions({ query, context, onSelect, isOpen, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q || q.length < 1) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res: any = await api.get('/search/suggestions', {
        params: { q, context }
      });
      setSuggestions(res?.data || []);
    } catch (err) {
      console.error('[SearchSuggestions] Failed to fetch:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [context]);

  // Debounced fetch on query change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query || query.length < 1) {
      setSuggestions([]);
      return;
    }

    timerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetchSuggestions]);

  if (!isOpen || (!loading && suggestions.length === 0 && query.length < 1)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-[#0a0a0d]/95 backdrop-blur-[50px] border border-gray-100 dark:border-white/[0.08] rounded-[1.5rem] shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
          <Search size={10} className="text-gray-400" />
          {loading ? 'Searching...' : `${suggestions.length} Suggestions`}
        </p>
      </div>

      {/* Loading */}
      {loading && suggestions.length === 0 && (
        <div className="px-5 py-6 flex items-center justify-center gap-3">
          <Loader2 size={14} className="text-red-500 animate-spin" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Finding matches...</span>
        </div>
      )}

      {/* No results */}
      {!loading && suggestions.length === 0 && query.length >= 1 && (
        <div className="px-5 py-6 text-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No matches found</span>
        </div>
      )}

      {/* Suggestions list */}
      {suggestions.map((s, i) => {
        const config = TYPE_CONFIG[s.type] || TYPE_CONFIG.district;
        const Icon = config.icon;

        return (
          <button
            key={`${s.text}-${i}`}
            onClick={() => {
              onSelect(s.text);
              onClose();
            }}
            className="w-full text-left px-5 py-3 text-[10px] font-black italic text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-colors flex items-center gap-4 border-b border-gray-50 dark:border-white/5 last:border-0 uppercase tracking-widest group"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:bg-red-50 dark:group-hover:bg-red-500/10 transition-colors`}>
              <Icon size={12} className={`${config.color} group-hover:text-red-600 transition-colors`} />
            </div>
            <div className="flex-1 min-w-0">
              <span
                dangerouslySetInnerHTML={{
                  __html: query
                    ? s.text.replace(
                        new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
                        '<strong class="text-red-600 not-italic">$1</strong>'
                      )
                    : s.text,
                }}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {s.count !== null && (
                <span className="text-[8px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                  {s.count}
                </span>
              )}
              <span className={`text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 ${config.color}`}>
                {config.label}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
