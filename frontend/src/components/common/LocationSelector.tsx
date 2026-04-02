'use client';

import { getDivisions, getDistricts, getThanas } from '@/constants/locations';

interface LocationSelectorProps {
  division: string;
  district: string;
  thana: string;
  onChange: (field: string, value: string) => void;
  required?: boolean;
}

export function LocationSelector({ division, district, thana, onChange, required = false }: LocationSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest italic">Division {required && '*'}</label>
        <select 
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm transition-all"
          value={division}
          onChange={(e) => onChange('division', e.target.value)}
          required={required}
        >
          <option value="">Select Division</option>
          {getDivisions().map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {division && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest italic">District {required && '*'}</label>
          <select 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm transition-all"
            value={district}
            onChange={(e) => onChange('district', e.target.value)}
            required={required}
          >
            <option value="">Select District</option>
            {getDistricts(division).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      )}

      {district && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest italic">Thana / Upazila</label>
          <select 
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm transition-all"
            value={thana}
            onChange={(e) => onChange('thana', e.target.value)}
          >
            <option value="">Select Thana (Optional)</option>
            {getThanas(division, district).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}
