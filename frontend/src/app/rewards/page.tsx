'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { 
  Gift, 
  Star, 
  History, 
  Loader2, 
  Award,
  Sparkles,
  Zap,
  ShoppingBag,
  ShieldCheck,
  Target
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import CTASection from '@/components/common/CTASection';

export default function RewardsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [recentVoucher, setRecentVoucher] = useState<any>(null);

  // 1. Fetch available rewards
  const { data: rewardsData, isLoading: rewardsLoading } = useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const res: any = await api.get('/rewards');
      return (res as any)?.data || [];
    },
  });

  // 2. Fetch donor's point balance
  const { data: donorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res: any = await api.get('/donors/me');
      return (res as any)?.data;
    },
    enabled: isAuthenticated && user?.role === 'DONOR',
  });

  // 3. Redemption Mutation
  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const res: any = await api.post('/rewards/redeem', { rewardId });
      return (res as any)?.data;
    },
    onSuccess: (data) => {
      setRecentVoucher(data);
      setRedeemingId(null);
      toast.success('Reward redeemed! Check your voucher. 🎁');
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Redemption failed. Please try again.');
      setRedeemingId(null);
    }
  });

  const handleRedeem = (rewardId: string) => {
    if (!isAuthenticated) return toast.error('Please login as a donor to redeem rewards.');
    if (redeemMutation.isPending) return;
    redeemMutation.mutate(rewardId);
  };

  const rewards = rewardsData || [];
  const points = donorProfile?.points || 0;

  if (rewardsLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Syncing Rewards Pool...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Rewards Hero */}
      <section className="bg-gray-50/50 pt-32 pb-48 relative overflow-hidden group border-b border-gray-100 italic">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[40rem] h-[40rem] bg-red-600/[0.03] rounded-full blur-[150px] pointer-events-none group-hover:bg-red-600/[0.05] transition-all duration-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col xl:flex-row items-center gap-16">
            <div className="flex-1 space-y-10 text-center xl:text-left">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                 <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-lg shadow-red-600/10">
                    Impact Economy
                 </span>
                 <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-red-50 italic">
                   <Sparkles size={14} className="fill-red-100" />
                   Exclusive Perks
                 </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-none italic text-gray-900 leading-[0.85]">
                Your Impact<br />Is <span className="text-red-600 italic">Rewarding</span>.
              </h1>
              <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium italic leading-relaxed">
                Turn your heroism into exclusive rewards. Earn points for every confirmed donation and redeem them across our partner network.
              </p>
            </div>

            {/* Points Balance Card */}
            <div className="w-full xl:w-[450px] bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl text-center relative group overflow-hidden animate-in zoom-in duration-700">
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 italic">Your Balance Radar</p>
               <div className="flex items-center justify-center gap-6 mb-8">
                 <Star className="w-14 h-14 text-amber-500 fill-amber-100" />
                 <span className="text-8xl font-black italic tracking-tighter text-gray-900">{points}</span>
               </div>
               <p className="text-[10px] font-black italic text-gray-400 uppercase tracking-[0.3em] italic">Impact Points</p>
               
               <div className="mt-12 pt-12 border-t border-gray-50 grid grid-cols-2 gap-6 relative z-10">
                  <Link href="/dashboard" className="bg-gray-50 hover:bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center gap-3 transition-all italic hover:shadow-lg">
                    <History className="w-6 h-6 text-gray-400" />
                    <span className="text-[9px] font-black uppercase text-gray-500">History</span>
                  </Link>
                  <Link href="/urgent-requests" className="bg-gray-900 hover:bg-red-600 p-6 rounded-[2rem] shadow-xl flex flex-col items-center gap-3 transition-all italic active:scale-95 text-white group">
                    <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" />
                    <span className="text-[9px] font-black uppercase">Earn More</span>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Rewards Marketplace */}
      <section className="-mt-32 relative z-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {rewards.length > 0 ? rewards.map((reward: any, i: number) => {
              const canAfford = points >= reward.pointsCost;

              return (
                <div 
                  key={reward.id} 
                  className="bg-white p-10 lg:p-12 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 text-gray-400 flex items-center justify-center text-3xl transition-all duration-500 group-hover:bg-red-600 group-hover:text-white border border-gray-100 group-hover:border-red-500 group-hover:shadow-lg group-hover:shadow-red-500/20">
                      <Gift className="w-10 h-10" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3 italic">Threshold</p>
                      <div className={`flex items-center gap-2 justify-end font-black italic text-2xl ${canAfford ? 'text-red-600' : 'text-gray-300'}`}>
                        <Zap size={18} />
                        {reward.pointsCost}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black bg-gray-50 text-gray-500 px-4 py-1.5 rounded-full uppercase italic tracking-widest border border-gray-100">
                         {reward.category || 'Standard'}
                       </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 italic uppercase italic leading-none truncate group-hover:text-red-600 transition-colors">
                      {reward.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium italic mb-8 leading-relaxed line-clamp-3">
                      {reward.description}
                    </p>
                  </div>

                  <div className="mt-12 pt-10 border-t border-gray-50">
                    {isAuthenticated ? (
                      <button
                        onClick={() => setRedeemingId(reward.id)}
                        disabled={!canAfford || redeemMutation.isPending}
                        className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all italic flex items-center justify-center gap-3 active:scale-95 ${
                          canAfford 
                            ? 'bg-gray-900 text-white hover:bg-red-600 shadow-xl' 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-100 font-bold'
                        }`}
                      >
                        {canAfford ? 'Redeem Voucher' : 'Points Locked'}
                      </button>
                    ) : (
                      <Link href="/login" className="block w-full text-center py-6 bg-gray-100 text-gray-500 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all italic shadow-sm hover:shadow-lg">
                        Login to Claim
                      </Link>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-56 text-center bg-white rounded-[5rem] border-4 border-dashed border-gray-100 shadow-sm group">
                 <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-10 border border-gray-100 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={56} />
                 </div>
                 <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">Marketplace Closed</h3>
                 <p className="text-gray-400 italic text-sm font-medium mt-4">The rewards pool is being replenished. Check back in 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Global CTA */}
      <CTASection 
        title="REWARD YOUR HEROISM."
        subtitle="Every donation is a gift of life. We believe your bravery deserves to be celebrated. High-end perks for citizens who care."
        primaryBtnText="START EARNING"
        secondaryBtnText="MISSION FEED"
      />

      {/* 4. Redemption Modal */}
      {redeemingId && (
        <>
          <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setRedeemingId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full p-16 rounded-[4rem] bg-white shadow-2xl z-[110] animate-in zoom-in-95 duration-300 border border-gray-100">
             <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-red-100 shadow-xl shadow-red-500/10">
                <Gift size={44} />
             </div>
             <h3 className="text-4xl font-black text-gray-900 italic uppercase text-center mb-6 italic leading-none">Confirm Claim</h3>
             <p className="text-center text-gray-500 italic font-bold mb-12 leading-relaxed px-6 text-lg">
                Are you sure you want to trade <span className="text-red-600 font-black">{rewards.find((r: any) => r.id === redeemingId)?.pointsCost} Impact Points</span> for this reward?
             </p>
             
             <div className="flex gap-6">
               <button 
                  onClick={() => setRedeemingId(null)}
                  className="flex-1 py-6 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 italic"
               >
                 Abort
               </button>
               <button 
                  onClick={() => handleRedeem(redeemingId)}
                  disabled={redeemMutation.isPending}
                  className="flex-[2] py-6 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 italic"
               >
                 {redeemMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Redemption'}
               </button>
             </div>
          </div>
        </>
      )}

      {/* 5. Success Modal */}
      {recentVoucher && (
        <>
          <div className="fixed inset-0 z-[120] bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setRecentVoucher(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-16 rounded-[4rem] bg-white shadow-2xl z-[130] text-center border-t-8 border-t-red-600 animate-in zoom-in duration-300">
             
             <div className="flex flex-col items-center">
               <div className="w-28 h-28 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-10 shadow-xl">
                  <ShieldCheck size={56} />
               </div>
               <h3 className="text-5xl font-black text-gray-900 italic uppercase mb-2 italic leading-none">Claimed!</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12 italic">Voucher Dispatched</p>
               
               <div className="w-full p-12 rounded-[2.5rem] bg-gray-900 border-2 border-dashed border-white/20 mb-12 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 italic">Secret Voucher Key</p>
                  <p className="text-4xl font-black text-white tracking-[0.2em] italic font-mono relative z-10">{recentVoucher.voucherCode}</p>
               </div>

               <button 
                  onClick={() => setRecentVoucher(null)}
                  className="w-full py-6 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl italic"
               >
                 Return to Hub
               </button>
             </div>
          </div>
        </>
      )}
    </main>
  );
}
