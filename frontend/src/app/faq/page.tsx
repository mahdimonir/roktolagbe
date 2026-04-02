'use client';

import {
    Droplets,
    ExternalLink,
    Heart,
    MessageCircle,
    Minus,
    Plus,
    Search,
    ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is blood donation safe during the process?",
      a: "Absolutely. We only partner with verified hospitals and blood banks that follow international safety standards. All equipment is sterile and single-use.",
      category: "Safety",
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      q: "How often can I donate blood?",
      a: "Healthy donors can typically donate whole blood every 8-12 weeks. Our platform automatically tracks your last donation and notifies you when you are eligible again.",
      category: "Eligibility",
      icon: <Droplets className="w-4 h-4" />
    },
    {
      q: "What are the basic requirements?",
      a: "You should be between 18-65 years old, weigh at least 50kg, and be in generally good health. Specific medical conditions may affect eligibility.",
      category: "Eligibility",
      icon: <Heart className="w-4 h-4" />
    },
    {
      q: "How does the matching system work?",
      a: "When a request is posted, our algorithm searches for donors with the matching blood group within your district and sends instant notifications.",
      category: "Platform",
      icon: <Search className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <section className="py-24 relative overflow-hidden bg-gray-50/50 italic border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center animate-fade-in">
          <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block italic">Knowledge Hub</span>
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.9] uppercase italic">
            Common <br /><span className="text-red-600 italic">Questions</span>.
          </h1>
          <div className="relative max-w-xl mx-auto group">
            <input 
              type="text" 
              placeholder="Search for answers (e.g., 'safety', 'eligibility')..." 
              className="w-full bg-white border border-gray-200 rounded-[2.5rem] py-5 px-8 pr-16 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all text-sm italic font-bold shadow-xl shadow-gray-200/50"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center group-hover:bg-red-500 transition-all cursor-pointer">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      </section>

      {/* FAQ List */}
      <section className="py-24 bg-white italic relative">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`group border-2 rounded-[3.5rem] p-4 transition-all duration-500 ${openIndex === i ? 'border-red-500 bg-red-50/10 shadow-xl shadow-red-500/5' : 'border-gray-50 bg-white hover:border-gray-200'}`}
              >
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-[1.5rem] flex items-center justify-center border-2 transition-all ${openIndex === i ? 'bg-red-500 border-red-500 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                      {faq.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-1">{faq.category}</span>
                      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">
                        {faq.q}
                      </h3>
                    </div>
                  </div>
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-red-500 text-white rotate-180' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                    {openIndex === i ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                
                {openIndex === i && (
                  <div className="px-6 pb-8 pt-2 pl-[5.5rem] animate-slide-up">
                    <p className="text-gray-500 leading-relaxed text-sm italic font-bold max-w-xl">
                      {faq.a}
                    </p>
                    <div className="mt-6 flex items-center gap-4">
                       <Link href="/eligibility" className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                          Read More <ExternalLink className="w-3 h-3" />
                       </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions - Refactored from bg-gray-900 */}
      <section className="py-24 bg-white text-gray-900 text-center rounded-t-[4rem] px-4 italic border-t border-gray-100 shadow-2xl shadow-gray-200">
         <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-100">
               <MessageCircle className="w-10 h-10 text-red-600 animate-bounce" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic leading-none">
              Still have <span className="text-red-600 italic">questions?</span>
            </h2>
            <p className="text-gray-400 mb-12 italic font-bold">
              Our 24/7 support hero is ready to assist you with any inquiries regarding blood donation or platform usage.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link href="/contact" className="btn-primary px-12 py-5 text-sm uppercase tracking-widest font-black shadow-xl shadow-red-500/20">
                  Connect With Support
                </Link>
                <Link href="/how-it-works" className="bg-white border-2 border-red-500 text-red-500 px-12 py-5 rounded-full text-sm uppercase tracking-widest font-black hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/5">
                  The Journey Step by Step
                </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
