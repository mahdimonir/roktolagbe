'use client';

import { Activity, Globe, Users, Zap } from 'lucide-react';
import Image from 'next/image';

export default function ImpactWall() {
   const stats = [
      { label: 'LIVES TRANSORMED', value: '4.2K+', icon: <Users size={20} /> },
      { label: 'EMERGENCY BRIDGES', value: '18K+', icon: <Activity size={20} /> },
      { label: 'DONOR STREAK', value: '240d', icon: <Zap size={20} /> },
      { label: 'ACTIVE HUBS', value: '12', icon: <Globe size={20} /> }
   ];

   const recentMissions = ['HERO #B892', 'HERO #Z441', 'HERO #P112', 'HERO #R909'];

   return (
      <section className="py-16 md:py-20 bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/5 relative overflow-hidden italic text-gray-900 dark:text-white">
         <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
            <Image 
               src="/impact-wall.png" 
               alt="Impact Grid" 
               fill 
               className="object-cover"
            />
         </div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[150px] pointer-events-none" />

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center space-y-4 mb-16">
               <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                  Global Metrics
               </div>
               <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                  THE <span className="text-red-500">IMPACT</span> GRID.
               </h2>
               <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto italic leading-relaxed">
                  Every dot represents a life transformed by our collective empathy.
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {stats.map((stat, i) => (
                  <div key={i} className="p-8 rounded-[2rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] text-center space-y-3 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all group shadow-sm">
                     <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        {stat.icon}
                     </div>
                     <div className="space-y-0.5">
                        <h4 className="text-3xl md:text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{stat.value}</h4>
                        <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest italic">{stat.label}</p>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5">
               <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
                  {recentMissions.map((hero, i) => (
                     <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-400 dark:text-gray-500">{hero} JUST COMPLETED A MISSION</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
