'use client';

import { HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import Image from 'next/image';

export default function WhyDonate() {
   const benefits = [
      { title: "Saves 3 Lives", desc: "A single donation can help up to three different patients.", icon: <HeartPulse size={20} /> },
      { title: "Health Checkup", desc: "Every donor receives a free mini-checkup for pulse and BP.", icon: <Stethoscope size={20} /> },
      { title: "Heart Health", desc: "Regular donation helps maintain healthy blood flow.", icon: <ShieldCheck size={20} /> },
   ];

   return (
      <section className="py-16 bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/5 relative overflow-hidden italic">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <div className="space-y-10">
                  <div className="space-y-4">
                     <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                        Why It Matters
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                        A Gift From The <span className="text-red-600 italic">Heart</span>
                     </h2>
                     <p className="text-lg text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">
                        Donating blood isn&apos;t just about saving lives — it&apos;s a medical duty that keeps your body healthy and your community strong.
                     </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                     {benefits.map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-6 rounded-[2rem] bg-gray-50/20 dark:bg-white/[0.03] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 dark:hover:border-red-500/30 transition-all duration-500 group shadow-sm">
                           <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                              {item.icon}
                           </div>
                           <div className="space-y-1">
                              <h4 className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{item.title}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 italic font-medium leading-tight">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="relative group aspect-square lg:aspect-[4/3] rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-gray-100 dark:border-white/10">
                  <Image src="/why-donate.png" alt="Why Donate" fill className="object-cover group-hover:scale-105 transition-transform duration-[3s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
         </div>
      </section>
   );
}
