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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-10 animate-in fade-in zoom-in duration-700 italic">
         <div className="w-32 h-32 bg-green-500 text-white rounded-[3rem] flex items-center justify-center shadow-2xl shadow-green-500/20 italic">
            <CheckCircle2 size={64} className="italic" />
         </div>
         <div className="text-center space-y-4 italic">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase text-gray-900 italic">Verify Successful</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] italic">Donation units have been added to inventory</p>
         </div>
         <button 
           onClick={() => {
             setVerifiedDonation(null);
             setRequestId('');
           }}
           className="px-12 py-5 bg-gray-900 text-white rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95 italic flex items-center gap-4"
         >
            <ChevronLeft size={16} /> New Verification
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 italic">
      <div className="flex items-center gap-6 italic">
        <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
          <ShieldCheck size={32} className="italic" />
        </div>
        <div className="italic">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none italic">Verify Donation</h1>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 bg-gray-50 px-4 py-1.5 rounded-full inline-block border border-gray-100 italic italic">Confirm blood unit collection</p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl space-y-12 relative overflow-hidden group italic">
        <form onSubmit={handleSearch} className="space-y-4 italic">
           <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">Search Donation ID</label>
           <div className="flex gap-4 italic">
              <div className="relative flex-1 italic">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 italic" size={20} />
                 <input 
                   type="text" 
                   value={requestId}
                   onChange={(e) => setRequestId(e.target.value)}
                   placeholder="Enter 24-character donation ID..."
                   className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 pl-16 pr-8 outline-none font-black italic focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                 />
              </div>
              <button 
                type="submit"
                disabled={isSearching}
                className="px-10 bg-gray-900 text-white rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl active:scale-95 italic flex items-center justify-center gap-4"
              >
                {isSearching ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
                Search
              </button>
           </div>
        </form>

        {donation && (
          <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-500 italic">
             <div className="bg-red-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl group italic">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10 italic">
                   <div className="flex items-center gap-8 italic">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex flex-col items-center justify-center text-red-600 shadow-xl italic">
                         <span className="text-4xl font-black italic tracking-tighter leading-none italic">{donation.donor?.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}</span>
                         <span className="text-[8px] font-black uppercase tracking-widest mt-1 italic">Blood Group</span>
                      </div>
                      <div className="italic">
                         <p className="text-[10px] font-black uppercase tracking-widest text-red-100 mb-2 italic">Donor Identity</p>
                         <h3 className="text-3xl font-black italic uppercase tracking-tighter italic">{donation.donor?.name}</h3>
                         <p className="text-[2xl] font-black text-white italic italic">{donation.donor?.totalDonations || 0} Donations</p>
                      </div>
                   </div>
                   <div className="text-center md:text-right italic">
                      <p className="text-[10px] font-black text-red-100 uppercase tracking-widest mb-2 italic">Donation Site</p>
                      <h4 className="text-xl font-black italic uppercase tracking-tighter italic">{donation.request?.hospitalName || 'Central Hospital'}</h4>
                      <p className="text-xs font-bold text-red-100 italic italic mt-1 italic">{donation.request?.district} District</p>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full italic"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex items-center gap-8 shadow-inner italic">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-red-600 italic">
                      <Activity size={28} className="italic" />
                   </div>
                   <div className="italic">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic italic">Verify Status</p>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none italic">Pending</h3>
                   </div>
                </div>
                <div className="bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-center gap-2 shadow-inner italic">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Donation Date</p>
                   <p className="text-2xl font-black text-gray-900 italic italic">{new Date(donation.donatedAt).toLocaleDateString()}</p>
                </div>
             </div>

             <div className="bg-amber-50 p-10 rounded-[3rem] border border-amber-100 flex items-start gap-6 italic">
                <AlertTriangle className="text-amber-600 shrink-0 italic" size={24} />
                <div className="italic">
                   <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-2 italic">Confirm Blood Unit</p>
                   <p className="text-gray-600 font-medium italic text-lg leading-relaxed px-6 italic">Please confirm that the donor has successfully donated the required blood units at your hospital.</p>
                </div>
             </div>

             <button 
               onClick={() => verifyMutation.mutate(donation.id)}
               disabled={verifyMutation.isPending}
               className="w-full bg-gray-900 text-white hover:bg-green-600 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic flex items-center justify-center gap-4"
             >
                {verifyMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={20} />}
                Confirm & Verify Donation
             </button>
          </div>
        )}

        {!donation && !isSearching && requestId && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100 italic">
             <ShieldAlert className="w-16 h-16 text-gray-200 mx-auto mb-6 italic" />
             <h3 className="text-2xl font-black text-gray-900 italic uppercase italic">ID Not Recognized</h3>
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 italic italic">Please check the donation hash and retry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
