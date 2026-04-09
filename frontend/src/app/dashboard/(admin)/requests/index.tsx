'use client';
import { api } from '@/lib/api/axios';
import { BloodRequest, DonationHistory, PaginatedResponse } from '@/lib/types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Activity,
   AlertTriangle,
   Building2,
   ChevronRight,
   Clock,
   Download,
   Droplets,
   FileText,
   Loader2,
   MapPin,
   Phone,
   Plus,
   Search,
   ShieldAlert,
   ShieldCheck,
   Stethoscope, Thermometer,
   X
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminRequests() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [requestForm, setRequestForm] = useState({ 
    bloodGroup: 'A_POS', 
    units: 1, 
    urgency: 'NORMAL', 
    isEmergency: false,
    hospitalName: '', 
    district: '', 
    thana: '',
    contactPhone: '',
    patientCondition: '',
    hemoglobin: '',
    notes: '' 
  });

  const { data: requestsResponse, isLoading } = useQuery<PaginatedResponse<BloodRequest>>({
    queryKey: ['admin-requests', page, searchTerm],
    queryFn: () => api.get(`/admin/requests?page=${page}&limit=10&search=${searchTerm}`),
  });

  const cancelMutation = useMutation({
    mutationFn: (requestId: string) => api.patch(`/blood-requests/${requestId}`, { status: 'CANCELLED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      setSelectedRequest(null);
      toast.success('Request cancelled successfully.');
    },
    onError: () => toast.error('Failed to cancel request.')
  });

  const { mutate: createRequest, isPending: isCreating } = useMutation({
    mutationFn: (data: Partial<typeof requestForm>) => api.post('/admin/requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      setIsAdding(false);
      setRequestForm({ bloodGroup: 'A_POS', units: 1, urgency: 'NORMAL', isEmergency: false, hospitalName: '', district: '', thana: '', contactPhone: '', patientCondition: '', hemoglobin: '', notes: '' });
      toast.success('Request created successfully!');
    },
    onError: () => toast.error('Failed to create request.')
  });

  const { mutate: updateRequest, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof requestForm> }) => api.patch(`/admin/requests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      setIsEditing(false);
      toast.success('Request updated successfully!');
    },
    onError: () => toast.error('Failed to update request.')
  });

  const { mutate: deleteRequest, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/requests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] });
      setSelectedRequest(null);
      toast.success('Request deleted successfully.');
    },
    onError: () => toast.error('Failed to delete request.')
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/requests', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Blood_Requests_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Data exported successfully!');
    } catch (err) {
      toast.error('Failed to export report.');
    }
  };

  const requests = requestsResponse?.data || [];
  const meta = requestsResponse?.meta;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading requests...</p>
    </div>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-red-600/20 text-white shrink-0">
            <Droplets size={44} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">BLOOD REQUESTS</h1>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] mt-3 italic">SYSTEM-WIDE INVENTORY CONTROL</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 w-full xl:w-auto italic">
            <button 
               onClick={handleExport}
               className="flex-1 xl:flex-none px-10 py-5 bg-white dark:bg-[#0a0a0d] text-gray-900 dark:text-white border border-gray-100 dark:border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:border-red-600 dark:hover:border-red-600/50 transition-all shadow-sm italic group"
            >
               <Download size={18} className="text-red-500 group-hover:scale-110 transition-transform" /> EXPORT REPORT
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="flex-[2] xl:flex-none px-10 py-5 bg-red-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-red-700 transition-all shadow-2xl shadow-red-600/30 active:scale-95 italic"
            >
               <Plus size={20} /> INITIALIZE REQUEST
            </button>
         </div>
      </div>

      {/* Search Module */}
      <div className="bg-white/40 dark:bg-white/[0.02] backdrop-blur-[40px] p-6 rounded-[3rem] border border-gray-100/50 dark:border-white/5 shadow-2xl shadow-gray-200/20 dark:shadow-none flex items-center gap-6 italic">
        <div className="relative group flex-1 italic">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700 group-focus-within:text-red-600 transition-colors italic" size={24} />
           <input 
             type="text" 
             placeholder="FILTER BY HOSPITAL, DISTRICT, OR IDENTITY..." 
             className="w-full bg-gray-50/50 dark:bg-white/5 border border-transparent rounded-[2rem] py-6 pl-20 pr-10 outline-none font-black italic text-xs tracking-tighter placeholder:text-gray-300 dark:placeholder:text-gray-800 focus:bg-white dark:focus:bg-white/10 focus:border-red-600/20 dark:text-white transition-all shadow-inner"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Requests Feed */}
      <div className="grid grid-cols-1 gap-8 italic">
         {requests.length > 0 ? (
           requests.map((request: BloodRequest) => (
             <div 
               key={request.id} 
               onClick={() => setSelectedRequest(request)}
               className="bg-white dark:bg-[#0a0a0d] p-10 lg:p-12 rounded-[4rem] border border-gray-100 dark:border-white/5 hover:border-red-600/30 dark:hover:border-red-600/30 hover:shadow-2xl hover:shadow-red-600/5 transition-all duration-700 group relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 cursor-pointer italic"
             >
                {/* Blood Group */}
                <div className="shrink-0 italic">
                   <div className={`w-28 h-28 rounded-[2.8rem] flex flex-col items-center justify-center border-2 transition-all shadow-2xl italic ${request.isEmergency ? 'bg-red-600 text-white border-red-500 shadow-red-600/20' : 'bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white border-gray-100 dark:border-white/10'}`}>
                      <p className="text-4xl font-black italic tracking-tighter leading-none italic">{request.bloodGroup.replace(/_POS/g, '+').replace(/_NEG/g, '-')}</p>
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 italic mt-2 italic">GROUP</span>
                   </div>
                </div>

                <div className="flex-1 space-y-6 text-center lg:text-left min-w-0 italic">
                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 italic">
                      <span className="bg-gray-900 dark:bg-white text-white dark:text-black text-[9px] font-black px-5 py-2 rounded-xl uppercase italic tracking-[0.2em] italic shadow-xl">
                         {request.units} UNITS REQUIRED
                      </span>
                      <span className={`text-[9px] font-black px-5 py-2 rounded-xl uppercase italic tracking-[0.2em] border italic ${
                        request.status === 'OPEN' ? 'bg-green-50/50 dark:bg-green-600/10 text-green-600 dark:text-green-400 border-green-100/50 dark:border-green-600/20' : 'bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-600 border-gray-100 dark:border-white/10'
                      }`}>
                         {request.status} PROTOCOL
                      </span>
                      {request.isEmergency && (
                        <span className="bg-red-600 text-white text-[9px] font-black px-5 py-2 rounded-xl uppercase italic tracking-[0.2em] flex items-center gap-3 italic shadow-xl shadow-red-600/20">
                           <AlertTriangle size={14} /> CRITICAL
                        </span>
                      )}
                   </div>
                   <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none truncate group-hover:text-red-600 transition-colors italic">
                       {request.hospitalName || 'UNIDENTIFIED UNIT'}
                   </h3>
                   
                   {/* Progress Indicators */}
                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 pt-4 italic border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-3 italic">
                         <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-glow shadow-blue-500/50"></div>
                         <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.2em] italic">VOLUNTEERS: <span className="text-gray-900 dark:text-white italic">{request.donations?.length || 0}</span></p>
                      </div>
                      <div className="flex items-center gap-3 text-green-600 dark:text-green-400 italic">
                         <ShieldCheck size={18} />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">FULFILLED: <span className="text-gray-900 dark:text-white italic">{request.donations?.filter((d: DonationHistory) => d.status === 'VERIFIED').length || 0}</span></p>
                      </div>
                      <div className="flex items-center gap-3 text-red-600 italic">
                         <Droplets size={18} />
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] italic">REMAINING: <span className="text-gray-900 dark:text-white italic">{Math.max(0, request.units - (request.donations?.filter((d: DonationHistory) => d.status === 'VERIFIED').length || 0))}</span></p>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] italic pt-4 italic">
                      <div className="flex items-center gap-3 italic">
                         <MapPin className="w-4 h-4 text-red-600" />
                         <span className="italic">{request.district} // {request.thana || 'ZONE CENTRAL'}</span>
                      </div>
                      <div className="flex items-center gap-3 italic">
                         <Clock className="w-4 h-4 text-gray-300 dark:text-gray-800" />
                         <span className="italic">TIMESTAMP: {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-gray-50 dark:border-white/5 pt-10 lg:pt-0 lg:pl-12 italic">
                   <button className="flex-1 lg:w-60 py-6 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[2rem] hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-white/10 italic flex items-center justify-center gap-4 italic group/btn">
                      UPKEEP DETAILS <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
             </div>
           ))
         ) : (
           <div className="py-48 text-center bg-gray-50 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-white/5 italic">
              <ShieldAlert size={80} className="mx-auto text-gray-200 dark:text-gray-800 mb-10" />
              <h3 className="text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter italic">ZERO RECORDS</h3>
              <p className="text-gray-400 dark:text-gray-700 italic text-[10px] font-black uppercase tracking-[0.4em] mt-6 italic">NO ACTIVE BLOOD REQUESTS DETECTED ON GRID</p>
           </div>
         )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white/40 dark:bg-white/[0.02] backdrop-blur-[40px] p-8 rounded-[3rem] border border-gray-100/50 dark:border-white/5 shadow-2xl italic">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-10 py-5 bg-white dark:bg-white/5 rounded-[1.5rem] text-gray-900 dark:text-white hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-[0.3em] shadow-sm border border-gray-100 dark:border-white/5 active:scale-95 italic"
           >
             BACKWARD
           </button>
           <div className="text-center italic">
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] mb-1 italic">GRID POSITION</p>
              <span className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white italic">{page} // {meta.totalPages}</span>
           </div>
           <button 
             disabled={page === meta.totalPages}
             onClick={() => setPage(p => p + 1)}
             className="px-10 py-5 bg-white dark:bg-white/5 rounded-[1.5rem] text-gray-900 dark:text-white hover:bg-red-600 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-[0.3em] shadow-sm border border-gray-100 dark:border-white/5 active:scale-95 italic"
           >
             FORWARD
           </button>
        </div>
      )}

      {/* Details Drawer */}
      {selectedRequest && (
        <>
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[40px] z-[100] italic transition-opacity duration-700" onClick={() => setSelectedRequest(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[48rem] bg-white dark:bg-[#0a0a0d] z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-1000 border-l border-gray-100 dark:border-white/5 italic">
             <div className="p-10 lg:p-12 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 italic">
                <div className="flex items-center gap-6 italic">
                   <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20 italic">
                      <FileText size={28} />
                   </div>
                   <div>
                      <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none">REQUEST INTEL</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-700 mt-2 italic">PROTOCOL: {selectedRequest.id?.slice(-8).toUpperCase()}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-5 hover:bg-red-50 dark:hover:bg-red-600/10 hover:text-red-600 text-gray-300 dark:text-gray-800 rounded-2xl transition-all active:scale-90">
                   <X size={28} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-16 no-scrollbar italic">
                <div className="space-y-12 italic">
                   <div className="flex flex-col items-center text-center space-y-10 bg-red-600 rounded-[4rem] p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl shadow-red-600/20 italic">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                      <div className="relative z-10 w-44 h-44 bg-white/10 backdrop-blur-3xl p-4 rounded-[3.5rem] shadow-2xl italic">
                         <div className="w-full h-full bg-white rounded-[3rem] flex flex-col items-center justify-center text-red-600 shadow-inner border border-white italic">
                            <span className="text-6xl font-black italic tracking-tighter leading-none italic">{selectedRequest.bloodGroup.replace(/_POS/g, '+').replace(/_NEG/g, '-')}</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-3 opacity-40 italic">GROUP</span>
                         </div>
                      </div>
                      <div className="relative z-10 italic">
                         <h2 className="text-5xl lg:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none italic">{selectedRequest.units} UNITS REQUIRED</h2>
                         <div className="flex flex-wrap items-center justify-center gap-6 mt-10 italic">
                            <span className="text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-2xl uppercase italic tracking-[0.3em] border border-white/20 italic">{selectedRequest.urgency} PRIORITY</span>
                            <span className={`text-[10px] font-black bg-white/20 backdrop-blur-md text-white px-8 py-3 rounded-2xl uppercase italic tracking-[0.3em] border border-white/20 italic`}>
                               {selectedRequest.status} STATUS
                            </span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 italic">
                      <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[3rem] flex items-center gap-8 border border-gray-100 dark:border-white/5 italic">
                         <div className="w-16 h-16 bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shadow-sm italic">
                            <Stethoscope size={32} />
                         </div>
                         <div className="italic">
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] mb-2 italic">PATIENT CONDITION</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white uppercase italic italic">{selectedRequest.patientCondition || 'NONE PROVIDED'}</p>
                         </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[3rem] flex items-center gap-8 border border-gray-100 dark:border-white/5 italic">
                         <div className="w-16 h-16 bg-white dark:bg-white/10 text-red-600 rounded-2xl flex items-center justify-center shadow-sm italic">
                            <Thermometer size={32} />
                         </div>
                         <div className="italic">
                            <p className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] mb-2 italic">HEMOGLOBIN</p>
                            <p className="text-xl font-black text-gray-900 dark:text-white uppercase italic italic">{selectedRequest.hemoglobin || '0.0'} G/DL</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-10 italic">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-700 border-b border-gray-100 dark:border-white/5 pb-6 italic">LOCATION LOGISTICS</h4>
                   <div className="space-y-8 italic">
                      <div className="p-12 bg-white dark:bg-[#0a0a0d] border border-gray-100 dark:border-white/5 rounded-[3.5rem] shadow-sm flex items-center gap-10 group italic">
                         <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center border border-gray-100 dark:border-white/5 italic">
                            <Building2 size={36} className="text-red-600" />
                         </div>
                         <div className="italic flex-1">
                            <p className="text-2xl font-black text-gray-900 dark:text-white uppercase italic leading-none mb-4 group-hover:text-red-600 transition-colors italic">{selectedRequest.hospitalName || 'UNSPECIFIED UNIT'}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-700 font-black uppercase tracking-[0.2em] italic">{selectedRequest.detailedAddress || 'GPS DATA NOT LOGGED'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-10 italic">
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-700 border-b border-gray-100 dark:border-white/5 pb-6 italic">COMMUNICATION INTEL</h4>
                   <div className="bg-gray-900 dark:bg-white p-14 rounded-[3.5rem] space-y-10 text-white dark:text-black shadow-2xl italic relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 dark:bg-black/5 rounded-full blur-3xl"></div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic relative z-10">
                         <span className="italic">SENDER ORIGIN</span>
                         <span className="text-white dark:text-black italic">{selectedRequest.managerId ? `PARTNER MANAGER` : 'CENTRAL ADMIN'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic relative z-10">
                         <span className="italic">SECURE LINE</span>
                         <div className="flex items-center gap-4 italic">
                            <Phone size={16} className="text-red-600" />
                            <span className="text-white dark:text-black italic">{selectedRequest.contactPhone || 'PROTECTED'}</span>
                         </div>
                      </div>
                      <div className="pt-10 border-t border-white/10 dark:border-black/5 italic relative z-10">
                         <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] italic mb-6 italic">OPERATIONAL NOTES:</p>
                         <p className="text-sm font-medium italic text-gray-400 dark:text-gray-600 leading-relaxed italic bg-white/5 dark:bg-black/5 p-8 rounded-[2rem] border border-white/5 dark:border-black/5">
                            {selectedRequest.notes || 'NO ADDITIONAL DATA PROVIDED BY SENDER.'}
                         </p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-12 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0d] pb-16 italic">
                <div className="flex flex-col sm:flex-row gap-6 italic">
                   <button 
                      onClick={() => {
                        setRequestForm({
                           bloodGroup: selectedRequest.bloodGroup,
                           units: selectedRequest.units,
                           urgency: selectedRequest.urgency,
                           isEmergency: selectedRequest.isEmergency,
                           hospitalName: selectedRequest.hospitalName,
                           district: selectedRequest.district,
                           thana: selectedRequest.thana || '',
                           contactPhone: selectedRequest.contactPhone || '',
                           patientCondition: selectedRequest.patientCondition || '',
                           hemoglobin: selectedRequest.hemoglobin || '',
                           notes: selectedRequest.notes || ''
                        });
                        setIsEditing(true);
                      }}
                      className="flex-[2] py-6 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-95 italic shadow-xl"
                   >
                      <Activity size={24} className="text-red-600" /> MODIFY REQUEST
                   </button>
                   {selectedRequest.status === 'OPEN' && (
                     <button 
                       onClick={() => confirm('CANCEL PROTOCOL?') && cancelMutation.mutate(selectedRequest.id)}
                       disabled={cancelMutation.isPending}
                       className="flex-1 py-6 bg-red-50 dark:bg-red-600/10 text-red-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] border border-red-100 dark:border-red-600/20 italic hover:bg-red-100 transition-all"
                     >
                       ABORT
                     </button>
                   )}
                </div>
                <button 
                   onClick={() => confirm('PURGE RECORD PERMANENTLY?') && deleteRequest(selectedRequest.id)}
                   disabled={isDeleting}
                   className="w-full py-6 text-gray-300 dark:text-gray-800 hover:text-red-600 text-[10px] font-black uppercase tracking-[0.4em] transition-all italic mt-8 italic"
                >
                   TERMINATE RECORD
                </button>
             </div>
          </div>
        </>
      )}

      {/* Form Dialog */}
      {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[60px] z-[200] italic transition-opacity duration-700" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white dark:bg-[#0a0a0d] z-[210] shadow-2xl rounded-[4rem] p-12 lg:p-20 animate-in zoom-in duration-700 max-h-[90vh] overflow-y-auto no-scrollbar italic flex flex-col items-center border border-gray-100 dark:border-white/5">
             <div className="w-24 h-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-600/30 mb-10 italic">
                <Activity size={44} />
             </div>
             <h2 className="text-4xl lg:text-5xl font-black italic uppercase text-gray-900 dark:text-white tracking-tighter mb-4 text-center leading-none italic">
                {isAdding ? 'INITIALIZE REQUEST' : 'MODIFY PROTOCOL'}
             </h2>
             <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] mb-16 italic text-center italic">OPERATIONAL OVERRIDE</p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full italic">
                {[
                  { label: 'BLOOD SELECTION', val: requestForm.bloodGroup, key: 'bloodGroup', type: 'select', items: ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'], icons: true },
                  { label: 'TOTAL UNITS', val: requestForm.units, key: 'units', type: 'number' },
                  { label: 'URGENCY LEVEL', val: requestForm.urgency, key: 'urgency', type: 'select', items: ['NORMAL', 'URGENT', 'EMERGENCY'] },
                  { label: 'MEDICAL FACILITY', val: requestForm.hospitalName, key: 'hospitalName', type: 'text', ph: 'ENTER UNIT NAME...' },
                  { label: 'GEOGRAPHIC DISTRICT', val: requestForm.district, key: 'district', type: 'text', ph: 'ENTER DISTRICT...' },
                  { label: 'SECURE PHONE LINE', val: requestForm.contactPhone, key: 'contactPhone', type: 'text', ph: '+880...' },
                  { label: 'CLINICAL CONDITION', val: requestForm.patientCondition, key: 'patientCondition', type: 'text', ph: 'ENTER CONDITION...' }
                ].map((input, idx) => (
                  <div key={idx} className="space-y-4 italic">
                     <label className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-8 italic px-2 italic">{input.label}</label>
                     <div className="relative group italic">
                        {input.type === 'select' ? (
                           <select 
                             className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-6 px-10 outline-none font-black italic uppercase tracking-[0.2em] text-[11px] appearance-none focus:bg-white dark:focus:bg-white/10 focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-inner dark:text-white"
                             value={input.val}
                             onChange={(e) => setRequestForm({...requestForm, [input.key]: e.target.value})}
                           >
                              {input.items?.map(item => (
                                <option key={item} value={item} className="bg-white dark:bg-[#0a0a0d]">{input.icons ? item.replace('_POS', '+').replace('_NEG', '-') : item}</option>
                              ))}
                           </select>
                        ) : (
                          <input 
                            type={input.type} 
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-6 px-10 outline-none font-black italic text-xs tracking-tighter placeholder:text-gray-300 dark:placeholder:text-gray-800 focus:bg-white dark:focus:bg-white/10 focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-inner dark:text-white"
                            placeholder={input.ph || 'REQUIRED ENTRY...'}
                            value={input.val}
                            onChange={(e) => setRequestForm({...requestForm, [input.key]: input.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                          />
                        )}
                        {input.type === 'select' && (
                           <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 dark:text-gray-700">
                              <ChevronRight className="rotate-90" size={18} />
                           </div>
                        )}
                     </div>
                  </div>
                ))}
                
                <div className="md:col-span-2 group italic">
                   <div 
                      className={`flex items-center gap-8 p-10 rounded-[3rem] border transition-all cursor-pointer italic ${requestForm.isEmergency ? 'bg-red-600/10 border-red-600 shadow-glow shadow-red-600/10' : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/10 opacity-60 hover:opacity-100'}`} 
                      onClick={() => setRequestForm({...requestForm, isEmergency: !requestForm.isEmergency})}
                   >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all italic ${requestForm.isEmergency ? 'bg-red-600 text-white shadow-xl' : 'bg-white dark:bg-white/10 text-gray-300 dark:text-gray-700 border border-gray-100 dark:border-white/5'}`}>
                         <AlertTriangle size={32} />
                      </div>
                      <div className="flex-1 italic">
                         <p className={`text-[12px] font-black uppercase tracking-[0.3em] italic italic ${requestForm.isEmergency ? 'text-red-600' : 'text-gray-400 dark:text-gray-700'}`}>CRITICAL EMERGENCY OVERRIDE</p>
                         <p className="text-[10px] font-black text-gray-400 dark:text-gray-800 uppercase tracking-[0.1em] mt-2 italic">MARK THIS REQUEST AS AN URGENT LIFE-SAVING EMERGENCY.</p>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${requestForm.isEmergency ? 'border-red-600 bg-red-600' : 'border-gray-100 dark:border-white/10'}`}>
                         {requestForm.isEmergency && <ShieldCheck size={14} className="text-white" />}
                      </div>
                   </div>
                </div>

                <div className="md:col-span-2 space-y-4 italic">
                   <label className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-8 italic px-2 italic">OPERATIONAL INTELLIGENCE (NOTES)</label>
                   <textarea 
                     rows={3}
                     className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] py-8 px-10 outline-none font-black italic text-xs tracking-tighter placeholder:text-gray-300 dark:placeholder:text-gray-800 resize-none focus:bg-white dark:focus:bg-white/10 focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-inner dark:text-white"
                     placeholder="DATA FOR RESPONDING DONORS..."
                     value={requestForm.notes}
                     onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                   />
                </div>
             </div>

             <div className="mt-20 w-full flex flex-col sm:flex-row gap-8 lg:gap-10 italic">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-8 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-700 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] italic hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-transparent dark:border-white/5"
                >
                   ABORT 
                </button>
                <button 
                   onClick={() => isAdding ? createRequest(requestForm) : (selectedRequest?.id && updateRequest({ id: selectedRequest.id, data: requestForm }))}
                   disabled={isCreating || isUpdating}
                   className="flex-[2] py-8 bg-red-600 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-6 italic"
                >
                   {isCreating || isUpdating ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={28} />}
                   {isAdding ? 'COMMIT REQUEST' : 'UPKEEP DATA'}
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
