'use client';

import { api } from '@/lib/api/axios';
import { ApiResponse, BloodRequest, DonorProfile, PaginatedResponse } from '@/lib/types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Activity,
   AlertTriangle,
   Calendar,
   CheckCircle2,
   Droplet,
   Globe,
   Loader2,
   MapPin,
   Phone,
   Plus,
   ShieldCheck,
   Sparkles,
   Trash2,
   Users,
   TrendingUp,
   HeartPulse,
   MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ManagerRequestsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery<PaginatedResponse<BloodRequest>>({
    queryKey: ['manager-requests'],
    queryFn: () => api.get('/blood-requests'),
  });

  const { mutate: deleteRequest, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/blood-requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
      toast.success('Request deleted successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete request.');
    }
  });

  const allRequests = requestsData?.data || [];
  const filteredRequests = filter === 'ALL' ? allRequests : allRequests.filter((r) => r.status === filter);

   if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading requests...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 px-4 md:px-0">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl border border-gray-50 text-red-600">
               <Activity className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">Blood Requests</h1>
               <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">Managing {allRequests.length} active requests</p>
            </div>
         </div>

         <div className="flex flex-wrap lg:flex-nowrap gap-4 w-full lg:w-auto">
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm grow lg:grow-0">
               {['ALL', 'OPEN', 'FULFILLED'].map((f) => (
                 <button 
                   key={f}
                   onClick={() => setFilter(f)}
                   className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-lg italic' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                 >
                    {f}
                 </button>
               ))}
            </div>
            <Link href="?tab=requests-new" className="bg-red-600 hover:bg-red-700 transition-all text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 group grow lg:grow-0 italic">
               <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
               New Request
            </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 md:px-0">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request, i: number) => {
            const responders = request.donations?.length || 0;
            const confirmed = request.donations?.filter((d) => d.status === 'VERIFIED').length || 0;
            const needed = Math.max(0, request.units - confirmed);

            return (
              <div 
                key={request.id} 
                className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                 <div className="flex flex-col xl:flex-row items-center gap-12">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-red-100/50 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                         <p className="text-4xl font-black mb-1 italic tracking-tighter leading-none">{request.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</p>
                         <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 italic">Group</span>
                      </div>
                      {request.isEmergency && (
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center animate-pulse border-4 border-white shadow-lg">
                           <AlertTriangle size={14} className="text-red-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-8">
                       <div className="flex flex-wrap items-center gap-3 justify-center xl:justify-start">
                          {request.isEmergency && (
                             <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest shadow-lg shadow-red-600/10">
                                🚨 Emergency
                             </span>
                          )}
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest border flex items-center gap-2 ${request.status === 'OPEN' ? 'border-orange-200 bg-orange-50 text-orange-600' : 'border-green-200 bg-green-50 text-green-600'}`}>
                             <div className={`w-2 h-2 rounded-full ${request.status === 'OPEN' ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                             {request.status}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Donors Responded</p>
                             <div className="flex items-center gap-3">
                                <Users size={20} className="text-gray-400" />
                                <p className="text-3xl font-black text-gray-900 leading-none italic">{responders}</p>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Confirmed Visits</p>
                             <div className="flex items-center gap-3">
                                <ShieldCheck size={20} className="text-green-500" />
                                <p className="text-3xl font-black text-gray-900 leading-none italic">{confirmed}</p>
                             </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Still Needed</p>
                             <div className="flex items-center gap-3">
                                <Droplet size={20} className="text-red-500" />
                                <p className={`text-3xl font-black leading-none italic ${needed > 0 ? 'text-red-600' : 'text-gray-900'}`}>{needed}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto">
                      <button 
                        onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}
                        className={`flex-1 xl:grow-0 px-8 py-5 rounded-2xl transition-all shadow-sm border flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest italic ${expandedId === request.id ? 'bg-gray-900 text-white border-gray-900 shadow-xl' : 'bg-white text-gray-900 border-gray-100 hover:bg-gray-50'}`}
                      >
                        {expandedId === request.id ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4 text-red-500" />}
                        {expandedId === request.id ? 'Close Details' : 'Manage Request'}
                      </button>
                      
                      <button 
                        onClick={() => { if(confirm('Are you sure you want to delete this blood request?')) deleteRequest(request.id) }} 
                        disabled={isDeleting}
                        className="p-5 bg-gray-50 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-gray-50"
                      >
                         <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                 </div>

                  {expandedId === request.id && (
                    <div className="mt-12 pt-12 border-t border-dashed border-gray-100 animate-in slide-in-from-top-6 duration-1000">
                       <RequestManagement requestId={request.id} />
                    </div>
                  )}
              </div>
            );
          })
        ) : (
          <div className="py-44 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 relative overflow-hidden group">
             <div className="relative z-10 space-y-8">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform duration-700">
                   <Globe className="w-12 h-12 text-gray-200" />
                </div>
                <div className="space-y-4">
                   <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">No active requests</h3>
                   <p className="text-gray-400 italic max-w-sm mx-auto font-medium text-sm leading-relaxed">There are currently no active blood requests found for your hospital.</p>
                </div>
                <Link href="?tab=requests-new" className="inline-flex items-center gap-4 bg-gray-900 text-white px-12 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-gray-900/40 hover:scale-105 transition-all italic active:scale-95">
                   Create New Request <Plus className="w-4 h-4" />
                </Link>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestManagement({ requestId }: { requestId: string }) {
   const queryClient = useQueryClient();
   const { data: details, isLoading } = useQuery<ApiResponse<BloodRequest>>({
      queryKey: ['request-details', requestId],
      queryFn: () => api.get(`/blood-requests/${requestId}`),
   });

   const { mutate: verify, isPending } = useMutation({
      mutationFn: (donationId: string) => api.patch(`/blood-requests/verify/${donationId}`),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['request-lifecycle'] });
         queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
         toast.success('Donation verified successfully!');
      },
      onError: (err: any) => toast.error(err.response?.data?.message || 'Verification failed')
   });

   if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
         <div className="w-10 h-10 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse italic">Loading details...</span>
      </div>
   );

   const request = details?.data;
   const commitments = request?.donations || [];

   return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
         {/* Respondents List */}
         <div className="space-y-8">
            <div className="flex items-center gap-6 mb-8">
               <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={24} />
               </div>
               <div>
                  <h4 className="text-xl font-black uppercase italic tracking-tight text-gray-900 italic leading-none">Donor Responses</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2 italic">Donors who have responded to this request</p>
               </div>
            </div>

            <div className="space-y-4">
               {commitments.length > 0 ? commitments.map((donation) => (
                  <div key={donation.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 font-black text-xs border border-gray-100 group-hover:bg-gray-900 group-hover:text-white transition-all uppercase italic">
                           {donation.donor?.name?.[0]}
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-tight text-gray-900 group-hover:text-red-600 transition-colors italic">{donation.donor?.name}</p>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 italic leading-none">{donation.status}</p>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                        <Link 
                           href={`/dashboard/messages?contactId=${donation.donor?.userId}`}
                           className="p-3 bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                           title="Contact Donor"
                        >
                           <MessageSquare size={18} />
                        </Link>

                        {donation.status === 'COMMITTED' ? (
                           <button 
                              onClick={() => verify(donation.id)}
                              disabled={isPending}
                              className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg flex items-center gap-2 italic"
                           >
                              {isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                              Verify Visit
                           </button>
                        ) : (
                           <div className="flex items-center gap-2 text-green-600 font-black text-[9px] uppercase tracking-widest italic bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                              <ShieldCheck size={14} /> FULFILLED
                           </div>
                        )}
                     </div>
                  </div>
               )) : (
                  <div className="bg-gray-50/50 py-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">No donors found yet.</p>
                  </div>
               )}
            </div>
         </div>

         {/* Suggested Donors List */}
         <div className="space-y-8">
            <div className="flex items-center gap-6 mb-8">
               <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={24} />
               </div>
               <div>
                  <h4 className="text-xl font-black uppercase italic tracking-tight text-gray-900 italic leading-none">Matching Donors</h4>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2 italic">Available donors matching this request in your area</p>
               </div>
            </div>
            <ShortlistContent requestId={requestId} />
         </div>
      </div>
   );
}

