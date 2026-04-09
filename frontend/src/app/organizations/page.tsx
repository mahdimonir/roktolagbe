'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import Link from 'next/link';
import { 
  Building2, MapPin, Phone, ShieldCheck, Search, 
  Sparkles, Globe, HeartPulse, Activity, ChevronRight,
  Target, Zap, Globe2, Building
} from 'lucide-react';
import CTASection from '@/components/common/CTASection';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import SearchSuggestions from '@/components/common/SearchSuggestions';

function OrganizationsContent() {
  const { data: managersData, isLoading } = useQuery({
    queryKey: ['public-managers'],
    queryFn: () => api.get('/public/organizations'),
  });

  const organizations = managersData?.data || [];

  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter organizations based on search
  const filteredOrganizations = searchQuery.trim()
    ? organizations.filter((org: any) =>
        org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.district?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : organizations;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] italic text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* 1. Page Header - Optimized and Compact */}
      <section className="pt-32 pb-20 bg-gray-50/50 dark:bg-transparent border-b border-gray-100 dark:border-white/5 relative overflow-hidden px-4 md:px-0 scroll-mt-20 italic">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[140px] pointer-events-none italic"></div>
        
        <div className="max-w-7xl mx-auto px-10 relative z-10 italic">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-16 italic">
            <div className="max-w-3xl space-y-10 italic text-left">
               <div className="flex flex-wrap items-center gap-5 justify-start italic">
                  <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[9px] font-black tracking-[0.4em] uppercase italic shadow-2xl shadow-red-600/20">
                     MEDICAL SECTOR
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-gray-900 dark:text-gray-100 font-black uppercase tracking-[0.3em] bg-white dark:bg-white/5 px-6 py-2 rounded-full border border-gray-100 dark:border-white/10 italic shadow-sm">
                    <Building2 size={16} className="text-red-600 italic" />
                    VERIFIED NODES
                  </div>
               </div>
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-4 leading-none italic text-left">
                 Sector <span className="text-red-600 italic">Hubs</span>
               </h1>
               <p className="text-gray-500 dark:text-gray-400 font-medium italic text-lg md:text-2xl leading-relaxed max-w-2xl italic text-left">
                 Scanning global medical architecture. Monitoring verified partner nodes for synchronized life-support operations.
               </p>
            </div>

             {/* Search Interface */}
             <div className="flex flex-col gap-6 w-full xl:w-auto italic">
               <div ref={searchRef} className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 p-5 rounded-[4.5rem] shadow-2xl relative overflow-visible group/search italic">
                  <div className="flex-1 w-full sm:min-w-[400px] relative italic">
                     <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/search:text-red-600 transition-colors italic" />
                     <input 
                       type="text"
                       placeholder="SCANNING NODE NAME / LOCATION..."
                       className="w-full bg-transparent border-none outline-none pl-16 pr-6 py-6 font-black italic uppercase text-[10px] text-gray-900 dark:text-white tracking-[0.4em] placeholder:text-gray-300 dark:placeholder:text-gray-700 italic"
                       value={searchQuery}
                       onChange={(e) => {
                         setSearchQuery(e.target.value);
                         setShowSuggestions(true);
                       }}
                       onFocus={() => setShowSuggestions(true)}
                     />
                     
                     {/* Search Suggestions */}
                     <SearchSuggestions
                       query={searchQuery}
                       context="organizations"
                       onSelect={(text) => {
                         setSearchQuery(text);
                         setShowSuggestions(false);
                       }}
                       isOpen={showSuggestions}
                       onClose={() => setShowSuggestions(false)}
                     />
                  </div>
               </div>
               <div className="flex items-center justify-start gap-8 px-6 italic">
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.5em] italic flex items-center gap-4 italic leading-none">
                     <Globe size={16} className="text-red-600 italic" /> GLOBAL GRID SYNCED
                  </p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Organizations Grid - High Density 3-Column */}
      <section className="py-24 pb-48 px-4 md:px-0 transition-colors duration-500 italic">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 italic">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 italic">
               {filteredOrganizations.map((org: any, i: number) => (
                <div 
                  key={org.id} 
                  className="p-10 rounded-[4.5rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-600/30 shadow-sm hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col italic text-left"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-10 italic">
                     <div className={`w-16 h-16 rounded-[1.8rem] bg-white dark:bg-white/10 flex items-center justify-center text-red-600 shadow-xl border-4 border-gray-50 dark:border-white/5 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 italic`}>
                        {org.type === 'hospital' ? <Building size={28} className="italic" /> : <Building2 size={28} className="italic" />}
                     </div>
                      {org.isVerified && (
                       <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-5 py-2 rounded-full text-[8px] font-black tracking-[0.3em] uppercase italic border border-green-500/20 italic leading-none">
                         AUTHENTICATED
                       </span>
                     )}
                  </div>
                  
                  <div className="space-y-6 mb-10 flex-1 italic text-left">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-red-600 transition-colors uppercase italic tracking-tighter leading-none italic text-left">{org.name}</h3>
                    <div className="flex flex-wrap gap-4 italic text-left">
                       <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] italic leading-none">{org.type} HUB</p>
                       <span className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase italic tracking-[0.3em] leading-none px-4 py-1.5 bg-red-50 dark:bg-red-600/10 rounded-full italic">PARTNER</span>
                    </div>
                    
                    <div className="space-y-4 pt-6 italic">
                      <div className="bg-white dark:bg-white/5 p-4 rounded-[1.8rem] border border-gray-100 dark:border-white/10 flex items-center gap-4 transition-all shadow-sm italic">
                        <MapPin size={16} className="text-red-600 italic" />
                        <span className="text-[10px] font-black text-gray-900 dark:text-gray-200 uppercase italic tracking-[0.3em] truncate italic">{org.district}</span>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-[1.8rem] border border-gray-100 dark:border-white/10 flex items-center gap-4 transition-all shadow-sm italic">
                        <Phone size={16} className="text-green-500 italic" />
                        <span className="text-[10px] font-black text-gray-900 dark:text-gray-200 uppercase italic tracking-[0.3em] italic">{org.contactPhone}</span>
                      </div>
                      <div className="bg-red-600/5 dark:bg-red-600/10 p-4 rounded-[1.8rem] border border-red-600/10 dark:border-red-900/20 flex items-center justify-between italic">
                        <div className="flex items-center gap-4 italic">
                          <Activity size={16} className="text-red-600 italic" />
                          <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase italic tracking-[0.4em] italic leading-none">INTEGRITY</span>
                        </div>
                        <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic leading-none">OPTIMAL</span>
                      </div>
                    </div>
                  </div>

                   <div className="mt-auto pt-10 border-t border-gray-100 dark:border-white/[0.08] flex items-center justify-between italic bg-transparent">
                    <Link href={`/organizations/${org.id}`} className="text-[10px] font-black text-gray-900 dark:text-white hover:text-red-600 transition-colors flex items-center gap-3 italic uppercase tracking-[0.4em] leading-none">
                      VIEW NODE <ChevronRight size={16} className="italic" />
                    </Link>
                    <div className="text-right italic">
                       <p className="text-xl font-black text-red-600 leading-none italic">{org._count?.bloodRequests || 0}</p>
                       <p className="text-[8px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] leading-none mt-2 italic">MISSIONS</p>
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrganizations.length === 0 && (
                <div className="col-span-full py-60 text-center bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] border border-dashed border-gray-100 dark:border-white/[0.08] group relative overflow-hidden italic">
                   <div className="relative z-10 space-y-12 italic">
                      <div className="w-32 h-32 bg-white dark:bg-white/10 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-700 border-4 border-red-600/20 italic">
                         <Building2 className="w-16 h-16 text-gray-200 dark:text-gray-800 italic" />
                      </div>
                      <div className="space-y-6 italic">
                         <h3 className="text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none italic">Sector Offline</h3>
                         <p className="text-gray-400 dark:text-gray-600 italic text-lg font-black uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed italic">No active nodes detected in the grid.</p>
                      </div>
                      <Link href="/register" className="inline-flex items-center gap-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-14 py-8 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all italic active:scale-95 italic">
                         INITIALIZE NODE <ChevronRight size={20} className="italic" />
                      </Link>
                   </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <CTASection 
        title="REPRESENT A NODE?"
        subtitle="Integrate your medical institution into the global life-support architecture. Optimize management and reach volunteer operatives instantly."
        primaryBtnText="INITIALIZE REGISTRY"
        primaryBtnLink="/register"
        secondaryBtnText="SYSTEM OVERVIEW"
        secondaryBtnLink="/about"
      />
    </main>
  );
}

export default function OrganizationsPage() {
  return (
     <Suspense fallback={
       <div className="min-h-screen py-44 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0d] italic">
         <div className="w-16 h-16 border-4 border-red-50 dark:border-white/5 border-t-red-600 rounded-full animate-spin"></div>
         <p className="mt-8 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic animate-pulse">Connecting to Medical Hubs...</p>
       </div>
    }>
      <OrganizationsContent />
    </Suspense>
  );
}
