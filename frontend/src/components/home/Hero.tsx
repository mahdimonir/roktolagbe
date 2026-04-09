'use client';

import { Gauge, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
   return (
      <section className="relative pt-16 pb-16 md:pt-20 md:pb-20 overflow-hidden lg:bg-white dark:lg:bg-transparent max-lg:bg-[url('/mobile-hero-1.png')] max-lg:min-h-[600px] max-lg:bg-no-repeat max-lg:bg-bottom max-lg:bg-[length:auto_85%] max-lg:bg-[#EDEDED] dark:max-lg:bg-[#1a1a1a]">
         {/* Desktop-only pulse element */}
         <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] rounded-full blur-[150px] pointer-events-none animate-pulse max-lg:hidden"></div>
         
         {/* Mobile Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 lg:hidden pointer-events-none" />

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 xl:gap-20">
               <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="space-y-6 max-lg:space-y-4">
                     {/* Bengali Heading - Red Branding with Razor-Sharp Glow */}
                     <h1 className="text-red-600 text-5xl max-lg:text-6xl md:text-7xl font-black tracking-tighter leading-none mb-2 max-lg:drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] scale-110 max-lg:scale-100 transition-transform">
                        রক্ত লাগবে?
                     </h1>
                     {/* English Heading - Crisp White for Depth */}
                     <h2 className="text-gray-900 dark:text-white max-lg:text-white text-4xl md:text-[3.5rem] xl:text-[4.5rem] font-black tracking-tighter leading-[1.1] italic max-lg:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                        The Pulse of Life.
                     </h2>
                  </div>
                  
                  {/* Description with enhanced backdrop logic */}
                  <div className="relative max-w-xl mx-auto lg:mx-0">
                     <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-lg:text-white/95 font-medium leading-relaxed italic max-lg:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-4 sm:px-0">
                        Bridging the gap between medical urgency and human empathy. Bangladesh&apos;s most trusted clinical network for emergency blood donation.
                     </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                     <Link href="/register" className="bg-red-600 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-red-700 transition-all active:scale-95 italic group/btn">
                        <Heart className="w-5 h-5 fill-white group-hover/btn:scale-125 transition-transform" />
                        Become a Donor
                     </Link>
                     <Link href="/urgent-requests" className="bg-white dark:bg-white/5 lg:border-2 lg:border-red-600 lg:text-red-600 max-lg:bg-transparent max-lg:border-2 max-lg:border-white max-lg:text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all w-full sm:w-auto text-center italic active:scale-95 flex items-center justify-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        I Need Blood
                     </Link>
                  </div>
               </div>

               <div className="flex-1 relative w-full animate-in zoom-in duration-1000 group max-lg:hidden">
                  {/* Main Hero Image - Visible on Desktop */}
                  <div className="relative rounded-[4rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.12)] aspect-[1/1] xl:aspect-[4/3] w-full max-w-[640px] mx-auto border-8 border-white dark:border-gray-900 bg-gray-50 dark:bg-gray-800">
                     <Image 
                        src="/hero-rebrand.png" 
                        alt="Healthcare Pulse" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                        priority
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Floating RESPONSE TIME Badge */}
                  <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-white dark:bg-gray-900 p-4 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-500 border border-gray-100 dark:border-white/5 group-hover:translate-y-[-10px] transition-transform">
                     <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
                        <Gauge size={32} className="group-hover:rotate-45 transition-transform duration-700" />
                     </div>
                     <div className="text-left font-black italic">
                        <div className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-1">Response Time</div>
                        <div className="text-2xl text-[#112135] dark:text-white tracking-tighter">Under 30 Mins</div>
                     </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-600/[0.03] rounded-full blur-[100px] -z-10 group-hover:scale-125 transition-transform duration-1000" />
                  <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-red-600/[0.04] rounded-full blur-[120px] -z-10" />
               </div>
            </div>
         </div>
      </section>
   );
}
