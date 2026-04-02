'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { PaginatedResponse, OrgMember, DonorProfile } from '@/lib/types/models';
import { 
  Users, UserPlus, Phone, Search, Trash2, 
  Loader2, MapPin, Droplets, ShieldCheck, 
  ChevronRight, Star, HeartPulse, Zap, Sparkles,
  MessageSquare, ExternalLink, ShieldAlert, Target,
  Activity, Globe, UserCheck
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ManagerDonorsPage() {
  const queryClient = useQueryClient();
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'AVAILABLE'>('MEMBERS');

  // 1. Fetch My Donors (Members)
  const { data: membersData, isLoading: membersLoading } = useQuery<PaginatedResponse<OrgMember>>({
    queryKey: ['manager-members'],
    queryFn: () => api.get('/managers/me/members'),
  });

  // 2. Fetch Available Donors in region
  const { data: recruitsData, isLoading: recruitsLoading } = useQuery<PaginatedResponse<DonorProfile>>({
    queryKey: ['available-donors'],
    queryFn: () => api.get('/donors?limit=6'),
    enabled: activeTab === 'AVAILABLE',
  });

  const { mutate: addMember, isPending: isAdding } = useMutation({
    mutationFn: (phone: string) => api.post('/managers/me/members', { phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-members'] });
      setPhone('');
      toast.success('Donor added successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add donor.');
    }
  });

  const { mutate: removeMember, isPending: isRemoving } = useMutation({
    mutationFn: (memberId: string) => api.delete(`/managers/me/members/${memberId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-members'] });
      toast.success('Donor removed from your directory.');
    },
    onError: () => toast.error('Failed to remove donor.')
  });

  if (membersLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading directory...</p>
    </div>
  );

  const members = membersData?.data || [];
  const recruits = recruitsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 italic">
      
      {/* Search & Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl relative overflow-hidden group italic">
         <div className="flex items-center gap-10 relative z-10 italic">
            <div className="w-20 h-20 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 italic">
               <Users className="w-10 h-10 italic" />
            </div>
            <div className="italic">
               <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none mb-4 italic italic">Donor Directory</h1>
               <div className="flex flex-wrap items-center gap-4 italic">
                  <button 
                    onClick={() => setActiveTab('MEMBERS')}
                    className={`text-[10px] font-black tracking-widest uppercase italic px-6 py-2.5 rounded-xl border transition-all italic ${activeTab === 'MEMBERS' ? 'bg-red-600 text-white border-red-600 shadow-lg italic' : 'bg-white text-gray-400 border-gray-100 hover:border-red-600 italic'}`}
                  >
                    My Directory ({members.length})
                  </button>
                  <button 
                    onClick={() => setActiveTab('AVAILABLE')}
                    className={`text-[10px] font-black tracking-widest uppercase italic px-6 py-2.5 rounded-xl border transition-all italic ${activeTab === 'AVAILABLE' ? 'bg-gray-900 text-white border-gray-900 shadow-lg italic' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-900 italic'}`}
                  >
                    Find Donors
                  </button>
               </div>
            </div>
         </div>

         {/* Add Donor Form */}
         <div className="w-full xl:w-auto p-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-inner flex flex-col sm:flex-row gap-4 relative overflow-hidden italic">
            <div className="relative flex-1 sm:w-80 italic">
               <input 
                 type="text" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 placeholder="Search by phone..." 
                 className="w-full bg-gray-50 text-gray-900 rounded-[1.5rem] py-5 px-10 outline-none font-black italic placeholder:text-gray-400 focus:bg-white focus:border-red-600 transition-all text-[11px] border border-transparent italic" 
               />
               <Phone className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 italic" />
            </div>
            <button 
              onClick={() => phone && addMember(phone)}
              disabled={isAdding || !phone}
              className="bg-gray-900 text-white hover:bg-red-600 disabled:opacity-30 px-10 py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 italic italic"
            >
               {isAdding ? <Loader2 className="w-5 h-5 animate-spin italic" /> : <UserPlus className="w-5 h-5 italic" />}
               Register Donor
            </button>
         </div>
      </div>

      {/* Donors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 italic">
      {activeTab === 'MEMBERS' ? (
        members.length > 0 ? (
          members.map((member, i: number) => {
            const donor = member.donor;
            const isAvailable = donor.isAvailable;
            return (
              <div 
                key={member.id} 
                className="bg-white p-12 rounded-[4rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center space-y-10 italic shadow-sm"
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                 <div className="relative italic">
                    <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-white shadow-xl overflow-hidden z-10 relative italic">
                       {donor.profileImage ? (
                          <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover italic" />
                       ) : (
                          <div className="flex flex-col items-center italic">
                             <p className="text-4xl font-black mb-1 italic tracking-tighter leading-none text-gray-900 italic italic">
                                {donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                             </p>
                             <span className="text-[10px] font-black uppercase text-gray-400 opacity-50 italic italic">Blood Group</span>
                          </div>
                       )}
                    </div>
                    
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-gray-100 z-20 italic">
                       <ShieldCheck className={isAvailable ? 'text-green-600 italic' : 'text-orange-400 italic'} size={20} />
                    </div>
                 </div>

                 <div className="space-y-4 w-full italic">
                    <div className="space-y-1 italic">
                       <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none italic group-hover:text-red-600 transition-colors italic italic">
                          {donor.name}
                       </h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} Donor • {donor.points > 1000 ? 'Elite' : 'Verified'} Donor</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full pt-4 italic">
                       <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 group-hover:bg-white transition-all italic">
                          <MapPin size={16} className="text-red-600 italic" />
                          <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter italic">{donor.district}</span>
                       </div>
                       <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 group-hover:bg-white transition-all italic">
                          <Activity size={16} className="text-blue-600 italic" />
                          <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter italic">{donor.totalDonations} Donations</span>
                       </div>
                    </div>

                    <div className="pt-2 flex justify-center italic">
                       <span className={`text-[10px] font-black px-6 py-2 rounded-full uppercase italic tracking-widest border flex items-center gap-3 w-fit italic ${isAvailable ? 'bg-green-50 text-green-600 border-green-100 italic' : 'bg-orange-50 text-orange-600 border-orange-100 italic'}`}>
                          <div className={`w-2 h-2 rounded-full italic ${isAvailable ? 'bg-green-500 animate-ping italic' : 'bg-orange-500 italic'}`}></div>
                          {isAvailable ? 'Ready' : 'Unavailable'}
                       </span>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-6 border-t border-gray-50 italic">
                    <a 
                      href={`tel:${donor.user?.phone}`}
                      className="bg-gray-900 text-white py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-red-600 transition-all font-black text-[11px] uppercase tracking-widest italic shadow-xl active:scale-95 italic italic"
                    >
                       <Phone size={18} className="italic" /> Call
                    </a>
                    <Link 
                      href={`/dashboard/messages?contactId=${donor.userId}`}
                      className="bg-gray-100 text-gray-900 py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all font-black text-[11px] uppercase tracking-widest italic border border-gray-100 active:scale-95 italic italic"
                    >
                       <MessageSquare size={18} className="text-red-600 italic" /> Message
                    </Link>
                 </div>

                 {/* Remove Button */}
                 <button 
                   onClick={() => removeMember(member.id)}
                   disabled={isRemoving}
                   className="absolute top-8 right-8 p-4 text-gray-300 hover:text-red-600 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center active:scale-90 italic"
                 >
                    {isRemoving ? <Loader2 size={20} className="animate-spin italic" /> : <Trash2 size={20} className="italic" />}
                 </button>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 xl:col-span-3 py-60 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 relative overflow-hidden group italic">
             <div className="relative z-10 space-y-10 italic text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700 italic">
                   <Users size={48} className="text-gray-200 italic" />
                </div>
                <div className="space-y-4 italic text-center">
                   <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic italic">Empty Directory</h3>
                   <p className="text-gray-400 italic max-w-sm mx-auto font-medium text-lg leading-relaxed italic">You haven't registered any donors in your directory yet.</p>
                </div>
             </div>
          </div>
        )
      ) : (
        recruits.length > 0 ? (
          recruits.map((donor, i: number) => (
            <div 
              key={donor.id} 
              className="bg-white p-12 rounded-[4rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-sm italic"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
               <div className="relative italic">
                  <div className="w-32 h-32 bg-gray-50 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-white shadow-xl overflow-hidden z-10 relative italic">
                     {donor.profileImage ? (
                        <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 italic" />
                     ) : (
                        <p className="text-4xl font-black mb-1 italic tracking-tighter leading-none text-gray-900 italic italic">
                           {donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                        </p>
                     )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-600 rounded-2xl shadow-xl flex items-center justify-center border border-white z-20 italic">
                     <ShieldCheck className="text-white italic" size={18} />
                  </div>
               </div>

               <div className="space-y-4 w-full italic">
                  <div className="space-y-1 italic text-center">
                     <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none italic group-hover:text-red-600 transition-colors italic italic">
                        {donor.name}
                     </h3>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')} • Open Profile</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full pt-4 italic">
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 group-hover:bg-white transition-all italic">
                        <MapPin size={16} className="text-red-500 italic" />
                        <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter italic">{donor.district}</span>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-1 group-hover:bg-white transition-all italic">
                        <Activity size={16} className="text-blue-600 italic" />
                        <span className="text-[9px] font-black text-gray-900 uppercase italic tracking-tighter italic">{donor.totalDonations} Donations</span>
                     </div>
                  </div>
               </div>

               <button 
                 onClick={() => donor.user?.phone && addMember(donor.user.phone)}
                 disabled={isAdding || !donor.user?.phone}
                 className="w-full bg-gray-900 text-white py-5 rounded-[1.8rem] flex items-center justify-center gap-3 hover:bg-red-600 transition-all font-black text-[11px] uppercase tracking-widest italic shadow-xl active:scale-95 italic italic"
               >
                  {isAdding ? <Loader2 size={18} className="animate-spin italic" /> : <UserPlus size={18} className="italic" />}
                  Add to Directory
               </button>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 xl:col-span-3 py-60 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 relative overflow-hidden group italic">
             <div className="relative z-10 space-y-10 italic text-center">
                <Globe size={48} className="mx-auto text-gray-300 italic" />
                <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter italic italic">No donors nearby</h3>
                <p className="text-gray-400 italic max-w-sm mx-auto text-sm italic">No open donor profiles detected in your current region.</p>
             </div>
          </div>
        )
      )}
      </div>

      {/* Footer Info */}
      <div className="bg-white p-16 md:p-28 rounded-[4rem] border border-gray-100 shadow-xl relative overflow-hidden group italic">
         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none group-hover:bg-red-600/[0.05] transition-all duration-1000 italic"></div>
         <div className="relative z-10 flex flex-col xl:flex-row gap-20 items-center italic">
            <div className="w-24 h-24 bg-gray-900 text-white rounded-[1.5rem] shadow-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-700 italic">
               <Globe className="w-12 h-12 text-red-600 italic" />
            </div>
            <div className="space-y-6 text-center xl:text-left flex-1 italic text-left">
               <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none italic italic">Regional Coordination.</h2>
               <p className="text-gray-400 font-medium italic max-w-4xl text-xl leading-relaxed italic">
                 Effective regional coordination ensures that every hospital can connect with local life-savers in real-time. Manage your directory to maintain peak operational readiness.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
