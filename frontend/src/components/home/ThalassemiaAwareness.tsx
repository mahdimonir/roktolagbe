'use client';

import { ArrowRight, Droplets, HeartPulse, Stethoscope } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ThalassemiaAwareness() {
   return (
      <section className="py-12 md:py-16 bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/5 overflow-hidden italic relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <div className="space-y-8">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                        Awareness Mission
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                        Prevent <span className="text-red-600">Thalassemia</span>. <br />
                        Protect Generations.
                     </h2>
                     <p className="text-lg text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">
                        Knowledge and early screening can prevent its spread. Your donation is a lifeline for children fighting this battle every day.
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                     <div className="bg-gray-50/20 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-white/[0.08] backdrop-blur-[40px] shadow-sm group hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 shadow-sm transition-transform group-hover:scale-110">
                              <Stethoscope size={18} />
                           </div>
                           <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic tracking-widest leading-none">Pre-Marital screening</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold italic leading-relaxed">Simple blood tests before marriage can identify carriers and prevent future complications.</p>
                     </div>
                     <div className="bg-gray-50/20 dark:bg-white/[0.02] p-6 rounded-[2rem] border border-gray-100 dark:border-white/[0.08] backdrop-blur-[40px] shadow-sm group hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 shadow-sm transition-transform group-hover:scale-110">
                              <HeartPulse size={18} />
                           </div>
                           <h4 className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic tracking-widest leading-none">Regular Donation</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-bold italic leading-relaxed">Continuous supply of fresh blood is critical for patients managing chronic Thalassemia.</p>
                     </div>
                  </div>

                  <Link href="/help" className="inline-flex items-center gap-3 text-red-600 text-[9px] font-black uppercase tracking-widest italic group">
                     LEARN MORE ABOUT THALASSEMIA <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>

               <div className="relative group">
                  <div className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-[3.5rem] border-4 border-gray-100 dark:border-white/10 shadow-2xl">
                     <Image 
                        src="/thalassemia-awareness.png" 
                        alt="Thalassemia Awareness" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-3xl shadow-2xl flex items-center justify-center p-5 group-hover:-translate-y-2 transition-transform duration-700">
                     <Droplets className="w-full h-full text-red-500 animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
