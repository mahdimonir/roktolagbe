'use client';

import React from 'react';

interface StepItem {
   title: string;
   titleBn: string;
   desc: string;
   icon: React.ReactNode;
}

interface HowItWorksProps {
   steps: StepItem[];
}

export default function HowItWorks({ steps }: HowItWorksProps) {
   return (
      <section className="py-12 relative z-20 overflow-hidden italic">
         <div className="max-w-7xl mx-auto px-6">
            <div className="relative space-y-16">
               <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                     The Mission Flow
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none px-4">
                     Save a Life in <span className="text-red-500">4 Minutes</span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((step, i) => (
                     <div 
                        key={i} 
                        className="group relative flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-gray-50/20 dark:bg-white/[0.03] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 dark:hover:border-red-500/30 hover:shadow-2xl dark:hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-700 shadow-sm"
                     >
                        <div className="absolute top-6 right-8 text-6xl font-black text-gray-900/[0.03] dark:text-white/[0.05] select-none pointer-events-none italic tracking-tighter group-hover:text-red-600/10 transition-colors">
                           0{i+1}
                        </div>
                        
                        <div className="w-14 h-14 bg-white dark:bg-white/5 text-red-600 dark:text-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100 dark:border-white/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 mb-6 [&>svg]:w-6 [&>svg]:h-6">
                           {step.icon}
                        </div>
                        
                        <div className="space-y-2">
                           <h3 className="text-lg md:text-xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{step.titleBn}</h3>
                           <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium italic">{step.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
}
