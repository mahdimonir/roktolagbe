'use client';

import { 
  Activity, ArrowRight, Award, CheckCircle2, 
  Droplets, Heart, MapPin, Zap, Target, 
  ShieldCheck, Globe, Fingerprint, Microscope,
  Sparkles, HeartPulse, ShieldAlert, Laptop, ChevronRight,
  ClipboardCheck, TrendingUp, Users
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Create Account',
      desc: 'Sign up and provide your basic details and blood group. Our verification process ensures a safe and secure donation experience.',
      icon: <Users className="w-8 h-8 text-red-600" />,
      color: 'red',
      tag: 'Step 01'
    },
    {
      title: 'Smart Matching',
      desc: 'When an urgent blood request is made, our location-based system instantly identifies and notifies the nearest eligible donors.',
      icon: <Target className="w-8 h-8 text-blue-600" />,
      color: 'blue',
      tag: 'Step 02'
    },
    {
      title: 'Donate Blood',
      desc: 'Visit the hospital to donate. Once confirmed by the medical facility, your points are updated and the request is fulfilled.',
      icon: <HeartPulse className="w-8 h-8 text-red-500" />,
      color: 'red',
      tag: 'Step 03'
    },
    {
      title: 'Rewards',
      desc: 'Earn recognition, digital certificates, and exclusive perks. Your contributions are securely recorded in our network.',
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      color: 'yellow',
      tag: 'Step 04'
    }
  ];

  const algorithms = [
    { l: 'Nearby Search', d: 'Automatically finds donors within a 5-10km radius of the hospital for immediate response.', icon: <MapPin size={20} /> },
    { l: 'Eligibility Check', d: 'Ensures donor safety by automatically tracking health eligibility and waiting periods.', icon: <ShieldCheck size={20} /> },
    { l: 'Instant Notifications', d: 'Sends real-time alerts to matching donors via SMS and app notifications for maximum reach.', icon: <Zap size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Header Section */}
      <section className="pt-32 pb-48 text-center relative overflow-hidden bg-gray-50 border-b border-gray-100">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none transition-all duration-1000"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
           <div className="flex justify-center gap-4">
              <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl shadow-red-600/20">
                 The Process
              </span>
              <div className="bg-white border border-gray-100 text-gray-400 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic">
                 Standard Workflow
              </div>
           </div>
           <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.8] uppercase italic">
             How it <br /> <span className="text-red-600 italic">Works</span>.
           </h1>
           <p className="text-xl text-gray-400 max-w-2xl mx-auto italic font-medium leading-relaxed">
             A simple four-step process to save lives. RoktoLagbe bridges the gap between donors and those in urgent clinical need.
           </p>
        </div>
      </section>

      {/* 2. Process Timeline */}
      <section className="-mt-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="group relative" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`p-12 rounded-[3.5rem] bg-white border border-gray-100 h-full transition-all duration-700 hover:-translate-y-4 hover:border-red-500 hover:shadow-2xl flex flex-col items-center text-center relative z-10 overflow-hidden`}>
                   <div className={`w-20 h-20 bg-${step.color}-50 text-${step.color}-600 rounded-[1.5rem] flex items-center justify-center mb-10 border border-${step.color}-100 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500`}>
                      {step.icon}
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter mb-6 uppercase italic leading-tight">{step.title}</h3>
                   <p className="text-sm text-gray-500 leading-relaxed italic font-medium">{step.desc}</p>
                   
                   <div className="mt-auto pt-10 text-gray-50 font-black text-8xl absolute -bottom-6 right-10 pointer-events-none group-hover:text-red-500/5 transition-colors">
                      {step.tag.split(' ')[1]}
                   </div>
                   
                   <div className="absolute top-8 left-10 bg-gray-50 border border-gray-100 text-gray-400 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                      {step.tag}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Technology Section */}
      <section className="py-44 relative bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div className="space-y-16">
                  <div className="space-y-6">
                     <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.4em] italic mb-4">Core Technology</p>
                     <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic uppercase leading-[0.9]">
                        Powered by <br /><span className="text-red-600 italic">Smart Sync</span>.
                     </h2>
                     <p className="text-lg text-gray-500 font-medium italic max-w-xl leading-relaxed">
                        Our platform uses advanced location matching and eligibility tracking to ensure the fastest connection between donors and emergency requests.
                     </p>
                  </div>
                  <div className="space-y-10">
                    {algorithms.map((item, i) => (
                      <div key={i} className="flex gap-8 items-start group">
                         <div className="w-14 h-14 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-sm">
                            {item.icon}
                         </div>
                         <div className="space-y-2">
                            <p className="font-black uppercase italic tracking-widest text-lg text-gray-900 group-hover:text-red-600 transition-colors">{item.l}</p>
                            <p className="text-gray-500 text-sm italic font-medium max-w-sm">{item.d}</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="p-16 bg-gray-50 rounded-[4rem] border border-gray-100 shadow-2xl relative group overflow-hidden aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 text-center space-y-10 group-hover:scale-105 transition-transform duration-700">
                    <div className="relative inline-block">
                       <MapPin className="w-24 h-24 text-red-600 mx-auto group-hover:text-black transition-colors" />
                       <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/10 blur-md rounded-full"></div>
                    </div>
                    <div>
                       <p className="text-3xl font-black italic tracking-tighter uppercase mb-2 text-gray-900">Live Request Map</p>
                       <p className="text-sm text-gray-400 italic font-medium max-w-[280px] mx-auto leading-relaxed">
                          Our real-time interactive map monitors every urgent request across the entire network.
                       </p>
                    </div>
                    <Link href="/urgent-requests" className="bg-gray-900 text-white px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-red-600 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-gray-900/20 active:scale-95 italic group/btn">
                       View Urgent Requests <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                    </Link>
                  </div>
                  
                  <div className="absolute top-10 right-10 p-4 border border-gray-200 rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity">
                     <Activity size={32} className="text-red-600" />
                  </div>
                  <div className="absolute bottom-10 left-10 p-4 border border-gray-200 rounded-3xl opacity-20">
                     <Microscope size={32} className="text-blue-500" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Final CTA */}
      <section className="px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden group border border-gray-800 shadow-2xl">
            <div className="relative z-10 space-y-12">
               <div className="flex justify-center gap-6">
                  <Sparkles className="w-12 h-12 text-yellow-500" />
                  <HeartPulse className="w-12 h-12 text-red-600" />
               </div>
               <div className="space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] italic uppercase">
                    Ready to <br /> <span className="text-red-600 italic">save a life</span>?
                  </h2>
                  <p className="text-gray-400 text-xl font-medium italic max-w-2xl mx-auto leading-relaxed">
                    Start your journey today. Join the world's most advanced professional blood donation network.
                  </p>
               </div>
               <div className="flex justify-center">
                 <Link href="/register" className="bg-red-600 text-white px-16 py-6 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-red-600/30 hover:bg-white hover:text-gray-900 transition-all active:scale-95 italic flex items-center gap-4 group/btn">
                    Register Now <ChevronRight size={20} className="group-hover/btn:translate-x-3 transition-transform" />
                 </Link>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[150px] pointer-events-none group-hover:bg-red-600/[0.15] transition-all duration-1000"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
