'use client';

import CTASection from '@/components/common/CTASection';
import { Skeleton } from '@/components/common/Skeleton';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import { 
  Award, 
  Gift, 
  TrendingUp, 
  Zap, 
  Star,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Coins
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Rewards() {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['marketplace-rewards'],
    queryFn: async () => {
      const res: any = await api.get('/rewards/marketplace');
      return res?.data || [];
    }
  });

  return (
    <main className="min-h-screen bg-white pb-28 italic font-black">
      {/* 1. Hero Section - Refined Mobile Typography */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-red-600 text-white">
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-2 rounded-full text-white text-[10px] uppercase tracking-[0.3em] font-black italic mb-4">
               <Sparkles size={14} />
               Elite Donor Rewards
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
               REWARDS.<br />
               <span className="text-gray-900">REDEEMED.</span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic px-4">
               Your heroism deserves more than just a thank you. Earn clinical credits for every life-saving donation and unlock exclusive healthcare benefits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
               <Link href="/login" className="w-full sm:w-auto bg-gray-900 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-black transition-all active:scale-95 italic flex items-center justify-center gap-3">
                  <Lock size={18} />
                  Membership Login
               </Link>
               <button className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all active:scale-95 italic text-center">
                  Check Eligibility
               </button>
            </div>
         </div>
      </section>

      {/* 2. Points Balance / Login Placeholder - Mobile Scale Correction */}
      <section className="relative z-20 -mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-[#FBFAFA] rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 border-4 border-dashed border-gray-100 flex flex-col items-center text-center space-y-12 group overflow-hidden relative shadow-2xl">
               <div className="relative z-10 space-y-10">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl border border-gray-50 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700">
                     <Coins className="w-10 h-10 md:w-12 md:h-12 text-red-600" />
                  </div>
                  <div className="space-y-4">
                     <h2 className="text-3xl md:text-5xl font-black text-gray-200 uppercase tracking-tighter italic transition-colors group-hover:text-gray-400 px-4 md:px-0 leading-none">Join the Elite Donor Network.</h2>
                     <p className="text-gray-400 text-base md:text-xl italic max-w-2xl mx-auto font-medium leading-relaxed px-4 md:px-0">
                        Login to track your clinical credits, view your donor rank, and manage your exclusive marketplace redemptions.
                     </p>
                  </div>
                  <div className="pt-4">
                     <Link href="/login" className="w-full sm:w-auto inline-block bg-[#112135] text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl active:scale-95 italic">
                        Access Rewards Dashboard
                     </Link>
                  </div>
               </div>
               <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/[0.01] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
         </div>
      </section>

      {/* 3. Marketplace Highlights - Full Mobile Refinement */}
      <section className="py-32 italic">
         <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-16 text-center md:text-left">
               <div className="space-y-4">
                  <p className="text-red-600 font-black text-[11px] uppercase tracking-widest leading-none">Marketplace Catalog</p>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                     Elite <span className="text-red-600 italic">Perks</span>
                  </h2>
               </div>
               <Link href="/marketplace" className="text-xs md:text-sm font-black text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest flex items-center gap-3 group">
                  Full Catalog <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="space-y-6">
                        <Skeleton className="aspect-square rounded-[2.5rem]" />
                        <div className="space-y-3">
                           <Skeleton className="h-8 w-3/4 rounded-full" />
                           <Skeleton className="h-4 w-1/2 rounded-full" />
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               /* PLACEHOLDER MARKETPLACE STATE - Enhanced Mobile Sizing */
               <div className="w-full bg-[#FBFAFA] rounded-[2.5rem] md:rounded-[4rem] p-12 md:p-24 border-2 border-gray-100 text-center space-y-12 group relative overflow-hidden">
                  <div className="relative z-10 space-y-10">
                     <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-700">
                        <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-gray-200" />
                     </div>
                     <div className="space-y-4">
                        <h3 className="text-2xl md:text-4xl font-black text-gray-300 uppercase tracking-tighter italic">Marketplace Replenishing</h3>
                        <p className="text-gray-400 text-sm md:text-lg italic max-w-xl mx-auto font-medium px-4 md:px-0">
                           Our clinical partners are updating the reward inventory. New lifestyle and healthcare perks are arriving soon.
                        </p>
                     </div>
                     <div className="max-w-xs mx-auto space-y-3">
                        <div className="flex justify-between text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                           <span>System Update</span>
                           <span>85%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full w-[85%] bg-blue-500 animate-pulse" />
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </section>

      <CTASection 
         title="TURN IMPACT INTO REWARDS."
         subtitle="Every life you save brings you closer to the next elite tier. Join our life-saving network and unlock the benefits of your heroism."
         primaryBtnText="START DONATING"
         primaryBtnLink="/register"
         secondaryBtnText="VIEW RANKINGS"
         secondaryBtnLink="/rewards/ranks"
      />
    </main>
  );
}
