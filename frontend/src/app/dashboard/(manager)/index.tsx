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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Hospital Dashboard Hero */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 text-gray-900 shadow-xl relative overflow-hidden group border border-gray-100 italic">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[30rem] h-[30rem] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none group-hover:bg-red-600/[0.05] transition-all duration-1000 italic"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 italic">
          <div className="space-y-8 flex-1 italic">
            <div className="flex flex-wrap items-center gap-4 italic">
               <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic shadow-lg shadow-red-600/10 italic">Verified Hospital</span>
               <div className="flex items-center gap-2 text-[10px] text-gray-600 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic">
                 <MapPin size={14} className="text-red-500 italic" />
                 {org.district || 'Location'}
               </div>
               <div className="flex items-center gap-2 text-[10px] text-green-600 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic italic">
                 <ShieldCheck size={14} className="italic" />
                 Active
               </div>
            </div>
            
            <div className="space-y-2 italic">
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase italic leading-none italic">{org.name || 'Medical Center'}</h1>
               <p className="text-gray-500 text-lg md:text-xl font-medium italic max-w-2xl leading-relaxed italic">
                 Manage blood requests, verify donations, and coordinate with donors.
               </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full xl:w-auto italic">
            <Link href="?tab=requests-new" className="bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 group/btn active:scale-95 italic italic">
              <Plus size={20} className="italic" /> Create Request
            </Link>
          </div>
        </div>
      </div>

      {/* Hospital Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 italic">
        {[
          { label: 'Active Requests', value: stats.openRequests || 0, icon: Activity, trend: 'Emergency', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Fulfilment Rate', value: `${Math.round(stats.efficiency || 0)}%`, icon: TrendingUp, trend: 'Success', color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Donors', value: stats.totalMembers || 0, icon: Users, trend: 'Network', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Inventory Units', value: stats.inventory?.totalUnits || 0, icon: ShieldCheck, trend: 'Stored', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden italic">
             <div className="flex justify-between items-start mb-6 italic">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform italic`}>
                   <stat.icon size={22} className="italic" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 italic">
                   <span className="text-[8px] font-black uppercase text-gray-400 italic">{stat.trend}</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</p>
             <p className="text-4xl font-black text-gray-900 mt-2 tracking-tighter italic leading-none italic">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 italic">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-8 italic">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2 italic">
            <div className="italic">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase italic italic">Recent Activity</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Recent donation and request logs</p>
            </div>
            <Link href="?tab=requests" className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic italic">View All →</Link>
          </div>

          <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50 italic">
            {recentActivities.map((activity: any) => (
              <div key={activity.id} className="p-8 hover:bg-gray-50/50 transition-all flex flex-col sm:flex-row gap-8 items-center justify-between group italic">
                <div className="flex items-center gap-6 italic">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center border border-indigo-100 font-black group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0 overflow-hidden italic">
                      {activity.donorAvatar ? (
                        <img src={activity.donorAvatar} className="w-full h-full object-cover italic" />
                      ) : (
                        <span className="text-2xl italic tracking-tighter leading-none italic">{activity.donorName[0]}</span>
                      )}
                   </div>
                   <div className="space-y-1 italic">
                      <p className="text-lg font-black text-gray-900 uppercase italic leading-none group-hover:text-red-600 transition-colors italic">{activity.donorName}</p>
                      <div className="flex items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">
                        <span className="flex items-center gap-1.5 italic"><Droplets size={12} className="text-red-500 italic" /> {activity.bloodGroup.replace('_POS', '+')}</span>
                        <span className="w-1 h-1 bg-gray-200 rounded-full italic"></span>
                        <span className="flex items-center gap-1.5 italic"><Clock size={12} className="italic" /> {new Date(activity.timestamp).toLocaleTimeString()}</span>
                      </div>
                   </div>
                </div>
                 <div className="flex items-center gap-5 italic">
                    <div className="flex flex-col items-end gap-2 italic">
                       <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest italic border italic ${activity.status === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-100 italic' : 'bg-orange-50 text-orange-600 border-orange-100 italic'}`}>
                        {activity.status}
                       </span>
                    </div>
                    <Link href={`/dashboard/requests?id=${activity.id}`} className="w-12 h-12 bg-white text-gray-200 hover:text-red-500 hover:border-red-500 border border-gray-100 rounded-2xl flex items-center justify-center transition-all shadow-sm italic">
                     <ChevronRight size={24} className="italic" />
                    </Link>
                 </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="py-40 text-center space-y-6 italic">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto shadow-inner italic">
                   <Activity className="w-10 h-10 text-gray-200 italic" />
                </div>
                 <p className="text-gray-400 font-black text-xs uppercase tracking-widest italic italic">No active activities found</p>
              </div>
            )}
          </div>
        </div>

        {/* Hospital Performance */}
        <div className="space-y-10 italic">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-xl italic">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 italic">
                 <Target className="w-7 h-7 text-white italic" />
              </div>
              <h3 className="text-2xl font-black mb-3 italic uppercase italic tracking-tight italic">Hospital Performance</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-10 italic italic">
                Analyze donation trends and fulfilment rates to optimize your hospital's operations.
              </p>
              <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-red-600 hover:text-white italic text-center italic">
                Review Performance
              </button>
           </div>
           
           <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm space-y-8 italic">
              <div className="flex items-center justify-between italic">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Operational Status</span>
                <span className="w-2 h-2 bg-green-500 rounded-full italic"></span>
              </div>
              <div className="space-y-6 italic">
                 <div className="flex justify-between items-end italic">
                    <p className="text-[10px] font-black text-gray-900 uppercase italic italic">System Uptime</p>
                    <p className="text-xs font-black text-green-600 italic italic">99.9%</p>
                 </div>
                 <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden italic">
                    <div className="h-full bg-green-500 w-[99.9%] italic"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
