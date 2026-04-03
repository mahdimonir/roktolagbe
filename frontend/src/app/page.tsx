'use client';

import CTASection from '@/components/common/CTASection';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import {
   Activity, ArrowRight,
   Award,
   Droplets,
   Globe,
   HeartPulse,
   Hospital, MapPin,
   ShieldCheck,
   Target,
   Thermometer,
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
      <main className="min-h-screen bg-white pb-32 italic">
         {/* 1. Hero Section */}
         <section className="relative pt-24 pb-48 overflow-hidden bg-gray-50/50 border-b border-gray-100">
            <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[45rem] h-[45rem] bg-red-600/[0.05] rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
               <div className="flex flex-col xl:flex-row items-center gap-24">
                  <div className="flex-1 text-center xl:text-left space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                     <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                        <span className="bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/10">
                           Reliable Blood Network
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-red-100 shadow-sm">
                           <Globe size={16} className="text-red-500" />
                           Island-wide Coverage
                        </div>
                     </div>
                     <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.85] mb-6 tracking-tighter italic whitespace-pre-line leading-none">
                        রক্ত দিন, <br /><span className="text-red-600 italic">জীবন</span> বাঁচান।
                     </h1>
                     <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl font-medium italic">
                        Connect with donors & hospitals instantly. Helping you find blood when every second matters. Simple, fast, and secure.
                     </p>
                     <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-8">
                        <Link href="/urgent-requests" className="bg-red-600 text-white px-14 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest shadow-2xl shadow-red-600/20 flex items-center justify-center gap-4 w-full sm:w-auto hover:bg-red-700 transition-all active:scale-95 italic group/btn">
                           I Need Blood <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-3 transition-transform" />
                        </Link>
                        <Link href="/register" className="bg-white border-2 border-gray-100 text-gray-900 px-14 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all w-full sm:w-auto text-center italic active:scale-95 shadow-sm">
                           Become a Donor
                        </Link>
                     </div>
                     <p className="mt-12 text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center xl:justify-start gap-4 italic leading-none">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        Verified network with 120+ Medical centers
                     </p>
                  </div>

                  <div className="flex-1 relative animate-in zoom-in duration-1000">
                     <div className="relative rounded-[5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.08)] border-8 border-white aspect-square group/visual">
                        <Image 
                           src="/hero-rebrand.png" 
                           alt="Healthcare Hero" 
                           fill 
                           className="object-cover group-hover:scale-105 transition-transform duration-1000"
                           priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                     </div>
                     <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] -z-10" />
                     <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-red-600/5 blur-[100px] -z-10" />
                  </div>
               </div>
            </div>
         </section>

         {/* 2. How it Works */}
         <section className="-mt-24 relative z-20">
            <div className="max-w-7xl mx-auto px-6">
               <div className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-2xl space-y-24">
                  <div className="text-center space-y-4">
                     <p className="text-red-600 font-black text-[11px] uppercase tracking-widest italic">How it works</p>
                     <h2 className="text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                        রক্ত দান কত <span className="text-red-600">সহজ!</span>
                     </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
                     {steps.map((step, i) => (
                        <div key={i} className="group relative flex flex-col items-center text-center space-y-8 p-10 rounded-[3rem] bg-gray-50/50 border-2 border-transparent hover:border-red-100 hover:bg-white hover:shadow-2xl transition-all duration-700">
                           <div className="w-20 h-20 bg-white text-gray-900 rounded-[1.5rem] flex items-center justify-center shadow-xl border border-gray-100 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                              {step.icon}
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase leading-none">{step.titleBn}</h3>
                              <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">{step.title}</p>
                              <p className="text-gray-500 text-sm italic font-medium leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
                           </div>
                           <div className="absolute top-8 right-10 text-gray-100 font-black text-7xl opacity-0 group-hover:opacity-20 transition-opacity font-mono">0{i+1}</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* 3. Impact Stats */}
         <section className="py-32 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
               <div className="bg-white p-16 lg:p-24 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden group">
                  <div className="flex flex-col xl:flex-row justify-between items-center gap-24 relative z-10">
                     <div className="text-center xl:text-left space-y-8 max-w-md">
                        <div className="flex items-center gap-3 justify-center xl:justify-start">
                           <div className="w-3 h-3 bg-red-600 rounded-full animate-ping" />
                           <p className="text-[11px] font-black text-red-600 uppercase tracking-widest italic">Platform Impact</p>
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-[0.9]">
                           Our <br /> <span className="text-red-600 italic">Lives</span> Impacted.
                        </h2>
                        <p className="text-gray-500 text-lg font-medium italic leading-relaxed">
                           Live tracking of life-saving donations across helping thousands every month.
                        </p>
                     </div>

                     <div className="grid grid-cols-2 gap-12 lg:gap-20 flex-1">
                        {stats.map((stat, i) => (
                           <div key={i} className="text-center xl:text-left group/stat">
                              <div className="flex items-center gap-5 justify-center xl:justify-start mb-6">
                                 <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-red-600 group-hover/stat:bg-red-600 group-hover/stat:text-white transition-all duration-500 shadow-sm border border-gray-100">
                                    {stat.icon}
                                 </div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</p>
                              </div>
                              <p className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter italic group-hover/stat:text-red-600 transition-colors uppercase">{stat.value}</p>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-red-600/[0.01] blur-[100px] rounded-full -mr-48 -mt-48" />
               </div>
            </div>
         </section>

         {/* 4. Urgent Requests */}
         <section className="py-24 bg-gray-50/50 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
               <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  <div className="space-y-4">
                     <p className="text-red-600 font-black text-[11px] uppercase tracking-widest italic">Urgent Requests</p>
                     <h2 className="text-5xl font-black text-gray-900 italic uppercase tracking-tighter leading-none">
                        এখনই রক্ত <span className="text-red-600">দরকার</span>।
                     </h2>
                  </div>
                  <Link href="/urgent-requests" className="bg-white border text-gray-900 px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-xl italic flex items-center gap-4 group/link">
                     View All Requests <ArrowRight size={18} className="group-hover/link:translate-x-3 transition-transform" />
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {displayRequests.length > 0 ? displayRequests.map((req: any, i: number) => {
                     const confirmed = req.donations?.filter((d: any) => d.status === 'VERIFIED').length || 0;
                     const progress = Math.min(100, (confirmed / req.units) * 100);
                     const deadlineDate = new Date(req.deadline);
                     const isExpired = deadlineDate < new Date();

                     return (
                        <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden flex flex-col" style={{ transitionDelay: `${i * 150}ms` }}>
                           <div className="flex justify-between items-start mb-10">
                              <div className="w-20 h-20 bg-red-600 text-white rounded-[1.5rem] flex flex-col items-center justify-center border-4 border-white shadow-xl">
                                 <p className="text-3xl font-black mb-1 italic tracking-tighter italic leading-none">
                                    {(req.bloodGroup || '').replace('_POS', '+').replace('_NEG', '-')}
                                 </p>
                                 <span className="text-[8px] font-black uppercase tracking-widest opacity-50 italic">Group</span>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                 {(req.urgency === 'EMERGENCY' || req.isEmergency) && (
                                    <span className="bg-red-600 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase italic tracking-widest animate-pulse shadow-xl shadow-red-600/20">
                                       Emergency
                                    </span>
                                 )}
                                 <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border italic ${isExpired ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                    {isExpired ? 'Mission Expired' : `Needed: ${deadlineDate.toLocaleDateString()}`}
                                 </span>
                              </div>
                           </div>

                           <div className="space-y-6 mb-12 flex-1">
                              <div className="space-y-2">
                                 <h3 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter truncate leading-none group-hover:text-red-600 transition-colors">
                                    {req.hospitalName || 'Hospital Center'}
                                 </h3>
                                 <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest italic pt-1">
                                    <MapPin className="w-4 h-4 text-red-500" />
                                    <span className="truncate">{req.thana ? `${req.thana}, ` : ''}{req.district}</span>
                                 </div>
                              </div>
                              
                              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                 <div className="h-full bg-red-600 rounded-full transition-all duration-1000" style={{ width: `${progress || 0}%` }} />
                               </div>
                               
                               <div className="flex flex-wrap items-center gap-4 pt-2">
                                  <div className="flex items-center gap-2.5 bg-gray-50 text-gray-500 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-gray-100">
                                     <Droplets className="w-4 h-4 text-red-500" />
                                     <span>{req.units} Units</span>
                                  </div>
                                  {req.hemoglobin && (
                                     <div className="flex items-center gap-2.5 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-blue-100">
                                        <Thermometer className="w-4 h-4" />
                                        <span>Hb: {req.hemoglobin}</span>
                                     </div>
                                  )}
                                  <div className="flex items-center gap-2.5 bg-red-50 text-red-600 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-100">
                                     <HeartPulse className="w-4 h-4" />
                                     <span>{req.urgency}</span>
                                  </div>
                               </div>
                            </div>

                           <Link href={`/urgent-requests/${req.id}`} className="w-full bg-gray-900 text-white py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-4 active:scale-95 italic group/btn shadow-xl">
                               Respond Now <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                           </Link>
                        </div>
                     );
}) : (
                     <div className="col-span-full">
                        <div className="bg-white border-4 border-dashed border-gray-100 rounded-[3.5rem] p-16 md:p-24 text-center space-y-8 animate-in fade-in duration-1000">
                           <div className="max-w-3xl mx-auto space-y-8">
                              <h3 className="text-4xl md:text-6xl font-black text-gray-200 tracking-tighter uppercase italic leading-[0.8] mb-4">
                                 We&apos;re on standby. <br /> No urgent calls.
                              </h3>
                              <p className="text-gray-400 italic text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed opacity-80">
                                 The blood network is currently stable with no matching emergencies. Join our verified donor community today and be ready to save a life when the next call comes.
                              </p>
                              <div className="pt-4">
                                 <Link href="/register" className="inline-flex items-center justify-center bg-gray-50 text-gray-400 px-14 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all italic active:scale-95 shadow-sm border border-gray-100">
                                    Join the network
                                 </Link>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </section>

         {/* 5. CTA Section */}
         <CTASection 
            title="START SAVING LIVES TODAY."
            subtitle="Join our community of donors and make a difference. Every donation can save up to three lives. Whether you're looking to donate or you're in an emergency, our platform is built to help you instantly."
            primaryBtnText="REGISTER NOW"
            primaryBtnLink="/register"
            secondaryBtnText="LEARN MORE"
            secondaryBtnLink="/how-it-works"
         />
      </main>
   );
}
