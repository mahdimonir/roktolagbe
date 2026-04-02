'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { Reward, RedeemedReward, ApiResponse } from '@/lib/types/models';
import { 
  Sparkles, 
  Gift, 
  Zap, 
  Lock, 
  Unlock, 
  ChevronRight, 
  CheckCircle2, 
  Timer,
  ShoppingBag,
  ExternalLink,
  Medal,
  Flame,
  Loader2,
  Copy,
  Ticket,
  ShieldCheck,
  Award,
  Filter
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DonorRewardsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState('ALL');

  const { data: rewardsResponse, isLoading: rewardsLoading } = useQuery<ApiResponse<Reward[]>>({
    queryKey: ['available-rewards'],
    queryFn: () => api.get('/rewards'),
  });

  const { data: redeemedResponse, isLoading: redeemedLoading } = useQuery<ApiResponse<RedeemedReward[]>>({
    queryKey: ['my-rewards'],
    queryFn: () => api.get('/rewards/my'),
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardId: string) => api.post('/rewards/redeem', { rewardId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['my-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success('Reward successfully redeemed! 🎁');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Insufficient points for this reward.');
    }
  });

  const rewards = rewardsResponse?.data || [];
  const redeemed = redeemedResponse?.data || [];
  const categories = ['ALL', 'MEDICAL', 'LIFESTYLE', 'ELITE'];

  const filteredRewards = activeCategory === 'ALL' 
    ? rewards 
    : rewards.filter((r) => r.category.toUpperCase() === activeCategory);

  if (rewardsLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading rewards...</p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 italic">
      
      {/* Points Header */}
      <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl relative overflow-hidden group italic">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left italic">
            <div className="space-y-6 italic">
               <div className="flex items-center gap-5 justify-center md:justify-start italic">
                  <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-2xl italic">
                     <Award className="w-8 h-8" />
                  </div>
                  <div className="italic">
                     <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none italic">Redeem Rewards</h2>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 italic">Earn points through life-saving donations</p>
                  </div>
               </div>
               <p className="text-gray-500 max-w-lg text-sm italic font-medium leading-relaxed italic">
                 Your contributions help save lives. Use your earned points to redeem exclusive healthcare perks and rewards from our partners.
               </p>
            </div>

            <div className="bg-gray-50 p-10 rounded-[3.5rem] border border-gray-100 text-center min-w-[18rem] relative overflow-hidden shadow-inner italic">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 italic">Available Points</p>
               <h3 className="text-7xl font-black italic tracking-tightest leading-none flex items-center justify-center gap-4 text-gray-900 italic">
                   {user?.points || 0}
               </h3>
               <div className="mt-8 flex justify-center gap-2 italic">
                  <div className="h-1.5 w-16 bg-red-600 rounded-full shadow-sm"></div>
               </div>
            </div>
         </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-between items-center gap-8 italic">
         <div className="flex bg-white p-2 rounded-[2rem] border border-gray-100 shadow-sm italic">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic ${activeCategory === cat ? 'bg-gray-900 text-white shadow-xl italic' : 'text-gray-400 hover:text-gray-900'}`}
              >
                 {cat}
              </button>
            ))}
         </div>
      </div>

      {/* Reward Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 italic">
         {filteredRewards.map((reward) => (
           <div 
             key={reward.id} 
             className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col h-full italic"
           >
              <div className="flex justify-between items-start mb-10 italic">
                 <div className="bg-gray-50 text-gray-500 px-5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic border border-gray-100">
                    {reward.category}
                 </div>
                 <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm italic">
                    <Gift size={18} />
                 </div>
              </div>

              <div className="flex-1 space-y-4 italic">
                 <h4 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-none group-hover:text-red-600 transition-colors italic">
                    {reward.title}
                 </h4>
                 <p className="text-gray-400 text-xs font-medium italic leading-relaxed line-clamp-2 italic">
                    {reward.description}
                 </p>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between italic">
                 <div className="italic">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-2 italic">Points Required</p>
                    <p className="text-2xl font-black italic tracking-tighter text-gray-900 italic">
                       {reward.pointsCost} <span className="text-xs uppercase text-red-600 italic">pts</span>
                    </p>
                 </div>
                 <button 
                   onClick={() => redeemMutation.mutate(reward.id)}
                   disabled={redeemMutation.isPending || (user?.points || 0) < reward.pointsCost}
                   className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 italic active:scale-95 ${
                    (user?.points || 0) >= reward.pointsCost 
                      ? 'bg-gray-900 text-white shadow-xl hover:bg-red-600' 
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                   }`}
                 >
                    {redeemMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                    Redeem Reward
                 </button>
              </div>
           </div>
         ))}
      </div>

      {/* Redeemed Rewards (The Vault) */}
      <div className="space-y-12 pt-16 italic">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8 italic">
            <div className="flex items-center gap-6 italic">
               <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white shadow-xl italic">
                  <ShoppingBag size={28} />
               </div>
               <div className="italic">
                  <h3 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none italic">My Rewards 🎁</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 italic">View and manage your redeemed vouchers</p>
               </div>
            </div>
         </div>

         {redeemed.length > 0 ? (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 italic">
              {redeemed.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 flex flex-col sm:flex-row items-center gap-10 relative overflow-hidden group italic"
                >
                   <div className="shrink-0 w-32 h-32 bg-gray-50 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 group-hover:bg-red-600 group-hover:text-white transition-all duration-700 shadow-inner italic border border-gray-100">
                      <Ticket size={48} className="italic" />
                      <p className="text-[8px] font-black uppercase tracking-widest mt-2 italic">Partner Gift Voucher</p>
                   </div>

                   <div className="flex-1 space-y-4 min-w-0 text-center sm:text-left italic">
                      <div className="flex items-center justify-center sm:justify-start gap-4 italic">
                        <p className="text-[9px] font-black uppercase text-red-600 tracking-widest italic bg-red-50 px-3 py-1 rounded-full border border-red-100 italic">{item.reward.category}</p>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Redeemed: {new Date(item.redeemedAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h5 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase truncate leading-none italic group-hover:text-red-600 transition-colors italic">
                        {item.reward.title}
                      </h5>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 italic">
                         <div className="flex-1 w-full bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between italic">
                            <span className="text-[10px] font-mono font-black text-gray-500 italic">CODE: {item.voucherCode}</span>
                            <button 
                               onClick={() => { 
                                 navigator.clipboard.writeText(item.voucherCode); 
                                 toast.success('Code copied to clipboard!'); 
                               }}
                               className="p-2 text-gray-400 hover:text-gray-900 transition-colors bg-white rounded-lg border border-gray-100 shadow-sm italic"
                            >
                               <Copy size={14} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="py-32 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 italic">
              <Gift className="w-20 h-20 text-gray-200 mx-auto mb-8 italic" />
              <h4 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter italic">No rewards yet</h4>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-4 italic">Donate blood to earn points and unlock rewards.</p>
           </div>
         )}
      </div>

    </div>
  );
}
