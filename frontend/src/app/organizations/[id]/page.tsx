'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Activity, 
  Gift, 
  Users,
  Droplets,
  Calendar,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: orgData, isLoading, error } = useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const res: any = await api.get(`/managers/${id}`);
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] italic">
      <div className="w-16 h-16 border-4 border-red-50 dark:border-white/5 border-t-red-600 rounded-full animate-spin"></div>
      <p className="mt-8 text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest italic animate-pulse">Initializing Organization Hub...</p>
    </div>
  );

  if (error || !orgData) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] p-8 text-center italic">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6">Archive Missing</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-12 italic text-lg max-w-sm">This medical node might have shifted or the signature is no longer valid.</p>
      <button onClick={() => router.back()} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 italic">RETURN TO GRID</button>
    </div>
  );

  const org = orgData;

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 italic">
      {/* 1. Integrated Header Navigation */}
      <div className="pt-12 px-8 sm:px-12 lg:px-20 max-w-[1700px] mx-auto italic">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-4 text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] hover:text-red-600 transition-all italic group leading-none"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform italic" />
          EXIT TO DIRECTORY
        </button>
      </div>

      {/* 2. Hero Component - Premium Glass Container */}
      <section className="pt-16 pb-20 italic">
        <div className="max-w-[1700px] mx-auto px-8 sm:px-12 lg:px-20 italic">
          <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 lg:p-24 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm relative overflow-hidden group italic scroll-mt-20">
            <div className="flex flex-col xl:flex-row items-center gap-20 relative z-10 italic">
              
              {/* Identity Matrix Core */}
              <div className="relative italic">
                <div className="w-56 h-56 lg:w-72 lg:h-72 bg-white dark:bg-white/5 text-red-600 rounded-[5rem] lg:rounded-[6rem] flex flex-col items-center justify-center border-4 border-gray-50 dark:border-white/10 shadow-2xl group-hover:scale-105 transition-transform duration-1000 overflow-hidden italic">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-24 h-24 lg:w-32 lg:h-32 text-red-600 opacity-20 italic" />
                  )}
                </div>
                {org.isVerified && (
                  <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-red-600/30 border-4 border-white dark:border-[#0a0a0d] italic">
                    <ShieldCheck className="w-8 h-8 italic" />
                  </div>
                )}
              </div>

              {/* Data Streams */}
              <div className="flex-1 text-center xl:text-left italic">
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 mb-10 italic">
                  <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.4em] italic shadow-2xl shadow-red-600/20 leading-none">
                    {org.type} HUB
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-gray-900 dark:text-white font-black uppercase tracking-[0.3em] bg-white dark:bg-white/5 px-6 py-2 rounded-full border border-gray-100 dark:border-white/10 italic leading-none">
                    AUTHENTICITY SECURED
                  </div>
                </div>
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter mb-8 leading-none italic">
                  {org.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-8 text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] text-[10px] italic mb-12 italic leading-none">
                  <div className="flex items-center gap-3 italic">
                    <MapPin className="w-5 h-5 text-red-600 italic" />
                    {org.district} GRID
                  </div>
                  {org.website && (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-red-600 transition-colors italic">
                      <Globe className="w-5 h-5 text-red-600 italic" />
                      SECURE WEB INTERFACE
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-center xl:justify-start gap-6 italic">
                   <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center italic">
                      <Phone size={24} className="italic" />
                   </div>
                   <div className="text-left italic">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1 italic leading-none">SIGNAL LINE</p>
                      <p className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none italic">{org.contactPhone}</p>
                   </div>
                </div>
              </div>

              {/* Matrix Statistics */}
              <div className="w-full xl:w-96 bg-white dark:bg-white/5 p-12 rounded-[4rem] border border-gray-100 dark:border-white/10 flex flex-col items-center justify-center text-center italic shadow-sm">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.5em] mb-10 italic leading-none">NETWORK INTENSITY</p>
                <div className="grid grid-cols-2 gap-10 w-full italic">
                  <div className="space-y-3 italic">
                    <p className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter leading-none italic">{org._count?.members || 0}</p>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] leading-none italic">OPERATIVES</p>
                  </div>
                  <div className="space-y-3 italic">
                    <p className="text-4xl lg:text-5xl font-black text-red-600 italic tracking-tighter leading-none italic">{org._count?.bloodRequests || 0}</p>
                    <p className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] leading-none italic">MISSIONS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Stream Dynamics */}
            <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.04] rounded-full blur-[140px] pointer-events-none group-hover:scale-110 transition-transform duration-1000 italic" />
          </div>
        </div>
      </section>

      {/* 3. Operational Data Modules */}
      <section className="pb-40 italic">
        <div className="max-w-[1700px] mx-auto px-8 sm:px-12 lg:px-20 italic">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 italic text-left">

            {/* Information Core */}
            <div className="xl:col-span-2 space-y-20 italic text-left">
              
              <div className="space-y-12 italic text-left">
                <div className="flex items-center gap-6 italic">
                   <div className="w-12 h-1 bg-red-600 rounded-full italic" />
                   <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none italic">NODE SPECIFICATIONS</h2>
                </div>
                <div className="space-y-10 italic text-left">
                  <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 leading-relaxed italic max-w-4xl text-left">
                    {org.description || "Foundational medical infrastructure optimized for regional blood distribution and volunteer coordination. Actively monitoring local supply vectors to ensure immediate response capability."}
                  </p>
                  {org.address && (
                    <div className="p-10 rounded-[3rem] bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm italic text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" />
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em] mb-4 italic leading-none">GEOSPATIAL COORDINATES</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-tight italic">{org.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Protocol Rewards */}
              <div className="space-y-12 italic text-left">
                <div className="flex items-center gap-6 italic">
                   <div className="w-12 h-1 bg-amber-500 rounded-full italic" />
                   <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none italic">OPERATIVE PERKS</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 italic">
                  {org.rewards && org.rewards.length > 0 ? (
                    org.rewards.map((r: any) => (
                      <div key={r.id} className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-8 rounded-[3.5rem] border border-gray-100 dark:border-white/10 flex items-center gap-8 hover:shadow-2xl transition-all group relative overflow-hidden italic shadow-sm">
                        <div className="w-20 h-20 bg-white dark:bg-amber-600/10 text-amber-500 rounded-[2rem] flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-xl border border-gray-50 dark:border-amber-500/20 italic">
                          <Gift className="w-10 h-10 italic" />
                        </div>
                        <div className="space-y-2 italic text-left">
                          <p className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter italic leading-none">{r.title}</p>
                          <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] mt-2 italic leading-none">{r.pointsCost} CP REQUIRED</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-24 text-center rounded-[3.5rem] border-4 border-dashed border-gray-100 dark:border-white/5 bg-gray-50/20 dark:bg-transparent italic">
                      <p className="text-gray-400 dark:text-gray-700 italic font-black text-[10px] uppercase tracking-[0.5em] leading-relaxed">NO ACTIVE REWARD PROTOCOLS <br/>CURRENTLY DEPLOYED</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Matrix Sideview */}
            <div className="space-y-12 italic text-left">
              
              {/* Mission Stream */}
              <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[4rem] border border-gray-100 dark:border-white/[0.08] shadow-sm italic text-left">
                <div className="flex items-center justify-between mb-12 italic">
                  <div className="space-y-2 italic">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic italic leading-none">MISSION FEED</h3>
                    <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.5em] italic leading-none">REAL-TIME SIGNALS</p>
                  </div>
                  <div className="w-4 h-4 bg-red-600 rounded-full animate-ping shadow-[0_0_15px_rgba(220,38,38,0.6)]" />
                </div>
                
                <div className="space-y-10 italic">
                  {org.bloodRequests && org.bloodRequests.length > 0 ? (
                    org.bloodRequests.map((req: any) => (
                      <Link key={req.id} href="/urgent-requests" className="block p-8 bg-white dark:bg-white/5 rounded-[2.5rem] hover:bg-red-50 dark:hover:bg-red-600/10 transition-all border border-gray-100 dark:border-white/10 group shadow-sm italic">
                        <div className="flex items-center justify-between mb-6 italic">
                          <span className="text-3xl font-black text-red-600 italic tracking-tighter leading-none italic">{req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
                          <span className="text-[8px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic leading-none">URGENT</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] italic leading-relaxed line-clamp-3">{req.notes || "Emergency contribution protocol activated by node manager."}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="py-20 text-center italic">
                       <p className="text-gray-300 dark:text-gray-800 italic font-black text-[10px] uppercase tracking-[0.6em] leading-relaxed">ALL SYSTEM VECTORS <br/>CURRENTLY SATISFIED</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recruitment Module */}
              <div className="p-12 rounded-[4rem] bg-gray-900 border border-white/10 text-white shadow-2xl relative overflow-hidden group/recruit italic">
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-red-600 rounded-full blur-[100px] pointer-events-none group-hover/recruit:scale-150 transition-transform duration-1000 italic opacity-40"></div>
                <div className="relative z-10 italic">
                  <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-6 relative z-10 italic">JOIN NODE</h3>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.35em] mb-12 leading-relaxed italic relative z-10 italic">
                    Establish direct synchronization with this medical hub. Receive immediate alerts for high-priority regional missions.
                  </p>
                  <div className="flex flex-col gap-6 relative z-10 italic">
                     <Link href={`/register?orgRef=${org.inviteToken}`} className="block w-full bg-white text-gray-900 text-center py-6 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95 italic">
                       BECOME OPERATIVE
                     </Link>
                     <button 
                       onClick={() => {
                          const link = `${window.location.origin}/register?orgRef=${org.inviteToken}`;
                          navigator.clipboard.writeText(link);
                          toast.success('INVITE PROTOCOL COPIED! 📋');
                       }}
                       className="block w-full bg-white/5 border border-white/10 text-white text-center py-6 rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/10 transition-all italic"
                     >
                       EXPORT INVITE
                     </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
