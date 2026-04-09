'use client';

import { MessageSquare } from 'lucide-react';

export default function Testimonials() {
   const cites = [
      { name: "Arif Rahaman", role: "Regular Donor", msg: "Saving someone's parent or child gives me a sense of peace I can't describe.", points: "35 Donations" },
      { name: "Sumaiya Akhter", role: "Recipient", msg: "A donor from this platform arrived within 40 minutes in the middle of the night.", points: "Emergency Match" },
      { name: "Dr. Kamrul Islam", role: "Consultant", msg: "Verified data is the backbone of emergency medicine. This platform providing exactly that.", points: "Verified Expert" }
   ];

   return (
      <section className="py-16 md:py-20 bg-white dark:bg-[#0a0a0d] relative overflow-hidden italic text-center border-t border-gray-100 dark:border-white/5">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[120px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="space-y-4 mb-12">
               <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                  Hero Manifest
               </div>
               <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                  Voice of <span className="text-red-500">Heroes</span>
               </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {cites.map((cite, i) => (
                  <div key={i} className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] p-8 md:p-10 rounded-[2.5rem] text-left space-y-6 hover:border-red-500/30 dark:hover:border-red-500/30 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-12 bg-red-600/[0.02] rounded-full blur-3xl pointer-events-none" />
                     <MessageSquare size={32} className="text-red-600 dark:text-red-500 opacity-40 group-hover:scale-110 transition-transform" />
                     <p className="text-base text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">&quot;{cite.msg}&quot;</p>
                     <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black italic shadow-lg">{cite.name.charAt(0)}</div>
                        <div>
                           <h4 className="text-base font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">{cite.name}</h4>
                           <p className="text-[9px] text-red-600 dark:text-red-500 font-black uppercase tracking-widest italic">{cite.role} • {cite.points}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
