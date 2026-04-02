'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { DonationHistory, PaginatedResponse } from '@/lib/types/models';
import { 
  Calendar, MapPin, Download, Award, History, 
  Loader2, ExternalLink, Droplet, ShieldCheck,
  Zap, HeartPulse, Sparkles, TrendingUp
} from 'lucide-react';
import { generateCertificate } from '@/lib/utils/certificate';
import Link from 'next/link';

export default function DonationHistoryPage() {
  const { data, isLoading } = useQuery<PaginatedResponse<DonationHistory>>({
    queryKey: ['my-history'],
    queryFn: async () => {
      const res = await api.get('/donors/me/history');
      return res.data;
    },
  });

  const history = data?.data || [];

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading donation history...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 italic">
        <div className="flex items-center gap-6 italic">
          <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
            <History className="w-10 h-10" />
          </div>
          <div className="italic">
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none italic">Donation History</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] bg-gray-50 px-4 py-1.5 rounded-full inline-block mt-3 border border-gray-100 italic">Your past blood donations</p>
          </div>
        </div>
        
        <div className="bg-white text-gray-900 px-10 py-6 rounded-[2.5rem] shadow-xl flex items-center gap-5 border border-gray-100 relative overflow-hidden italic">
          <Award className="w-10 h-10 text-red-600 shrink-0" />
          <div className="leading-tight relative z-10 italic">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Total Donations</p>
            <p className="text-4xl font-black italic tracking-tighter italic">{history.length} <span className="text-base text-red-600 italic">Blood Donation{history.length !== 1 ? 's' : ''}</span></p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-12 italic">
        <div className="absolute left-10 md:left-[3.25rem] top-0 bottom-0 w-1 bg-gray-50 rounded-full italic"></div>

        {history.length > 0 ? (
          history.map((donation, i: number) => (
            <div 
              key={donation.id} 
              className="group relative flex flex-col md:flex-row gap-12 items-start md:items-center italic"
            >
              <div className="z-10 shrink-0 w-24 md:w-28 h-24 md:h-28 bg-white rounded-[1.5rem] border-8 border-gray-50 shadow-xl flex flex-col items-center justify-center transition-all duration-700 relative overflow-hidden italic">
                <Calendar className="w-6 h-6 text-red-600 mb-1" />
                <span className="text-[11px] font-black uppercase text-gray-900 leading-none italic">{new Date(donation.donatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">{new Date(donation.donatedAt).getFullYear()}</span>
              </div>

              <div className="flex-1 w-full bg-white p-10 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-700 relative overflow-hidden italic">
                <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10 italic">
                   <div className="text-center md:text-left space-y-4 flex-1 italic">
                      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start italic">
                         <span className="bg-gray-50 text-gray-400 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest italic border border-gray-100">#{donation.id.slice(-6).toUpperCase()}</span>
                         <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase italic tracking-widest border flex items-center gap-2 italic ${donation.status === 'VERIFIED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            {donation.status || 'LOGGED'}
                         </span>
                      </div>
                      
                      <div className="space-y-1 italic">
                         <h3 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none group-hover:text-red-600 transition-colors italic">
                            {donation.request?.hospitalName || 'Emergency Referral'}
                         </h3>
                         <div className="flex items-center gap-3 justify-center md:justify-start pt-2 italic">
                            <MapPin className="w-4 h-4 text-red-600" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{donation.request?.district} • {donation.request?.thana || 'Central'}</span>
                         </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm italic font-medium max-w-2xl bg-gray-50 p-6 rounded-2xl border border-gray-50 italic">
                        "{donation.notes || 'Thank you for your life-saving donation.'}"
                      </p>
                   </div>

                   <div className="flex flex-col sm:flex-row xl:flex-col gap-4 w-full md:w-auto xl:w-64 shrink-0 italic">
                      <button 
                         onClick={() => generateCertificate(donation.donor?.name || 'Verified Donor', donation.request?.bloodGroup || 'Blood', new Date(donation.donatedAt).toLocaleDateString())}
                         className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl active:scale-95 italic"
                      >
                         <Download size={18} /> Download Certificate
                      </button>
                      <Link 
                        href={`/dashboard/donor/card/${donation.id}`}
                        className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 italic text-center"
                      >
                         <ExternalLink size={18} /> View ID Card
                      </Link>
                   </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="ml-10 md:ml-12 py-40 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 relative overflow-hidden italic">
             <div className="max-w-md mx-auto space-y-8 relative z-10 px-8 italic">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner italic">
                   <Droplet className="w-12 h-12 text-gray-100" fill="currentColor" />
                </div>
                <div className="space-y-3 italic">
                   <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-none italic">No history found</h3>
                   <p className="text-gray-400 text-sm font-medium italic">You haven't logged any donations yet. Start your journey today.</p>
                </div>
                <Link href="/urgent-requests" className="inline-flex items-center gap-4 bg-gray-900 text-white px-12 py-5 rounded-full font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all italic">
                   Donate Now <Zap className="w-4 h-4" />
                </Link>
             </div>
          </div>
        )}
      </div>

      {/* Impact Footer */}
      {history.length > 0 && (
        <div className="mt-20 bg-gray-900 rounded-[3rem] p-16 text-center relative overflow-hidden shadow-2xl italic">
          <div className="relative z-10 space-y-10 italic">
             <div className="flex justify-center gap-6 italic">
                <HeartPulse size={32} className="text-red-600" />
             </div>
             <div className="space-y-4 italic">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Donor Impact</p>
                <h2 className="text-4xl text-white font-black tracking-tighter italic leading-none uppercase italic">"Your contribution makes a world of <br/> <span className="text-red-600 italic">difference</span>."</h2>
             </div>
             <Link href="/urgent-requests" className="text-gray-400 text-[10px] font-black uppercase tracking-widest border-b-2 border-transparent hover:border-red-600 pb-2 hover:text-white transition-all inline-block italic">
               View urgent requests →
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
