'use client';

import React from 'react';

interface StatItem {
   label: string;
   value: string;
   icon: React.ReactNode;
}

interface StatsProps {
   stats: StatItem[];
}

export default function Stats({ stats }: StatsProps) {
   return (
      <section className="py-10 md:py-12 bg-white dark:bg-[#0a0a0d] border-b border-gray-100 dark:border-white/5 relative overflow-hidden italic">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               {stats.map((stat, i) => (
                  <div 
                     key={i} 
                     className="bg-gray-50/20 dark:bg-white/[0.02] p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/[0.08] hover:shadow-2xl dark:hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-500 group backdrop-blur-[30px] flex flex-col items-center lg:items-start text-center lg:text-left shadow-sm"
                  >
                     <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 dark:bg-red-500/10 rounded-xl shadow-sm dark:shadow-black/20 border border-red-50 dark:border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative overflow-hidden text-red-600 dark:text-red-500 [&>svg]:w-6 [&>svg]:h-6">
                        <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {stat.icon}
                     </div>
                     <div className="space-y-1">
                        <div className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic leading-none">{stat.label}</div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
