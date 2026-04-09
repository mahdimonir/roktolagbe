'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { 
  Search, MapPin, Droplets, ArrowLeft, ArrowRight, 
  Loader2, User, Phone, ShieldCheck, SortAsc, Globe, HeartPulse, X, Filter, Zap
} from 'lucide-react';
import SearchSuggestions from '@/components/common/SearchSuggestions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getDivisions, getDistricts, getThanas } from '@/constants/locations';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import CTASection from '@/components/common/CTASection';

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];



function DonorsList() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || searchParams.get('name') || searchParams.get('phone') || searchParams.get('district') || ''
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || '',
    search: searchParams.get('search') || searchParams.get('name') || searchParams.get('district') || searchParams.get('phone') || '',
    sortBy: 'newest'
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);


  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['donors-search', debouncedFilters, page],
    queryFn: async () => {
      const params: any = { 
        page, 
        limit: 12,
        bloodGroup: debouncedFilters.bloodGroup,
        sortBy: debouncedFilters.sortBy,
        search: debouncedFilters.search.trim() || undefined
      };

      const res: any = await api.get('/donors/search', { params });
      return res;
    },
  });

  const donors = searchResults?.data || [];
  const totalPages = searchResults?.meta?.totalPages || 1;
  const user = useAuthStore(state => state.user);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setFilters(prev => ({ ...prev, search: value }));
    
    const params = new URLSearchParams();
    if (value) params.set('search', value);
    if (filters.bloodGroup) params.set('bloodGroup', filters.bloodGroup);
    window.history.replaceState(null, '', params.toString() ? `?${params.toString()}` : '?');
    setPage(1);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleBloodGroupChange = (value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, bloodGroup: value };
      const params = new URLSearchParams();
      if (newFilters.search) params.set('search', newFilters.search);
      if (value) params.set('bloodGroup', value);
      window.history.replaceState(null, '', params.toString() ? `?${params.toString()}` : '?');
      return newFilters;
    });
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({ ...prev, sortBy: value }));
    setPage(1);
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
                     Global Registry
                  </div>
                  <div className="flex items-center gap-2 text-[8px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.3em] bg-gray-50 dark:bg-white/5 px-4 py-1 rounded-full border border-gray-100 dark:border-white/10 italic">
                    <ShieldCheck size={12} className="text-red-500" />
                    Verified Donors
                  </div>
               </div>
               <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-2 leading-none">
                 Blood <span className="text-red-600">Network</span>
               </h1>
               <p className="text-gray-500 dark:text-gray-400 font-medium italic text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                 Connect with life-saving heroes. Search by name, phone, or location — all in one elite portal.
               </p>
            </div>
            
            <Link
              href="/emergency-request"
              className="group bg-red-600 text-white px-8 py-4 rounded-[1.5rem] text-[9px] font-black tracking-[0.3em] uppercase italic shadow-2xl shadow-red-600/20 hover:bg-black transition-all flex items-center gap-4 self-center lg:self-end"
            >
              <Zap className="w-3.5 h-3.5" />
              Emergency Request
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
                  placeholder="name, phone, location..."
                  className="w-full bg-transparent border-none outline-none pl-12 pr-10 py-4 font-black italic text-[11px] text-gray-900 dark:text-white uppercase tracking-wider placeholder:text-gray-400/50"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowSuggestions(true);
                    handleSearch(e.target.value);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {searchInput && (
                  <button 
                    onClick={() => { handleSearch(''); setSearchInput(''); }}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}

                {/* Suggestions Dropdown */}
                <SearchSuggestions
                  query={searchInput}
                  context="donors"
                  onSelect={(text) => handleSuggestionClick(text)}
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
                    onClick={() => handleBloodGroupChange(filters.bloodGroup === group ? '' : group)}
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
                     onChange={(e) => handleSortChange(e.target.value)}
                     className="bg-transparent border-none outline-none text-[9px] font-black uppercase tracking-widest italic text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-600 transition-colors"
                   >
                     <option value="newest" className="bg-white dark:bg-[#0a0a0d]">Recent</option>
                     <option value="donations" className="bg-white dark:bg-[#0a0a0d]">Saviors</option>
                     <option value="available" className="bg-white dark:bg-[#0a0a0d]">Combat</option>
                   </select>
                 </div>
                 
                 {(filters.bloodGroup || filters.search || filters.sortBy !== 'newest') && (
                    <button 
                      onClick={() => { setFilters({ bloodGroup: '', search: '', sortBy: 'newest' }); setSearchInput(''); }}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                    >
                      <X size={12} />
                    </button>
                 )}
              </div>
            </div>

            {/* Matrix Status Bar */}
            <div className="flex flex-wrap items-center gap-6 px-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                 <Globe size={12} className="text-red-500" /> {donors.length} Saviors Indexed
               </p>
               {filters.bloodGroup && (
                 <div className="flex items-center gap-2 bg-red-600/10 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest">
                   {filters.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} ONLY
                 </div>
               )}
               {filters.search && (
                 <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest border border-gray-200 dark:border-white/5">
                   QUERY: {filters.search}
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Results Grid */}
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
                  {donors.map((donor: any, i: number) => (
                    <div 
                      key={donor.id} 
                      className="p-8 rounded-[2rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center shadow-sm"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="relative mb-6">
                         <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden relative z-10 group-hover:scale-105 transition-transform duration-500">
                          {donor.profileImage ? (
                            <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center">
                              <p className="text-2xl font-black italic text-gray-900 dark:text-white leading-none">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4 mb-8 flex-1 w-full">
                        <div>
                          <h3 className="text-base font-black text-gray-900 dark:text-white group-hover:text-red-600 transition-colors uppercase italic tracking-tighter leading-none mb-1.5 truncate w-full">
                             {donor.name || 'Anonymous Hero'}
                          </h3>
                          <div className="flex items-center justify-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`} />
                             <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} • {donor.isAvailable ? 'AVAILABLE' : 'OFF DUTY'}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 w-full">
                          <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-1">
                             <MapPin size={10} className="text-red-500 opacity-50" />
                             <span className="text-[8px] font-black text-gray-400 uppercase italic truncate w-full">{donor.district}</span>
                          </div>
                          <div className="bg-white/50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5 flex flex-col items-center gap-1">
                             <Droplets size={10} className="text-red-600 opacity-50" />
                             <span className="text-[8px] font-black text-gray-400 uppercase italic">{donor.totalDonations} SAVES</span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full space-y-2 relative z-10">
                        <Link 
                           href={`/donors/${donor.id}`}
                           className="w-full bg-gray-900 dark:bg-white/10 text-white py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all flex items-center justify-center gap-2 italic active:scale-95"
                        >
                           ACCESS PROFILE
                        </Link>

                        {user && donor.user?.phone && (
                          <a
                            href={`tel:${donor.user.phone}`}
                            className="w-full bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 text-red-600 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 italic"
                          >
                            DIRECT LINK
                          </a>
                        )}
                      </div>
                    </div>
                  ))}

                  {donors.length === 0 && (
                    <div className="col-span-full py-40 text-center bg-white dark:bg-white/[0.02] rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/10 group relative overflow-hidden italic">
                        <div className="relative z-10 space-y-8">
                           <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700 border border-gray-100 dark:border-white/10">
                              <Search className="w-12 h-12 text-gray-200 dark:text-gray-600" />
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">No Heroes Found</h3>
                              <p className="text-gray-400 italic text-sm font-medium max-w-sm mx-auto leading-relaxed">Adjust your search criteria to find available donors in your region.</p>
                           </div>
                           <button 
                              onClick={() => { setFilters({ bloodGroup: '', search: '', sortBy: 'newest' }); setSearchInput(''); }}
                              className="inline-flex items-center gap-4 bg-gray-900 dark:bg-white/10 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 transition-all italic"
                           >
                              Clear All Filters <Globe size={18} />
                           </button>
                        </div>
                    </div>
                  )}
               </div>

               {/* Pagination Controls */}
               {totalPages > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-6">
                     <div className="flex items-center gap-3">
                        <button 
                           onClick={() => setPage(p => Math.max(1, p - 1))}
                           disabled={page === 1}
                           className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm"
                        >
                           <ArrowLeft size={18} />
                        </button>
                        <div className="px-8 py-3 bg-gray-900 dark:bg-white/10 rounded-xl text-white flex flex-col items-center justify-center shadow-xl">
                           <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest mb-1 leading-none italic">Page</span>
                           <p className="text-xl font-black italic tracking-tighter leading-none">{page} / {totalPages}</p>
                        </div>
                        <button 
                           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                           disabled={page === totalPages}
                           className="w-12 h-12 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all shadow-sm"
                        >
                           <ArrowRight size={18} />
                        </button>
                     </div>
                     <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">Global Registry Feed</p>
                  </div>
               )}
            </div>
          )}
        </div>
      </section>

      <CTASection 
        title="HELP SAVE A LIFE."
        subtitle="RoktoLagbe connects people with life-saving blood donors. Join our community and help make a difference."
        primaryBtnText="BECOME A DONOR"
        primaryBtnLink="/register"
        secondaryBtnText="HOW IT WORKS"
        secondaryBtnLink="/how-it-works"
      />
    </main>
  );
}

export default function DonorsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-44 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0d] italic">
        <Loader2 className="w-16 h-16 text-red-600 animate-spin" />
        <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Initializing donor network...</p>
      </div>
    }>
      <DonorsList />
    </Suspense>
  );
}