function ShortlistContent({ requestId }: { requestId: string }) {
   const { data: matches, isLoading } = useQuery<ApiResponse<DonorProfile[]>>({
      queryKey: ['shortlist', requestId],
      queryFn: () => api.get(`/blood-requests/${requestId}/shortlist`),
   });

   if (isLoading) return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
         <div className="w-10 h-10 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
         <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 animate-pulse italic">Finding matching donors...</span>
      </div>
   );

   const donors = matches?.data || [];

   if (donors.length === 0) return (
      <div className="bg-gray-50/50 py-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">No matching donors found in this area.</p>
      </div>
   );

   return (
      <div className="grid grid-cols-1 gap-4">
         {donors.map((donor) => (
            <div key={donor.id} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex flex-col items-center justify-center text-red-600 font-black shrink-0 border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm">
                     <span className="text-xl italic leading-none">{donor.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')}</span>
                  </div>
                  <div>
                     <p className="text-xs font-black uppercase tracking-tight text-gray-900 group-hover:text-red-700 transition-colors truncate italic">{donor.name}</p>
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1.5 italic">{donor.district} • {donor.thana}</p>
                  </div>
               </div>
               <a 
                 href={`tel:${donor.user?.phone}`} 
                 className="w-11 h-11 bg-gray-900 text-white rounded-[1rem] flex items-center justify-center hover:bg-red-600 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-gray-900/20 shrink-0"
               >
                  <Phone size={16} fill="currentColor" />
               </a>
            </div>
         ))}
      </div>
   );
}
