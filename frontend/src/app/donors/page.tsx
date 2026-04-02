'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { Search, MapPin, Droplets, ArrowLeft, ArrowRight, Loader2, User, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getDivisions, getDistricts, getThanas } from '@/constants/locations';

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

import { Suspense } from 'react';

function DonorsList() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchBy, setSearchBy] = useState<'district' | 'name' | 'phone'>(
    (searchParams.get('name') ? 'name' : searchParams.get('phone') ? 'phone' : 'district') as any
  );
  
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || '',
    division: searchParams.get('division') || '',
    district: searchParams.get('district') || '',
    thana: searchParams.get('thana') || '',
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
  });

  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Sync state with URL params on initial load
  useEffect(() => {
    const bg = searchParams.get('bloodGroup');
    const div = searchParams.get('division');
    const d = searchParams.get('district');
    const th = searchParams.get('thana');
    const n = searchParams.get('name');
    const p = searchParams.get('phone');
    
    const newFilters = {
      bloodGroup: bg || '',
      division: div || '',
      district: d || '',
      thana: th || '',
      name: n || '',
      phone: p || '',
    };
    setFilters(newFilters);
    setDebouncedFilters(newFilters);

    if (n) setSearchBy('name');
    else if (p) setSearchBy('phone');
    else setSearchBy('district');
  }, [searchParams]);

  // Handle Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['donors-search', debouncedFilters, page],
    queryFn: async () => {
      const res: any = await api.get('/donors/search', { 
        params: { ...debouncedFilters, page, limit: 9 } 
      });
      return res;
    },
  });

  const donors = searchResults?.data || [];
  const totalPages = searchResults?.meta?.totalPages || 1;

  const user = useAuthStore(state => state.user);

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'searchBy') {
      setFilters(prev => ({ ...prev, district: '', division: '', thana: '', name: '', phone: '' }));
      setSearchBy(value as any);
      return;
    }
    // Reset downstream cascades
    if (key === 'division') {
      setFilters(prev => ({ ...prev, division: value, district: '', thana: '' }));
      setPage(1);
      return;
    }
    if (key === 'district') {
      setFilters(prev => ({ ...prev, district: value, thana: '' }));
      setPage(1);
      return;
    }

    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      const params = new URLSearchParams();
      if (newFilters.bloodGroup) params.set('bloodGroup', newFilters.bloodGroup);
      if (newFilters.division) params.set('division', newFilters.division);
      if (newFilters.district) params.set('district', newFilters.district);
      if (newFilters.thana) params.set('thana', newFilters.thana);
      if (newFilters.name) params.set('name', newFilters.name);
      if (newFilters.phone) params.set('phone', newFilters.phone);
      window.history.replaceState(null, '', `?${params.toString()}`);
      return newFilters;
    });
    setPage(1);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .bg-grid-white { background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 30px 30px; }
      `}</style>

      {/* 1. Hero Section */}
      <section className="pt-32 pb-24 bg-gray-50/50 border-b border-gray-100 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[40rem] h-[40rem] bg-red-600/[0.05] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-red-600/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 mb-6">
                   <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-xl shadow-red-600/10">Donor Registry</span>
                   <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-red-100 italic shadow-sm">
                     <ShieldCheck size={14} className="text-green-500" /> Verified Donors
                   </div>
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-gray-900 italic uppercase tracking-tighter leading-none italic">
                  Search the <br/><span className="text-red-600">Blood Network</span>
                </h1>
                <p className="text-gray-500 font-medium italic text-xl leading-relaxed max-w-2xl mx-auto mt-6">
                  Find and connect with blood donors in your area. Quick, reliable, and life-saving.
                </p>
             </div>

            {/* Search Filters */}
            <div className="bg-white border border-gray-200 p-3 rounded-[3.5rem] shadow-xl flex flex-col lg:flex-row gap-3 items-center group/forge hover:border-gray-300 transition-all duration-700">
              <div className="flex-[0.8] w-full relative group/input">
                <Droplets className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500 transition-transform" />
                <select 
                  className="w-full bg-gray-50 text-gray-900 rounded-[2.5rem] border-none outline-none pl-16 pr-8 py-5 font-black italic uppercase text-[10px] appearance-none cursor-pointer tracking-widest hover:bg-gray-100 transition-all"
                  value={filters.bloodGroup}
                  onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                >
                  <option value="">Blood Group</option>
                  {BLOOD_GROUPS.map(g => (
                    <option key={g} value={g}>{g.replace('_POS', '+').replace('_NEG', '-')}</option>
                  ))}
                </select>
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-gray-200" />

              <div className="flex-[0.7] w-full relative group/input">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  className="w-full bg-gray-50 text-gray-900 rounded-[2.5rem] border-none outline-none pl-16 pr-8 py-5 font-black italic uppercase text-[10px] appearance-none cursor-pointer tracking-widest hover:bg-gray-100 transition-all"
                  value={searchBy}
                  onChange={(e) => handleFilterChange('searchBy', e.target.value)}
                >
                  <option value="district">Search By Location</option>
                  <option value="name">Search By Name</option>
                  <option value="phone">Search By Phone</option>
                </select>
              </div>

              <div className="hidden lg:block w-[1px] h-10 bg-white/10" />

              <div className="flex-1 w-full relative group/input">
                {searchBy === 'district' ? (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="relative flex-1">
                      <select
                        className="w-full bg-gray-50 text-gray-900 rounded-[2.5rem] border-none outline-none px-8 py-5 font-black italic uppercase text-[10px] appearance-none cursor-pointer hover:bg-gray-100 transition-all"
                        value={filters.division}
                        onChange={(e) => handleFilterChange('division', e.target.value)}
                      >
                        <option value="">Division</option>
                        {getDivisions().map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    {filters.division && (
                      <div className="relative flex-1">
                        <select
                          className="w-full bg-gray-50 text-gray-900 rounded-[2.5rem] border-none outline-none px-8 py-5 font-black italic uppercase text-[10px] appearance-none cursor-pointer hover:bg-gray-100 transition-all"
                          value={filters.district}
                          onChange={(e) => handleFilterChange('district', e.target.value)}
                        >
                          <option value="">District</option>
                          {getDistricts(filters.division).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                ) : (
                  <input 
                    type={searchBy === 'phone' ? 'tel' : 'text'}
                    placeholder={searchBy === 'phone' ? 'ENTER PHONE...' : 'ENTER NAME...'}
                    className="w-full bg-gray-50 text-gray-900 rounded-[2.5rem] border-none outline-none px-10 py-5 font-black italic uppercase text-[10px] placeholder:text-gray-400 focus:bg-gray-100 tracking-widest transition-all"
                    value={searchBy === 'name' ? filters.name : filters.phone}
                    onChange={(e) => handleFilterChange(searchBy, e.target.value)}
                  />
                )}
              </div>

              <button className="bg-white text-gray-950 w-full lg:w-20 h-16 rounded-[2rem] flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 shrink-0 group/btn">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6 group-hover/btn:scale-125 transition-transform" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Biometric Results Matrix */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="py-44 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
              <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic animate-pulse font-mono font-bold italic">Synchronizing Regional Hero Manifest...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {donors.map((donor: any, i: number) => (
                  <div 
                    key={donor.id} 
                    className="p-12 rounded-[5rem] bg-white border border-gray-50 hover:border-red-100 shadow-sm hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-700 group relative overflow-hidden flex flex-col items-center text-center space-y-10"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="relative group/avatar">
                      <div className="w-32 h-32 bg-gray-50 rounded-[3.5rem] flex items-center justify-center border-4 border-white shadow-2xl overflow-hidden relative z-10 group-hover:scale-110 transition-transform duration-700">
                        {donor.profileImage ? (
                          <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center">
                            <p className="text-4xl font-black mb-1 italic text-gray-900">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                            <span className="text-[8px] font-black uppercase text-gray-400">Sector</span>
                          </div>
                        )}
                      </div>
                      <div className={`absolute -inset-4 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${donor.isAvailable ? 'bg-green-500/10' : 'bg-red-500/10'}`}></div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <div>
                        <h3 className="text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase italic tracking-tighter leading-none italic mb-2">
                           {donor.name || 'Anonymous Donor'}
                        </h3>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} • Verified Donor</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full pt-4">
                        <div className="bg-gray-50 p-4 rounded-[2rem] border border-gray-50 flex flex-col items-center gap-1 group-hover:bg-white transition-all">
                           <MapPin size={16} className="text-red-500" />
                           <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter">{donor.district}</span>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-[2rem] border border-gray-50 flex flex-col items-center gap-1 group-hover:bg-white transition-all">
                           <Droplets size={16} className="text-red-600" />
                           <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter">{donor.totalDonations} Donations</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-center">
                        <span className={`text-[10px] font-black px-6 py-2 rounded-full uppercase italic tracking-[0.3em] border flex items-center gap-3 w-fit ${donor.isAvailable ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-100 text-gray-400 border-gray-200'}`}>
                           <div className={`w-2.5 h-2.5 rounded-full ${donor.isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                           {donor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <Link 
                        href={`/donors/${donor.id}`}
                        className="w-full bg-gray-900 text-white py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all flex items-center justify-center gap-3 italic active:scale-95 shadow-xl"
                      >
                         View Profile <ArrowRight size={18} />
                      </Link>

                      {user && donor.user?.phone && (
                        <a
                          href={`tel:${donor.user.phone}`}
                          className="w-full bg-gray-50 border border-gray-100 text-gray-900 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white hover:border-green-600 transition-all flex items-center justify-center gap-3 italic"
                        >
                          <Phone size={16} /> Call: {donor.user.phone}
                        </a>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.01)_0%,transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  </div>
                ))}

                {donors.length === 0 && (
                  <div className="col-span-full py-60 text-center bg-gray-50 rounded-[6rem] border border-gray-200 relative overflow-hidden group">
                    <Search className="w-24 h-24 text-gray-200 mx-auto mb-10 group-hover:scale-110 transition-transform" />
                    <h3 className="text-4xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter italic leading-none">No Donors Found</h3>
                    <p className="text-gray-500 italic max-w-sm mx-auto text-lg leading-relaxed">No matching donors found in this area. Try adjusting your search filters.</p>
                  </div>
                )}
              </div>

              {/* Tactical Pagination Node */}
              {totalPages > 1 && (
                <div className="mt-24 flex justify-center items-center gap-8 animate-fade-in">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-20 h-20 rounded-[2.5rem] bg-gray-50 border border-gray-100 text-gray-900 disabled:opacity-30 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90 flex items-center justify-center"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="px-12 py-6 bg-gray-900 rounded-[2.5rem] text-white flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] mb-1 italic leading-none">Page</span>
                    <span className="text-4xl font-black italic tracking-tighter leading-none italic">{page} <span className="text-red-500">/</span> {totalPages}</span>
                  </div>
                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-20 h-20 rounded-[2.5rem] bg-gray-50 border border-gray-100 text-gray-900 disabled:opacity-30 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90 flex items-center justify-center"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action Footer Accent */}
      <div className="bg-white py-40 border-t border-gray-100 relative overflow-hidden group">
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
            <h2 className="text-4xl md:text-6xl text-gray-900 font-black tracking-tighter italic uppercase leading-none italic">Help Save a Life.<br/><span className="text-red-600 italic">Become a Donor Today.</span></h2>
            <p className="text-gray-500 font-medium italic text-lg max-w-2xl mx-auto leading-relaxed">
               RoktoLagbe connects people with life-saving blood donors. Join our community and help make a difference.
            </p>
         </div>
      </div>
    </>
  );
}

export default function DonorsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={
        <div className="min-h-screen py-32 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Initializing Portal...</p>
        </div>
      }>
        <DonorsList />
      </Suspense>
    </main>
  );
}
