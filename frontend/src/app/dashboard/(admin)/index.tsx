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
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading analytics...</p>
    </div>
  );

  const cards = [
    { title: 'Total Donors', value: stats?.donors?.total || 0, sub: `${stats?.donors?.available || 0} available`, icon: Users, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Partners', value: stats?.managers?.total || 0, sub: `${stats?.managers?.verified || 0} verified`, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Fulfilment Rate', value: `${stats?.resolutionRate || 0}%`, sub: `${stats?.requests?.fulfilled || 0} fulfilled`, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Total Donations', value: stats?.donations?.total || 0, sub: 'Lifetime impact', icon: Gift, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 italic">
      {/* Admin Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl relative overflow-hidden group italic">
         <div className="flex items-center gap-10 relative z-10 italic">
            <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
               <Globe className="w-12 h-12 italic" />
            </div>
            <div className="italic">
               <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase leading-none mb-4 italic italic">Admin Overview</h1>
               <div className="flex flex-wrap items-center gap-4 italic">
                  <span className="bg-gray-900 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic italic">Platform Admin</span>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic italic">
                    <Zap size={14} className="text-amber-500 italic" /> Status: Operational
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-[1.5rem] border border-gray-100 italic">
            <div className="flex items-center gap-4 px-4 italic">
               <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm italic"></div>
               <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic">All Systems Healthy</span>
            </div>
         </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 italic">
        {cards.map((card, i) => (
          <div key={card.title} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-64 italic">
             <div className="flex justify-between items-start italic">
                <div className={`w-16 h-16 rounded-[1.5rem] ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform italic`}>
                   <card.icon size={28} className="italic" />
                </div>
             </div>
             <div className="space-y-1 italic">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">{card.title}</p>
                <p className="text-5xl font-black text-gray-900 tracking-tighter italic leading-none italic">{card.value}</p>
             </div>
             <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-fit italic">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic italic">{card.sub}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 italic text-left">
         {/* Donation Trends */}
         <div className="lg:col-span-2 bg-white rounded-[4rem] p-12 text-gray-900 relative overflow-hidden group shadow-xl border border-gray-100 italic">
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 italic">
               <div className="space-y-2 italic">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none italic">Donation Trends</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Platform activity overview</p>
               </div>
               <div className="flex bg-gray-50 p-2 rounded-2xl border border-gray-100 gap-2 italic">
                  <button className="px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest bg-gray-900 text-white shadow-xl transition-all italic">30 Days</button>
               </div>
            </div>

            <div className="h-80 w-full relative z-10 italic">
                {stats?.donations?.trends && stats.donations.trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={stats.donations.trends}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 9, fill: '#4b5563', fontWeight: 'bold' }}
                        tickFormatter={(val: string) => val.split('-').slice(1).join('/')}
                        dy={15}
                      />
                      <YAxis hide domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#000', fontWeight: 'bold', fontSize: '11px', fontStyle: 'italic' }}
                        labelStyle={{ display: 'none' }}
                        cursor={{ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#ef4444" 
                        strokeWidth={6} 
                        fillOpacity={1} 
                        fill="url(#colorCount)" 
                        animationDuration={2500}
                        activeDot={{ r: 8, fill: '#fff', stroke: '#ef4444', strokeWidth: 4 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-6 italic">
                     <p className="text-[11px] font-black uppercase tracking-widest italic italic">No data available</p>
                  </div>
                )}
            </div>
         </div>

         <div className="space-y-10 italic">
            {/* System Status Monitor */}
            <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-xl space-y-10 relative overflow-hidden group italic">
               <div className="flex items-center gap-5 border-b border-gray-50 pb-8 relative z-10 italic">
                  <ShieldAlert className="w-8 h-8 text-red-600 italic" />
                  <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase italic">System Status</h3>
               </div>
               
               <div className="space-y-6 relative z-10 italic">
                   {stats?.requests && stats.requests.open > 5 ? (
                    <div className="flex items-center gap-6 p-6 bg-red-50 rounded-[2.5rem] border border-red-100 transition-all italic">
                       <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30 italic">
                          <ShieldAlert size={26} className="italic" />
                       </div>
                       <div className="space-y-1 italic">
                          <p className="text-lg font-black text-red-600 uppercase italic leading-none italic">High Volume</p>
                          <p className="text-[10px] text-red-500/70 font-black uppercase tracking-widest italic italic">{stats.requests.open} Active Requests</p>
                       </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6 p-6 bg-green-50 rounded-[2.5rem] border border-green-100 transition-all italic">
                       <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-600/30 italic">
                          <CheckCircle2 size={26} className="italic" />
                       </div>
                       <div className="space-y-1 italic">
                          <p className="text-lg font-black text-green-600 uppercase italic leading-none italic">Status: Stable</p>
                          <p className="text-[10px] text-green-500/70 font-black uppercase tracking-widest italic italic">Everything normal</p>
                       </div>
                    </div>
                  )}

                   <div className="flex items-center gap-6 p-6 bg-blue-50 rounded-[2.5rem] border border-blue-100 transition-all italic">
                      <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 italic">
                         <Users size={26} className="italic" />
                      </div>
                      <div className="space-y-1 italic">
                         <p className="text-lg font-black text-blue-600 uppercase italic leading-none italic">User Registry</p>
                         <p className="text-[10px] text-blue-500/70 font-black uppercase tracking-widest italic italic">System healthy</p>
                      </div>
                   </div>
               </div>
            </div>

            {/* Audit Logs */}
            <div className="bg-gray-900 rounded-[3rem] p-12 text-white text-center relative overflow-hidden group shadow-2xl italic">
               <div className="relative z-10 space-y-6 italic">
                  <div className="w-20 h-20 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto mb-8 italic">
                     <FileText size={32} className="text-red-600 italic" />
                  </div>
                  <div className="space-y-2 italic text-center">
                     <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 italic italic">Security</p>
                     <h4 className="text-3xl font-black italic tracking-tighter leading-tight uppercase italic italic italic">Activity <br/> Logs</h4>
                  </div>
                  <button className="w-full py-5 bg-white text-gray-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl italic active:scale-95 italic">
                     View All Logs →
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
