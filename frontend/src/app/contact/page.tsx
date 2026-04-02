'use client';

import { Heart, Mail, MapPin, MessageSquare, Phone, Send, Zap } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white italic font-medium">
      {/* Header */}
      <section className="py-24 text-center relative overflow-hidden bg-white italic px-4 md:px-0">
        <div className="max-w-4xl mx-auto px-4 relative z-10 animate-fade-in">
          <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-red-500/10 underline-offset-4">Support Center</span>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.8] uppercase italic leading-none">
            Connect <br /> <span className="text-red-600 italic">With Us</span>.
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto italic font-bold">
            Emergency or inquiry? Our support team is available 24/7 to help you. We respond quickly to every message.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] -mr-48 -mt-48" />
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           {/* Contact Info */}
           <div className="space-y-12 animate-fade-in">
               <div className="p-12 rounded-[4rem] bg-red-50/50 border border-red-100 relative overflow-hidden group shadow-2xl shadow-red-500/5">
                  <div className="relative z-10">
                     <Heart className="w-12 h-12 text-red-500 mb-8 animate-pulse" />
                     <h2 className="text-3xl font-black mb-6 uppercase italic tracking-tighter text-gray-900 leading-none">Emergency <br />Hotlines</h2>
                     <p className="text-gray-500 text-sm italic mb-10 leading-relaxed font-bold">
                        For critical blood requests, use our direct contact numbers for immediate assistance.
                     </p>
                     <div className="space-y-6">
                        <div className="flex items-center gap-6 group/item cursor-pointer">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 border border-red-200 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                              <Phone className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Direct Helpline</p>
                              <p className="text-xl font-black text-gray-900 italic tracking-tight">+880 1234 567 890</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6 group/item cursor-pointer">
                           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 border border-red-200 group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                              <Mail className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Support Email</p>
                              <p className="text-xl font-black text-gray-900 italic tracking-tight">team@roktolagbe.com</p>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[100px] -mr-32 -mt-32" />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-xl shadow-gray-200/50 italic">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 border border-gray-100">
                        <MapPin className="w-5 h-5" />
                     </div>
                     <p className="font-black text-gray-900 uppercase italic tracking-tighter text-sm mb-2">Central HQ</p>
                     <p className="text-xs text-gray-400 leading-relaxed italic">Road 12, Block B, Banani, <br />Dhaka 1213, Bangladesh</p>
                  </div>
                  <div className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-xl shadow-gray-200/50 italic">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 mb-6 border border-gray-100">
                        <MessageSquare className="w-5 h-5" />
                     </div>
                     <p className="font-black text-gray-900 uppercase italic tracking-tighter text-sm mb-2">Social Media</p>
                     <p className="text-xs text-gray-400 leading-relaxed italic">Connect with our community on <Link href="#" className="text-red-700 underline decoration-red-500/10">Instagram</Link> and <Link href="#" className="text-red-700 underline decoration-red-500/10">Facebook</Link>.</p>
                  </div>
               </div>
           </div>

           {/* Contact Form */}
           <div className="p-12 lg:p-16 rounded-[4rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="mb-12">
                 <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter leading-none">Send a <span className="text-red-600 italic font-bold">Message</span>.</h2>
                 <p className="text-gray-400 text-sm italic font-bold">Complete the form below and our team will get back to you as soon as possible.</p>
              </div>

              <form className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Full Name</label>
                       <input 
                         type="text" 
                         className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4 px-6 focus:outline-none focus:bg-white focus:border-red-600 transition-all text-sm italic font-bold shadow-inner"
                         placeholder="Your Name"
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Email Address</label>
                       <input 
                         type="email" 
                         className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4 px-6 focus:outline-none focus:bg-white focus:border-red-600 transition-all text-sm italic font-bold shadow-inner"
                         placeholder="email@example.com"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Topic</label>
                    <select className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4 px-6 focus:outline-none focus:bg-white focus:border-red-600 transition-all text-sm italic font-bold appearance-none shadow-inner">
                       <option>General Inquiry</option>
                       <option>Donor Verification</option>
                       <option>Partnerships</option>
                       <option>Technical Issue</option>
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 italic">Message</label>
                    <textarea 
                       rows={4} 
                       className="w-full bg-gray-50 border border-transparent rounded-[2rem] py-4 px-8 focus:outline-none focus:bg-white focus:border-red-600 transition-all text-sm italic font-bold resize-none shadow-inner"
                       placeholder="How can we help you?"
                    ></textarea>
                 </div>

                 <button className="w-full bg-gray-900 text-white hover:bg-red-600 py-6 rounded-[2rem] text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 italic">
                    <Send className="w-5 h-5" />
                    Send Message
                 </button>
              </form>
           </div>
        </div>
      </section>

      {/* Team Quote */}
      <section className="py-24 bg-gray-50/50 text-center border-t border-gray-100 mb-20 italic">
         <div className="max-w-2xl mx-auto px-4">
            <Heart className="w-12 h-12 text-red-600 mx-auto mb-8" />
            <p className="text-xl font-black text-gray-900 italic tracking-tighter uppercase mb-6">"Communication is the heart of coordination."</p>
            <p className="text-gray-400 text-xs italic font-bold uppercase tracking-widest">- The RoktoLagbe Team</p>
         </div>
      </section>
    </div>
  );
}
