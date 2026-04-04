'use client';

import CTASection from '@/components/common/CTASection';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import {
   Activity, ArrowRight,
   Award,
   Gauge,
   Heart,
   HeartPulse,
   Hospital, MapPin,
   Sparkles,
   Target,
   UserPlus, Users
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
   // 1. Fetch Stats
   const { data: statsData } = useQuery({
      queryKey: ['public-stats'],
      queryFn: async () => {
         const res: any = await api.get('/public/stats');
         return (res as any)?.data;
      }
   });

   // 2. Fetch Urgent Requests
   const { data: urgentResponse } = useQuery({
      queryKey: ['urgent-requests'],
      queryFn: async () => {
         const res: any = await api.get('/blood-requests?limit=3');
         return (res as any)?.data;
      }
   });

   const stats = [
      { label: 'Verified Donors', value: statsData?.totalDonors?.toLocaleString() || '1,500', icon: <Users className="w-6 h-6 text-red-600" /> },
      { label: 'Active Requests', value: statsData?.urgentRequests?.toLocaleString() || '42', icon: <Activity className="w-6 h-6 text-red-600" /> },
      { label: 'Lives Saved', value: statsData?.livesSaved?.toLocaleString() || '890', icon: <HeartPulse className="w-6 h-6 text-red-600" /> },
      { label: 'Partner Hospitals', value: statsData?.partnerHospitals?.toLocaleString() || '12', icon: <Hospital className="w-6 h-6 text-red-600" /> },
   ];

   const steps = [
      {
         title: 'Quick Register',
         titleBn: 'নিবন্ধন করুন',
         desc: 'Sign up as a donor and join our life-saving community in seconds.',
         icon: <UserPlus className="w-10 h-10" />
      },
      {
         title: 'Find Matches',
         titleBn: 'খুঁজুন বা পোস্ট করুন',
         desc: 'Search for blood donors or post an emergency request near your location.',
         icon: <Target className="w-10 h-10" />
      },
      {
         title: 'Connect Instantly',
         titleBn: 'সংযুক্ত হোন',
         desc: 'Directly contact donors or hospitals to coordinate blood collection.',
         icon: <Activity className="w-10 h-10" />
      },
      {
         title: 'Save a Life',
         titleBn: 'জীবন বাঁচান',
         desc: 'Complete the donation, earn badges, and make a real-world impact.',
         icon: <Award className="w-10 h-10" />
      },
   ];

   const displayRequests = urgentResponse || [];

   return (
      <main className="min-h-screen bg-white pb-16 md:pb-28 italic font-black text-gray-900">
         {/* 1. Hero Section - Elite Mobile Refinement */}
         <section className="relative pt-20 pb-24 md:pt-24 md:pb-32 lg:pt-16 lg:pb-24 overflow-hidden lg:bg-white max-lg:bg-[url('/mobile-hero-1.png')] max-lg:min-h-[600px] max-lg:bg-no-repeat max-lg:bg-bottom max-lg:bg-[length:auto_85%] max-lg:bg-[#EDEDED]">
            {/* Desktop-only pulse element */}
            <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] rounded-full blur-[150px] pointer-events-none animate-pulse max-lg:hidden"></div>
            
            {/* Mobile Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 lg:hidden pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 xl:gap-32">
                  <div className="flex-1 text-center lg:text-left space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                     <div className="space-y-6 max-lg:space-y-4">
                        {/* Bengali Heading - Red Branding with Razor-Sharp Glow */}
                        <h1 className="text-red-600 text-5xl max-lg:text-6xl md:text-7xl font-black tracking-tighter leading-none mb-2 max-lg:drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] scale-110 max-lg:scale-100 transition-transform">
                           রক্ত লাগবে?
                        </h1>
                        {/* English Heading - Crisp White for Depth */}
                        <h2 className="text-gray-900 max-lg:text-white text-4xl md:text-[3.5rem] xl:text-[4.5rem] font-black tracking-tighter leading-[1.1] italic max-lg:drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                           The Pulse of Life.
                        </h2>
                     </div>
                     
                     {/* Description with enhanced backdrop logic */}
                     <div className="relative max-w-xl mx-auto lg:mx-0">
                        <p className="text-lg md:text-xl text-gray-500 max-lg:text-white/95 font-medium leading-relaxed italic max-lg:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-4 sm:px-0">
                           Bridging the gap between medical urgency and human empathy. Bangladesh&apos;s most trusted clinical network for emergency blood donation.
                        </p>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                        <Link href="/register" className="bg-red-600 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-red-600/20 flex items-center justify-center gap-3 w-full sm:w-auto hover:bg-red-700 transition-all active:scale-95 italic group/btn">
                           <Heart className="w-5 h-5 fill-white group-hover/btn:scale-125 transition-transform" />
                           Become a Donor
                        </Link>
                        <Link href="/urgent-requests" className="bg-white lg:border-2 lg:border-red-600 lg:text-red-600 max-lg:bg-transparent max-lg:border-2 max-lg:border-white max-lg:text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all w-full sm:w-auto text-center italic active:scale-95 flex items-center justify-center gap-3">
                           <Sparkles className="w-5 h-5" />
                           I Need Blood
                        </Link>
                     </div>
                  </div>

                  <div className="flex-1 relative w-full animate-in zoom-in duration-1000 group max-lg:hidden">
                     {/* Main Hero Image - Visible on Desktop */}
                     <div className="relative rounded-[4rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.12)] aspect-[1/1] xl:aspect-[4/3] w-full max-w-[640px] mx-auto border-8 border-white bg-gray-50">
                        <Image 
                           src="/hero-rebrand.png" 
                           alt="Healthcare Pulse" 
                           fill 
                           className="object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
                           priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                     
                     {/* Floating RESPONSE TIME Badge */}
                     <div className="absolute -bottom-8 -left-8 md:-bottom-12 md:-left-12 bg-white p-4 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-500 border border-gray-100 group-hover:translate-y-[-10px] transition-transform">
                        <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
                           <Gauge size={32} className="group-hover:rotate-45 transition-transform duration-700" />
                        </div>
                        <div className="text-left font-black italic">
                           <div className="text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-1">Response Time</div>
                           <div className="text-2xl text-[#112135] tracking-tighter">Under 30 Mins</div>
                        </div>
                     </div>
                     
                     {/* Decorative Elements */}
                     <div className="absolute -top-16 -right-16 w-64 h-64 bg-red-600/[0.03] rounded-full blur-[100px] -z-10 group-hover:scale-125 transition-transform duration-1000" />
                     <div className="absolute -bottom-24 -right-12 w-80 h-80 bg-red-600/[0.04] rounded-full blur-[120px] -z-10" />
                  </div>
               </div>
            </div>
         </section>

         {/* 2. How it Works - Improved Mobile Responsiveness */}
         <section className="py-24 relative z-20">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
               <div className="bg-white px-6 py-12 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-2xl space-y-12 md:space-y-24">
                  <div className="text-center space-y-4">
                     <p className="text-red-600 font-black text-[11px] uppercase tracking-widest italic leading-none">How it works</p>
                     <h2 className="text-3xl md:text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none px-4">
                        রক্ত দান কত <span className="text-red-600">সহজ!</span>
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                     {steps.map((step, i) => (
                        <div key={i} className="group relative flex flex-col items-center text-center space-y-6 md:space-y-8 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-gray-50/50 border-2 border-transparent hover:border-red-100 hover:bg-white hover:shadow-2xl transition-all duration-700">
                           <div className="w-16 h-16 md:w-20 md:h-20 bg-white text-gray-900 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-xl border border-gray-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                              {step.icon}
                           </div>
                           <div className="space-y-3 md:space-y-4">
                              <h3 className="text-xl md:text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">{step.titleBn}</h3>
                              <p className="text-gray-500 text-sm md:text-[14px] leading-relaxed font-medium italic">
                                 {step.desc}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 3. Urgent Requests - Full Mobile Refinement */}
         <section className="py-20 md:py-32 italic">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-8 mb-16 text-center md:text-left">
                  <div className="space-y-4">
                     <p className="text-red-600 font-black text-[11px] uppercase tracking-widest leading-none">Emergency Dashboard</p>
                     <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                        Urgent <span className="text-red-600 italic">Needs</span>
                     </h2>
                  </div>
                  <Link href="/urgent-requests" className="text-xs md:text-sm font-black text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest flex items-center gap-3 group">
                     Explore Feed <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>

               {displayRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     {displayRequests.map((request: any) => (
                        <div key={request.id} className="bg-[#FBFAFA] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-6 md:p-8">
                              <div className="w-14 h-14 md:w-16 md:h-16 bg-white text-red-600 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-lg border border-red-50 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                                 {request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                              </div>
                           </div>
                           <div className="space-y-8">
                              <div className="flex items-center gap-3 bg-white px-4 py-1.5 rounded-full border border-gray-50 w-fit text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
                                 <MapPin size={12} className="text-red-500" />
                                 {request.district}
                              </div>
                              <div className="space-y-3">
                                 <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">{request.patientName}</h3>
                                 <p className="text-gray-500 text-sm italic font-medium">{request.hospitalName}</p>
                              </div>
                              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                                 <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-none mb-2">Required by</span>
                                    <span className="text-sm font-black text-gray-900 italic leading-none">{new Date(request.neededBy).toLocaleDateString()}</span>
                                 </div>
                                 <Link 
                                    href={`/urgent-requests/${request.id}`}
                                    className="bg-white text-gray-900 p-4 rounded-2xl border border-gray-100 group-hover:bg-[#112135] group-hover:text-white transition-all duration-500 shadow-sm"
                                 >
                                    <ArrowRight size={20} />
                                 </Link>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  /* LOCAL EMPTY STATE - Enhanced Mobile Sizing */
                  <div className="w-full bg-[#FBFAFA] rounded-[2.5rem] md:rounded-[3.52rem] p-12 md:p-24 border-4 border-dashed border-gray-100 text-center space-y-10 group overflow-hidden relative">
                     <div className="relative z-10 space-y-8">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                           <Activity className="w-10 h-10 text-gray-200" />
                        </div>
                        <div className="space-y-3">
                           <h3 className="text-3xl md:text-4xl font-black text-gray-200 uppercase tracking-tighter italic transition-colors group-hover:text-gray-300 px-4">On Standby.</h3>
                           <p className="text-gray-400 text-base md:text-lg italic max-w-xl mx-auto font-medium leading-relaxed px-4 md:px-0">
                              No urgent requests at the moment. Our network is in its stable, life-saving state waiting for the next update.
                           </p>
                        </div>
                        <div className="pt-6 px-4 md:px-0">
                           <Link href="/blood-requests" className="w-full sm:w-auto inline-block bg-white text-gray-300 border border-gray-100 px-8 md:px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:border-red-200 hover:text-red-500 transition-all italic shadow-sm hover:shadow-xl active:scale-95">
                              View Full Dashboard
                           </Link>
                        </div>
                     </div>
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/[0.01] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  </div>
               )}
            </div>
         </section>

         {/* 4. Global Stats Area - Improved Mobile Legibility */}
         <section className="py-20 md:py-24 bg-gray-50/50 italic font-black">
            <div className="max-w-7xl mx-auto px-6">
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-24">
                  {stats.map((stat, i) => (
                     <div key={i} className="space-y-4 md:space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-xl border border-red-50 flex items-center justify-center mx-auto lg:mx-0">
                           {stat.icon}
                        </div>
                        <div className="space-y-2">
                           <div className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter italic">{stat.value}</div>
                           <div className="text-xs font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         <CTASection 
            title="THE PULSE OF HOPE."
            subtitle="Join thousands of heroes today. Your simple act of kindness ensures that the pulse of life never stops for someone in need."
            primaryBtnText="BECOME A DONOR"
            primaryBtnLink="/register"
            secondaryBtnText="REQUEST SUPPORT"
            secondaryBtnLink="/urgent-requests"
         />
      </main>
   );
}
