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
  Lock,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import CTASection from '@/components/common/CTASection';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/common/Skeleton';

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

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-[45rem] h-[45rem] bg-gray-50 rounded-full blur-[120px] -ml-64 -mt-64 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-gray-50 rounded-full blur-[100px] -mr-48 -mb-48 opacity-30 pointer-events-none" />

      {/* 1. Rewards Hero - Renders Instantly */}
      <section className="bg-gray-50/20 pt-24 pb-48 relative overflow-hidden border-b border-gray-100 italic font-black">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col xl:flex-row items-center gap-24">
            <div className="flex-1 space-y-12 text-center xl:text-left">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                 <span className="bg-[#112135] text-white px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic shadow-2xl shadow-gray-900/10">
                    Impact Hub
                 </span>
                 <div className="flex items-center gap-3 text-[11px] text-red-600 font-black uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-red-50 italic animate-pulse">
                   <Sparkles size={16} className="fill-red-50" />
                   Exclusive Citizen Perks
                 </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9] text-[#112135]">
                Your Impact<br />Is <span className="text-red-600 italic">Rewarding</span>.
              </h1>
              <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium italic leading-relaxed">
                Turn your bravery into exclusive rewards. Earn points for every heroic donation and redeem them across our curated partner network.
              </p>
            </div>

            {/* AUTH STATE: Points Balance OR Guest Card */}
            {isAuthenticated ? (
               profileLoading ? (
                  /* Points Balance Skeleton */
                  <div className="w-full xl:w-[480px] h-[400px] bg-[#112135] rounded-[4rem] animate-pulse flex items-center justify-center">
                     <Skeleton className="w-32 h-32 rounded-full opacity-20" />
                  </div>
               ) : (
                  <div className="w-full xl:w-[480px] bg-[#112135] p-12 lg:p-14 rounded-[4rem] shadow-2xl text-center relative group overflow-hidden animate-in zoom-in-95 duration-700">
                     <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                     
                     <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] mb-10 italic relative z-10">Your Impact Wallet</p>
                     <div className="flex items-center justify-center gap-8 mb-10 relative z-10">
                        <Star className="w-14 h-14 text-amber-500 fill-amber-500" />
                        <span className="text-8xl font-black italic tracking-tighter text-white">{points || 0}</span>
                     </div>
                     <p className="text-[11px] font-black italic text-red-500 uppercase tracking-[0.4em] italic mb-12">Verified Impact Points</p>
                     
                     <div className="pt-10 border-t border-white/5 grid grid-cols-2 gap-8 relative z-10">
                        <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 p-7 rounded-[2.5rem] border border-white/5 flex flex-col items-center gap-4 transition-all italic group/link">
                        <History className="w-6 h-6 text-white/40 group-hover/link:text-white" />
                        <span className="text-[10px] font-black uppercase text-white/40 group-hover/link:text-white">Logs</span>
                        </Link>
                        <Link href="/urgent-requests" className="bg-red-600 hover:bg-red-700 p-7 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 transition-all italic active:scale-95 text-white group/earn">
                        <Zap className="w-6 h-6 group-hover/earn:scale-125 transition-transform" />
                        <span className="text-[10px] font-black uppercase">Earn More</span>
                        </Link>
                     </div>
                  </div>
               )
            ) : (
               <div className="w-full xl:w-[480px] bg-white p-12 lg:p-14 rounded-[4rem] shadow-2xl text-center relative group overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000 border border-gray-100 font-black">
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />
                  
                  <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-[2rem] flex items-center justify-center mx-auto mb-10 group-hover:text-red-200 group-hover:scale-110 duration-700 transition-all border border-gray-100">
                    <Lock size={32} />
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-tight mb-6">Join the Elite <br /> Donor Network</h3>
                  <p className="text-gray-400 italic text-base font-medium mb-12 max-w-[280px] mx-auto leading-relaxed">
                     Donors save lives and earn premium perks. Login to view and redeem your impact rewards.
                  </p>
                  
                  <Link href="/login" className="block w-full bg-[#112135] text-white py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all italic shadow-xl shadow-gray-200 active:scale-95 hover:-translate-y-1">
                     Membership Login
                  </Link>
               </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Rewards Marketplace - Conditional Loading Grid */}
      <section className="-mt-32 relative z-20 px-6 mb-32 italic font-black min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {rewardsLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => (
                   <div key={i} className="bg-white p-12 lg:p-14 rounded-[4rem] border border-gray-100 space-y-10">
                      <div className="flex justify-between">
                         <SkeletonCircle size="w-20 h-20" />
                         <Skeleton className="w-24 h-10 rounded-xl" />
                      </div>
                      <SkeletonText lines={3} />
                      <Skeleton className="w-full h-16 rounded-full" />
                   </div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-12">
               {rewards.length > 0 ? rewards.map((reward: any, i: number) => {
               const canAfford = points >= reward.pointsCost;

               return (
                  <div 
                     key={reward.id} 
                     className={`bg-white p-12 lg:p-14 rounded-[4rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col relative overflow-hidden ${
                        !isAuthenticated ? 'grayscale-[0.8] opacity-90' : ''
                     }`}
                  >
                     <div className="flex items-start justify-between mb-12">
                     <div className="w-22 h-22 rounded-[1.8rem] bg-gray-50 text-gray-400 flex items-center justify-center text-3xl transition-all duration-500 group-hover:bg-[#112135] group-hover:text-white border border-gray-100 group-hover:border-[#112135] group-hover:shadow-xl group-hover:shadow-[#112135]/10">
                        <Gift className="w-11 h-11" />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-none mb-4 italic">Cost Threshold</p>
                        <div className={`flex items-center gap-3 justify-end font-black italic text-3xl transition-colors ${canAfford ? 'text-red-600' : 'text-gray-200'}`}>
                           <Zap size={20} className={canAfford ? 'animate-pulse' : ''} />
                           {reward.pointsCost}
                        </div>
                     </div>
                     </div>

                     <div className="flex-1 space-y-6">
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-5 py-2 rounded-full uppercase italic tracking-widest border border-gray-100 group-hover:bg-red-50 group-hover:text-red-500 group-hover:border-red-100 transition-all">
                           {reward.category || 'Premium Perk'}
                        </span>
                     </div>
                     <h3 className="text-3xl font-black text-gray-900 italic uppercase leading-[0.9] truncate group-hover:text-[#112135] transition-colors pr-4">
                        {reward.title}
                     </h3>
                     <p className="text-gray-500 text-base font-medium italic mb-10 leading-relaxed line-clamp-3 opacity-90">
                        {reward.description}
                     </p>
                     </div>

                     <div className="mt-14 pt-12 border-t border-gray-50">
                     {isAuthenticated ? (
                        <div className="flex flex-col gap-4">
                           <button
                              onClick={() => setRedeemingId(reward.id)}
                              disabled={!canAfford || redeemMutation.isPending}
                              className={`w-full py-6 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all italic flex items-center justify-center gap-4 active:scale-95 ${
                                 canAfford 
                                 ? 'bg-[#112135] text-white hover:bg-red-600 shadow-2xl' 
                                 : 'bg-gray-50 text-gray-200 cursor-not-allowed border border-gray-100 font-bold opacity-60'
                              }`}
                              >
                              {canAfford ? 'Redeem Voucher' : 'Points Locked'}
                              </button>
                              {!canAfford && (
                                 <p className="text-[9px] text-center font-black text-gray-300 uppercase tracking-widest italic">
                                    Unlock by saving more lives.
                                 </p>
                              )}
                        </div>
                     ) : (
                        <div className="space-y-4">
                           <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Lock className="w-12 h-12 text-[#112135] opacity-20" />
                           </div>
                           <Link href="/login" className="relative z-20 block w-full text-center py-6 bg-gray-900 text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 transition-all italic shadow-2xl flex items-center justify-center gap-3 group/lock">
                           Login to Claim <ArrowRight className="w-5 h-5 group-hover/lock:translate-x-2 transition-transform" />
                           </Link>
                           <p className="text-[9px] text-center font-black text-gray-300 uppercase tracking-widest italic relative z-20">
                              Member Exclusive Area
                           </p>
                        </div>
                     )}
                     </div>
                  </div>
               );
               }) : (
                  <div className="col-span-full bg-white rounded-[5rem] border-4 border-dashed border-gray-100 p-32 text-center space-y-12 animate-in fade-in duration-1000 shadow-sm relative overflow-hidden group">
                     <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                        <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto transition-all group-hover:bg-[#112135] group-hover:text-white group-hover:scale-110 duration-700 border border-gray-100 shadow-sm">
                           <ShoppingBag size={56} />
                        </div>
                        
                        <div className="space-y-4">
                           <h3 className="text-5xl md:text-8xl font-black text-gray-200 uppercase italic tracking-tighter leading-[0.8] transition-colors group-hover:text-gray-300">
                              Marketplace <br /> <span className="italic italic">Replenishing.</span>
                           </h3>
                           <p className="text-gray-400 italic text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                              Our rewards pool is being updated with fresh high-end vouchers. We drop new impact perks weekly—check back soon.
                           </p>
                        </div>

                        <div className="pt-8 w-full max-w-xs mx-auto">
                           <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                              <div className="h-full bg-gray-100 rounded-full w-[85%] animate-pulse" />
                           </div>
                           <p className="mt-6 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic">System Update 85%</p>
                        </div>
                     </div>
                     <div className="absolute inset-0 bg-[#112135]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
               )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Global CTA - Renders Instantly */}
      <CTASection 
        title="REWARD YOUR HEROISM."
        subtitle="Every donation is a gift of life. We believe your bravery deserves to be celebrated. Exclusive citizen perks for those who care most."
        primaryBtnText="START EARNING"
        primaryBtnLink="/register"
        secondaryBtnText="MISSION FEED"
        secondaryBtnLink="/saved-lives"
      />

      {/* 4. Redemption Modal */}
      {redeemingId && (
        <>
          <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setRedeemingId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full p-16 rounded-[5rem] bg-white shadow-2xl z-[110] animate-in zoom-in-95 duration-300 border border-gray-100 italic font-black">
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
                  className="flex-1 py-6 bg-gray-50 text-gray-400 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 italic"
               >
                 Abort
               </button>
               <button 
                  onClick={() => handleRedeem(redeemingId)}
                  disabled={redeemMutation.isPending}
                  className="flex-[2] py-6 bg-[#112135] text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 italic"
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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-16 rounded-[5rem] bg-white shadow-2xl z-[130] text-center border-t-8 border-t-red-600 animate-in zoom-in duration-300 italic font-black">
             
             <div className="flex flex-col items-center">
               <div className="w-28 h-28 bg-[#112135] text-white rounded-full flex items-center justify-center mb-10 shadow-2xl">
                  <ShieldCheck size={56} />
               </div>
               <h3 className="text-5xl font-black text-gray-900 italic uppercase mb-2 italic leading-none">Claimed!</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12 italic">Voucher Dispatched</p>
               
               <div className="w-full p-12 rounded-[3.5rem] bg-[#112135] border-2 border-dashed border-white/20 mb-12 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em] mb-4 italic">Secret Voucher Key</p>
                  <p className="text-5xl font-black text-white tracking-[0.1em] italic font-mono relative z-10">{recentVoucher.voucherCode}</p>
               </div>

               <button 
                  onClick={() => setRecentVoucher(null)}
                  className="w-full py-6 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-[#112135] transition-all shadow-xl italic"
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
