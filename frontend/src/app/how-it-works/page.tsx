'use client';

import { 
  Activity, ArrowRight, Award, CheckCircle2, 
  Droplets, Heart, MapPin, Zap, Target, 
  ShieldCheck, Globe, Fingerprint, Microscope,
  Sparkles, HeartPulse, ShieldAlert, Laptop, ChevronRight,
  ClipboardCheck, TrendingUp, Users
} from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

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
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 pb-24 italic">
      {/* 1. Header - Compact Glass */}
      <section className="relative pt-24 pb-32 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent px-4 md:px-0">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="flex flex-col items-center gap-6">
               <div className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.3em] uppercase italic shadow-xl shadow-red-600/10">
                  Mission Protocol
               </div>
               <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                 HOW IT <span className="text-red-600">WORKS</span>
               </h1>
               <p className="text-gray-400 dark:text-gray-500 text-[11px] font-black uppercase tracking-[0.2em] italic max-w-xl mx-auto mt-4">
                 A simple four-step process to save lives. RoktoLagbe bridges the gap between donors and those in urgent clinical need.
               </p>
            </div>
        </div>
      </section>

      {/* 2. Process Timeline - Compact Glass Cards */}
      <section className="-mt-16 relative z-20 px-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="group relative">
                <div className="p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 h-full transition-all duration-700 hover:-translate-y-2 hover:border-red-600 dark:hover:border-red-600 shadow-xl dark:shadow-black/50 backdrop-blur-[40px] flex flex-col items-center text-center overflow-hidden">
                   <div className="w-16 h-16 bg-red-600/10 text-red-600 rounded-2xl flex items-center justify-center mb-8 border border-red-600/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                      {step.icon}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter mb-4 uppercase leading-tight">{step.title}</h3>
                   <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed italic font-bold uppercase tracking-wide">{step.desc}</p>
                   
                   <div className="mt-auto pt-8 text-gray-100 dark:text-white/5 font-black text-7xl absolute -bottom-6 right-8 pointer-events-none group-hover:text-red-600/10 transition-colors">
                      {step.tag.split(' ')[1]}
                   </div>
                   
                   <div className="absolute top-8 left-8 bg-gray-50 dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all">
                      {step.tag}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Technology Section - High Density */}
      <section className="py-32 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-12">
                  <div className="space-y-4">
                     <p className="text-red-600 font-black text-[9px] uppercase tracking-[0.4em] italic leading-none">CORE TECHNOLOGY</p>
                     <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">
                        POWERED BY <br /><span className="text-red-600 italic">SMART SYNC</span>
                     </h2>
                     <p className="text-sm text-gray-400 dark:text-gray-500 font-black italic max-w-xl leading-relaxed uppercase tracking-tight">
                        Our platform uses advanced location matching and eligibility tracking to ensure the fastest connection between donors and emergency requests.
                     </p>
                  </div>
                  <div className="space-y-6">
                    {algorithms.map((item, i) => (
                      <div key={i} className="flex gap-6 items-start group">
                         <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/10 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                            {item.icon}
                         </div>
                         <div className="space-y-1">
                            <p className="font-black uppercase italic tracking-widest text-base text-gray-900 dark:text-white group-hover:text-red-600 transition-colors leading-none">{item.l}</p>
                            <p className="text-gray-400 dark:text-gray-500 text-[10px] italic font-bold uppercase tracking-wide">{item.d}</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Right Side - Visual Anchor */}
               <div className="p-10 md:p-14 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-2xl relative group overflow-hidden aspect-square flex items-center justify-center backdrop-blur-[20px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  <div className="relative z-10 text-center space-y-8 transition-transform duration-700">
                    <div className="relative inline-block">
                       <MapPin className="w-20 h-20 text-red-600 mx-auto" />
                       <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/10 dark:bg-red-600/20 blur-md rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-2xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white leading-none">LIVE REQUEST MAP</p>
                       <p className="text-[10px] text-gray-400 dark:text-gray-500 italic font-black uppercase tracking-tight max-w-[240px] mx-auto leading-relaxed">
                          Monitoring every urgent request across the network in real-time.
                       </p>
                    </div>
                    <Link href="/urgent-requests" className="bg-gray-900 dark:bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 dark:hover:bg-red-700 transition-all flex items-center justify-center gap-4 shadow-xl active:scale-95 italic">
                       VIEW LIVE MAP <ArrowRight size={16} />
                    </Link>
                  </div>
                  
                  <div className="absolute top-8 right-8 p-3 border border-gray-200 dark:border-white/10 rounded-2xl opacity-20 group-hover:opacity-100 transition-opacity">
                     <Activity size={24} className="text-red-600" />
                  </div>
                  <div className="absolute bottom-8 left-8 p-3 border border-gray-200 dark:border-white/10 rounded-2xl opacity-20">
                     <Microscope size={24} className="text-blue-500" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. Final CTA */}
      <CTASection 
        title="READY TO SAVE A LIFE?"
        subtitle="Start your journey today. Join the world's most advanced professional blood donation network."
        primaryBtnText="REGISTER NOW"
        primaryBtnLink="/register"
        secondaryBtnText="LEARN MORE"
        secondaryBtnLink="/about"
      />
    </main>
  );
}
