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
      <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
         <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
         <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading dashboard...</p>
      </div>
    );
  }

  const stats = (analyticsData as any)?.data || {};
  const recentDonations = stats.donations || [];
  const donorDistrict = user?.donorProfile?.district || 'Location';
  const recommendedRequests = (recommendationsData as any)?.data || [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 italic">
      {/* Welcome Hero Section */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 text-gray-900 shadow-xl relative overflow-hidden group border border-gray-100 italic">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[30rem] h-[30rem] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none group-hover:bg-red-600/[0.05] transition-all duration-1000 italic"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 italic">
          <div className="space-y-8 flex-1 italic">
            <div className="flex flex-wrap items-center gap-4 italic">
               <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic shadow-xl shadow-red-600/10 italic">Verified Donor</span>
               <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic">
                 <ShieldCheck size={14} className="text-green-500 italic" />
                 Donor Profile
               </div>
               <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic italic">
                 <Zap size={14} className="text-amber-500 italic" />
                 Rank: {stats.rank || 'Bronze'}
               </div>
            </div>
            
            <div className="space-y-2 italic">
               <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none italic italic">Welcome, {user?.name?.split(' ')[0] || 'Donor'}!</h1>
               <p className="text-gray-500 text-lg md:text-xl font-medium italic max-w-2xl leading-relaxed italic">
                 Thank you for being part of our life-saving community. Your contributions make a real difference.
               </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full xl:w-auto italic">
            <Link href="?tab=history" className="bg-gray-900 text-white hover:bg-red-600 px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 italic group/btn italic">
              <Activity size={20} className="italic" /> Donation History
            </Link>
          </div>
        </div>
      </div>

      {/* Donor Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 italic">
         {/* Card 1: Donations */}
         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden italic">
            <div className="flex justify-between items-start mb-6 italic">
               <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform italic">
                  <Activity size={22} className="italic" />
               </div>
               <span className="text-[10px] font-black italic text-red-600 italic">Lives Saved</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none italic">Total Donations</p>
            <p className="text-4xl font-black text-gray-900 mt-2 tracking-tighter italic leading-none italic">{stats.totalDonations || 0}</p>
         </div>

         {/* Card 2: Nearby Requests */}
         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden italic">
            <div className="flex justify-between items-start mb-6 italic">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform italic">
                  <Target size={22} className="italic" />
               </div>
               <span className="text-[10px] font-black italic text-blue-600 italic">Matches</span>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none italic">Nearby Requests</p>
            <p className="text-4xl font-black text-gray-900 mt-2 tracking-tighter italic leading-none italic">{stats.nearbyRequests || 0}</p>
         </div>

         {/* Card 3: Reward Points */}
         <Link href="?tab=rewards" className="relative group/reward flex-1 italic">
           <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden h-full italic">
              <div className="flex justify-between items-start mb-6 italic">
                 <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover/reward:scale-110 transition-transform italic">
                    <Star size={22} className="italic" />
                 </div>
                 <div className="px-3 py-1 bg-amber-50 rounded-full border border-amber-100 flex items-center gap-1.5 shadow-sm group-hover/reward:bg-amber-500 group-hover/reward:text-white transition-all italic">
                    <span className="text-[8px] font-black uppercase tracking-widest italic">Points</span>
                 </div>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none italic">Reward Points</p>
              <p className="text-4xl font-black text-amber-600 mt-2 tracking-tighter italic leading-none group-hover/reward:text-gray-900 transition-colors italic">{stats.points || 0}</p>
              <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2 italic">View Rewards →</p>
           </div>
         </Link>

         {/* Card 4: Availability Status */}
         <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex-1 italic">
            <div className="flex justify-between items-start mb-6 italic">
               <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform italic">
                  <HeartPulse size={22} className="italic" />
               </div>
               <button 
                 onClick={() => toggleAvailability.mutate(!stats.isAvailable)}
                 className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors italic"
               >
                 {stats.isAvailable ? <ToggleRight className="text-green-500 w-5 h-5 italic"/> : <ToggleLeft className="w-5 h-5 italic"/>}
                 <span className="text-[8px] font-black uppercase text-gray-400 italic">Toggle</span>
               </button>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none italic">Availability Status</p>
            <p className={`text-4xl font-black mt-2 tracking-tighter italic leading-none italic ${stats.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
               {stats.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
            </p>
         </div>
      </div>

      {/* Progress Section */}
      <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-200 shadow-sm group italic">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 italic">
             <div className="space-y-6 flex-1 text-center md:text-left italic">
                <div className="flex items-center justify-center md:justify-start gap-4 italic">
                   <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg text-amber-500 italic">
                      <Award size={24} className="italic" />
                   </div>
                   <div className="italic">
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none italic">Donation Milestones</h2>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">Rank: {stats.rank || 'Bronze'}</p>
                   </div>
                </div>
                <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-gray-200 p-1 italic">
                   <div 
                     className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-sm italic"
                     style={{ width: `${Math.min((stats.points / 1000) * 100, 100)}%` }}
                   />
                </div>
                <div className="flex justify-between items-center px-4 italic text-[9px] font-black uppercase text-gray-500 italic">
                   <p className="italic">Current: <span className="text-red-600 italic">{stats.points} Pts</span></p>
                   <p className="italic">Target: 1000 Pts for Silver Rank</p>
                </div>
             </div>

             <div className="flex flex-wrap justify-center gap-6 xl:gap-10 italic">
                {[
                   { label: 'First Donation', icon: Zap, active: stats.totalDonations > 0, color: 'text-amber-500' },
                   { label: '5-Time Donor', icon: ShieldCheck, active: stats.totalDonations >= 5, color: 'text-red-600' },
                   { label: 'Life Saver', icon: HeartPulse, active: stats.points >= 500, color: 'text-red-500' },
                   { label: 'Community Hero', icon: Globe, active: stats.points >= 1000, color: 'text-red-600' },
                 ].map((badge, i) => (
                    <div key={i} className={`flex flex-col items-center gap-3 transition-opacity duration-500 italic ${badge.active ? 'opacity-100' : 'opacity-20'}`}>
                       <div className={`w-20 h-20 rounded-[2.5rem] border-4 border-white shadow-xl flex items-center justify-center relative italic ${badge.active ? 'bg-white' : 'bg-transparent border-dashed'}`}>
                          <badge.icon size={28} className={badge.active ? badge.color : 'text-gray-300'} />
                          {badge.active && <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-lg italic"><Star size={10} className="italic" /></div>}
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-900 italic italic">{badge.label}</span>
                    </div>
                 ))}
             </div>
          </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 italic">
        {/* Recent Donations */}
        <div className="lg:col-span-2 space-y-8 italic">
           <div className="flex justify-between items-end px-2 italic">
              <div className="italic">
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase italic italic">Donation History</h2>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">Your life-saving contributions</p>
              </div>
              <Link href="?tab=history" className="bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic italic">View All History →</Link>
           </div>

           <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden p-8 space-y-6 italic">
              {recentDonations.map((donation: any) => (
                <div key={donation.id} className="group relative flex gap-8 italic">
                   <div className="flex flex-col items-center italic">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 border-4 border-white flex items-center justify-center shrink-0 shadow-lg group-hover:bg-red-600 group-hover:text-white transition-all z-10 text-red-600 italic">
                        <Droplet className="w-6 h-6 italic" fill="currentColor" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-100 group-last:hidden mt-4 border-dashed italic"></div>
                   </div>
                   <div className="bg-gray-50 flex-1 rounded-[2.5rem] p-8 mb-4 group-hover:shadow-xl group-hover:bg-white transition-all border border-transparent group-hover:border-red-50 italic">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 italic">
                         <div className="space-y-1 italic">
                            <div className="flex items-center gap-3 italic">
                               <h3 className="font-black text-gray-900 text-xl italic uppercase font-mono tracking-tight italic">{donation.hospital}</h3>
                               <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border italic ${donation.status === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-100 italic' : 'bg-orange-50 text-orange-600 border-orange-100 italic'}`}>
                                  {donation.status}
                               </span>
                            </div>
                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest italic italic">{donation.district} • {new Date(donation.date).toLocaleDateString()}</p>
                         </div>
                         
                         <div className="flex items-center gap-3 italic">
                            <button 
                               onClick={() => generateCertificate(user?.name || 'Donor', 'N/A', new Date(donation.date).toLocaleDateString())}
                               className="bg-white text-gray-900 hover:bg-red-600 hover:text-white border border-gray-200 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 italic active:scale-95 italic"
                             >
                               <Download size={14} className="italic" /> Certificate
                             </button>
                          </div>
                      </div>
                   </div>
                </div>
              ))}
              
              {recentDonations.length === 0 && (
                <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 italic">
                  <ShieldQuestion className="w-16 h-16 text-gray-200 mx-auto mb-6 italic" />
                  <p className="text-gray-400 font-black text-xs uppercase tracking-widest italic italic">No donations found yet</p>
                </div>
              )}
           </div>
        </div>

        {/* Recommended Requests */}
        <div className="space-y-10 italic">
           <div className="bg-white rounded-[3rem] p-10 text-gray-900 shadow-sm border border-gray-100 italic">
              <div className="flex items-center gap-4 mb-10 italic">
                 <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/10 text-white italic">
                    <Target size={24} className="italic" />
                 </div>
                 <div className="italic">
                    <h2 className="text-xl font-black uppercase tracking-tighter italic italic leading-none italic">Nearby Requests</h2>
                    <p className="text-[8px] font-black uppercase tracking-widest text-red-600 mt-2 italic">Location: {donorDistrict}</p>
                 </div>
              </div>

              <div className="space-y-6 italic">
                 {recommendedRequests.map((req: any) => (
                    <div key={req.id} className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 hover:border-red-600 transition-all group/item relative overflow-hidden italic">
                       <div className="flex justify-between items-start mb-4 italic">
                          <div className="space-y-1 italic">
                             <p className="font-black text-lg uppercase italic tracking-tighter text-gray-900 leading-none italic">
                                {req.unitsRequired} Units Needed
                             </p>
                             <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic">{req.hospitalName}</p>
                          </div>
                          <div className={`text-[8px] font-black px-3 py-1 rounded-full uppercase italic border italic ${req.isEmergency ? 'bg-red-600 text-white border-red-500 italic' : 'bg-white border-gray-200 italic'}`}>
                             {req.urgency}
                          </div>
                       </div>

                       <div className="flex items-center gap-4 text-[9px] text-gray-400 font-black uppercase tracking-widest mb-6 italic">
                          <span className="flex items-center gap-1.5 italic"><MapPin size={12} className="text-red-500 italic" /> {req.district}</span>
                          <span className="flex items-center gap-1.5 italic"><Clock size={12} className="text-gray-400 italic" /> {new Date(req.deadline).toLocaleDateString()}</span>
                       </div>

                       <button 
                           onClick={() => commitMutation.mutate(req.id)}
                           disabled={commitMutation.isPending}
                           className="w-full py-4 bg-gray-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-xl italic text-center italic"
                        >
                           {commitMutation.isPending ? 'Processing...' : 'Respond Now'}
                        </button>
                    </div>
                 ))}
                 {recommendedRequests.length === 0 && (
                    <div className="py-12 text-center space-y-4 italic">
                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest italic px-4 italic">No active blood requests in {donorDistrict}.</p>
                    </div>
                 )}
              </div>

              <Link href="/urgent-requests" className="flex items-center justify-center gap-3 w-full text-[10px] font-black text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest mt-10 italic">
                 View All Requests <ChevronRight size={14} className="italic" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
