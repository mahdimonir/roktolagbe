'use client';

import { GraduationCap, Megaphone, Stethoscope } from 'lucide-react';

export default function AwarenessCampaigns() {
   const campaigns = [
      { 
         title: "Blood Grouping Drive", 
         desc: "Free blood group testing for students and local communities.",
         icon: <Stethoscope size={20} />,
         color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600",
         tag: "Ongoing"
      },
      { 
         title: "Institutional Awareness", 
         desc: "Seminars at universities about the social duty of donation.",
         icon: <GraduationCap size={20} />,
         color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600",
         tag: "Education"
      },
      { 
         title: "Emergency Booths", 
         desc: "On-ground support at major hospitals for instant matching.",
         icon: <Megaphone size={20} />,
         color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600",
         tag: "Action"
      }
   ];

   return (
      <section className="py-12 md:py-16 bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/5 overflow-hidden italic relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-12">
               <div className="space-y-4 max-w-2xl text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 italic">
                     Community Impact
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                     Driven by <span className="text-red-600 italic">Awareness</span>
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">
                     Hosting regular campaigns to educate and identify heroes across the nation.
                  </p>
               </div>
               <div className="bg-gray-50/20 dark:bg-white/[0.03] p-6 rounded-[2rem] border border-gray-100 dark:border-white/[0.08] backdrop-blur-[40px] flex flex-col items-center gap-1 shadow-sm px-10">
                  <span className="text-3xl font-black text-red-600 italic leading-none">250+</span>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none">Campaigns Held</span>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {campaigns.map((camp, i) => (
                  <div key={i} className="group p-8 rounded-[2.5rem] bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 dark:hover:border-red-500/30 hover:shadow-2xl dark:hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-700 relative overflow-hidden shadow-sm">
                     <div className={`w-12 h-12 ${camp.color} rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                        {camp.icon}
                     </div>
                     <div className="space-y-3">
                        <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest w-fit">{camp.tag}</span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">{camp.title}</h3>
                        <p className="text-[13px] text-gray-500 dark:text-gray-400 text-sm font-medium italic leading-relaxed">{camp.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
