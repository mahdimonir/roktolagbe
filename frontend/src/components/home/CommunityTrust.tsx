'use client';

import { PhoneCall, UserCheck, HeartHandshake, ShieldCheck, Globe } from 'lucide-react';

export default function CommunityTrust() {
   const trustPoints = [
      {
         title: "Call Donors Directly",
         desc: "No confusing messages. Just call the donor or patient directly to coordinate help instantly when every second counts.",
         icon: <PhoneCall className="w-8 h-8 text-red-600" />,
         color: "bg-red-50 dark:bg-red-500/10"
      },
      {
         title: "Verified Requests",
         desc: "We check blood requests to make sure they are real. You can trust that your donation is going to a patient who truly needs it.",
         icon: <UserCheck className="w-8 h-8 text-blue-600" />,
         color: "bg-blue-50 dark:bg-blue-500/10"
      },
      {
         title: "100% Free Service",
         desc: "RoktoLagbe is built for the community, by the community. No fees, no hidden costs. We are here to help, not to profit.",
         icon: <HeartHandshake className="w-8 h-8 text-green-600" />,
         color: "bg-green-50 dark:bg-green-500/10"
      }
   ];

   return (
      <section className="py-12 bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/5 overflow-hidden italic relative">
         {/* Subtle Dark Mode Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[100px] pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
               <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em] mb-1 font-black italic">
                  Community Integrity
               </div>
               <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">
                  Reliable Help. <br/> <span className="text-red-600 italic">Real People.</span>
               </h2>
               <p className="text-base text-gray-500 dark:text-gray-400 font-medium italic leading-relaxed">
                  The verified, trust-first branch of your local blood-saving network.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
               {trustPoints.map((point, i) => (
                  <div 
                     key={i} 
                     className="bg-gray-50/20 dark:bg-white/[0.02] p-7 rounded-[2rem] border border-gray-100 dark:border-white/[0.08] hover:border-red-500/30 dark:hover:border-red-500/30 hover:shadow-2xl dark:hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-500 group backdrop-blur-[40px] relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/[0.02] pointer-events-none"></div>
                     <div className={`w-14 h-14 ${point.color} rounded-xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-500 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        {point.icon}
                     </div>
                     <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-2 leading-none">
                        {point.title}
                     </h3>
                     <p className="text-[13px] text-gray-500 dark:text-gray-400 italic font-medium leading-relaxed">
                        {point.desc}
                     </p>
                  </div>
               ))}
            </div>

            {/* Bottom Proof Bar - Extreme Glassmorphism */}
            <div className="mt-10 p-6 md:p-8 rounded-[2.5rem] bg-gray-50/20 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.08] relative overflow-hidden shadow-sm hover:shadow-2xl transition-all backdrop-blur-[50px]">
               <div className="absolute inset-0 bg-gradient-to-r from-red-600/[0.02] to-transparent pointer-events-none"></div>
               <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-red-600/[0.03] dark:bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-3 text-red-600 text-[9px] font-black uppercase tracking-[0.3em]">
                        <ShieldCheck size={14} /> Safety Guaranteed
                     </div>
                     <h4 className="text-xl md:text-2xl font-black italic uppercase leading-none tracking-tighter text-gray-900 dark:text-white">Your Privacy is Our Priority</h4>
                  </div>
                  <p className="max-w-md text-gray-500 dark:text-gray-400 font-medium italic text-[13px] text-center md:text-left">
                     Your phone number is shared only when you coordinate a verified donation.
                  </p>
                  <div className="flex items-center gap-3 bg-white/40 dark:bg-white/5 px-5 py-3 rounded-xl border border-gray-100 dark:border-white/10 shadow-lg shrink-0 backdrop-blur-md">
                     <Globe className="text-red-600" size={18} />
                     <div className="space-y-0">
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest leading-none italic">Local Network</p>
                        <p className="text-base font-black italic leading-none text-gray-900 dark:text-white uppercase">ALL OVER BD</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
