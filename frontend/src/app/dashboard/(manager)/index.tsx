'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import Link from 'next/link';
import { 
  Droplets, Award, ChevronRight, Users, Gift, Plus, 
  Activity, ShieldCheck, MapPin, Building2, TrendingUp,
  Zap, Globe, Target, Calendar, Clock
} from 'lucide-react';

export default function ManagerDashboard() {
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['manager-analytics'],
    queryFn: () => api.get('/managers/me/analytics'),
  });

  const { data: orgData, isLoading: orgLoading } = useQuery({
    queryKey: ['my-org-profile'],
    queryFn: () => api.get('/managers/me'),
  });

  if (analyticsLoading || orgLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
         <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
         <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading dashboard...</p>
    </div>
    );
  }

  const analyticResults = (analyticsData as any)?.data || { stats: {}, recentActivities: [] };
  const stats = analyticResults.stats || {};
  const recentActivities = analyticResults.recentActivities || [];
  const org = (orgData as any)?.data || {};

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-28 italic">
      {/* Hospital Dashboard Hero */}
      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[3.5rem] p-12 md:p-20 text-gray-900 dark:text-white shadow-sm relative overflow-hidden group border border-gray-100 dark:border-white/[0.08] italic">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[40rem] h-[40rem] bg-red-600/[0.04] rounded-full blur-[140px] pointer-events-none group-hover:bg-red-600/[0.06] transition-all duration-1000 italic"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-16 italic">
          <div className="space-y-10 flex-1 italic text-left">
            <div className="flex flex-wrap items-center gap-4 italic justify-start">
               <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-2xl shadow-red-600/30 italic">VERIFIED HUB</span>
               <div className="flex items-center gap-3 text-[10px] text-gray-900 dark:text-gray-100 font-black uppercase tracking-widest bg-white dark:bg-white/5 px-5 py-2 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm italic">
                 <MapPin size={16} className="text-red-500 italic" />
                 {org.district || 'Location'}
               </div>
               <div className="flex items-center gap-3 text-[10px] text-green-600 font-black uppercase tracking-widest bg-white dark:bg-white/5 px-5 py-2 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm italic">
                 <ShieldCheck size={16} className="italic" />
                 OPERATIONAL
               </div>
            </div>
            
            <div className="space-y-4 italic text-left">
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter italic uppercase leading-none italic">{org.name || 'Medical Center'}</h1>
               <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium italic max-w-2xl leading-relaxed italic">
                 Coordinate mission-critical blood logistics and donor verification in real-time.
               </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto italic">
            <Link href="?tab=requests-new" className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white px-12 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-4 active:scale-95 italic italic group/btn">
              <Plus size={22} className="group-hover/btn:rotate-90 transition-transform italic" /> CREATE REQUEST
            </Link>
          </div>
        </div>
      </div>

      {/* Hospital Analytics Grid - Optimized for all screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 italic">
        {[
          { label: 'Platform Activity', value: stats.openRequests || 0, icon: Activity, trend: 'Emergency', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Fulfilment Matrix', value: `${Math.round(stats.efficiency || 0)}%`, icon: TrendingUp, trend: 'Precision', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Donor Network', value: stats.totalMembers || 0, icon: Users, trend: 'Global', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Matrix Storage', value: stats.inventory?.totalUnits || 0, icon: ShieldCheck, trend: 'Secured', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-10 rounded-[3rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-white/5 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-72 italic">
             <div className="flex justify-between items-start mb-6 italic">
                <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform italic`}>
                   <stat.icon size={26} className="italic" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-white/50 dark:bg-white/10 rounded-full border border-gray-100 dark:border-white/10 italic">
                   <span className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-600 italic tracking-widest">{stat.trend}</span>
                </div>
             </div>
             <div className="space-y-3">
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic leading-none">{stat.label}</p>
                <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none italic">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 italic">
        {/* Recent Activity */}
        <div className="xl:col-span-2 space-y-10 italic">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 px-4 italic text-left">
            <div className="italic">
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase italic leading-none italic">Mission Logs</h2>
              <p className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] mt-2 italic">DYNAMICS OF SYNCED OPERATIONS</p>
            </div>
            <Link href="?tab=requests" className="bg-gray-50/50 dark:bg-white/5 hover:bg-red-600 hover:text-white text-gray-500 dark:text-gray-400 px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] transition-all italic border border-gray-100 dark:border-white/10 shadow-sm active:scale-95 italic italic">ARCHIVE LOGS →</Link>
          </div>

          <div className="bg-white dark:bg-white/[0.01] rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm overflow-hidden p-8 space-y-6 italic">
            {recentActivities.map((activity: any) => (
              <div key={activity.id} className="p-8 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all flex flex-col sm:flex-row gap-10 items-center justify-between group rounded-[2.5rem] border border-transparent hover:border-gray-100 dark:hover:border-white/10 italic">
                <div className="flex items-center gap-8 italic">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-gray-900 dark:bg-red-600/10 text-white dark:text-red-600 flex flex-col items-center justify-center border border-white/10 font-black group-hover:scale-105 transition-all shadow-xl shrink-0 overflow-hidden italic">
                      {activity.donorAvatar ? (
                        <img src={activity.donorAvatar} className="w-full h-full object-cover italic" />
                      ) : (
                        <span className="text-2xl italic tracking-tighter leading-none italic uppercase">{activity.donorName[0]}</span>
                      )}
                   </div>
                   <div className="space-y-2 italic text-left">
                      <p className="text-xl font-black text-gray-900 dark:text-white uppercase italic leading-none group-hover:text-red-600 transition-colors italic">{activity.donorName}</p>
                      <div className="flex items-center gap-6 text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] mt-3 italic">
                        <span className="flex items-center gap-2 italic"><Droplets size={14} className="text-red-500 italic" /> {activity.bloodGroup.replace('_POS', '+')}</span>
                        <span className="flex items-center gap-2 italic"><Clock size={14} className="italic" /> {new Date(activity.timestamp).toLocaleTimeString()}</span>
                      </div>
                   </div>
                </div>
                 <div className="flex items-center gap-6 italic">
                    <span className={`text-[9px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest italic border italic ${activity.status === 'VERIFIED' ? 'bg-green-50/50 text-green-600 border-green-100 italic' : 'bg-orange-50/50 text-orange-600 border-orange-100 italic'}`}>
                     {activity.status}
                    </span>
                    <Link href={`/dashboard/requests?id=${activity.id}`} className="w-14 h-14 bg-white dark:bg-white/5 text-gray-200 dark:text-gray-700 hover:text-red-600 hover:border-red-600 dark:hover:text-red-600 border border-gray-100 dark:border-white/10 rounded-2xl flex items-center justify-center transition-all shadow-sm italic active:scale-90">
                     <ChevronRight size={24} className="italic" />
                    </Link>
                 </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="py-40 text-center space-y-8 italic">
                <div className="w-24 h-24 bg-gray-50/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto shadow-inner italic border border-gray-100 dark:border-white/10">
                   <Activity className="w-10 h-10 text-gray-200 dark:text-gray-800 italic" />
                </div>
                 <p className="text-gray-400 dark:text-gray-600 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none italic">NO RECENT SIGNALS DETECTED</p>
              </div>
            )}
          </div>
        </div>

        {/* Hospital Performance */}
        <div className="space-y-12 italic">
           <div className="bg-gray-900 dark:bg-white/5 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl transition-all duration-700 hover:scale-[1.02] italic">
              <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors pointer-events-none"></div>
              <div className="relative z-10 space-y-10">
                <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] border border-white/10 flex items-center justify-center italic">
                   <Target className="w-8 h-8 text-white italic" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black italic uppercase leading-none tracking-tighter italic">Operational <br/> Intelligence</h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-medium italic italic">
                    Synthesize donation patterns to optimize regional grid performance.
                  </p>
                </div>
                <button className="w-full py-6 bg-white dark:bg-red-600 text-gray-950 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 dark:hover:bg-white dark:hover:text-red-600 hover:text-white transition-all shadow-2xl shadow-black/40 italic text-center italic active:scale-95">
                  EXECUTE ANALYSIS
                </button>
              </div>
           </div>
           
           <div className="bg-white dark:bg-white/[0.01] rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-10 italic">
              <div className="flex items-center justify-between italic text-left">
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic italic">CORE SYNC STATUS</span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse italic"></span>
              </div>
              <div className="space-y-8 italic">
                 <div className="flex justify-between items-end italic text-left">
                    <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic italic">Uptime Matrix</p>
                    <p className="text-xs font-black text-green-600 italic italic">99.9%</p>
                 </div>
                 <div className="w-full h-2 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 p-0.5 italic">
                    <div className="h-full bg-green-500 rounded-full w-[99.9%] italic shadow-[0_0_10px_rgba(34,197,94,0.3)]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
