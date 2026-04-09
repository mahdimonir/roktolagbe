'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { generateCertificate } from '@/lib/utils/certificate';
import { 
  Download, Droplet, Heart, ShieldQuestion, Star, Sparkles,
  Activity, ToggleLeft, ToggleRight, Users, 
  ChevronRight, Zap, Target, ShieldCheck,
  CheckCircle2, AlertTriangle, TrendingUp,
  HeartPulse, MapPin, Calendar, Clock, Award, Globe
} from 'lucide-react';
import { toast } from 'sonner';

export default function DonorDashboard() {
  const user = useAuthStore(state => state.user);
  const queryClient = useQueryClient();
  
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['donor-analytics'],
    queryFn: () => api.get('/donors/me/analytics'),
  });

  const toggleAvailability = useMutation({
    mutationFn: (newStatus: boolean) => api.patch('/donors/me', { isAvailable: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-analytics'] });
      toast.success('Availability updated!');
    },
    onError: () => toast.error('Failed to update availability.')
  });

  const { data: recommendationsData, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommended-requests'],
    queryFn: () => api.get(`/blood-requests?bloodGroup=${user?.role === 'DONOR' ? 'MATCH' : ''}&status=OPEN&limit=3`),
    enabled: !!user,
  });

  const commitMutation = useMutation({
    mutationFn: (requestId: string) => api.post(`/blood-requests/${requestId}/commit`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donor-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['recommended-requests'] });
      toast.success('Response confirmed! Thank you.');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to confirm response')
  });

  if (analyticsLoading || recommendationsLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] italic">
         <div className="w-16 h-16 border-4 border-red-50 dark:border-red-500/20 border-t-red-600 rounded-full animate-spin shadow-xl"></div>
         <p className="mt-8 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse italic">Synchronizing with Global Matrix...</p>
      </div>
    );
  }

  const stats = (analyticsData as any)?.data || {};
  const recentDonations = stats.donations || [];
  const donorDistrict = user?.donorProfile?.district || 'Location';
  const recommendedRequests = (recommendationsData as any)?.data || [];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-40 px-4 md:px-0 italic">
      {/* Welcome Hero Section */}
      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] p-12 md:p-20 text-gray-900 dark:text-white shadow-sm relative overflow-hidden group border border-gray-100 dark:border-white/[0.08] italic text-left">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 italic"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-16 italic">
          <div className="space-y-12 flex-1 italic text-left">
            <div className="flex flex-wrap items-center gap-5 italic justify-start">
               <div className="bg-red-600 text-white px-6 py-2.5 rounded-full text-[9px] font-black tracking-[0.4em] uppercase italic shadow-2xl shadow-red-600/30">OPERATIVE ACTIVE</div>
               <div className="flex items-center gap-3 text-[10px] text-gray-900 dark:text-gray-100 font-black uppercase tracking-widest bg-white dark:bg-white/5 px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm italic">
                 <ShieldCheck size={18} className="text-green-500 italic" />
                 SECURED PROFILE
               </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-900 dark:text-gray-100 font-black uppercase tracking-widest bg-white dark:bg-white/5 px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm italic">
                  <Droplet size={18} className="text-red-600 italic" />
                  GENOTYPE: {user?.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-') || 'UNSET'}
                </div>
            </div>
            
             <div className="space-y-8 italic text-left">
               <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter italic uppercase leading-none dark:text-white italic">Asset <br/><span className="text-red-600 italic">{user?.name?.split(' ')[0] || 'Member'}</span></h1>
               <p className="text-gray-500 dark:text-gray-400 text-lg md:text-2xl font-medium italic max-w-3xl leading-relaxed italic text-left">
                 Platform integrity prioritized. Scanning global nodes for life-support opportunities in the grid.
               </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 w-full xl:w-auto italic">
            <Link href="?tab=history" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-red-600 dark:hover:text-white px-14 py-8 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 italic group/btn flex items-center justify-center gap-5">
              <Activity size={24} className="group-hover/btn:rotate-12 transition-transform" /> VIEW FEED
            </Link>
          </div>
        </div>
      </div>

      {/* Donor Analytics Grid - Optimized for all screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 italic">
         {/* Card 1: Donations */}
         <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden italic text-left">
            <div className="flex justify-between items-start mb-10 italic">
               <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-red-600/10 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform italic border border-gray-100 dark:border-red-500/20 shadow-lg">
                  <Activity size={28} className="italic" />
               </div>
               <span className="text-[10px] font-black italic text-red-600 uppercase tracking-[0.3em] mt-2">SAVED</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">TOTAL LOGS</p>
            <p className="text-6xl font-black text-gray-900 dark:text-white mt-6 tracking-tighter italic leading-none">{stats.totalDonations || 0}</p>
         </div>

         {/* Card 2: Nearby Requests */}
         <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden italic text-left">
            <div className="flex justify-between items-start mb-10 italic">
               <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-blue-600/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform italic border border-gray-100 dark:border-blue-500/20 shadow-lg">
                  <Target size={28} className="italic" />
               </div>
               <span className="text-[10px] font-black italic text-blue-600 uppercase tracking-[0.3em] mt-2">ACTIVE</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">NEARBY SIGNALS</p>
            <p className="text-6xl font-black text-gray-900 dark:text-white mt-6 tracking-tighter italic leading-none">{stats.nearbyRequests || 0}</p>
         </div>

         {/* Card 3: Reward Points */}
         <Link href="?tab=rewards" className="relative group/reward flex-1 italic block">
           <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden h-full italic text-left">
              <div className="flex justify-between items-start mb-10 italic">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-amber-600/10 text-amber-500 flex items-center justify-center group-hover/reward:scale-110 transition-transform italic border border-gray-100 dark:border-amber-500/20 shadow-lg">
                    <Star size={28} className="italic" />
                 </div>
                 <div className="px-5 py-2.5 bg-amber-50/50 dark:bg-amber-500/10 rounded-full border border-amber-100 dark:border-amber-500/20 flex items-center gap-2.5 shadow-sm group-hover/reward:bg-amber-600 group-hover/reward:text-white transition-all italic">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">ELITE</span>
                 </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">MATRIX CREDITS</p>
              <p className="text-6xl font-black text-amber-600 mt-6 tracking-tighter italic leading-none group-hover/reward:scale-110 transition-transform origin-left">{stats.points || 0}</p>
              <p className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em] mt-8 italic group-hover/reward:text-gray-900 dark:group-hover/reward:text-white transition-colors">INITIATE SWAP →</p>
           </div>
         </Link>

         {/* Card 4: Availability Status */}
         <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-xl transition-all duration-700 group relative overflow-hidden flex-1 italic text-left">
            <div className="flex justify-between items-start mb-10 italic">
               <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-green-600/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform italic border border-gray-100 dark:border-green-500/20 shadow-lg">
                  <HeartPulse size={28} className="italic" />
               </div>
               <button 
                 onClick={() => toggleAvailability.mutate(!stats.isAvailable)}
                 className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-white/10 rounded-full border border-gray-100 dark:border-white/10 hover:border-red-600 transition-all italic shadow-sm active:scale-90"
               >
                 {stats.isAvailable ? <ToggleRight className="text-green-500 w-6 h-6 italic"/> : <ToggleLeft className="text-gray-300 w-6 h-6 italic"/>}
                 <span className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-600 italic tracking-[0.3em]">NODE</span>
               </button>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] italic leading-none">SIGNAL STREAM</p>
            <p className={`text-5xl font-black mt-6 tracking-tighter italic leading-none ${stats.isAvailable ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-700'}`}>
               {stats.isAvailable ? 'ON GRID' : 'SILENT'}
            </p>
         </div>
      </div>

      {/* Progress Section - Optimized for horizontal space */}
      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 md:p-20 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm group italic">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-20 italic">
             <div className="space-y-12 flex-1 text-center md:text-left italic">
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-10 italic">
                   <div className="w-20 h-20 bg-gray-900 border border-white/10 text-white rounded-[2.2rem] flex items-center justify-center shadow-2xl text-amber-500 italic">
                      <Award size={40} className="italic" />
                   </div>
                   <div className="space-y-4 italic text-left">
                      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none italic">Tier Progression</h2>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.5em] italic">RANK: {stats.rank || 'BRONZE PROTOCOL'}</p>
                   </div>
                </div>
                <div className="space-y-6 italic">
                   <div className="w-full h-4 bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 p-1 italic">
                      <div 
                        className="h-full bg-red-600 rounded-full transition-all duration-2000 shadow-[0_0_20px_rgba(220,38,38,0.6)] italic"
                        style={{ width: `${Math.min((stats.points / 1000) * 100, 100)}%` }}
                      />
                   </div>
                   <div className="flex justify-between items-center px-4 text-[10px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.4em] italic leading-none">
                      <p>SIGNAL INTENSITY: <span className="text-red-600 italic">{stats.points} CP</span></p>
                      <p>NEXT LEVEL: 1000 CP (SILVER)</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-wrap justify-center gap-10 xl:gap-14 italic">
                {[
                   { label: 'Activated', icon: Zap, active: stats.totalDonations > 0, color: 'text-amber-500' },
                   { label: 'Vanguard', icon: ShieldCheck, active: stats.totalDonations >= 5, color: 'text-red-600' },
                   { label: 'Rescuer', icon: HeartPulse, active: stats.points >= 500, color: 'text-red-500' },
                   { label: 'Legend', icon: Globe, active: stats.points >= 1000, color: 'text-red-600' },
                 ].map((badge, i) => (
                    <div key={i} className={`flex flex-col items-center gap-5 transition-all duration-1000 italic transform ${badge.active ? 'opacity-100 scale-110' : 'opacity-10 grayscale'}`}>
                       <div className={`w-28 h-28 rounded-[3rem] border-4 border-white dark:border-[#0f0f13] shadow-2xl flex items-center justify-center relative italic ${badge.active ? 'bg-white dark:bg-white/10' : 'bg-transparent border-dashed dark:border-white/10'}`}>
                          <badge.icon size={44} className={badge.active ? badge.color : 'text-gray-300 dark:text-gray-800'} />
                          {badge.active && (
                            <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_20px_-5px_rgba(220,38,38,0.5)] italic">
                              <Star size={18} fill="currentColor" />
                            </div>
                          )}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-900 dark:text-gray-400 italic text-center leading-none">{badge.label}</span>
                    </div>
                 ))}
             </div>
          </div>
       </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 italic text-left">
        {/* Recent Donations */}
        <div className="lg:col-span-2 space-y-12 italic text-left">
           <div className="flex justify-between items-end px-8 italic">
              <div className="space-y-3 italic text-left">
                 <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none italic">Activity Log</h2>
                 <p className="text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] italic">TEMPORAL DONATION REGISTRY</p>
              </div>
              <Link href="?tab=history" className="bg-gray-50/20 dark:bg-white/5 hover:bg-red-600 hover:text-white text-gray-500 dark:text-gray-400 px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all italic border border-gray-100 dark:border-white/10 shadow-sm active:scale-95 leading-none">ARCHIVE →</Link>
           </div>

           <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] p-12 lg:p-14 border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-12 italic">
              {recentDonations.map((donation: any) => (
                <div key={donation.id} className="group relative flex gap-10 italic">
                   <div className="flex flex-col items-center italic">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-white/10 border-4 border-gray-50 dark:border-white/5 flex items-center justify-center shrink-0 shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all z-10 text-red-600 italic">
                        <Droplet className="w-8 h-8 italic" fill="currentColor" />
                      </div>
                      <div className="w-1 h-full bg-gray-100 dark:bg-white/5 group-last:hidden mt-6 border-dashed italic"></div>
                   </div>
                    <div className="bg-white dark:bg-white/5 flex-1 rounded-[3.5rem] p-10 md:p-12 mb-6 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all border border-gray-100 dark:border-white/10 italic text-left relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-red-600/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
                       <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10 italic">
                         <div className="space-y-4 italic text-left">
                            <div className="flex flex-wrap items-center gap-5 italic text-left">
                               <h3 className="font-black text-gray-900 dark:text-white text-3xl italic uppercase tracking-tighter italic leading-none">{donation.hospital}</h3>
                               <span className={`text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] border italic leading-none ${donation.status === 'VERIFIED' ? 'bg-green-500/10 text-green-600 border-green-500/20 italic' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 italic'}`}>
                                  {donation.status}
                               </span>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] italic leading-none">{donation.district} GRID • {new Date(donation.date).toLocaleDateString()}</p>
                         </div>
                         
                         <div className="flex items-center gap-5 italic">
                            <button 
                               onClick={() => generateCertificate(user?.name || 'Donor', 'N/A', new Date(donation.date).toLocaleDateString())}
                               className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white border border-transparent px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl flex items-center gap-4 italic active:scale-95 leading-none"
                             >
                               <Download size={18} className="italic" /> EXPORT LOG
                             </button>
                          </div>
                      </div>
                    </div>
                </div>
              ))}
              
              {recentDonations.length === 0 && (
                <div className="text-center py-40 bg-gray-50/50 dark:bg-white/5 rounded-[4rem] border border-dashed border-gray-200 dark:border-white/10 italic">
                  <ShieldQuestion className="w-20 h-20 text-gray-200 dark:text-gray-800 mx-auto mb-10 italic" />
                  <p className="text-gray-400 dark:text-gray-600 font-black text-[10px] uppercase tracking-[0.5em] italic">NO DETECTED CONTRIBUTIONS</p>
                </div>
              )}
           </div>
        </div>

        {/* Recommended Requests */}
        <div className="space-y-12 italic text-left">
           <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] p-12 lg:p-14 border border-gray-100 dark:border-white/[0.08] shadow-sm italic text-left">
              <div className="flex items-center gap-8 mb-16 italic text-left">
                 <div className="w-16 h-16 bg-red-600 rounded-[1.8rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] text-white italic">
                    <Target size={32} className="italic" />
                 </div>
                 <div className="space-y-3 italic text-left">
                    <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none italic">Scanning</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 italic leading-none">SECTOR: {donorDistrict}</p>
                 </div>
              </div>

              <div className="space-y-10 italic">
                 {recommendedRequests.map((req: any) => (
                    <div key={req.id} className="bg-white dark:bg-white/5 p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/10 hover:border-red-600 group/item relative overflow-hidden italic text-left transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]">
                       <div className="flex justify-between items-start mb-10 italic gap-6 text-left">
                          <div className="space-y-4 italic text-left">
                             <p className="font-black text-4xl uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none italic text-left">
                                {req.units} UNITS
                             </p>
                             <p className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] italic leading-none">{req.hospitalName}</p>
                          </div>
                          <div className={`text-[8px] font-black px-4 py-2 rounded-full uppercase italic border tracking-[0.3em] italic leading-none ${req.isEmergency ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30' : 'bg-gray-50 dark:bg-white/10 dark:text-white border-gray-200 dark:border-white/10'}`}>
                             {req.urgency}
                          </div>
                       </div>

                       <div className="flex flex-wrap items-center gap-8 text-[10px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] mb-12 italic">
                          <span className="flex items-center gap-3 italic"><MapPin size={16} className="text-red-600 italic" /> {req.district}</span>
                          <span className="flex items-center gap-3 italic"><Clock size={16} /> {new Date(req.deadline).toLocaleDateString()}</span>
                       </div>

                       <button 
                           onClick={() => commitMutation.mutate(req.id)}
                           disabled={commitMutation.isPending}
                           className="w-full py-7 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-95 shadow-2xl italic leading-none"
                        >
                           {commitMutation.isPending ? 'SYNCHRONIZING...' : 'ACCEPT MISSION'}
                        </button>
                    </div>
                 ))}
                 {recommendedRequests.length === 0 && (
                    <div className="py-24 text-center italic">
                       <p className="text-[11px] text-gray-400 dark:text-gray-800 font-black uppercase tracking-[0.6em] italic leading-relaxed">NO SIGNALS DETECTED IN <br/>{donorDistrict}</p>
                    </div>
                 )}
              </div>

              <Link href="/urgent-requests" className="flex items-center justify-center gap-4 w-full text-[10px] font-black text-gray-400 dark:text-gray-700 hover:text-red-600 dark:hover:text-red-600 transition-all uppercase tracking-[0.5em] mt-16 italic opacity-60 hover:opacity-100">
                 GLOBAL RANGE <ChevronRight size={18} />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
