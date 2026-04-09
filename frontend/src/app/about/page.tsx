'use client';

import { 
  Award, Heart, Shield, Target, Users, Zap, 
  Globe, Activity, HeartPulse, Sparkles, 
  ArrowRight, ShieldCheck, TrendingUp,
  Droplets, Microscope, Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

export default function AboutPage() {
  const stats = [
    { label: 'Registered Donors', value: '25,000+', icon: <Users className="w-8 h-8 text-blue-600" /> },
    { label: 'Success Stories', value: '75,000+', icon: <HeartPulse className="w-8 h-8 text-red-600" /> },
    { label: 'Partner Hospitals', value: '180+', icon: <Target className="w-8 h-8 text-indigo-600" /> },
  ];

  const values = [
    {
      title: 'Smart Matching',
      icon: <Users className="w-8 h-8 text-red-600" />,
      desc: 'Our proprietary matching algorithm connects donors with urgent requests in minutes across the country.',
      color: 'red'
    },
    {
      title: 'Verified Network',
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
      desc: 'Every donor and hospital profile is verified to ensure the highest standards of safety and reliability.',
      color: 'blue'
    },
    {
      title: 'Donor Recognition',
      icon: <Award className="w-8 h-8 text-amber-600" />,
      desc: 'We appreciate our donors through a points-based rewards system and milestone recognition.',
      color: 'amber'
    },
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
                <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-[0.4em] uppercase italic shadow-xl shadow-red-600/10">
                   Our Heritage
                </span>
                <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-[0.4em] bg-white dark:bg-white/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-white/10 italic shadow-sm">
                  <Heart size={14} className="text-red-500" />
                  Elite Impact
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                Saving Lives. <br /><span className="text-red-600 italic">One Drop.</span>
              </h1>
              
              <p className="text-gray-500 dark:text-gray-400 font-medium italic text-[15px] leading-relaxed max-w-xl mx-auto lg:mx-0">
                RoktoLagbe is a premium emergency network dedicated to connecting vital blood donors with urgent missions across the nation.
              </p>
            </div>

            <div className="hidden lg:block">
               <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800 animate-bounce">
                  <Activity size={32} className="text-red-600" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Impact Section - Compact Grid */}
      <section className="py-12 px-4 md:px-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="p-10 rounded-[4.5rem] bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.08] shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 hover:border-red-100 dark:hover:border-red-500/30 transition-all duration-700 group relative overflow-hidden backdrop-blur-[40px] italic text-center text-gray-900 dark:text-white">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-white/10 text-gray-400 dark:text-gray-500 rounded-[1.2rem] flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 border border-gray-100 dark:border-transparent">
                   {stat.icon && (typeof stat.icon === 'object' ? stat.icon : null)}
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic group-hover:text-red-600 transition-colors mb-2 italic leading-none">{stat.value}</h2>
                 <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.4em] italic leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pillars Section - Refined Layout */}
      <section className="py-16 relative overflow-hidden bg-gray-50/50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-12">
                <div className="space-y-4 text-center lg:text-left">
                   <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] italic mb-2">Our Architecture</p>
                   <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-tight italic">
                     The Pulse of <br /><span className="text-red-600">Compassion.</span>
                   </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 text-gray-900 dark:text-white">
                  {values.map((v, i) => (
                    <div key={i} className="flex gap-8 group bg-white dark:bg-white/[0.02] p-8 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] hover:border-red-100 transition-all backdrop-blur-[40px] shadow-sm">
                      <div className="w-16 h-16 bg-gray-50 dark:bg-white/10 flex items-center justify-center shrink-0 rounded-[1.2rem] border border-gray-100 dark:border-white/5 group-hover:bg-red-600 group-hover:text-white transition-all duration-700">
                        {v.icon && (typeof v.icon === 'object' ? v.icon : null)}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter italic group-hover:text-red-600 transition-colors leading-none">{v.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium italic leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             {/* Visual Impact */}
             <div className="relative group overflow-hidden rounded-[4.5rem] aspect-square bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.08] shadow-2xl flex items-center justify-center backdrop-blur-[40px] italic">
                <div className="text-center p-12 relative z-10">
                   <div className="relative mb-8 group-hover:scale-110 transition-transform duration-700">
                      <HeartPulse className="w-24 h-24 text-red-600 mx-auto animate-pulse" />
                      <div className="absolute inset-0 bg-red-600/10 blur-[60px] rounded-full"></div>
                   </div>
                   <p className="text-2xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none italic">Saving Lives <br /> <span className="text-red-600">One Drop</span> At a Time.</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.02] to-transparent opacity-50"></div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <CTASection 
        title="READY TO JOIN US?"
        subtitle="Join the elite community of life-savers today."
        primaryBtnText="REGISTER NOW"
        primaryBtnLink="/register"
        secondaryBtnText="VIEW IMPACT"
        secondaryBtnLink="/saved-lives"
      />
    </div>
  );
}
