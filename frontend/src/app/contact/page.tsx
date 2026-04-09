'use client';

import CTASection from '@/components/common/CTASection';
import { HeartPulse, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 pb-20 italic">
      {/* 1. Header - Compact Glass */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="flex flex-col items-center gap-6">
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-xl shadow-red-600/10">
                  Support Command
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                 CONNECT <br /> <span className="text-red-600">WITH US</span>
               </h1>
               <p className="text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] italic max-w-xl mx-auto mt-4 leading-relaxed">
                 Emergency or inquiry? Our support team is available 24/7 to coordinate mission-critical responses.
               </p>
            </div>
        </div>
      </section>

      {/* 2. Communication Hub */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               
               {/* Left: Intelligence & Hotlines */}
               <div className="space-y-10">
                  <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 relative overflow-hidden group shadow-xl backdrop-blur-[40px]">
                     <div className="relative z-10">
                        <HeartPulse className="w-10 h-10 text-red-600 mb-8 animate-pulse" />
                        <h2 className="text-2xl font-black mb-6 uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none">EMERGENCY <br />MISSION HOTLINES</h2>
                        <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest mb-10 italic leading-relaxed">
                           For critical blood requests, use our direct verified lines for immediate clinical assistance.
                        </p>
                        
                        <div className="space-y-6">
                           <div className="flex items-center gap-6 group/item cursor-pointer">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100 dark:border-white/10 group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                                 <Phone className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-red-600 uppercase tracking-widest italic leading-none mb-1">DIRECT HELPLINE</p>
                                 <p className="text-lg font-black text-gray-900 dark:text-white italic tracking-tight uppercase leading-none">+880 1234 567 890</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-6 group/item cursor-pointer">
                              <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100 dark:border-white/10 group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                                 <Mail className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-[9px] font-black text-red-600 uppercase tracking-widest italic leading-none mb-1">MISSION SUPPORT</p>
                                 <p className="text-lg font-black text-gray-900 dark:text-white italic tracking-tight uppercase leading-none">TEAM@ROKTOLAGBE.ORG</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="p-8 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] italic backdrop-blur-[40px]">
                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 mb-6 border border-gray-100 dark:border-white/10">
                           <MapPin className="w-5 h-5" />
                        </div>
                        <p className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter text-sm mb-2">CENTRAL HQ</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest italic leading-relaxed">Dhaka 1213, Bangladesh</p>
                     </div>
                     <div className="p-8 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] italic backdrop-blur-[40px]">
                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 mb-6 border border-gray-100 dark:border-white/10">
                           <MessageSquare className="w-5 h-5" />
                        </div>
                        <p className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter text-sm mb-2">NETWORK OPS</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest italic leading-relaxed">Available on Social Hubs</p>
                     </div>
                  </div>
               </div>

               {/* Right: Mission Dispatch Form */}
               <div className="p-10 md:p-12 rounded-[3.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl backdrop-blur-[40px]">
                  <div className="mb-10 text-center lg:text-left">
                     <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3 uppercase italic tracking-tighter leading-none">SEND A <span className="text-red-600">MESSAGE</span></h2>
                     <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-widest italic">MISSION DISPATCH WILL RESPOND WITHIN 24H.</p>
                  </div>

                  <form className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2 italic">IDENTITY NAME</label>
                           <input type="text" className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-6 focus:border-red-600 transition-all text-[10px] italic font-black uppercase tracking-widest dark:text-white outline-none" placeholder="YOUR NAME" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2 italic">SECURE EMAIL</label>
                           <input type="email" className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-6 focus:border-red-600 transition-all text-[10px] italic font-black uppercase tracking-widest dark:text-white outline-none" placeholder="EMAIL@HUB.ORG" />
                        </div>
                     </div>
                     
                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2 italic">MISSION TOPIC</label>
                        <select className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-6 focus:border-red-600 transition-all text-[10px] italic font-black uppercase tracking-widest dark:text-white outline-none appearance-none h-[54px]">
                           <option>General Inquiry</option>
                           <option>Donor Verification</option>
                           <option>Partnerships</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[8px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest px-2 italic">MISSION INTEL</label>
                        <textarea rows={4} className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-4 px-6 focus:border-red-600 transition-all text-[10px] italic font-black uppercase tracking-widest dark:text-white outline-none resize-none" placeholder="HOW CAN WE ASSIST YOUR MISSION?"></textarea>
                     </div>

                     <button className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 transition-all active:scale-[0.98] italic">
                        <Send size={16} />
                        DISPATCH MESSAGE
                     </button>
                  </form>
               </div>
            </div>
        </div>
      </section>

      {/* 3. Team Quote CTA */}
      <CTASection 
        title="COMMUNICATION IS KEY."
        subtitle="Our team is available 24/7 to coordinate emergency responses. Connect with us to ensure no request goes unanswered."
        primaryBtnText="START CONVERSATION"
        primaryBtnLink="mailto:team@roktolagbe.com"
        secondaryBtnText="HELP CENTER"
        secondaryBtnLink="/help"
      />
    </main>
  );
}
