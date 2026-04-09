'use client';

import { ChevronRight, Eye, FileText, Lock, Shield } from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

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
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 pb-20 italic">
      {/* 1. Header - Compact Glass */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="flex flex-col items-center gap-6">
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-xl shadow-red-600/10">
                  Mission Security
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                 PRIVACY <span className="text-red-600">POLICY</span>
               </h1>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic mt-4">
                 LAST UPDATED: MARCH 26, 2026
               </p>
            </div>
        </div>
      </section>

      {/* 2. Content Structure */}
      <section className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
               
               {/* Fixed Navigation Desk */}
               <div className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
                  <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-8 italic">CORE SECTIONS</h3>
                  <nav className="space-y-4">
                     {sections.map((s, i) => (
                       <button 
                         key={i} 
                         onClick={() => scrollToSection(s.id)}
                         className="flex items-center gap-4 text-[11px] font-black text-gray-400 dark:text-gray-600 hover:text-red-600 transition-all w-full text-left group italic uppercase tracking-widest"
                       >
                          <div className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10 group-hover:bg-red-50 dark:group-hover:bg-red-600/20 group-hover:border-red-100 dark:group-hover:border-red-600/30 transition-all">
                             <div className="text-gray-400 group-hover:text-red-600 transition-colors">
                                {s.icon}
                             </div>
                          </div>
                          {s.title}
                       </button>
                     ))}
                  </nav>
               </div>

               {/* Main Narrative */}
               <div className="lg:col-span-3 space-y-20">
                  
                  {/* Section 01 */}
                  <div id="introduction" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600 italic">01.</span> Introduction
                     </h2>
                     <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm backdrop-blur-[40px]">
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic font-medium">
                            At RoktoLagbe, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform to donate blood or request assistance.
                         </p>
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic mt-6">
                            By using the platform, you agree to the collection and use of information in accordance with this policy. We prioritize transparency and empower you with full control over your data.
                         </p>
                     </div>
                  </div>

                  {/* Section 02 */}
                  <div id="data-collection" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">02.</span> Information We Collect
                     </h2>
                     <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-[11px] mb-8 italic font-black uppercase tracking-widest">
                        To facilitate life-saving connections, we collect essential data points.
                     </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { label: 'Identity Data', desc: 'Full name, blood group, and verification imagery.' },
                          { label: 'Contact Data', desc: 'Phone number and secure email for emergency alerts.' },
                          { label: 'Medical Data', desc: 'Last donation date and health eligibility status.' },
                          { label: 'Location Data', desc: 'City and zone for optimized donor matching.' },
                        ].map((item, i) => (
                          <div key={i} className="flex gap-4 p-8 bg-white dark:bg-white/5 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-sm hover:border-red-100 dark:hover:border-red-500/30 transition-all group backdrop-blur-[40px]">
                             <ChevronRight className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                             <div>
                                <p className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter text-sm mb-1">{item.label}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 italic font-medium leading-relaxed">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Section 03 - High Impact Glass */}
                  <div id="security" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">03.</span> Data Security
                     </h2>
                     <div className="p-12 bg-red-600 text-white rounded-[3.5rem] relative overflow-hidden group shadow-2xl shadow-red-600/20">
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                           <div className="w-20 h-20 bg-white/10 rounded-[1.5rem] flex items-center justify-center shrink-0 border border-white/20">
                              <Lock className="w-10 h-10 text-white animate-pulse" />
                           </div>
                           <div>
                              <h3 className="text-xl font-black uppercase italic tracking-widest mb-3">ENCRYPTION FIRST PROTOCOL</h3>
                              <p className="text-sm leading-relaxed italic font-medium opacity-90 max-w-2xl">
                                 We implement industry-standard AES-256 encryption for all sensitive data stored in our mission databases. We never sell your personal information to third parties.
                              </p>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.05] rounded-full blur-[100px] -mr-32 -mt-32" />
                     </div>
                  </div>

                  {/* Section 04 */}
                  <div id="rights" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">04.</span> Your Data Rights
                     </h2>
                     <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm backdrop-blur-[40px]">
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic">
                            Under the modern data protection laws, you have the right to access, rectify, or erase your personal data. You can perform these actions directly from your account dashboard or by contacting our support team at <span className="text-red-600 font-black hover:underline cursor-pointer italic px-1">privacy@roktolagbe.com</span>.
                         </p>
                     </div>
                  </div>
               </div>

            </div>
        </div>
      </section>

      {/* 3. Global Call to Action */}
      <CTASection 
        title="HAVE PRIVACY QUESTIONS?"
        subtitle="If you have any questions about our data practices, our privacy hero is here to help."
        primaryBtnText="CONTACT SUPPORT"
        primaryBtnLink="/contact"
        secondaryBtnText="LEGAL TERMS"
        secondaryBtnLink="/terms"
      />
    </main>
  );
}
