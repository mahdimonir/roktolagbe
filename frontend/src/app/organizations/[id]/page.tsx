'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Globe, 
  ShieldCheck, 
  ArrowLeft, 
  Loader2, 
  Activity, 
  Gift, 
  Users,
  Droplets,
  Calendar,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: orgData, isLoading, error } = useQuery({
    queryKey: ['organization', id],
    queryFn: async () => {
      const res: any = await api.get(`/managers/${id}`);
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Initializing Organization Hub...</p>
    </div>
  );

  if (error || !orgData) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4 text-center">
      <h1 className="text-2xl font-black text-gray-900 uppercase italic mb-4">Organization Not Found</h1>
      <p className="text-gray-500 mb-8 italic">This medical center might have shifted or is currently being verified.</p>
      <button onClick={() => router.back()} className="btn-primary px-8">Back to Directory</button>
    </div>
  );

  const org = orgData;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header Navigation */}
      <div className="pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors italic group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
      </div>

      {/* 2. Hero Section */}
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass p-8 lg:p-16 rounded-[4rem] border-gray-100 bg-white shadow-2xl shadow-red-500/5 relative overflow-hidden group">
            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              
              {/* Logo / Icon */}
              <div className="relative">
                <div className="w-48 h-48 lg:w-64 lg:h-64 bg-red-50 text-red-600 rounded-[4rem] lg:rounded-[5rem] flex flex-col items-center justify-center border-4 border-red-100 shadow-2xl shadow-red-500/10 group-hover:scale-105 transition-transform duration-700 overflow-hidden bg-white">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-24 h-24 lg:w-32 lg:h-32 text-red-500 opacity-20" />
                  )}
                </div>
                {org.isVerified && (
                  <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-3xl shadow-xl border border-gray-100">
                    <ShieldCheck className="w-8 h-8 text-green-500" />
                  </div>
                )}
              </div>

              {/* Identity */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 italic border border-red-100">
                  {org.type} Center
                </span>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 italic uppercase tracking-tighter mb-4">
                  {org.name}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 font-bold uppercase tracking-widest text-[10px] italic mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    {org.district}
                  </div>
                  {org.website && (
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                      <Globe className="w-4 h-4 text-red-500" />
                      Official Website
                    </a>
                  )}
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <span className="text-sm font-black text-gray-900 uppercase italic">Contact:</span>
                  <p className="text-xl font-black text-red-600 italic underline decoration-red-200 underline-offset-8 decoration-4">{org.contactPhone}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="w-full lg:w-72 glass p-8 rounded-[3rem] bg-gray-50/50 border-gray-200/50 text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Network Power</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-black text-gray-900 italic tracking-tighter">{org._count?.members || 0}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Verified Members</p>
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900 italic tracking-tighter">{org._count?.bloodRequests || 0}</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">Cases Managed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full -mr-48 -mt-48" />
          </div>
        </div>
      </section>

      {/* 3. Detailed Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left Column: Description & Rewards */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Description */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 italic uppercase">About Organization</h2>
                  <div className="h-px flex-1 bg-gray-100 mx-6 hidden sm:block" />
                </div>
                <p className="text-lg text-gray-600 leading-relaxed italic pr-8">
                  {org.description || "As a cornerstone of local healthcare, we are committed to streamlining blood accessibility and supporting volunteer heroes across the region."}
                </p>
                {org.address && (
                  <div className="mt-8 p-6 rounded-3xl bg-gray-50 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Location Facility</p>
                    <p className="text-sm font-bold text-gray-600 italic">{org.address}</p>
                  </div>
                )}
              </div>

              {/* Sponsored Rewards */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-gray-900 italic uppercase">Community Perks</h2>
                  <div className="h-px flex-1 bg-gray-100 mx-6 hidden sm:block" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {org.rewards && org.rewards.length > 0 ? (
                    org.rewards.map((r: any) => (
                      <div key={r.id} className="glass p-6 rounded-[2.5rem] bg-white border-gray-100 flex items-center gap-4 hover:shadow-xl transition-all group">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-red-500 group-hover:text-white transition-all">
                          <Gift className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase italic leading-tight">{r.title}</p>
                          <p className="text-[10px] font-bold text-red-500 uppercase mt-1">{r.pointsCost} Points Required</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center rounded-[2.5rem] border border-dashed border-gray-200">
                      <p className="text-gray-400 italic font-bold text-sm">No specific perks offered by this center at the moment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Active Feed & CTA */}
            <div className="space-y-8">
              
              {/* Active Requests Feed */}
              <div className="glass p-10 rounded-[3rem] border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest italic underline decoration-red-500 decoration-2 underline-offset-4">Mission Feed</h3>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                </div>
                
                <div className="space-y-6">
                  {org.bloodRequests && org.bloodRequests.length > 0 ? (
                    org.bloodRequests.map((req: any) => (
                      <Link key={req.id} href="/urgent-requests" className="block p-4 rounded-2xl hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-black text-red-600 italic">{req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
                          <span className="text-[8px] font-black text-gray-400 uppercase italic">Active Request</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-600 italic line-clamp-2">{req.notes || "Urgent assistance required at the center."}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-400 italic font-bold text-[10px] text-center py-6">All sets are satisfied at the moment.</p>
                  )}
                </div>
              </div>

              {/* Join Organization CTA */}
              <div className="p-10 rounded-[3rem] bg-gradient-to-br from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/30 relative overflow-hidden group/cta">
                <h3 className="text-2xl font-black italic uppercase mb-4 relative z-10">Join Network</h3>
                <p className="text-sm text-white font-bold mb-8 leading-relaxed italic relative z-10 opacity-90">
                  Are you a hero donor in this area? Join this organization to receive direct notifications for their emergency missions.
                </p>
                <div className="flex flex-col gap-4 relative z-10">
                   <Link href={`/register?orgRef=${org.inviteToken}`} className="block w-full bg-white text-red-600 text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-xl shadow-black/5">
                     Become a Member
                   </Link>
                   <button 
                     onClick={() => {
                        const link = `${window.location.origin}/register?orgRef=${org.inviteToken}`;
                        navigator.clipboard.writeText(link);
                        toast.success('Referral link copied to clipboard! 📋');
                     }}
                     className="block w-full bg-red-800/40 text-white text-center py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-800/60 transition-all border border-red-400/30"
                   >
                     Copy Invite Link
                   </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[50px] rounded-full -mr-16 -mt-16 group-hover/cta:scale-150 transition-transform duration-700" />
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
