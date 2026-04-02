"use client";

import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, MapPin, Droplets, Loader2, Plus, 
  Zap, Activity, Target, ShieldAlert,
  ChevronRight, ArrowRight, ShieldCheck,
  TrendingUp, HeartPulse, Globe
} from 'lucide-react';

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
  });

  // Sync state if URL changes (back/forward)
  useEffect(() => {
    setFilters({
      bloodGroup: searchParams.get('bloodGroup') || '',
      district: searchParams.get('district') || '',
    });
  }, [searchParams]);

  const { data: requestsResponse, isLoading } = useQuery({
    queryKey: ['urgent-requests', filters],
    queryFn: async () => {
      const res: any = await api.get('/blood-requests', { params: { ...filters, limit: 20 } });
      return res.data;
    },
  });

  const requests = (requestsResponse as any) || [];

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    const params = new URLSearchParams();
    if (newFilters.bloodGroup) params.set('bloodGroup', newFilters.bloodGroup);
    if (newFilters.district) params.set('district', newFilters.district);
    window.history.replaceState(null, '', `?${params.toString()}`);
    setFilters(newFilters);
  };

  return (
    <main className="min-h-screen bg-white italic">
      {/* 1. Page Header */}
      <section className="pt-32 pb-24 bg-gray-50/50 border-b border-gray-100 relative overflow-hidden px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left space-y-6">
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic shadow-xl shadow-red-600/10">
                     Active Requests
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-red-100 italic shadow-sm">
                    <Globe size={14} className="text-red-500" />
                    Live Updates
                  </div>
               </div>
               <h1 className="text-6xl lg:text-8xl font-black text-gray-900 italic uppercase tracking-tighter mb-4 leading-none italic leading-none">
                 Blood <span className="text-red-600">Requests</span>
               </h1>
               <p className="text-gray-500 font-medium italic text-lg leading-relaxed max-w-xl">
                 Browse and respond to urgent blood requests across all regions. Every response is a chance to save a life.
               </p>
            </div>

            {/* Search Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-white border border-gray-200 p-6 rounded-[3.5rem] shadow-xl w-full lg:w-auto relative overflow-hidden">
               <div className="flex-1 w-full sm:w-56 relative group/select">
                 <Droplets className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                 <select
                   className="w-full bg-transparent border-none outline-none pl-14 pr-8 py-4 font-black italic uppercase text-[10px] appearance-none cursor-pointer text-gray-900 tracking-widest"
                   value={filters.bloodGroup}
                   onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
                 >
                   <option value="">Blood Group</option>
                   {BLOOD_GROUPS.map(g => (
                     <option key={g} value={g}>{g.replace('_POS', '+').replace('_NEG', '-')}</option>
                   ))}
                 </select>
                 <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
               </div>
               <div className="hidden sm:block w-[1px] h-10 bg-gray-100" />
               <div className="flex-1 w-full sm:w-56 relative group/select">
                 <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
                 <select
                   className="w-full bg-transparent border-none outline-none pl-14 pr-8 py-4 font-black italic uppercase text-[10px] appearance-none cursor-pointer text-gray-900 tracking-widest"
                   value={filters.district}
                   onChange={(e) => handleFilterChange('district', e.target.value)}
                 >
                   <option value="">Any District</option>
                   {DISTRICTS.map(d => (
                     <option key={d} value={d}>{d}</option>
                   ))}
                 </select>
                 <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
               </div>
               <Link href="/emergency-request" className="w-full sm:w-auto bg-gray-900 text-white px-10 py-5 rounded-[2rem] font-black uppercase italic text-[11px] tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 italic">
                 <Plus className="w-4 h-4" />
                 Request Blood
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Requests Feed (Grid) */}
      <section className="py-24 pb-48 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="py-44 flex flex-col items-center justify-center">
               <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
               <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse leading-none italic">Syncing urgent requests...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
              {requests.map((request: any, i: number) => {
                 const confirmed = request.donations?.filter((d: any) => d.status === 'VERIFIED').length || 0;
                 const needed = Math.max(0, request.unitsRequired - confirmed);
                 const progress = Math.min(100, (confirmed / request.unitsRequired) * 100);

                 return (
                  <div
                    key={request.id}
                    className={`p-10 rounded-[3.5rem] relative overflow-hidden transition-all duration-700 hover:-translate-y-3 group border border-gray-100 bg-white hover:border-red-100 shadow-sm hover:shadow-2xl`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {(request.urgency === 'EMERGENCY' || request.isEmergency) && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] uppercase font-black px-10 py-3.5 rounded-bl-[2rem] tracking-widest shadow-lg animate-pulse z-10 italic">
                        Emergency
                      </div>
                    )}

                    <div className="flex items-center gap-8 mb-10">
                      <div className={`w-24 h-24 rounded-[1.5rem] flex flex-col items-center justify-center border-4 transition-all shadow-xl ${request.isEmergency ? 'bg-red-600 text-white border-red-500 shadow-red-600/30' : 'bg-red-50 text-red-600 border-white group-hover:bg-red-600 group-hover:text-white'}`}>
                        <p className="text-4xl font-black mb-1 italic tracking-tighter leading-none italic">{request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-50 italic">Group</span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-2xl italic uppercase tracking-tighter text-gray-900 truncate leading-tight group-hover:text-red-600 transition-colors">
                          {request.hospitalName || 'Hospital Center'}
                        </h3>
                        <div className="flex items-center gap-2.5 mt-2">
                          <MapPin size={14} className="text-red-500" />
                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest truncate italic tracking-[0.15em] leading-none">{request.district}</p>
                        </div>
                      </div>
                    </div>

                    {/* Request Details */}
                     <div className="grid grid-cols-2 gap-6 mb-10">
                       <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group-hover:bg-white transition-all overflow-hidden shadow-inner">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Condition</p>
                          <p className="text-sm font-black text-red-600 italic truncate leading-none uppercase">{request.patientCondition || 'Emergency'}</p>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 group-hover:bg-white transition-all shadow-inner">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">Requirement</p>
                          <p className="text-sm font-black text-gray-900 italic leading-none">{request.unitsRequired} Units</p>
                       </div>
                     </div>

                    {/* Donation Progress */}
                    <div className="space-y-6 mb-12 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 group-hover:bg-white transition-all shadow-inner">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                           <span className="text-gray-400 flex items-center gap-2">Donation Progress</span>
                           <span className="text-gray-900 font-mono italic">{confirmed} / {request.unitsRequired} UNITS</span>
                        </div>
                        <div className="h-4 w-full bg-white rounded-full overflow-hidden p-1 border border-gray-100 shadow-inner">
                           <div 
                              className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-xl"
                              style={{ width: `${progress}%` }}
                           />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic pt-2">
                           <span className="text-gray-400 flex items-center gap-2">Status</span>
                           <span className={`italic font-mono ${needed > 0 ? 'text-red-500' : 'text-green-600'}`}>
                              {needed > 0 ? `${needed} Still Needed` : 'FULFILLED'}
                           </span>
                        </div>
                    </div>

                     <Link
                       href={`/urgent-requests/${request.id}`}
                       className={`block w-full text-center py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 italic flex items-center justify-center gap-4 group/btn ${request.isEmergency ? 'bg-red-600 text-white hover:bg-gray-900' : 'bg-gray-900 text-white hover:bg-red-600'}`}
                     >
                       Respond Now <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                     </Link>
                  </div>
                 );
              })}

              {requests.length === 0 && (
                <div className="col-span-full py-56 text-center bg-white rounded-[4rem] border-4 border-dashed border-gray-100 group relative overflow-hidden transition-all duration-700">
                  <div className="relative z-10 space-y-10">
                     <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700 border-2 border-gray-100">
                        <ShieldCheck className="w-16 h-16 text-gray-200" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">No Requests Found</h3>
                        <p className="text-gray-400 italic text-sm font-medium max-w-sm mx-auto leading-relaxed">There are no active blood requests for the selected criteria. Please try different filters.</p>
                     </div>
                     <Link href="/urgent-requests" className="inline-flex items-center gap-6 bg-gray-900 text-white px-12 py-5 rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-red-600 transition-all italic active:scale-95">
                        Clear Filters <Globe className="w-5 h-5" />
                     </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Additional Info */}
      <div className="bg-gray-50 py-32 border-t border-gray-100 relative overflow-hidden italic shadow-inner">
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-12">
            <div className="space-y-4">
               <HeartPulse className="w-16 h-16 text-red-600 mx-auto mb-8 animate-bounce" />
               <p className="text-red-500 font-black text-[10px] uppercase tracking-widest italic">Your Support Matters</p>
               <h2 className="text-4xl md:text-6xl text-gray-900 font-black tracking-tighter italic uppercase leading-none">Every Donation Helps <br/> Save A <span className="text-red-600 italic">Life</span></h2>
            </div>
            <p className="text-gray-500 font-medium italic text-lg max-w-3xl mx-auto leading-relaxed">
               RoktoLagbe connects critical blood requests with life-saving donors. We help bridge the gap in emergency situations to ensure help is always reachable.
            </p>
         </div>
      </div>
    </main>
  );
}

export default function UrgentRequestsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-44 flex flex-col items-center justify-center bg-white italic">
        <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin shadow-xl"></div>
        <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Loading requests...</p>
      </div>
    }>
      <UrgentRequestsContent />
    </Suspense>
  );
}
