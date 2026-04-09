'use client';

import { CheckCircle2, HelpCircle, Info, Scale, Shield } from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

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
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 pb-20 italic">
      {/* 1. Header - Compact Glass */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="flex flex-col items-center gap-6">
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-xl shadow-red-600/10">
                  Governance Protocol
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                 TERMS OF <span className="text-red-600">SERVICE</span>
               </h1>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] italic mt-4">
                 EFFECTIVE DATE: MARCH 26, 2026
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
                  <h3 className="text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.2em] mb-8 italic">PLATFORM RULES</h3>
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
                  <div id="acceptance" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600 italic">01.</span> Acceptance of Terms
                     </h2>
                     <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm backdrop-blur-[40px]">
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic font-medium">
                            By accessing or using the RoktoLagbe platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services.
                         </p>
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic mt-6">
                            We reserve the right to modify these terms at any time. Your continued use of the platform following the posting of changes constitutes your acceptance of such changes.
                         </p>
                     </div>
                  </div>

                  {/* Section 02 */}
                  <div id="responsibilities" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">02.</span> User Responsibilities
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { title: 'Data Accuracy', desc: 'Users must provide verified, current, and complete health data.' },
                          { title: 'Mission Safety', desc: 'Donors must follow all safety protocols and eligibility criteria.' },
                          { title: 'Emergency Use', desc: 'Requests should be made only for genuine life-saving requirements.' },
                          { title: 'Platform Integrity', desc: 'Misuse of the system results in immediate unit termination.' },
                        ].map((item, i) => (
                          <div key={i} className="p-8 bg-red-50/30 dark:bg-white/5 rounded-[2.5rem] border border-red-100 dark:border-white/10 group hover:border-red-600 transition-all backdrop-blur-[40px]">
                             <h4 className="font-black text-red-600 text-[11px] uppercase italic tracking-widest mb-3">{item.title}</h4>
                             <p className="text-gray-500 dark:text-gray-500 text-[10px] italic leading-relaxed font-bold">{item.desc}</p>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Section 03 */}
                  <div id="liability" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">03.</span> Limitation of Liability
                     </h2>
                     <div className="p-10 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/10 relative group overflow-hidden bg-white dark:bg-transparent">
                        <p className="text-gray-500 dark:text-gray-400 text-sm italic leading-relaxed relative z-10 font-medium">
                            RoktoLagbe acts as a facilitator connecting donors and organizations. We are not responsible for medical outcomes, donor conduct, or any individual's health status. Users utilize the mission platform at their own risk.
                        </p>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                     </div>
                  </div>

                  {/* Section 04 */}
                  <div id="termination" className="scroll-mt-32">
                     <h2 className="text-2xl font-black mb-8 tracking-tighter flex items-center gap-4 italic text-gray-900 dark:text-white uppercase leading-none">
                        <span className="text-red-600">04.</span> Termination
                     </h2>
                     <div className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm backdrop-blur-[40px]">
                         <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm italic">
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of our mission.
                         </p>
                     </div>
                  </div>
               </div>

            </div>
        </div>
      </section>

      {/* 3. Global Call to Action */}
      <CTASection 
        title="CONFUSED ABOUT TERMS?"
        subtitle="Our support team is available 24/7 to clarify any governance questions."
        primaryBtnText="SUPPORT DISPATCH"
        primaryBtnLink="/contact"
        secondaryBtnText="PRIVACY POLICY"
        secondaryBtnLink="/privacy"
      />
    </main>
  );
}
