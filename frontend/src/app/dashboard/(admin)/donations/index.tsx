'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { PaginatedResponse, DonationHistory } from '@/lib/types/models';
import { 
  History, Droplets, 
  Trash2, Search, 
  Calendar, MapPin, 
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminDonationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: donationsResponse, isLoading } = useQuery<PaginatedResponse<DonationHistory>>({
    queryKey: ['admin-donations', page],
    queryFn: () => api.get(`/admin/donations?page=${page}&limit=10`),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/donations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-donations'] });
      toast.success('Donation record deleted.');
    },
    onError: () => toast.error('Failed to delete record')
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/donations', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Donation_Records_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Donation records exported!');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const donations = donationsResponse?.data || [];
  const meta = donationsResponse?.meta;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading donations...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic">
        <div className="flex items-center gap-5 italic text-left">
          <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
            <History className="w-8 h-8 italic" />
          </div>
          <div className="italic">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none italic">Donation Records</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-1 bg-gray-100 px-3 py-1 rounded-full inline-block italic border border-gray-100 italic">View and manage all past donations</p>
          </div>
        </div>
        
        <button 
          onClick={handleExport}
          className="bg-white border border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm flex items-center gap-3 italic"
        >
          <Download size={14} className="italic" /> Export CSV
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center italic">
        <div className="relative flex-1 group w-full italic">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors italic" size={18} />
          <input 
            type="text" 
            placeholder="Search by Donor Name or Request ID..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-16 pr-6 outline-none font-bold italic focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Donation Grid */}
      <div className="grid grid-cols-1 gap-6 italic">
        {donations.map((item: DonationHistory) => (
          <div key={item.id} className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 italic">
            <div className="flex items-center gap-6 flex-1 italic text-left">
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex flex-col items-center justify-center border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm italic">
                  <Droplets className="w-6 h-6 mb-1 italic" />
                  <span className="text-[8px] font-black uppercase tracking-tighter italic italic">{item.donor?.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')}</span>
               </div>
               <div className="italic">
                  <h3 className="text-xl font-black text-gray-900 italic uppercase tracking-tight italic group-hover:text-red-600 transition-colors italic">{item.donor?.name || 'Anonymous Donor'}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 italic">
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">
                        <Calendar size={12} className="text-red-600 italic" />
                        {new Date(item.donatedAt).toLocaleDateString()}
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">
                        <MapPin size={12} className="text-red-600 italic" />
                        {item.donor?.district || 'Unknown Location'}
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-10 italic">
               <div className="text-right hidden md:block italic">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Points Awarded</p>
                  <p className="text-2xl font-black text-gray-900 italic italic italic">{item.pointsEarned} <span className="text-red-600 italic">Pts</span></p>
               </div>
               <div className="flex gap-3 italic">
                  <button 
                    onClick={() => {
                       if(confirm('Delete this donation record permanently?')) {
                          deleteMutation.mutate(item.id);
                       }
                    }}
                    className="p-4 bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all shadow-sm active:scale-95 border border-transparent italic italic"
                  >
                     <Trash2 size={20} className="italic" />
                  </button>
               </div>
            </div>
          </div>
        ))}

        {donations.length === 0 && !isLoading && (
          <div className="py-40 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 italic">
             <History className="w-20 h-20 text-gray-200 mx-auto mb-8 italic" />
             <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">No records found</h3>
             <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-4 italic">The donation database is currently empty.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-10 italic">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-8 py-3 bg-white border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 italic shadow-sm italic italic"
           >
             <ChevronLeft size={16} className="italic" /> Previous
           </button>
           <span className="text-[11px] font-black text-gray-900 italic uppercase italic italic">Page {page} of {meta.totalPages}</span>
           <button 
             disabled={page === meta.totalPages}
             onClick={() => setPage(p => p + 1)}
             className="px-8 py-3 bg-white border border-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 italic shadow-sm italic italic"
           >
             Next <ChevronRight size={16} className="italic" />
           </button>
        </div>
      )}
    </div>
  );
}
