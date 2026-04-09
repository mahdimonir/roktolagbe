'use client';

import {
   Activity,
   AlertTriangle,
   CheckCircle2,
   ChevronRight,
   Clock,
   Droplets,
   Heart,
   Scale,
   ShieldCheck,
   Stethoscope,
   Thermometer,
   XCircle,
   Zap
} from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

export default function Eligibility() {
  const requirements = [
    { title: 'Age Range', desc: 'Between 18 and 65 years old. Frequent donors may donate past 65 with medical approval.', icon: <Clock className="w-6 h-6" /> },
    { title: 'Weight', desc: 'Minimum 50kg (110 lbs). This ensures your body can safely handle the volume of blood drawn.', icon: <Scale className="w-6 h-6" /> },
    { title: 'Hemoglobin', desc: 'Minimum 12.5 g/dL for women and 13.0 g/dL for men to prevent anemia.', icon: <Droplets className="w-6 h-6" /> },
    { title: 'Blood Pressure', desc: 'Systolic: 100-130 mmHg, Diastolic: 60-90 mmHg at the time of donation.', icon: <Activity className="w-6 h-6" /> },
    { title: 'Pulse Rate', desc: 'A regular resting pulse between 50 and 100 beats per minute.', icon: <Heart className="w-6 h-6" /> },
    { title: 'Temperature', desc: 'Body temperature must be normal (around 98.6°F / 37°C) without signs of fever.', icon: <Thermometer className="w-6 h-6" /> },
    { title: 'Health Status', desc: 'Must be in generally good health and free from any transmissible infections.', icon: <ShieldCheck className="w-6 h-6" /> },
    { title: 'Interval', desc: 'At least 8-12 weeks between whole blood donations to allow your body to replenish.', icon: <CheckCircle2 className="w-6 h-6" /> },
  ];

  const compatibility = [
    { type: 'O-', canDonateTo: ['Everyone (Universal)'], canReceiveFrom: ['O-'] },
    { type: 'O+', canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
    { type: 'A-', canDonateTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
    { type: 'A+', canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
    { type: 'B-', canDonateTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
    { type: 'B+', canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
    { type: 'AB-', canDonateTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
    { type: 'AB+', canDonateTo: ['AB+'], canReceiveFrom: ['Everyone (Universal)'] },
  ];

  const tempDeferrals = [
    'Tattoos or Piercings (Wait 6 months)',
    'Major Surgery or Illness (Wait 6-12 months)',
    'Pregnancy or Breastfeeding (Wait 6 months post-delivery/weaning)',
    'Antibiotic Treatment (Wait 7 days after completion)',
    'Dental Procedures (Wait 24h for minor, 1 month for major)',
    'Recent Vaccinations (Wait 2-4 weeks depending on vaccine)'
  ];

  const permDeferrals = [
    'Hepatitis B or C diagnosis since age 11',
    'HIV/AIDS positive status or high-risk lifestyle',
    'History of severe heart disease or certain cancers',
    'Bleeding disorders like Hemophilia',
    'Chronic kidney or liver failure'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0d] italic font-black text-gray-900 dark:text-gray-100 transition-colors duration-500 pb-20">
      {/* 1. Header - Compact Glass */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.4em] uppercase italic shadow-xl shadow-red-600/10 leading-none">
                   Medical Guidelines
                </span>
                <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-[0.4em] bg-white dark:bg-white/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-white/10 italic shadow-sm leading-none">
                  <Stethoscope size={14} className="text-red-500" />
                  Verified Safety
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                Check Your <br /><span className="text-red-600">Eligibility</span>.
              </h1>
              
              <p className="text-gray-500 dark:text-gray-400 font-medium italic text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Before you save a life, ensure you are ready and healthy. Our strict protocols exist to protect both our generous donors and the patients.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5 w-full lg:w-auto">
               <div className="bg-white dark:bg-white/[0.02] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-xl shadow-red-500/5 relative overflow-hidden group backdrop-blur-[40px]">
                  <div className="flex items-center gap-5 relative z-10">
                     <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-xl flex items-center justify-center border border-red-100 dark:border-white/10">
                        <Activity size={24} />
                     </div>
                     <div className="text-left font-black italic">
                        <p className="text-[8px] text-gray-400 uppercase tracking-[0.4em] leading-none mb-1">Status</p>
                        <p className="text-xl text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Clinical OK</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Requirements Grid */}
      <section className="py-16 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {requirements.map((req, i) => (
              <div key={i} className="p-8 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 hover:border-red-100 dark:hover:border-red-500/30 transition-all duration-700 group relative overflow-hidden backdrop-blur-sm">
                 <div className="w-14 h-14 bg-gray-50 dark:bg-white/10 text-red-500 rounded-2xl flex items-center justify-center mb-6 border border-white dark:border-gray-800 shadow-lg group-hover:scale-110 transition-transform">
                    {req.icon}
                 </div>
                 <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 uppercase italic tracking-tighter">{req.title}</h3>
                 <p className="text-[13px] text-gray-500 dark:text-gray-400 italic leading-relaxed font-medium">{req.desc}</p>
              </div>
            ))}
          </div>

          {/* Compatibility Module */}
          <div className="mb-20">
             <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 md:p-14 border border-gray-100 dark:border-white/10 shadow-sm relative overflow-hidden group backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/[0.03] rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-1000" />
                
                <div className="relative z-10">
                   <div className="text-center mb-12">
                      <Droplets className="w-10 h-10 text-red-500 mx-auto mb-6 drop-shadow-sm group-hover:scale-110 transition-transform" />
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-4">
                        Blood <span className="text-red-600">Compatibility</span>
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400 italic max-w-xl mx-auto font-medium text-[15px]">
                        Understanding who you can help and who can help you. O- is the universal donor, while AB+ is the universal receiver.
                      </p>
                   </div>

                   <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left border-collapse min-w-[600px]">
                         <thead>
                            <tr>
                               <th className="p-4 border-b border-gray-100 dark:border-white/5 text-red-600 font-black uppercase tracking-widest text-[10px] italic">Blood Type</th>
                               <th className="p-4 border-b border-gray-100 dark:border-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] italic">Donate To</th>
                               <th className="p-4 border-b border-gray-100 dark:border-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] italic">Receive From</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                            {compatibility.map((item, idx) => (
                               <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all group">
                                  <td className="p-4">
                                     <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white dark:bg-white/10 text-red-500 font-black text-lg border border-gray-100 dark:border-white/10 shadow-sm group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                                        {item.type}
                                     </span>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-wrap gap-2">
                                        {item.canDonateTo.map(bt => (
                                           <span key={bt} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black italic border border-gray-100 dark:border-white/10 shadow-sm group-hover:border-red-100 transition-colors">
                                              {bt}
                                           </span>
                                        ))}
                                     </div>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-wrap gap-2">
                                        {item.canReceiveFrom.map(bt => (
                                           <span key={bt} className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black italic border border-gray-100 dark:border-white/10 shadow-sm group-hover:border-red-100 transition-colors">
                                              {bt}
                                           </span>
                                        ))}
                                     </div>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          </div>

          {/* Deferrals Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
             {/* Temporary */}
             <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 md:p-14 border border-gray-100 dark:border-white/10 relative group overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-700 backdrop-blur-sm">
                <div className="relative z-10 h-full flex flex-col">
                   <AlertTriangle className="w-10 h-10 text-red-500 mb-6 drop-shadow-sm group-hover:scale-110 transition-transform" />
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase italic tracking-tighter leading-tight italic">Temporary <br />Deferrals</h2>
                   <p className="text-[13px] text-gray-500 dark:text-gray-400 italic mb-10 font-medium">Wait before donating if you fall under these categories.</p>
                   
                   <div className="space-y-4 flex-1">
                      {tempDeferrals.map((text, i) => (
                        <div key={i} className="flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-red-100 transition-all group/item">
                           <div className="w-8 h-8 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-red-500 shrink-0 shadow-sm border border-gray-100 dark:border-white/10 transition-transform group-hover/item:scale-110">
                              <Clock className="w-4 h-4" />
                           </div>
                           <p className="text-sm font-black text-gray-900 dark:text-white italic tracking-tight uppercase group-hover/item:text-red-600 transition-colors">{text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/[0.03] rounded-full blur-[80px] -mr-32 -mt-32" />
             </div>

             {/* Permanent */}
             <div className="bg-white dark:bg-white/5 rounded-[3rem] p-10 md:p-14 border border-gray-100 dark:border-white/10 relative group overflow-hidden shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 transition-all duration-700 backdrop-blur-sm">
                <div className="relative z-10 h-full flex flex-col">
                   <XCircle className="w-10 h-10 text-gray-400 mb-6 drop-shadow-sm group-hover:scale-110 transition-transform" />
                   <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 uppercase italic tracking-tighter leading-tight italic">Permanent <br />Deferrals</h2>
                   <p className="text-[13px] text-gray-500 dark:text-gray-400 italic mb-10 font-medium">For the safety of the supply, you may not be able to donate if.</p>
                   
                   <div className="space-y-4 flex-1">
                      {permDeferrals.map((text, i) => (
                        <div key={i} className="flex gap-4 items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-transparent hover:border-gray-300 transition-all group/item">
                           <div className="w-8 h-8 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 dark:border-white/10 transition-transform group-hover/item:scale-110">
                              <AlertTriangle className="w-4 h-4" />
                           </div>
                           <p className="text-sm font-black text-gray-500 dark:text-gray-400 italic tracking-tight uppercase group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-600/[0.03] rounded-full blur-[80px] -mr-32 -mb-32 group-hover:bg-gray-200 transition-all duration-700" />
             </div>
          </div>
        </div>
      </section>

      {/* Institutional Compact Section */}
      <section className="py-16 max-w-7xl mx-auto px-6 italic">
         <div className="bg-white dark:bg-white/5 rounded-[3.5rem] p-10 md:p-14 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
               <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                     <Stethoscope className="w-6 h-6 text-red-500" />
                     <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Medical Oversight</p>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none italic">Verified Clinical <br /><span className="text-red-600">Standards.</span></h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium italic leading-relaxed max-w-xl">
                     Our criteria are updated based on national health standards and international recommendations.
                  </p>
               </div>
               <Link href="/organizations" className="w-full lg:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all italic flex items-center justify-center gap-4">
                  Clinical Partners <ChevronRight size={16} />
               </Link>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <CTASection 
        title="ELIGIBLE? START SAVING."
        subtitle="Join our elite circle of verified donors today."
        primaryBtnText="START DONATING"
        primaryBtnLink="/register"
        secondaryBtnText="ASK QUESTIONS"
        secondaryBtnLink="/contact"
      />
    </div>
  );
}
