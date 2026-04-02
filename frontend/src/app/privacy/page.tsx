'use client';

import { ChevronRight, Eye, FileText, Lock, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const sections = [
    { title: 'Introduction', id: 'introduction', icon: <FileText className="w-5 h-5 text-red-500" /> },
    { title: 'Data Collection', id: 'data-collection', icon: <Eye className="w-5 h-5 text-gray-500" /> },
    { title: 'Security Measures', id: 'security', icon: <Shield className="w-5 h-5 text-red-600" /> },
    { title: 'Your Rights', id: 'rights', icon: <Lock className="w-5 h-5 text-gray-900" /> },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/10">
      {/* Header */}
      <section className="py-20 bg-white border-b border-gray-100 italic">
        <div className="max-w-7xl mx-auto px-4 text-center animate-fade-in">
           <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block italic">Legal Compliance</span>
           <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 uppercase">
              Privacy <span className="text-red-600">Policy</span>.
           </h1>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest italic">Last Updated: March 26, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Table of Contents */}
              <div className="lg:col-span-1 border-r border-gray-100 pr-8 hidden lg:block sticky top-32 h-fit">
                 <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Navigation</h3>
                 <nav className="space-y-4">
                    {sections.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => scrollToSection(s.id)}
                        className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-red-500 transition-colors w-full text-left group italic uppercase tracking-tight"
                      >
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                            {s.icon}
                         </div>
                         {s.title}
                      </button>
                    ))}
                 </nav>
              </div>

              {/* Main Text */}
              <div className="lg:col-span-3 space-y-24 animate-fade-in">
                 
                 <div id="introduction" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3 italic text-gray-900 uppercase">
                       <span className="text-red-600">01.</span> Introduction
                    </h2>
                    <div className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm space-y-6">
                        <p className="text-gray-600 leading-relaxed text-sm italic font-medium">
                           At RoktoLagbe, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform to donate blood or request assistance.
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm italic">
                           By using the platform, you agree to the collection and use of information in accordance with this policy. We prioritize transparency and empower you with full control over your data.
                        </p>
                    </div>
                 </div>

                 <div id="data-collection" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3 italic text-gray-900 uppercase">
                       <span className="text-red-600">02.</span> Information We Collect
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm mb-8 italic italic font-medium">
                       To facilitate life-saving connections, we collect essential data point which include but are not limited to:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                       {[
                         { label: 'Identity Data', desc: 'Full name, blood group, and profile imagery.' },
                         { label: 'Contact Data', desc: 'Phone number and email address for emergency notifications.' },
                         { label: 'Medical Data', desc: 'Last donation date and self-declared health eligibility.' },
                       ].map((item, i) => (
                         <li key={i} className="flex gap-4 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <ChevronRight className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                            <div>
                               <p className="font-bold text-gray-900 uppercase italic tracking-tighter">{item.label}</p>
                               <p className="text-xs text-gray-500 italic mt-1">{item.desc}</p>
                            </div>
                         </li>
                       ))}
                    </ul>
                 </div>

                 <div id="security" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3 italic text-gray-900 uppercase">
                       <span className="text-red-600">03.</span> Data Security
                    </h2>
                    {/* Refactored from bg-gray-900 */}
                    <div className="p-12 bg-red-50 rounded-[4rem] text-gray-900 relative overflow-hidden group border border-red-100">
                       <div className="relative z-10">
                          <Lock className="w-12 h-12 text-red-500 mb-6 animate-bounce" />
                          <h3 className="text-xl font-black uppercase italic tracking-tight mb-4 text-red-600">Encryption First Protocol</h3>
                          <p className="text-base leading-relaxed italic font-bold opacity-80 max-w-2xl">
                             "We implement industry-standard AES-256 encryption for all sensitive data stored in our databases. We never sell your personal information to third parties."
                          </p>
                       </div>
                       <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[100px] -mr-32 -mt-32" />
                    </div>
                 </div>

                 <div id="rights" className="prose prose-red max-w-none scroll-mt-32">
                    <h2 className="text-3xl font-black mb-8 tracking-tight flex items-center gap-3 italic text-gray-900 uppercase">
                       <span className="text-red-600">04.</span> Your Data Rights
                    </h2>
                    <div className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm italic">
                        <p className="text-gray-600 leading-relaxed text-sm italic">
                           Under the modern data protection laws, you have the right to access, rectify, or erase your personal data. You can perform these actions directly from your account dashboard or by contacting our support team at <span className="text-red-600 font-bold hover:underline cursor-pointer">privacy@roktolagbe.com</span>.
                        </p>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="py-24 bg-white text-center border-t border-gray-100">
         <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">Have Privacy <span className="text-red-600 italic">Questions?</span></h2>
            <p className="text-gray-500 mb-10 italic font-medium">If you have any questions about our data practices, our privacy hero is here to help.</p>
            <Link href="/contact" className="bg-red-500 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-red-500/20">
               Contact Support
            </Link>
         </div>
      </section>
    </div>
  );
}
