'use client';

import { CheckCircle2, HelpCircle, Info, Scale, Shield } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
  const sections = [
    { title: 'Acceptance', id: 'acceptance', icon: <CheckCircle2 className="w-5 h-5 text-red-500" /> },
    { title: 'User Responsibilities', id: 'responsibilities', icon: <Scale className="w-5 h-5 text-gray-500" /> },
    { title: 'Liability', id: 'liability', icon: <Shield className="w-5 h-5 text-red-600" /> },
    { title: 'Termination', id: 'termination', icon: <Info className="w-5 h-5 text-gray-900" /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 bg-gray-50/30 border-b border-gray-100 italic">
        <div className="max-w-7xl mx-auto px-4 text-center animate-fade-in">
           <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block italic underline decoration-red-500/20 underline-offset-4 font-bold">Platform Governance</span>
           <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 uppercase italic leading-none">
              Terms of <span className="text-red-600 italic">Service</span>.
           </h1>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">Effective Date: March 26, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
              
              {/* Table of Contents */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-12 hidden lg:block sticky top-32 h-fit">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10 italic">Core Sections</h3>
                 <nav className="space-y-6">
                    {sections.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => scrollToSection(s.id)}
                        className="flex items-center gap-4 text-sm font-black text-gray-600 hover:text-red-500 transition-all w-full text-left group italic uppercase tracking-tighter"
                      >
                         <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors border border-gray-100">
                            {s.icon}
                         </div>
                         {s.title}
                      </button>
                    ))}
                 </nav>
              </div>

              {/* Main Text */}
              <div className="lg:col-span-3 space-y-20 animate-fade-in">
                 
                 <div id="acceptance" className="prose prose-red max-w-none scroll-mt-32 italic">
                    <h2 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 uppercase leading-none">
                       <span className="text-red-600 italic">01.</span> Acceptance of Terms
                    </h2>
                    <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm leading-relaxed italic">
                        <p className="text-gray-600 text-sm mb-6 underline decoration-red-500/10">
                           By accessing or using the RoktoLagbe platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
                        </p>
                        <p className="text-gray-600 text-sm italic">
                           We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes constitutes your acceptance of such changes.
                        </p>
                    </div>
                 </div>

                 <div id="responsibilities" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 uppercase">
                       <span className="text-red-600">02.</span> User Responsibilities
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {[
                         { title: 'Accuracy', text: 'Users must provide accurate, current, and complete information.' },
                         { title: 'Safety', text: 'Donors must follow all safety protocols and eligibility guidelines.' },
                         { title: 'Emergency', text: 'Requests should be made only for genuine medical requirements.' },
                         { title: 'Integrity', text: 'Misuse of the platform will result in immediate termination.' },
                       ].map((item, i) => (
                         <div key={i} className="p-8 bg-red-50/30 rounded-[2.5rem] border border-red-100 group hover:bg-white transition-all">
                            <h4 className="font-black text-red-600 text-sm uppercase italic tracking-widest mb-3">{item.title}</h4>
                            <p className="text-gray-500 text-xs italic leading-relaxed">{item.text}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div id="liability" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 uppercase">
                       <span className="text-red-600">03.</span> Limitation of Liability
                    </h2>
                    <div className="p-10 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 relative group overflow-hidden">
                       <p className="text-gray-500 text-sm italic leading-relaxed relative z-10 font-medium">
                           RoktoLagbe acts as a facilitator connecting donors and organizations. We are not responsible for medical outcomes, donor conduct, or any individual's health status. Users utilize the platform at their own risk.
                       </p>
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </div>
                 </div>

                 <div id="termination" className="prose prose-red max-w-none scroll-mt-32 italic">
                    <h2 className="text-3xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 uppercase">
                       <span className="text-red-600 italic">04.</span> Termination of Service
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed italic font-medium p-8 bg-gray-50 rounded-[3rem] border border-gray-100">
                       We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-24 bg-white text-center border-t border-gray-100 mb-20">
         <div className="max-w-2xl mx-auto px-4">
            <HelpCircle className="w-16 h-16 text-gray-200 mx-auto mb-8" />
            <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic leading-none">Confused about <span className="text-red-600 italic">Terms?</span></h2>
            <p className="text-gray-500 mb-10 italic font-bold">Our support team is available 24/7 to clarify any governance questions you may have.</p>
            <Link href="/contact" className="bg-gray-900 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-gray-200">
               Support Dispatch
            </Link>
         </div>
      </section>
    </div>
  );
}
