'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useParams, useRouter } from 'next/navigation';
import { 
  Droplets, MapPin, Calendar, Heart, ShieldCheck, 
  ArrowLeft, Loader2, Award, Clock, Phone, Mail,
  ExternalLink, Share2, Info, User, CheckCircle2,
  AlertCircle, History
} from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth-store';
import { canDonate } from '@/lib/utils/blood-compatibility';
import { useState } from 'react';
import { toast } from 'sonner';

export default function RequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const [isCopying, setIsCopying] = useState(false);

  const { data: requestData, isLoading: isLoadingRequest, refetch: refetchRequest } = useQuery({
    queryKey: ['blood-request', id],
    queryFn: async () => {
      const res: any = await api.get(`/blood-requests/${id}`);
      return res.data;
    },
  });

  const commitMutation = useMutation({
    mutationFn: async () => api.post(`/blood-requests/${id}/commit`),
    onSuccess: () => {
      toast.success('Mission Accepted! Thank you for your bravery. 🩸');
      refetchRequest();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join mission.');
    }
  });

  const { data: shortlistedDonors, isLoading: isLoadingShortlist } = useQuery({
    queryKey: ['shortlisted-donors', id],
    queryFn: async () => {
      const res: any = await api.get(`/blood-requests/${id}/shortlist`);
      return res.data;
    },
    enabled: !!authUser && !!requestData, // Only try if logged in
  });

  if (isLoadingRequest) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Syncing Mission Specs...</p>
    </div>
  );

  if (!requestData) return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <h1 className="text-2xl font-black italic uppercase">Mission Not Found</h1>
      <Link href="/urgent-requests" className="mt-4 px-6 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Return to Feed</Link>
    </div>
  );

  const request = requestData;
  const isAuthorized = authUser?.role === 'ADMIN' || authUser?.role === 'MANAGER' || authUser?.id === request.manager?.userId;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopying(true);
    toast.success('Number copied to clipboard!');
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24">
      {/* Navbar Decoration */}
      <div className="fixed top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-red-50/30 to-transparent -z-10" />
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-all italic">
            <ArrowLeft className="w-4 h-4" />
            Abort & Return
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic border ${
              request.status === 'OPEN' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'
            }`}>
              Mission {request.status}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: Request Details */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                    {request.urgency} Request
                  </span>
                  {request.isEmergency && (
                    <span className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic">
                      Verified Emergency
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                  <div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-4">
                      {request.bloodGroup.replace('_POS','+').replace('_NEG','-')} <span className="text-red-600">Needed</span>
                    </h1>
                    <div className="flex items-center gap-4 text-gray-500 italic font-bold">
                       <MapPin className="w-5 h-5 text-red-500" />
                       <span className="text-lg">{request.thana ? `${request.thana}, ` : ''}{request.district}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center min-w-[160px]">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Volume Required</p>
                    <p className="text-4xl font-black text-gray-900 italic tracking-tighter">{request.units} <span className="text-lg opacity-30">Units</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-t border-gray-50 pt-10">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase italic mb-1">Time Criticality</p>
                        <p className="text-sm font-bold text-gray-700 italic">Deadline: {new Date(request.deadline).toLocaleString()}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <Droplets className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase italic mb-1">Clinical Details</p>
                        <p className="text-sm font-bold text-gray-700 italic">{request.hemoglobin ? `Hb: ${request.hemoglobin} g/dL` : 'No Hb Data'}</p>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase italic mb-4 flex items-center gap-2">
                            <User size={12} className="text-red-500" />
                            Patient Information
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b border-gray-200/50 pb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Name</span>
                                <span className="text-xs font-black text-gray-900 italic uppercase">{request.patientName || 'Private'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/50 pb-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Age/Gender</span>
                                <span className="text-xs font-black text-gray-900 italic uppercase">
                                    {request.patientAge || 'N/A'}Y / {request.patientGender || 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Relationship</span>
                                <span className="text-xs font-black text-gray-900 italic uppercase">{request.relationship || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase italic mb-4 flex items-center gap-2">
                            <AlertCircle size={12} className="text-red-500" />
                            Condition Details
                        </p>
                        <p className="text-xs font-bold text-gray-600 italic leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                            {request.patientCondition || 'Emergency blood required for patient support.'}
                        </p>
                    </div>
                </div>

                {request.notes && (
                  <div className="bg-red-50/30 p-8 rounded-[2rem] border border-red-50 relative">
                    <Info className="absolute top-8 left-8 w-12 h-12 text-red-500/5" />
                    <p className="text-lg font-bold text-gray-600 italic leading-relaxed pl-10">"{request.notes}"</p>
                  </div>
                )}
              </div>

              {/* Background Decoration */}
              <div className="absolute -bottom-20 -right-20 opacity-[0.03] select-none pointer-events-none">
                <Droplets className="w-96 h-96" />
              </div>
            </div>

            {/* SHORTLISTED DONORS (AUTHORIZED ONLY) */}
            {isAuthorized ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-2xl font-black italic uppercase text-gray-900 tracking-tighter">Matching Heroes <span className="text-red-500">Shortlist</span></h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Live Matches</span>
                  </div>
                </div>

                {isLoadingShortlist ? (
                  <div className="bg-white rounded-[3rem] p-20 flex flex-col items-center justify-center border border-gray-100">
                    <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
                    <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Identifying Candidates...</p>
                  </div>
                ) : shortlistedDonors?.length > 0 ? (
                  <div className="overflow-x-auto pb-4">
                    <table className="w-full text-left bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                      <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Identifier</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Location</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Experience</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest italic">Last Donation</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest italic text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {shortlistedDonors.map((donor: any) => (
                          <tr key={donor.id} className="hover:bg-gray-50/80 transition-all group">
                            <td className="px-8 py-6">
                              <Link href={`/donors/${donor.id}`} className="font-black text-gray-900 uppercase italic text-sm hover:text-red-500 transition-all flex items-center gap-2">
                                {donor.name}
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                              </Link>
                            </td>
                            <td className="px-8 py-6 text-xs text-gray-500 font-bold italic">
                              {donor.thana}, {donor.district}
                            </td>
                            <td className="px-8 py-6">
                              <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase italic border border-red-100">
                                {donor.totalDonations} Missions
                              </span>
                            </td>
                            <td className="px-8 py-6 text-xs text-gray-500 font-bold italic">
                              {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Ready'}
                            </td>
                            <td className="px-8 py-6 text-right">
                              {donor.user?.phone ? (
                                <button
                                  onClick={() => handleCopy(donor.user.phone)}
                                  className="px-6 py-2 bg-gray-900 border border-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:border-red-500 transition-all flex items-center gap-2 ml-auto active:scale-95"
                                >
                                  {donor.user.phone}
                                </button>
                              ) : (
                                <span className="text-[9px] font-black text-gray-300 uppercase italic">Contact Hidden</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white rounded-[3rem] p-16 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
                    <History className="w-12 h-12 text-gray-200 mb-6" />
                    <h4 className="text-sm font-black text-gray-900 uppercase italic mb-2">Algorithm Dry-Run</h4>
                    <p className="text-xs text-gray-400 font-bold italic max-w-sm">No available donors found matching these specific parameters currently. Try expanding your search criteria.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 bg-amber-50 rounded-[3rem] border border-amber-100 flex flex-col items-center text-center">
                <AlertCircle className="w-12 h-12 text-amber-300 mb-6" />
                <h3 className="text-sm font-black text-amber-900 uppercase italic mb-2">Restricted Access</h3>
                <p className="text-xs text-amber-700/70 font-bold italic max-w-sm leading-relaxed">
                  Confidential donor shortlist is only visible to the official seeker and verified network managers for privacy reasons.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT: Actions & Quick Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Donor Commitment Action */}
            {authUser?.role === 'DONOR' && (
              <div className="bg-white rounded-[2.5rem] p-8 border-2 border-red-50 shadow-sm space-y-4 relative overflow-hidden">
                {request.donations?.some((d: any) => d.donor?.userId === authUser.id) ? (
                  <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black italic uppercase text-gray-900 leading-tight">Mission Accepted</h4>
                    <p className="text-xs font-bold text-gray-400 italic mt-2">You are a true hero. The seeker has been notified of your commitment.</p>
                  </div>
                ) : !authUser.donorProfile?.bloodGroup ? (
                   <Link href="/dashboard?tab=profile" className="block w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest italic text-[10px] text-center">
                     Verify Blood Group to Help
                   </Link>
                ) : canDonate(authUser.donorProfile.bloodGroup, request.bloodGroup) ? (
                  <>
                    <div className="flex items-center gap-3 text-red-600 mb-2">
                      <Heart className="w-5 h-5 fill-current" />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Compatible Donor Match</span>
                    </div>
                    <h4 className="text-xl font-black italic uppercase text-gray-900 leading-tight">Can you save this life?</h4>
                    <p className="text-xs font-bold text-gray-500 italic leading-relaxed">
                      Your blood group ({authUser.donorProfile.bloodGroup.replace('_POS','+').replace('_NEG','-')}) is a match for this request.
                    </p>
                    <button
                      onClick={() => commitMutation.mutate()}
                      disabled={commitMutation.isPending}
                      className="w-full py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest italic text-[11px] hover:bg-gray-900 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                    >
                      {commitMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Droplets className="w-4 h-4 group-hover:animate-bounce" />}
                      I Can Help 🩸
                    </button>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                     <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                     <p className="text-[10px] font-black text-gray-400 uppercase italic">Incompatible Blood Group</p>
                     <p className="text-[9px] font-bold text-gray-400 mt-2 italic px-2">
                        Only compatible donors ({authUser.donorProfile.bloodGroup.replace('_POS','+').replace('_NEG','-')} cannot give to {request.bloodGroup.replace('_POS','+').replace('_NEG','-')}) can accept this mission.
                     </p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Seeker Card */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-red-600/30">
               <div className="flex items-center gap-3 mb-8 opacity-60">
                  <Phone className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic">Direct Contact Line</span>
               </div>
               <h3 className="text-4xl font-black italic uppercase mb-4 leading-none tracking-tighter">Support the Citizen</h3>
               <p className="text-[11px] font-bold text-white/70 mb-10 italic leading-relaxed">
                 You are viewing an active alert. If you are a donor or a hub manager, use the line below to coordinate immediately.
               </p>
               
               {request.contactPhone ? (
                  <a href={`tel:${request.contactPhone}`} className="block w-full py-6 bg-white text-red-700 text-center rounded-[2rem] text-[11px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-all shadow-xl shadow-black/10 active:scale-95">
                    Call: {request.contactPhone}
                  </a>
               ) : (
                  <div className="p-6 bg-white/10 rounded-[2rem] text-center border border-white/10">
                    <p className="text-[10px] font-black uppercase italic tracking-widest opacity-50">Private Request</p>
                    <p className="text-xs font-bold leading-relaxed mt-2 italic">Coordinate via verified hub channels only.</p>
                  </div>
               )}
            </div>

            {/* Hub Info */}
            {request.manager && (
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-6">Posting Authority</p>
                <div className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-red-50 transition-colors">
                    <ShieldCheck className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase italic leading-none mb-1">{request.manager.name}</h4>
                    <p className="text-[8px] font-black text-gray-400 uppercase">{request.manager.type} Network</p>
                  </div>
                </div>
                {request.manager.contactPhone && (
                  <div className="mt-8 pt-8 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase italic mb-4">Official Verification</p>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-600 italic">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       Trusted Institution
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Statistics */}
            <div className="bg-[#1a0505] rounded-[3rem] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-2xl rounded-full" />
               <h4 className="text-[10px] font-black uppercase text-white/30 tracking-widest italic mb-8">Mission Activity</h4>
               <div className="space-y-8 relative z-10">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-white/50 uppercase italic tracking-widest">Responses</p>
                    <p className="text-2xl font-black italic tracking-tighter">{request._count?.donations || 0}</p>
                 </div>
                 <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-red-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(((request._count?.donations || 0) / request.units) * 100, 100)}%` }} 
                   />
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
