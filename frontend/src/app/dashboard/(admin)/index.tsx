'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { ApiResponse, AdminAnalytics } from '@/lib/types/models';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, CartesianGrid 
} from 'recharts';
import { 
  Users, Building2, Activity, Gift, 
  TrendingUp, ShieldAlert, CheckCircle2, 
  Clock, Globe, Zap, FileText
} from 'lucide-react';

export default function AdminOverview() {
  const { data: analytics, isLoading } = useQuery<ApiResponse<AdminAnalytics>>({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics'),
  });

  const stats = analytics?.data;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] italic">
       <div className="w-16 h-16 border-4 border-red-50 dark:border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-8 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse italic">Accessing central intelligence...</p>
    </div>
  );

  const cards = [
    { title: 'Total Donors', value: stats?.donors?.total || 0, sub: `${stats?.donors?.available || 0} available`, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Partners', value: stats?.managers?.total || 0, sub: `${stats?.managers?.verified || 0} verified`, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Fulfilment Rate', value: `${stats?.resolutionRate || 0}%`, sub: `${stats?.requests?.fulfilled || 0} fulfilled`, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Donations', value: stats?.donations?.total || 0, sub: 'Lifetime impact', icon: Gift, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-40 italic">
      {/* Admin Header */}
      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 md:p-20 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm relative overflow-hidden group italic text-left">
         <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"></div>
         <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 relative z-10 italic">
            <div className="flex items-center gap-10 italic">
               <div className="w-24 h-24 bg-gray-900 border border-white/10 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(220,38,38,0.3)] italic">
                  <Globe className="w-12 h-12 text-red-600 italic animate-spin-slow" />
               </div>
               <div className="space-y-4 italic text-left">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none italic">Global Matrix</h1>
                  <div className="flex flex-wrap items-center gap-4 italic justify-start">
                     <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-2xl shadow-red-600/30">ADMINISTRATIVE CORE</span>
                     <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-widest bg-white dark:bg-white/5 px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 italic">
                       <Zap size={18} className="text-amber-500 italic" /> STATUS: OPERATIONAL
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-8 p-10 bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-sm italic text-left">
               <div className="flex flex-col items-start gap-4 italic">
                  <div className="flex items-center gap-4 italic">
                    <div className="w-3.5 h-3.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)] animate-pulse italic"></div>
                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] italic leading-none">ALL SYSTEMS NOMINAL</span>
                  </div>
                  <p className="text-[8px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] italic">SYNCED WITH CORE GRID</p>
               </div>
            </div>
         </div>
      </div>

      {/* Platform KPIs - Optimized for all screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 italic">
        {cards.map((card, i) => (
          <div key={card.title} className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-white/5 transition-all duration-700 group relative overflow-hidden flex flex-col justify-between h-80 italic">
             <div className="flex justify-between items-start italic">
                <div className={`w-20 h-20 rounded-[1.8rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform italic shadow-lg`}>
                   <card.icon size={32} className="italic" />
                </div>
             </div>
             <div className="space-y-4 italic relative z-10 text-left">
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic leading-none">{card.title}</p>
                <p className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none italic">{card.value}</p>
             </div>
             <div className="bg-white/50 dark:bg-white/10 px-8 py-4 rounded-2xl border border-gray-100 dark:border-white/10 w-fit italic shadow-sm transform group-hover:translate-x-2 transition-transform">
                <p className="text-[9px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-[0.25em] italic">{card.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Section - Optimized Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 italic text-left">
         {/* Donation Trends */}
         <div className="xl:col-span-2 bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] p-12 lg:p-20 text-gray-900 dark:text-white relative overflow-hidden group shadow-sm border border-gray-100 dark:border-white/[0.08] italic">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-10 italic">
               <div className="space-y-3 italic text-left">
                  <h3 className="text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-none italic">Temporal Core</h3>
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] mt-3 italic">MATRIX DYNAMICS OVER 30D SPECTRUM</p>
               </div>
               <div className="flex bg-white/50 dark:bg-white/10 p-2.5 rounded-[2rem] border border-gray-100 dark:border-white/10 gap-3 shadow-inner italic">
                  <button className="px-10 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] bg-red-600 text-white shadow-2xl shadow-red-600/30 transition-all italic active:scale-95">RETRIEVE LOGS</button>
               </div>
            </div>

            <div className="h-[28rem] w-full relative z-10 italic">
                {stats?.donations?.trends && stats.donations.trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={stats.donations.trends}>
                       <defs>
                         <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                           <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(239, 68, 68, 0.05)" />
                       <XAxis 
                         dataKey="date" 
                         axisLine={false} 
                         tickLine={false} 
                         tick={{ fontSize: 10, fill: '#6b7280', fontWeight: '900', fontStyle: 'italic', opacity: 0.6 }}
                         tickFormatter={(val: string) => val.split('-').slice(1).join('/')}
                         dy={25}
                       />
                       <YAxis hide domain={['auto', 'auto']} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '2.5rem', border: '1px solid rgba(220,38,38,0.1)', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.15)' }}
                         itemStyle={{ color: '#ef4444', fontWeight: '900', fontSize: '14px', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                         labelStyle={{ display: 'none' }}
                         cursor={{ stroke: '#ef4444', strokeWidth: 4, strokeDasharray: '12 12' }}
                       />
                       <Area 
                         type="monotone" 
                         dataKey="count" 
                         stroke="#ef4444" 
                         strokeWidth={10} 
                         fillOpacity={1} 
                         fill="url(#colorCount)" 
                         animationDuration={4000}
                         activeDot={{ r: 12, fill: '#fff', stroke: '#ef4444', strokeWidth: 6, filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.8))' }}
                       />
                     </AreaChart>
                  </ResponsiveContainer>
                 ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 dark:text-gray-800 gap-8 italic">
                     <Globe className="w-20 h-20 opacity-20 animate-pulse" />
                     <p className="text-[12px] font-black uppercase tracking-[0.5em] italic leading-none">SILENCE IN THE GRID</p>
                  </div>
                )}
            </div>
         </div>

         <div className="space-y-12 italic">
            {/* System Status Monitor */}
            <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4rem] p-12 lg:p-14 border border-gray-100 dark:border-white/[0.08] space-y-14 relative overflow-hidden group italic shadow-sm text-left">
               <div className="flex items-center gap-8 border-b border-gray-50 dark:border-white/[0.05] pb-12 relative z-10 italic">
                  <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-[1.5rem] flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-lg italic">
                     <ShieldAlert className="w-8 h-8 text-red-600 italic" />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase leading-none italic">Diagnostic Matrix</h3>
               </div>
               
               <div className="space-y-10 relative z-10 italic">
                   {stats?.requests && stats.requests.open > 5 ? (
                    <div className="flex items-center gap-8 p-10 bg-red-600/10 rounded-[3.5rem] border border-red-600/20 group-hover:bg-red-600/[0.15] transition-all duration-700 italic">
                       <div className="w-20 h-20 bg-red-600 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] relative">
                          <div className="absolute inset-0 bg-red-600 rounded-[2rem] animate-ping opacity-20"></div>
                          <ShieldAlert size={36} className="relative z-10 italic" />
                       </div>
                       <div className="space-y-3 italic text-left">
                          <p className="text-2xl font-black text-red-600 uppercase italic leading-none">CRITICAL FLUX</p>
                          <p className="text-[10px] text-red-500 font-black uppercase tracking-[0.3em] italic leading-none">{stats.requests.open} ACTIVE SIGNALS DETECTED</p>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-8 p-10 bg-green-500/10 rounded-[3.5rem] border border-green-500/20 hover:bg-green-500/[0.15] transition-all duration-700 italic">
                       <div className="w-20 h-20 bg-green-500 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(34,197,94,0.5)] italic">
                          <CheckCircle2 size={36} className="italic" />
                       </div>
                       <div className="space-y-3 italic text-left">
                          <p className="text-2xl font-black text-green-600 uppercase italic leading-none text-left">STATUS: NOMINAL</p>
                          <p className="text-[10px] text-green-500 font-black uppercase tracking-[0.3em] italic leading-none">ZERO ANOMALIES LOGGED</p>
                       </div>
                    </div>
                  )}

                   <div className="flex items-center gap-8 p-10 bg-white/50 dark:bg-white/5 rounded-[3.5rem] border border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all duration-700 italic shadow-sm">
                      <div className="w-20 h-20 bg-gray-900 border border-white/10 text-white rounded-[2rem] flex items-center justify-center shadow-2xl italic">
                         <Users size={36} className="italic" />
                      </div>
                      <div className="space-y-3 italic text-left">
                         <p className="text-2xl font-black text-gray-900 dark:text-white uppercase italic leading-none text-left">ENTITY SYNC</p>
                         <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] italic leading-none">REGISTRY OPTIMIZED</p>
                      </div>
                   </div>
               </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-gray-900 dark:bg-white/5 rounded-[4rem] p-12 lg:p-14 text-white text-center relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-all duration-1000 hover:scale-[1.02] italic">
               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
               <div className="relative z-10 space-y-10 italic">
                  <div className="w-24 h-24 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl italic group-hover:rotate-12 transition-transform duration-700">
                     <FileText size={48} className="text-red-600 italic" />
                  </div>
                  <div className="space-y-5 italic text-center">
                     <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] italic leading-none">SECURITY AUDIT</p>
                     <h4 className="text-4xl lg:text-5xl font-black italic tracking-tighter leading-none uppercase italic">DATA <br/> RETRIEVAL</h4>
                  </div>
                  <button className="w-full py-8 bg-white dark:bg-red-600 text-gray-900 dark:text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-600 dark:hover:bg-white dark:hover:text-red-600 hover:text-white transition-all shadow-2xl italic active:scale-95 group-hover:shadow-red-600/40">
                     INITIATE CORE PULL
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
