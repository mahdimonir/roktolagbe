'use client';
import { api } from '@/lib/api/axios';
import { ApiResponse, AdminAnalytics } from '@/lib/types/models';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Activity,
   ArrowUpRight,
   BarChart3,
   Calendar,
   Download,
   Globe,
   PieChart as PieChartIcon,
   ShieldCheck, Target,
   TrendingUp,
   Users,
   Zap,
   Plus,
   ChevronRight,
   MapPin,
   Clock,
   Award,
   HeartPulse
} from 'lucide-react';
import { useState } from 'react';
import {
   Area,
   AreaChart,
   CartesianGrid,
   Cell,
   Label,
   Pie,
   PieChart,
   ResponsiveContainer,
   Tooltip,
   XAxis, YAxis
} from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#71717a'];

export default function AnalyticsCenter() {
  const { data: analyticsData, isLoading } = useQuery<ApiResponse<AdminAnalytics>>({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data;
    },
  });

  const queryClient = useQueryClient();
  const [activePieIndex, setActivePieIndex] = useState<number | undefined>(undefined);
  const stats = analyticsData?.data;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading analytics...</p>
    </div>
  );

  const trendData = stats?.donations?.trends || [];
  const distributionData = stats?.donations?.distribution || [];
  const resolutionRate = stats?.resolutionRate || 0;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic">
        <div className="flex items-center gap-5 italic text-left">
          <div className="w-16 h-16 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-xl text-white italic">
            <BarChart3 className="w-8 h-8 italic" />
          </div>
          <div className="italic">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none italic">Platform Analytics</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">System-wide data insights</p>
          </div>
        </div>
        
        <div className="flex gap-3 italic">
           <button 
             onClick={async () => {
                const csvData = [
                  ['Date', 'Donation Count'],
                  ...trendData.map((d: { date: string; count: number }) => [d.date, d.count])
                ].map(e => e.join(",")).join("\n");
                const blob = new Blob([csvData], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Platform_Impact_Report_${new Date().toISOString()}.csv`;
                a.click();
                toast.success('Analytics report exported!');
             }}
             className="px-6 py-2.5 bg-white border border-gray-100 text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm active:scale-95 italic"
           >
              <Download size={14} className="text-red-600 italic" /> Export Data
           </button>
           <div className="flex items-center gap-3 bg-white p-2 px-6 rounded-xl border border-gray-100 shadow-sm italic">
              <div className="w-2 h-2 bg-green-500 rounded-full italic" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Live Status: <span className="text-green-600 font-black italic">ACTIVE</span></span>
           </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 italic text-left">
         {[
           { label: 'Success Rate', value: `${resolutionRate}%`, sub: 'Requests fulfilled', icon: Target, trend: '+4.2%', color: 'text-red-600', bg: 'bg-red-50' },
           { label: 'Total Donors', value: stats?.donors?.total || 0, sub: 'Registered users', icon: Users, trend: '+12%', color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Active Requests', value: stats?.requests?.open || 0, sub: 'Open applications', icon: Activity, trend: '-2%', color: 'text-orange-600', bg: 'bg-orange-50' },
           { label: 'Total Donations', value: stats?.donations?.total || 0, sub: 'Lives impacted', icon: ShieldCheck, trend: '+89', color: 'text-green-600', bg: 'bg-green-50' },
         ].map((item, i) => (
           <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden italic">
              <div className="flex justify-between items-start mb-6 italic">
                 <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform italic`}>
                    <item.icon size={24} className="italic" />
                 </div>
                 <span className={`text-[10px] font-black italic italic ${item.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{item.trend}</span>
              </div>
              <p className="text-4xl font-black italic text-gray-900 tracking-tighter leading-none mb-2 italic">{item.value}</p>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 italic">{item.label}</p>
              <p className="text-[9px] text-gray-400 font-bold italic opacity-60 leading-none italic">{item.sub}</p>
           </div>
         ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 italic">
         {/* Donation Trends */}
         <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-10 group relative overflow-hidden italic">
            <div className="flex justify-between items-center relative z-10 italic">
               <div className="italic text-left">
                  <h3 className="text-xl font-black italic uppercase text-gray-900 tracking-tight flex items-center gap-3 italic">
                     <TrendingUp className="text-red-600 italic" /> Donation Trends
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Last 30 days activity</p>
               </div>
               <div className="flex bg-gray-50 p-1.5 rounded-xl gap-2 border border-gray-100 shadow-inner italic">
                  <button className="px-4 py-1.5 bg-white text-[9px] font-black uppercase text-gray-900 rounded-lg shadow-sm border border-gray-100 italic transition-all hover:bg-gray-900 hover:text-white italic">Daily</button>
                  <button className="px-4 py-1.5 text-[9px] font-black uppercase text-gray-400 rounded-lg italic transition-all hover:text-gray-900 italic">Monthly</button>
               </div>
            </div>

            <div className="h-[24rem] w-full relative z-10 italic">
               {trendData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={trendData}>
                     <defs>
                       <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} 
                       dy={10}
                     />
                     <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fontSize: 9, fontWeight: 900, fill: '#94a3b8'}} 
                     />
                     <Tooltip 
                       contentStyle={{backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '1rem', color: '#000', fontSize: '10px'}} 
                       itemStyle={{color: '#ef4444', fontWeight: 900}}
                     />
                     <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                   </AreaChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="h-full flex items-center justify-center text-gray-200 italic">
                    <p className="text-[10px] uppercase font-black tracking-widest italic italic">Loading analytics...</p>
                 </div>
               )}
            </div>
         </div>

         {/* Distribution */}
         <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col group relative overflow-hidden italic">
            <div className="text-center relative z-10 italic text-left">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-6 italic">
                  <PieChartIcon size={24} className="italic" />
               </div>
               <h3 className="text-lg font-black italic uppercase text-gray-900 tracking-tight leading-none mb-2 italic text-center">Blood Groups</h3>
               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic border-b border-gray-50 pb-4 italic text-center">Group distribution data</p>
            </div>

            <div className="flex-1 min-h-[20rem] relative z-10 mt-6 italic">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="count"
                      stroke="none"
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(undefined)}
                    >
                      {distributionData.map((entry, index: number) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          opacity={activePieIndex === undefined || activePieIndex === index ? 1 : 0.3}
                          className="transition-all duration-500 cursor-pointer outline-none italic"
                        />
                      ))}
                      <Label 
                        position="center"
                        content={({ viewBox }) => {
                          const { cx, cy } = viewBox as { cx: number; cy: number };
                          return (
                            <g>
                              <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" className="fill-gray-900 text-3xl font-black italic tracking-tighter italic">
                                {stats?.donors?.total || 0}
                              </text>
                              <text x={cx} y={cy + 20} textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 text-[8px] font-black uppercase tracking-[0.2em] italic italic">
                                Total Donors
                              </text>
                            </g>
                          )
                        }}
                      />
                    </Pie>
                    <Tooltip 
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                            return (
                              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-xl italic text-left">
                                 <p className="text-[9px] font-black text-red-600 uppercase tracking-widest italic mb-1 italic">{payload[0].name}</p>
                                 <p className="text-xl font-black text-gray-900 italic tracking-tighter italic">{payload[0].value} <span className="text-[8px] text-gray-400 not-italic ml-1 italic">DONORS</span></p>
                              </div>
                            );
                         }
                         return null;
                       }}
                    />
                  </PieChart>
               </ResponsiveContainer>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 relative z-10 italic">
               {distributionData.slice(0, 4).map((item, i: number) => (
                 <div key={i} className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100 italic transition-all hover:bg-red-50 italic">
                    <span className="text-[10px] font-black italic text-gray-500 italic">{item.group}</span>
                    <span className="text-[10px] font-black text-gray-900 italic">{item.count}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Coverage Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 italic">
         <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl italic text-left">
            <div className="flex items-center gap-4 mb-10 italic">
               <div className="w-14 h-14 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-xl italic">
                  <Globe size={26} className="italic" />
               </div>
               <div className="italic text-left">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter italic italic">Regional Coverage</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mt-1 italic">Platform geographical presence</p>
               </div>
            </div>

            <div className="space-y-6 italic text-left">
               {[
                 { district: 'Dhaka Metropolitan', count: '42%', color: 'bg-red-600' },
                 { district: 'Chittagong Hospital', count: '18%', color: 'bg-blue-600' },
                 { district: 'Sylhet Division', count: '12%', color: 'bg-green-600' },
                 { district: 'Others', count: '28%', color: 'bg-gray-700' }
               ].map((d, i) => (
                 <div key={i} className="space-y-2 italic">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                       <span className="italic">{d.district}</span>
                       <span className="text-white italic italic">{d.count}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden italic">
                       <div className={`h-full ${d.color} transition-all duration-1000 italic`} style={{ width: d.count }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="bg-white rounded-[3rem] p-12 border border-gray-200 shadow-xl flex flex-col justify-between group hover:border-red-600 transition-all italic text-left">
            <div className="flex justify-between items-start italic">
               <div className="flex items-center gap-4 mb-10 italic text-left">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center border border-red-100 italic">
                     <Calendar size={26} className="italic" />
                  </div>
                  <div className="italic text-left">
                     <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 italic leading-none mb-1 italic">Growth Forecast</h3>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Quarterly projection data</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-4 italic text-left">
               <div className="italic text-left">
                  <p className="text-4xl font-black text-gray-900 tracking-tighter italic mb-1 italic">+2.4k</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic italic">Projected Donors</p>
               </div>
               <div className="italic text-left">
                  <p className="text-4xl font-black text-red-600 tracking-tighter italic mb-1 italic">94%</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic italic">Match Rate</p>
               </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between italic">
               <div className="flex -space-x-4 italic">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-gray-100 italic shadow-sm" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-red-600 flex items-center justify-center text-[10px] font-black text-white italic">+18</div>
               </div>
               <button className="text-[10px] font-black uppercase text-red-600 tracking-widest italic hover:translate-x-2 transition-transform italic">Detailed Insights <ArrowUpRight className="inline ml-1 italic" size={14}/></button>
            </div>
         </div>
      </div>
    </div>
  );
}
