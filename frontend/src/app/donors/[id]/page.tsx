'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { 
  Droplets, MapPin, Calendar, Heart, ShieldCheck, 
  ArrowLeft, Loader2, Award, Clock, Facebook, 
  Linkedin, Briefcase, Quote, Star, Phone, Mail,
  ExternalLink, Share2, Info
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function DonorDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'history'>('info');

  const { data: donorData, isLoading, error } = useQuery({
    queryKey: ['public-donor', id],
    queryFn: async () => {
      const res: any = await api.get(`/donors/public/${id}`);
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-red-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplets className="w-6 h-6 text-red-300" />
        </div>
      </div>
      <p className="mt-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] italic animate-pulse">Synchronizing Hero Bio...</p>
    </div>
  );

  if (error || !donorData) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4 text-center">
      <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-8">
        <ShieldCheck className="w-12 h-12 text-red-200" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 uppercase italic mb-4 tracking-tighter">Record Not Found</h1>
      <p className="text-gray-500 mb-10 italic max-w-sm">This profile may have been privateized or the hero has transitioned to a different sector.</p>
      <button 
        onClick={() => router.push('/donors')} 
        className="bg-gray-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200"
      >
        Discover Other Heroes
      </button>
    </div>
  );

  const donor = donorData;

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20">
      {/* 1. Dynamic Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-red-50/50 to-transparent -z-10" />
      
      {/* 2. Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-red-600 transition-colors italic group"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </div>
            Back to Discovery
          </button>
          
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT COLUMN: Profile Visuals & Contact (Lg: 8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Main Profile Card */}
            <div className="bg-white rounded-[3.5rem] p-8 lg:p-14 shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                
                {/* Image / Avatar Container */}
                <div className="relative group/avatar">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-[4rem] bg-gray-50 border-8 border-white shadow-2xl overflow-hidden pointer-events-none transition-transform duration-700 group-hover/avatar:scale-105">
                    {donor.profileImage ? (
                      <img src={donor.profileImage} alt={donor.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-50 to-white flex flex-col items-center justify-center text-red-500">
                        <Droplets className="w-16 h-16 animate-pulse" />
                      </div>
                    )}
                  </div>
                  {/* Floating Blood Group Tag */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-600 text-white rounded-3xl flex flex-col items-center justify-center shadow-2xl shadow-red-600/30 border-4 border-white rotate-12 transition-transform hover:rotate-0 duration-500">
                    <p className="text-2xl font-black italic">{donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                    <span className="text-[8px] font-black uppercase tracking-[0.1em] opacity-70">Group</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                    <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] italic border border-red-100 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" />
                       Verified Life Saver
                    </span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] italic border flex items-center gap-2 ${
                      donor.isAvailable 
                      ? 'bg-green-50 text-green-600 border-green-100' 
                      : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                       <Clock className="w-3 h-3" />
                       {donor.isAvailable ? 'Ready to Donate' : 'Recovering'}
                    </span>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase italic tracking-tighter mb-4 leading-none">
                    {donor.name}
                  </h1>

                  {/* DIGITAL PRESENCE (Move to Hero for everyone) */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                    {donor.fbUrl && (
                      <a href={donor.fbUrl} target="_blank" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {donor.linkedinUrl && (
                      <a href={donor.linkedinUrl} target="_blank" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all shadow-sm">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {(donor.fbUrl || donor.linkedinUrl) && <div className="h-4 w-px bg-gray-200 mx-2" />}
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Digital Footprint</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Location</p>
                      <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        {donor.district}, {donor.division}
                      </p>
                    </div>
                    {donor.occupation && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Occupation</p>
                        <p className="text-sm font-bold text-gray-700 flex items-center gap-2 italic">
                          <Briefcase className="w-4 h-4 text-red-500" />
                          {donor.occupation}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Experience</p>
                      <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Award className="w-4 h-4 text-red-500" />
                        {donor.totalDonations} Donations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Accent Lines */}
              <div className="absolute bottom-0 right-0 opacity-[0.03] pointer-events-none select-none">
                <Heart className="w-[400px] h-[400px] -mr-20 -mb-20" />
              </div>
            </div>

            {/* Role-Based Contact Info & Actions */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8`}>
              {/* Contact Card for Authenticated Users */}
              {donor.user ? (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-2">
                      <Phone className="w-4 h-4 text-red-500" />
                      Hero Contact Detail
                    </h3>
                    <span className="text-[8px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-black uppercase">Verified Access</span>
                  </div>
                  
                  <div className="space-y-4">
                    <a href={`tel:${donor.user.phone}`} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-red-200 hover:bg-white transition-all group/item">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Primary Phone</p>
                          <p className="text-lg font-black text-gray-900 tracking-wider">{donor.user.phone}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover/item:text-red-500" />
                    </a>

                    <a href={`mailto:${donor.user.email}`} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-red-200 hover:bg-white transition-all group/item">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-red-600 shadow-sm group-hover/item:bg-red-600 group-hover/item:text-white transition-all">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Emergency Email</p>
                          <p className="text-sm font-black text-gray-900 truncate max-w-[150px]">{donor.user.email}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-300 group-hover/item:text-red-500" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100/50 rounded-[2.5rem] p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center px-10">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-gray-300 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic mb-2">Privacy Protected</h3>
                  <p className="text-[10px] text-gray-400 font-bold max-w-[200px] italic">Sign in to view contact details for emergency coordination.</p>
                  <Link href="/login" className="mt-4 text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline italic">Sign In to Continue</Link>
                </div>
              )}

              {/* Community Status Card */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic mb-6">Network Insight</h3>
                  <p className="text-[10px] text-gray-400 font-bold italic mb-6 leading-relaxed">Active donor profile within our network. Connect via social links above or coordinate through official channels.</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-2">Profile Verification</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[9px] font-black text-gray-700 uppercase italic">Active & Verified Record</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-10 border-b border-gray-200 px-4">
               <button 
                onClick={() => setActiveTab('info')}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'info' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
               >
                 Bio & Impact
                 {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-t-full" />}
               </button>
               <button 
                onClick={() => setActiveTab('history')}
                className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
                  activeTab === 'history' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}
               >
                 Donation History
                 {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded-t-full" />}
               </button>
            </div>

            {activeTab === 'info' ? (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* BIO */}
                {donor.bio && (
                  <div className="relative p-10 bg-white rounded-[3rem] shadow-sm border border-gray-100">
                    <Quote className="absolute top-8 left-8 w-12 h-12 text-red-500/5" />
                    <p className="text-lg lg:text-xl font-bold text-gray-600 italic leading-relaxed pl-10 relative z-10">
                      {donor.bio}
                    </p>
                  </div>
                )}

                {/* ACHIEVEMENTS */}
                <div>
                  <h2 className="text-xl font-black text-gray-900 italic uppercase mb-8">Hero Achievements</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {donor.badges && donor.badges.length > 0 ? (
                      donor.badges.map((b: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm text-center hover:-translate-y-1 transition-transform group">
                          <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-500 group-hover:text-white transition-all">
                            <Star className="w-7 h-7 fill-current" />
                          </div>
                          <p className="text-[10px] font-black text-gray-900 uppercase italic leading-tight mb-1">{b.badge.name}</p>
                          <p className="text-[7px] font-black text-gray-400 uppercase tracking-tighter">{b.badge.category}</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-10 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                        <p className="text-gray-400 italic font-bold text-xs uppercase tracking-widest">Awaiting First Milestone</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ADDRESS (Detailed for privileged) */}
                {donor.address && (
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic mb-4">Residential/Primary Area Detail</h3>
                    <p className="text-sm font-bold text-gray-600 flex items-start gap-4 italic leading-relaxed">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-red-500">
                        <MapPin className="w-5 h-5" />
                      </div>
                      {donor.address}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                 {donor.donations && donor.donations.length > 0 ? (
                    donor.donations.map((donation: any, i: number) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                          <Award className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-gray-900 uppercase italic">Successfully Donated Blood</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2 mt-1 italic">
                            <Calendar className="w-3 h-3" />
                            {new Date(donation.donatedAt).toLocaleDateString(undefined, { dateStyle: 'full' })}
                          </p>
                        </div>
                        <div className="text-right whitespace-nowrap hidden sm:block">
                          <p className="text-xs font-black text-green-600">Impact Score +{donation.pointsEarned}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                      <Droplets className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                      <p className="text-gray-400 italic font-black text-sm uppercase tracking-widest">No Public Records Yet</p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Impact Summary & CTA (Lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Impact Widget - PREMIUM MESH GRADIENT BACKGROUND */}
            <div className="bg-[#1a0505] rounded-[3rem] p-10 text-white shadow-2xl shadow-gray-400/20 relative overflow-hidden group/impact border border-white/5">
              {/* Mesh Gradient Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900/30 blur-[100px] rounded-full -ml-32 -mb-32" />
              <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-red-500/10 blur-[60px] rounded-full" />

              <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-8 italic relative z-10">Impact Scorecard</h3>
              
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                    <p className="text-4xl font-black italic tracking-tighter">{donor.totalDonations}</p>
                  </div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Lives Impacted</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <p className="text-4xl font-black italic tracking-tighter">{donor.points}</p>
                  </div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Hero Points</p>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
                 <p className="text-[9px] font-bold text-white/50 italic leading-relaxed mb-6">
                   This hero has been a consistent source of hope for the {donor.district} community since their first involvement.
                 </p>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${Math.min((donor.totalDonations / 10) * 100, 100)}%` }} />
                 </div>
                 <p className="text-[7px] font-black text-white/30 uppercase mt-2 tracking-widest">Elite Donor Progression</p>
              </div>
            </div>

            {/* Emergency CTA */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-red-600/30">
               <h3 className="text-2xl font-black italic uppercase mb-4 leading-none tracking-tighter">Urgent Help?</h3>
               <p className="text-[11px] font-bold text-white/80 mb-8 italic leading-relaxed">
                 By posting an official request, our system will notify {donor.name} and other matching heroes in {donor.district} immediately via push alerts.
               </p>
               <Link href="/emergency-request" className="block w-full py-5 bg-white text-red-700 text-center rounded-2xl text-[10px] font-black tracking-widest uppercase hover:bg-black hover:text-white transition-all shadow-xl shadow-black/10">
                 Request Official Assistance
               </Link>
            </div>

            {/* Affiliations */}
            {donor.memberOf && donor.memberOf.length > 0 && (
              <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest italic mb-6 border-b border-gray-50 pb-4">Trusted Networks</h3>
                <div className="space-y-6">
                  {donor.memberOf.map((aff: any, i: number) => (
                    <Link key={i} href={`/organizations/${aff.manager.id}`} className="flex items-center gap-4 group/org">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover/org:bg-red-50 transition-colors">
                        {aff.manager.logoUrl ? (
                          <img src={aff.manager.logoUrl} alt={aff.manager.name} className="w-8 h-8 object-contain" />
                        ) : (
                          <Droplets className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] font-black text-gray-900 uppercase italic group-hover/org:text-red-600 transition-colors">{aff.manager.name}</p>
                        <p className="text-[7px] font-black text-gray-400 uppercase">{aff.manager.type}</p>
                      </div>
                      <BoxArrow className="w-4 h-4 text-gray-200 group-hover/org:text-red-200" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Disclaimer */}
            <div className="p-8 rounded-[2rem] bg-amber-50/50 border border-amber-100">
               <div className="flex gap-4">
                 <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0" />
                 <div>
                   <p className="text-[10px] font-black text-amber-900 uppercase italic mb-1">Safety First</p>
                   <p className="text-[9px] font-bold text-amber-700/70 italic leading-relaxed">
                     RoktoLagbe only facilitates contact. Always verify donors in person and never provide financial compensation for blood.
                   </p>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function BoxArrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7V17" />
    </svg>
  );
}
