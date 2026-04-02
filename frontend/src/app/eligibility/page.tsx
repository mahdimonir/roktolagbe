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
    <div className="min-h-screen bg-white italic font-medium">
      {/* Header */}
      <section className="py-24 text-center relative overflow-hidden bg-gray-50/30 italic">
        <div className="max-w-4xl mx-auto px-4 relative z-10 animate-fade-in">
          <span className="text-red-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block underline decoration-red-500/10 underline-offset-4">Comprehensive Guide</span>
          <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.8] uppercase italic">
            Check Your <br /><span className="text-red-600 italic">Eligibility</span>.
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto italic font-bold">
            Before you save a life, ensure you are ready and healthy. Our strict protocols exist to protect both our generous donors and the patients who depend on their gifts.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      </section>

      {/* Core Requirements */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
             <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Core <span className="text-red-500">Requirements</span></h2>
             <p className="text-gray-500 italic max-w-2xl mx-auto">The basic criteria you must meet to ensure a safe donation process for everyone involved.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {requirements.map((req, i) => (
              <div key={i} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:border-red-500/30 transition-all hover:-translate-y-2 group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-red-500/20 transition-all duration-300 border border-red-100">
                    {req.icon}
                 </div>
                 <h3 className="text-xl font-black text-gray-900 mb-3 uppercase italic tracking-tighter">{req.title}</h3>
                 <p className="text-sm text-gray-500 italic leading-relaxed group-hover:text-gray-700 transition-colors">{req.desc}</p>
              </div>
            ))}
          </div>

          {/* Blood Group Compatibility */}
          <div className="mb-24 animate-fade-in" style={{ animationDelay: '300ms' }}>
             <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-red-500/5 overflow-hidden relative border border-red-50">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] pointer-events-none -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none -ml-32 -mb-32" />
                
                <div className="relative z-10">
                   <div className="text-center mb-12">
                      <Droplets className="w-12 h-12 text-red-500 mx-auto mb-6 drop-shadow-sm" />
                      <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
                        Blood <span className="text-red-500">Compatibility</span>
                      </h2>
                      <p className="text-gray-500 italic max-w-2xl mx-auto">
                        Understanding who you can help and who can help you. O- is the universal donor, while AB+ is the universal receiver.
                      </p>
                   </div>

                   <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                         <thead>
                            <tr>
                               <th className="p-4 border-b border-red-100 text-red-600 font-bold uppercase tracking-wider text-sm whitespace-nowrap">Blood Type</th>
                               <th className="p-4 border-b border-red-100 text-gray-500 font-bold uppercase tracking-wider text-sm w-5/12">You Can Donate To</th>
                               <th className="p-4 border-b border-red-100 text-gray-500 font-bold uppercase tracking-wider text-sm w-5/12">You Can Receive From</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-red-50/80">
                            {compatibility.map((item, idx) => (
                               <tr key={idx} className="hover:bg-red-50/50 transition-colors group">
                                  <td className="p-4">
                                     <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-red-500 font-black text-lg group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm border border-red-100">
                                        {item.type}
                                     </span>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-wrap gap-2">
                                        {item.canDonateTo.map(bt => (
                                           <span key={bt} className="px-3 py-1 rounded-lg bg-white text-gray-700 text-xs font-bold border border-gray-100 shadow-sm group-hover:border-red-200 transition-colors">
                                              {bt}
                                           </span>
                                        ))}
                                     </div>
                                  </td>
                                  <td className="p-4">
                                     <div className="flex flex-wrap gap-2">
                                        {item.canReceiveFrom.map(bt => (
                                           <span key={bt} className="px-3 py-1 rounded-lg bg-white text-gray-700 text-xs font-bold border border-gray-100 shadow-sm group-hover:border-red-200 transition-colors">
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

          {/* Deferrals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
             {/* Temporary */}
             <div className="bg-red-50 rounded-[3rem] p-10 md:p-14 border border-red-100 relative group overflow-hidden animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="relative z-10 h-full flex flex-col">
                   <AlertTriangle className="w-12 h-12 text-red-500 mb-6 drop-shadow-sm" />
                   <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter leading-tight">Temporary <br />Deferrals</h2>
                   <p className="text-sm text-gray-500 italic mb-8">You may need to wait before donating if you fall under these categories.</p>
                   
                   <div className="space-y-4 flex-1">
                      {tempDeferrals.map((text, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white/50 p-4 rounded-2xl border border-red-100/50">
                           <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-red-500 shrink-0 shadow-sm mt-0.5">
                              <Clock className="w-3.5 h-3.5" />
                           </div>
                           <p className="text-sm font-bold text-gray-700 italic tracking-tight">{text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-[80px] -mr-32 -mt-32" />
             </div>

             {/* Permanent */}
             <div className="bg-gray-50 rounded-[3rem] p-10 md:p-14 border border-gray-200 relative group overflow-hidden animate-fade-in" style={{ animationDelay: '500ms' }}>
                <div className="relative z-10 h-full flex flex-col">
                   <XCircle className="w-12 h-12 text-gray-500 mb-6 drop-shadow-sm" />
                   <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase italic tracking-tighter leading-tight">Permanent <br />Deferrals</h2>
                   <p className="text-sm text-gray-500 italic mb-8">For the safety of the blood supply, you may not be able to donate if.</p>
                   
                   <div className="space-y-4 flex-1">
                      {permDeferrals.map((text, i) => (
                        <div key={i} className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                           <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                           </div>
                           <p className="text-sm font-bold text-gray-700 italic tracking-tight">{text}</p>
                        </div>
                      ))}
                   </div>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-gray-200/50 rounded-full blur-[80px] -mr-32 -mb-32 group-hover:bg-gray-200 transition-all duration-700" />
             </div>
          </div>
        </div>
      </section>

      {/* Institutional Oversight */}
      <section className="py-12 bg-white relative max-w-7xl mx-auto px-4 mb-20">
         <div className="bg-white rounded-[4rem] p-12 md:p-16 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
               <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 text-xs font-bold uppercase tracking-widest mb-6">
                     <Stethoscope className="w-4 h-4" /> Medical Verification
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter leading-tight">Institutional <span className="text-red-500">Oversight</span></h2>
                  <p className="text-gray-500 text-sm italic leading-relaxed md:max-w-xl">
                     Our partner medical boards and institutional affiliates review and update our eligibility criteria based on prevailing national health standards and international blood network recommendations.
                  </p>
               </div>
               <div>
                  <Link href="/organizations" className="bg-gray-900 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-3 w-full md:w-fit shadow-xl hover:shadow-red-500/20">
                     View Clinical Partners <ChevronRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:bg-red-500/10 transition-all duration-700" />
         </div>
      </section>

      {/* Rewards/CTA */}
      <section className="py-24 bg-white text-gray-900 border-t border-gray-100 shadow-2xl shadow-gray-200/50 rounded-t-[4rem]">
        <div className="max-w-5xl mx-auto px-4 text-center">
           <div className="w-20 h-20 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-red-100 relative group cursor-pointer hover:bg-red-500 transition-colors">
              <Zap className="w-10 h-10 text-red-600 group-hover:text-white transition-colors animate-pulse" />
              <div className="absolute inset-0 bg-red-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity rounded-[2.5rem]"></div>
           </div>
           <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic leading-none">
             Eligible? <span className="text-red-600 italic">Join the elite</span>.
           </h2>
           <p className="text-gray-400 mb-12 italic font-bold max-w-xl mx-auto">
             If you meet our criteria, you are already halfway to being a hero. Register now to join the premium network of verified lifesavers.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/register" className="btn-primary px-12 py-5 text-sm uppercase tracking-widest font-black shadow-xl shadow-red-500/20">
                Finalize Hero Profile
              </Link>
              <Link href="/contact" className="bg-white border-2 border-red-500 text-red-500 px-12 py-5 rounded-full text-sm uppercase tracking-widest font-black hover:bg-red-500 hover:text-white transition-all">
                Ask a Medical Hero
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
