'use client';

import { HelpCircle, Info } from 'lucide-react';

export default function FAQSection() {
   const faqs = [
      { q: "Is blood donation painful?", a: "Only a tiny pinch. We use ultra-fine needles for minimal discomfort." },
      { q: "How long does it take?", a: "The actual donation takes just 8-10 minutes. The whole process is under 45 minutes." },
      { q: "How often can I donate?", a: "Healthy males can donate every 3 months, and females every 4 months." },
      { q: "Will I feel weak afterwards?", a: "No, most donors feel perfectly fine. Just stay hydrated and avoid heavy lifting." }
   ];

   return (
      <section className="py-16 md:py-20 bg-white dark:bg-[#0a0a0d] italic relative overflow-hidden border-t border-gray-100 dark:border-white/5">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[150px] pointer-events-none"></div>

         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="text-center space-y-4 mb-12">
               <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                  Common Doubts
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                  Frequently Asked <span className="text-red-600 dark:text-red-500 italic">Questions</span>
               </h2>
            </div>
            <div className="space-y-4">
               {faqs.map((faq, i) => (
                  <div key={i} className="p-6 md:p-8 rounded-[2rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] space-y-2 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all group shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center text-red-600 shadow-sm transition-transform group-hover:scale-110">
                           <Info size={18} />
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">{faq.q}</h4>
                     </div>
                     <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium italic pl-12 md:pl-14">{faq.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
