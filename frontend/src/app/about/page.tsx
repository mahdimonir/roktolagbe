'use client';

import { 
  Award, Heart, Shield, Target, Users, Zap, 
  Globe, Activity, HeartPulse, Sparkles, 
  ArrowRight, ShieldCheck, TrendingUp,
  Droplets, Microscope, Fingerprint
} from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-white pb-32">
      {/* 1. Hero Section */}
      <section className="pt-32 pb-48 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[40rem] h-[40rem] bg-red-50 rounded-full blur-[120px] pointer-events-none group-hover:bg-red-100 transition-all duration-1000"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex justify-center gap-4">
               <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] italic shadow-xl shadow-red-600/10">
                  Our Mission
               </span>
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-gray-900 tracking-tighter mb-8 leading-[0.8] uppercase italic">
              SAVING <br /> <span className="text-red-600">LIVES</span>.
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed max-w-3xl mx-auto">
              RoktoLagbe is a life-saving platform dedicated to connecting blood donors with those in urgent need, making the donation process fast, safe, and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Impact Section */}
      <section className="-mt-24 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col items-center gap-6 text-center group hover:-translate-y-2 transition-all duration-700">
                <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-[2rem] flex items-center justify-center shadow-inner group-hover:bg-red-600 group-hover:text-white transition-all duration-500 border border-gray-100 group-hover:border-red-600">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase italic group-hover:text-red-600 transition-colors">{stat.value}</p>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2 italic px-4 py-1 bg-gray-50 rounded-full">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Pillars Section */}
      <section className="py-44 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
               <div className="space-y-6">
                  <div className="w-16 h-2 bg-red-600 rounded-full"></div>
                  <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic uppercase leading-[0.9] italic">
                    The Pulse of <br /><span className="text-red-600 underline decoration-red-600/10 underline-offset-[16px]">Compassion</span>.
                  </h2>
               </div>
               <div className="space-y-12">
                {values.map((v, i) => (
                  <div key={i} className="flex gap-10 group">
                    <div className={`w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all duration-700 shadow-sm`}>
                      {v.icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter italic group-hover:text-red-600 transition-colors">{v.title}</h3>
                      <p className="text-gray-500 text-lg font-medium italic leading-relaxed max-w-md">{v.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Section */}
            <div className="relative group overflow-hidden rounded-[4rem] aspect-square bg-gray-50 border-8 border-white shadow-2xl flex items-center justify-center group/visual">
               <div className="text-center p-20 relative z-10">
                  <div className="relative mb-12">
                     <HeartPulse className="w-44 h-44 text-red-600 mx-auto animate-pulse" />
                     <div className="absolute inset-0 bg-red-600/10 blur-[60px] rounded-full"></div>
                  </div>
                  <p className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter leading-none italic">Saving Lives <br /> <span className="text-red-600 italic">One Drop</span> At a Time.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Section */}
      <section className="px-6 relative z-10 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-[4rem] p-16 md:p-28 text-center relative overflow-hidden group shadow-2xl">
            <div className="relative z-10 space-y-12">
               <div className="flex justify-center gap-6">
                  <Droplets className="w-12 h-12 text-red-600 animate-bounce" />
               </div>
               <div className="space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.8] italic uppercase italic">
                    Ready to <br /> <span className="text-red-600 italic">Join Us</span>?
                  </h2>
                  <p className="text-gray-400 text-lg md:text-xl font-medium italic max-w-3xl mx-auto leading-relaxed">
                    Join our growing community of life-savers. Register today and start making a difference in your community.
                  </p>
               </div>
               <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                 <Link href="/register" className="w-full md:w-auto bg-red-600 text-white px-16 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-white hover:text-gray-900 transition-all active:scale-95 italic flex items-center justify-center gap-4 group/btn">
                    Register Now <ArrowRight size={20} className="group-hover/btn:translate-x-3 transition-transform" />
                 </Link>
                 <Link href="/urgent-requests" className="text-gray-400 hover:text-red-500 text-[11px] font-black uppercase tracking-[0.4em] border-b-2 border-transparent hover:border-red-600 pb-2 transition-all italic">
                    View Urgent Requests →
                 </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
