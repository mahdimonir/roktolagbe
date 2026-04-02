'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { 
  Gift, 
  Star, 
  History, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  HeartPulse,
  Target
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

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
      queryClient.invalidateQueries({ queryKey: ['redeemed-rewards'] });
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
      <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
      <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading rewards...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. Rewards Hero */}
      <section className="bg-white pt-32 pb-48 relative overflow-hidden group border-b border-gray-100">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[40rem] h-[40rem] bg-red-600/[0.03] rounded-full blur-[150px] pointer-events-none group-hover:bg-red-600/[0.05] transition-all duration-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col xl:flex-row items-center gap-16">
            <div className="flex-1 space-y-10 text-center xl:text-left">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                 <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-lg shadow-red-600/10">
                    Donor Rewards
                 </span>
                 <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100 italic">
                   <Sparkles size={14} />
                   Exclusive Perks
                 </div>
              </div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-tight italic text-gray-900">
                Your Impact<br />Is <span className="text-red-600">Rewarding</span>
              </h1>
              <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium italic leading-relaxed">
                Earn points for every blood donation and redeem them for exclusive vouchers and perks from our partners.
              </p>
            </div>

            {/* Points Balance Card */}
            <div className="w-full xl:w-[450px] bg-white p-12 rounded-[3.5rem] border border-gray-200 shadow-xl text-center relative group overflow-hidden">
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-10 italic">Current Balance</p>
               <div className="flex items-center justify-center gap-6 mb-8">
                 <Star className="w-14 h-14 text-amber-500" />
                 <span className="text-8xl font-black italic tracking-tighter text-gray-900">{points}</span>
               </div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Reward Points</p>
               
               <div className="mt-12 pt-12 border-t border-gray-100 grid grid-cols-2 gap-6 relative z-10">
                  <Link href="/dashboard?tab=history" className="bg-gray-50 hover:bg-gray-100 p-5 rounded-[1.5rem] border border-gray-100 flex flex-col items-center gap-3 transition-all italic">
                    <History className="w-6 h-6 text-gray-400" />
                    <span className="text-[9px] font-black uppercase text-gray-500">History</span>
                  </Link>
                  <Link href="/urgent-requests" className="bg-gray-900 hover:bg-red-600 p-5 rounded-[1.5rem] shadow-xl flex flex-col items-center gap-3 transition-all italic active:scale-95">
                    <Zap className="w-6 h-6 text-white" />
                    <span className="text-[9px] font-black uppercase text-white">Earn Points</span>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Rewards Marketplace */}
      <section className="-mt-32 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {rewards.length > 0 ? rewards.map((reward: any, i: number) => {
              const canAfford = points >= reward.pointsCost;

              return (
                <div 
                  key={reward.id} 
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 group flex flex-col relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-10">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-gray-50 text-gray-400 flex items-center justify-center text-3xl transition-all duration-500 group-hover:bg-red-600 group-hover:text-white">
                      <Gift className="w-10 h-10" />
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-3 italic">Price</p>
                      <div className={`flex items-center gap-2 justify-end font-black italic text-xl ${canAfford ? 'text-red-600' : 'text-gray-300'}`}>
                        <Zap size={18} />
                        {reward.pointsCost} PTS
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <span className="text-[9px] font-black bg-gray-50 text-gray-500 px-4 py-1 rounded-full uppercase italic tracking-widest border border-gray-100">
                      {reward.category || 'Reward'}
                    </span>
                    <h3 className="text-3xl font-black text-gray-900 italic uppercase italic leading-tight group-hover:text-red-600 transition-colors">
                      {reward.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium italic mb-8 leading-relaxed line-clamp-3">
                      {reward.description}
                    </p>
                  </div>

                  <div className="mt-12 pt-10 border-t border-gray-100">
                    {isAuthenticated ? (
                      <button
                        onClick={() => setRedeemingId(reward.id)}
                        disabled={!canAfford || redeemMutation.isPending}
                        className={`w-full py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all italic flex items-center justify-center gap-3 active:scale-95 ${
                          canAfford 
                            ? 'bg-gray-900 text-white hover:bg-red-600 shadow-xl' 
                            : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                        }`}
                      >
                        {canAfford ? 'Redeem Voucher' : 'Insufficient Points'}
                      </button>
                    ) : (
                      <Link href="/login" className="block w-full text-center py-6 bg-gray-100 text-gray-500 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all italic">
                        Login to Claim
                      </Link>
                    )}
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-56 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200 shadow-inner group">
                 <ShoppingBag size={80} className="mx-auto text-gray-200 mb-10" />
                 <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">No Rewards Available</h3>
                 <p className="text-gray-400 italic text-sm font-medium mt-4">New rewards are added regularly. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Redemption Modal */}
      {redeemingId && (
        <>
          <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setRedeemingId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-full p-16 rounded-[3rem] bg-white shadow-2xl z-[110] animate-in zoom-in-95 duration-300">
             <div className="w-24 h-24 bg-red-50 text-red-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-10 border border-red-100">
                <Gift size={44} />
             </div>
             <h3 className="text-4xl font-black text-gray-900 italic uppercase text-center mb-6 italic leading-tight">Confirm Redemption</h3>
             <p className="text-center text-gray-500 italic font-bold mb-12 leading-relaxed px-6 text-lg">
                Redeem this voucher for <span className="text-red-600 font-black">{rewards.find((r: any) => r.id === redeemingId)?.pointsCost} Points</span>?
             </p>
             
             <div className="flex gap-6">
               <button 
                  onClick={() => setRedeemingId(null)}
                  className="flex-1 py-6 bg-gray-50 text-gray-400 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200 italic"
               >
                 Cancel
               </button>
               <button 
                  onClick={() => handleRedeem(redeemingId)}
                  disabled={redeemMutation.isPending}
                  className="flex-[2] py-6 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-red-600 transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 italic"
               >
                 {redeemMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm'}
               </button>
             </div>
          </div>
        </>
      )}

      {/* 4. Success Modal */}
      {recentVoucher && (
        <>
          <div className="fixed inset-0 z-[120] bg-gray-900/90 backdrop-blur-md animate-in fade-in duration-500" onClick={() => setRecentVoucher(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-16 rounded-[3rem] bg-white shadow-2xl z-[130] text-center border-t-8 border-t-green-500 animate-in zoom-in duration-300">
             
             <div className="flex flex-col items-center">
               <div className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-10">
                  <ShieldCheck size={56} />
               </div>
               <h3 className="text-5xl font-black text-gray-900 italic uppercase mb-2 italic">Success!</h3>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-12 italic">Reward Claimed</p>
               
               <div className="w-full p-10 rounded-[2rem] bg-gray-900 border-2 border-dashed border-white/10 mb-12">
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 italic">Voucher Code</p>
                  <p className="text-4xl font-black text-white tracking-[0.2em] italic font-mono">{recentVoucher.voucherCode}</p>
               </div>

               <button 
                  onClick={() => setRecentVoucher(null)}
                  className="w-full py-6 bg-red-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl italic"
               >
                 Done
               </button>
             </div>
          </div>
        </>
      )}
    </main>
  );
}
