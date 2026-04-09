'use client';
import { api } from '@/lib/api/axios';
import { ApiResponse, DonationHistory } from '@/lib/types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle, ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2, Search,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ManagerVerifyPage() {
  const queryClient = useQueryClient();
  const [requestId, setRequestId] = useState('');
  const [verifiedDonation, setVerifiedDonation] = useState<DonationHistory | null>(null);

  const { data: donationData, isLoading: isSearching, refetch } = useQuery<ApiResponse<DonationHistory>>({
    queryKey: ['verify-donation', requestId],
    queryFn: () => api.get(`/manager/verify/${requestId}`),
    enabled: false,
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/manager/verify/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
      queryClient.invalidateQueries({ queryKey: ['manager-inventory'] });
      setVerifiedDonation(donationData?.data || null);
      toast.success('Donation verified successfully! 🛡️💎');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Verification failed. Please check the ID.');
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestId) return;
    refetch();
  };

  const donation = donationData?.data;

  if (verifiedDonation) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000 italic px-6 pb-20">
         <div className="w-40 h-40 bg-green-500 text-white rounded-[4rem] flex items-center justify-center shadow-[0_30px_60px_-15px_rgba(34,197,94,0.4)] italic">
            <CheckCircle2 size={80} className="italic" />
         </div>
         <div className="text-center space-y-6 italic">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase text-gray-900 dark:text-white leading-none italic">Verified</h2>
            <p className="text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.4em] text-[10px] italic">SYSTEM MATRIX SYNCRONIZED</p>
         </div>
         <button 
           onClick={() => {
             setVerifiedDonation(null);
             setRequestId('');
           }}
           className="px-14 py-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-2xl active:scale-95 italic flex items-center gap-5 italic"
         >
            <ChevronLeft size={20} /> CORE RESET
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-4 md:px-0 italic">
      <div className="flex items-center gap-8 italic text-left">
        <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(220,38,38,0.3)] text-white italic">
          <ShieldCheck size={40} className="italic" />
        </div>
        <div className="italic text-left">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none italic">Asset Verify</h1>
          <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.3em] mt-3 bg-white dark:bg-white/5 px-6 py-2.5 rounded-xl border border-gray-100 dark:border-white/10 inline-block italic">SYNCHRONIZE BLOOD UNITS COLLECTION</p>
        </div>
      </div>

      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 md:p-16 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-14 relative overflow-hidden group italic">
        <form onSubmit={handleSearch} className="space-y-6 italic text-left">
           <label className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] ml-6 italic">LOG SIGNAL ID</label>
           <div className="flex flex-col sm:flex-row gap-5 italic">
              <div className="relative flex-1 italic">
                 <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-700 italic" size={24} />
                 <input 
                   type="text" 
                   value={requestId}
                   onChange={(e) => setRequestId(e.target.value)}
                   placeholder="ENTER LOG HASH..."
                   className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.2rem] py-6 pl-20 pr-10 outline-none font-black italic focus:border-red-600 dark:focus:border-red-600 transition-all shadow-inner dark:text-white uppercase tracking-widest text-xs"
                 />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="px-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-[2.2rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-2xl active:scale-95 italic flex items-center justify-center gap-5 min-h-[4.5rem]"
              >
                {isSearching ? <Loader2 size={24} className="animate-spin" /> : <ArrowRight size={24} />}
                SYNC
              </button>
           </div>
        </form>

        {donation && (
          <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700 italic">
             <div className="bg-red-600 rounded-[4rem] p-12 lg:p-16 text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(220,38,38,0.4)] group italic">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 italic">
                   <div className="flex items-center gap-10 italic">
                      <div className="w-28 h-28 bg-white rounded-[3rem] flex flex-col items-center justify-center text-red-600 shadow-2xl italic group-hover:scale-110 transition-transform">
                         <span className="text-5xl font-black italic tracking-tighter leading-none italic">{donation.donor?.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic">GROUP</span>
                      </div>
                      <div className="italic text-left">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-100/60 mb-3 italic">DONOR IDENTITY</p>
                         <h3 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter italic leading-none">{donation.donor?.name}</h3>
                         <p className="text-lg font-black text-white italic mt-3 italic opacity-80">{donation.donor?.totalDonations || 0} LOGGED DONATIONS</p>
                      </div>
                   </div>
                   <div className="text-center md:text-right italic">
                      <p className="text-[10px] font-black text-red-100/60 uppercase tracking-[0.4em] mb-3 italic">COLLECTION HUB</p>
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter italic leading-none">{donation.request?.hospitalName || 'Central Hospital'}</h4>
                      <p className="text-xs font-bold text-red-100 italic mt-3 italic tracking-widest">{donation.request?.district} GRID</p>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 blur-[120px] rounded-full italic pointer-events-none"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 italic">
                <div className="bg-white dark:bg-white/5 p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/10 flex items-center gap-10 shadow-sm italic text-left">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-white/10 rounded-[1.8rem] flex items-center justify-center shadow-inner text-red-600 italic">
                      <Activity size={32} className="italic" />
                   </div>
                   <div className="italic text-left">
                      <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-2 italic">SIGNAL STATUS</p>
                      <h3 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none italic">PENDING</h3>
                   </div>
                </div>
                <div className="bg-white dark:bg-white/5 p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/10 flex flex-col justify-center gap-3 shadow-sm italic text-left">
                   <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic">TIMESTAMP</p>
                   <p className="text-3xl font-black text-gray-900 dark:text-white italic leading-none italic">{new Date(donation.donatedAt).toLocaleDateString()}</p>
                </div>
             </div>

             <div className="bg-amber-600/10 dark:bg-amber-600/[0.05] p-12 rounded-[3.5rem] border border-amber-600/20 flex items-start gap-8 italic text-left">
                <AlertTriangle className="text-amber-600 shrink-0 italic" size={32} />
                <div className="italic">
                   <p className="text-[10px] font-black uppercase text-amber-600 tracking-[0.4em] mb-4 italic">CRITICAL CLEARANCE</p>
                   <p className="text-gray-600 dark:text-gray-400 font-medium italic text-lg leading-relaxed italic text-left">
                      Authorization required. Verify that the asset collection has been successfully executed at this facility.
                   </p>
                </div>
             </div>

             <button 
               onClick={() => verifyMutation.mutate(donation.id)}
               disabled={verifyMutation.isPending}
               className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-green-600 dark:hover:bg-green-600 dark:hover:text-white py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 italic flex items-center justify-center gap-6"
             >
                {verifyMutation.isPending ? <Loader2 size={24} className="animate-spin italic" /> : <ShieldCheck size={26} className="italic" />}
                AUTHORIZE & LOG
             </button>
          </div>
        )}

        {!donation && !isSearching && requestId && (
          <div className="text-center py-32 bg-gray-50/50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/10 italic">
             <ShieldAlert className="w-20 h-20 text-gray-200 dark:text-gray-800 mx-auto mb-8 italic" />
             <h3 className="text-3xl font-black text-gray-900 dark:text-white italic uppercase leading-none">ID NOT RECOGNIZED</h3>
             <p className="text-gray-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mt-4 italic">PLEASE CHECK LOG HASH DYNAMICS</p>
          </div>
        )}
      </div>
    </div>
  );
}
