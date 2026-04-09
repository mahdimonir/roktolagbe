"use client";

import { useState, useEffect, Suspense, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, MapPin, Droplets, Loader2, Plus, 
  Zap, Activity, Target, ShieldAlert,
  ChevronRight, ArrowRight, ShieldCheck, X,
  TrendingUp, HeartPulse, Globe, Thermometer, Clock, Sparkles, Filter, SortAsc, LayoutGrid, List, AlertTriangle
} from 'lucide-react';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import SearchSuggestions from '@/components/common/SearchSuggestions';

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];
const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh',
  'Gazipur', 'Narayanganj', 'Comilla', 'Brahmanbaria', 'Noakhali', 'Feni', 'Chandpur',
  'Lakshmipur', 'Cox\'s Bazar', 'Bogura', 'Pabna', 'Sirajganj', 'Naogaon', 'Natore',
  'Joypurhat', 'Jashore', 'Kushtia', 'Magura', 'Narail', 'Satkhira', 'Bagerhat',
].sort();

function UrgentRequestsContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || '',
    district: searchParams.get('district') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as HTMLElement)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync state if URL changes (back/forward)
  useEffect(() => {
    setFilters({
      bloodGroup: searchParams.get('bloodGroup') || '',
      district: searchParams.get('district') || '',
      search: searchParams.get('search') || '',
      sortBy: searchParams.get('sortBy') || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
    });
  }, [searchParams]);

  const { data: requestsResponse, isLoading } = useQuery({
    queryKey: ['urgent-requests', filters],
    queryFn: async () => {
      const res: any = await api.get('/blood-requests', { params: { ...filters, limit: 12 } });
      return res.data;
    },
  });

  const requests = (requestsResponse as any) || [];

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v.toString());
    });
    window.history.replaceState(null, '', `?${params.toString()}`);
    setFilters(newFilters);
  };

  return (
        <main className="min-h-screen bg-white dark:bg-[#0a0a0d] italic font-black text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* 1. Page Header & Master Filter Bar */}
      <section className="pt-24 pb-12 bg-white dark:bg-[#0a0a0d] border-b border-gray-100 dark:border-white/[0.08] relative overflow-hidden px-4 md:px-0">
         <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.01] dark:bg-red-600/[0.02] rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-12">
            <div className="max-w-2xl space-y-4">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-1">
                  <div className="bg-red-50 dark:bg-red-500/10 text-red-600 px-4 py-1 rounded-full text-[8px] font-black tracking-[0.3em] uppercase italic">
                     Active Requests
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] bg-gray-50 dark:bg-white/5 px-4 py-1 rounded-full border border-gray-100 dark:border-white/10 italic">
                    <Globe size={12} className="text-red-500" />
                    Live Updates
                  </div>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2 leading-none">
                 Blood <span className="text-red-600">Requests</span>
               </h1>
               <p className="text-gray-500 dark:text-gray-400 font-medium italic text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                 Browse and respond to urgent missions. Every response is a chance to save a life.
               </p>
            </div>
            
            <Link
              href="/emergency-request"
              className="group bg-red-600 text-white px-8 py-4 rounded-[1.5rem] text-[9px] font-black tracking-[0.3em] uppercase italic shadow-2xl shadow-red-600/20 hover:bg-black transition-all flex items-center gap-4 self-center lg:self-end"
            >
              <Zap className="w-3.5 h-3.5" />
              Request Blood
            </Link>
          </div>

          {/* Master Command Bar */}
          <div className="max-w-5xl mx-auto lg:mx-0 w-full space-y-6">
            <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] p-2 rounded-[2rem] shadow-sm flex flex-col md:flex-row items-center gap-2">
              {/* Smart Search */}
               <div ref={searchRef} className="flex-1 w-full relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text"
                  placeholder="hospital, city, patient..."
                  className="w-full bg-transparent border-none outline-none pl-12 pr-10 py-4 font-black italic text-[11px] text-gray-900 dark:text-white uppercase tracking-wider placeholder:text-gray-400/50"
                  value={filters.search}
                  onChange={(e) => {
                    handleFilterChange('search', e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {filters.search && (
                  <button 
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Suggestions Dropdown */}
                <SearchSuggestions
                  query={filters.search}
                  context="requests"
                  onSelect={(text) => {
                    handleFilterChange('search', text);
                    setShowSuggestions(false);
                  }}
                  isOpen={showSuggestions}
                  onClose={() => setShowSuggestions(false)}
                />
              </div>

              {/* Blood Group Chips */}
              <div className="w-full md:w-auto flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-4 md:px-0 border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/10">
                <div className="hidden lg:flex items-center gap-2 mr-2 ml-4">
                  <Droplets size={12} className="text-red-500" />
                </div>
                {BLOOD_GROUPS.map((group) => (
                  <button
                    key={group}
                    onClick={() => handleFilterChange('bloodGroup', filters.bloodGroup === group ? '' : group)}
                    className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl text-[9px] font-black uppercase italic border transition-all flex items-center justify-center ${
                      filters.bloodGroup === group 
                      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' 
                      : 'bg-white/50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-500 hover:border-red-200 dark:hover:border-red-500/30'
                    }`}
                  >
                    {group.replace('_POS', '+').replace('_NEG', '-')}
                  </button>
                ))}
              </div>

              {/* Sort Switcher */}
              <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-100 dark:border-white/10 pl-3 md:pl-4 py-2 flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <SortAsc size={14} className="text-gray-400" />
                   <select 
                     value={filters.sortBy}
                     onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                     className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest italic text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-600 transition-colors"
                   >
                     <option value="newest" className="bg-white dark:bg-[#0a0a0d]">Recent</option>
                     <option value="urgency" className="bg-white dark:bg-[#0a0a0d]">Critical</option>
                     <option value="deadline" className="bg-white dark:bg-[#0a0a0d]">Deadline</option>
                   </select>
                 </div>
                 
                 {(filters.bloodGroup || filters.search || filters.sortBy !== 'newest') && (
                    <button 
                      onClick={() => setFilters({ bloodGroup: '', district: '', search: '', sortBy: 'newest', page: 1 })}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <X size={12} />
                    </button>
                 )}
              </div>
            </div>

            {/* Matrix Status Bar */}
            <div className="flex flex-wrap items-center gap-6 px-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                 <Target size={12} className="text-red-500" /> {requests.length} Missions Active
               </p>
               {filters.bloodGroup && (
                 <div className="flex items-center gap-2 bg-red-600/10 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest">
                   {filters.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} ONLY
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Requests Feed (Grid) */}
      <section className="py-20 pb-32 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-20">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                   {requests.map((request: any, i: number) => {
                     const confirmed = request.donations?.filter((d: any) => d.status === 'VERIFIED').length || 0;
                     const needed = Math.max(0, (request.units || 0) - confirmed);
                     const progress = Math.min(100, (confirmed / (request.units || 1)) * 100);
                     const deadlineDate = new Date(request.deadline);
                     const isExpired = deadlineDate < new Date();

                     return (
                     <div
                        key={request.id}
                        className={`p-8 rounded-[2rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col shadow-sm`}
                        style={{ animationDelay: `${i * 50}ms` }}
                     >
                        {/* Emergency Badge */}
                        {(request.urgency === 'EMERGENCY' || request.isEmergency) && (
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[7px] uppercase font-black px-4 py-1.5 rounded-bl-xl tracking-[0.3em] z-10 italic flex items-center gap-1.5">
                           <Zap size={10} /> Emergency
                        </div>
                        )}

                        {/* Top Row: Blood Group Badge + Location */}
                        <div className="flex items-start gap-5 mb-6">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 transition-all ${
                            request.isEmergency 
                              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                              : 'bg-gray-50 dark:bg-white/5 text-red-600 border border-gray-100 dark:border-white/10 group-hover:bg-red-600 group-hover:text-white'
                          }`}>
                             <p className="text-xl font-black italic tracking-tighter leading-none">{request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                             <span className="text-[6px] font-black uppercase tracking-widest opacity-60 italic leading-none mt-1">Type</span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1 text-left">
                             <h3 className="font-black text-sm italic uppercase tracking-tighter text-gray-900 dark:text-white leading-none group-hover:text-red-600 transition-colors truncate mb-2">
                                {request.hospitalName || 'Medical Center'}
                             </h3>
                             <div className="flex items-center gap-2">
                                <MapPin size={10} className="text-red-500 opacity-50 shrink-0" />
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic truncate">
                                  {request.district}
                                </p>
                             </div>
                             <div className="flex items-center gap-2 mt-1">
                                <Clock size={10} className="text-gray-400 opacity-50 shrink-0" />
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                                   DUE {deadlineDate.toLocaleDateString()}
                                </p>
                             </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                           <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Vitals</p>
                              <p className="text-[10px] font-black text-gray-900 dark:text-gray-100 italic leading-tight truncate px-1">{request.patientCondition || 'Critical'}</p>
                           </div>
                           <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-center">
                              <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Hemoglobin</p>
                              <p className="text-[10px] font-black text-gray-900 dark:text-gray-100 italic leading-tight">{request.hemoglobin ? `${request.hemoglobin} g/dL` : 'N/A'}</p>
                           </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8 space-y-2">
                           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest italic">
                              <span className="text-gray-400">Match Progress</span>
                              <span className="text-red-600">{confirmed}/{request.units} UNITS</span>
                           </div>
                           <div className="h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div 
                                 className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(220,38,38,0.4)]"
                                 style={{ width: `${progress}%` }}
                              />
                           </div>
                        </div>

                        <Link
                           href={`/urgent-requests/${request.id}`}
                           className={`block w-full text-center py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all italic flex items-center justify-center gap-2 ${
                             request.isEmergency 
                               ? 'bg-red-600 text-white hover:bg-black' 
                               : 'bg-gray-900 dark:bg-white/10 text-white hover:bg-red-600 dark:hover:bg-red-600'
                           }`}
                        >
                           RESPOND NOW
                        </Link>
                     </div>
                     );
                   })}

                  {requests.length === 0 && (
                     <div className="col-span-full py-40 text-center bg-white dark:bg-white/[0.02] rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/10 group relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                           <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700 border border-gray-100 dark:border-white/10">
                              <ShieldCheck className="w-12 h-12 text-gray-200 dark:text-gray-600" />
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">No Requests Found</h3>
                              <p className="text-gray-400 italic text-sm font-medium max-w-sm mx-auto leading-relaxed">Try adjusting your filters or search query to find more live missions.</p>
                           </div>
                           <button 
                              onClick={() => setFilters({ bloodGroup: '', district: '', search: '', sortBy: 'newest', page: 1 })}
                              className="inline-flex items-center gap-4 bg-gray-900 dark:bg-white/10 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 transition-all italic"
                           >
                              Clear All Filters <Globe className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  )}
               </div>

               {/* Pagination Controls */}
               {requests.length > 0 && (
                  <div className="mt-16 flex flex-col items-center gap-6">
                     <div className="flex items-center gap-3">
                        <button 
                           disabled={filters.page === 1}
                           onClick={() => handleFilterChange('page', filters.page - 1)}
                           className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm"
                        >
                           <ChevronRight className="rotate-180" size={18} />
                        </button>
                        <div className="flex gap-2">
                           {[1, 2, 3].map((p) => (
                              <button
                                 key={p}
                                 onClick={() => handleFilterChange('page', p)}
                                 className={`w-12 h-12 rounded-xl font-black text-[11px] uppercase italic transition-all ${filters.page === p ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'bg-white dark:bg-white/5 text-gray-400 border border-gray-100 dark:border-white/10 hover:border-red-100 dark:hover:border-red-500/20'}`}
                              >
                                 {p}
                              </button>
                           ))}
                        </div>
                        <button 
                           onClick={() => handleFilterChange('page', filters.page + 1)}
                           className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm"
                        >
                           <ChevronRight size={18} />
                        </button>
                     </div>
                     <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">Page {filters.page} of mission feed</p>
                  </div>
               )}
            </div>
          )}
        </div>
      </section>

      {/* Additional Info */}
      <div className="bg-gray-50 dark:bg-white/[0.02] py-24 border-t border-gray-100 dark:border-white/5 relative overflow-hidden italic text-center">
         <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-10">
            <div className="space-y-4">
               <HeartPulse className="w-14 h-14 text-red-600 mx-auto mb-6 animate-bounce" />
               <p className="text-red-500 font-black text-[10px] uppercase tracking-widest italic">Your Support Matters</p>
               <h2 className="text-3xl md:text-5xl text-gray-900 dark:text-white font-black tracking-tighter italic uppercase leading-none">Every Donation Helps <br/> Save A <span className="text-red-600 italic">Life</span></h2>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium italic text-lg max-w-3xl mx-auto leading-relaxed">
               RoktoLagbe connects critical blood requests with life-saving donors. We help bridge the gap in emergency situations.
            </p>
         </div>
      </div>
    </main>
  );
}

export default function UrgentRequestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-44 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0d] italic">
        <div className="w-16 h-16 border-4 border-red-50 dark:border-red-500/20 border-t-red-600 rounded-full animate-spin shadow-xl"></div>
        <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Loading mission feed...</p>
      </div>
    }>
      <UrgentRequestsContent />
    </Suspense>
  );
}
