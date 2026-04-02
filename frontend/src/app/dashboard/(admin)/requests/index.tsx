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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl text-white">
            <Droplets className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">Blood Requests</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">Overview of all blood requests</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full xl:w-auto italic">
            <button 
               onClick={handleExport}
               className="flex-1 xl:flex-none px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm italic"
            >
               <Download size={16} className="text-red-600" /> Export List
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="flex-1 xl:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 italic"
            >
               <Plus size={16} /> New Request
            </button>
         </div>
      </div>

      {/* Search Module */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 italic">
        <div className="relative group flex-1 italic">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 focus-within:text-red-600 transition-colors italic" size={20} />
           <input 
             type="text" 
             placeholder="Search by Hospital or District..." 
             className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-4 pl-16 pr-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 transition-all shadow-inner"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Requests Feed */}
      <div className="grid grid-cols-1 gap-6 italic">
         {requests.length > 0 ? (
           requests.map((request: BloodRequest) => (
             <div 
               key={request.id} 
               onClick={() => setSelectedRequest(request)}
               className="bg-white p-8 rounded-[3rem] border border-gray-100 hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 cursor-pointer italic"
             >
                {/* Blood Group */}
                <div className="shrink-0 italic">
                   <div className={`w-24 h-24 rounded-[2.2rem] flex flex-col items-center justify-center border-2 transition-all shadow-sm italic ${request.isEmergency ? 'bg-red-600 text-white border-red-500' : 'bg-gray-50 text-gray-900 border-gray-100'}`}>
                      <p className="text-3xl font-black italic tracking-tighter leading-none italic">{request.bloodGroup.replace(/_POS/g, '+').replace(/_NEG/g, '-')}</p>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic mt-1 italic">Group</span>
                   </div>
                </div>

                <div className="flex-1 space-y-4 text-center lg:text-left min-w-0 italic">
                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 italic">
                      <span className="bg-gray-900 text-white text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest italic shadow-lg">
                         {request.units} Units Needed
                      </span>
                      <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest border italic ${
                        request.status === 'OPEN' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                         {request.status} REQUEST
                      </span>
                      {request.isEmergency && (
                        <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest flex items-center gap-2 italic shadow-xl shadow-red-600/10">
                           <AlertTriangle size={12} /> EMERGENCY
                        </span>
                      )}
                   </div>
                   <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none truncate group-hover:text-red-600 transition-colors italic">
                       {request.hospitalName || 'Emergency Request'}
                   </h3>
                   
                   {/* Progress */}
                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 italic">
                      <div className="flex items-center gap-2 italic">
                         <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Donors: <span className="text-gray-900 italic">{request.donations?.length || 0}</span></p>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 italic">
                         <ShieldCheck size={14} />
                         <p className="text-[10px] font-black uppercase tracking-widest italic">Donated: <span className="text-gray-900 italic">{request.donations?.filter((d: DonationHistory) => d.status === 'VERIFIED').length || 0}</span></p>
                      </div>
                      <div className="flex items-center gap-2 text-red-500 italic">
                         <Droplets size={14} />
                         <p className="text-[10px] font-black uppercase tracking-widest italic">Needed: <span className="text-gray-900 italic">{Math.max(0, request.units - (request.donations?.filter((d: DonationHistory) => d.status === 'VERIFIED').length || 0))}</span></p>
                      </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-[10px] font-black text-gray-400 uppercase tracking-widest italic pt-2 italic">
                      <div className="flex items-center gap-2.5 italic">
                         <MapPin className="w-4 h-4 text-red-600" />
                         <span className="italic">{request.district}, {request.thana || 'Central'}</span>
                      </div>
                      <div className="flex items-center gap-2.5 italic">
                         <Clock className="w-4 h-4 text-gray-300" />
                         <span className="italic">Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-gray-50 pt-8 lg:pt-0 lg:pl-10 italic">
                   <button className="flex-1 lg:w-52 py-4.5 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm border border-gray-100 italic flex items-center justify-center gap-2 italic">
                      View Details <ChevronRight size={18} />
                   </button>
                </div>
             </div>
           ))
         ) : (
           <div className="py-40 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 italic">
              <ShieldAlert size={72} className="mx-auto text-gray-200 mb-8" />
              <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">No requests found</h3>
              <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-4 italic">There are currently no active blood requests.</p>
           </div>
         )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl italic">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-8 py-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-widest shadow-sm italic"
           >
             Previous
           </button>
           <div className="text-center italic">
              <span className="text-2xl font-black italic uppercase tracking-tighter italic">Page {page} of {meta.totalPages}</span>
           </div>
           <button 
             disabled={page === meta.totalPages}
             onClick={() => setPage(p => p + 1)}
             className="px-8 py-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-widest shadow-sm italic"
           >
             Next
           </button>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] italic" onClick={() => setSelectedRequest(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[45rem] bg-white z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-700 italic">
             <div className="p-10 border-b border-gray-100 flex items-center justify-between shrink-0 italic">
                <div className="flex items-center gap-6 italic">
                   <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-xl italic">
                      <FileText size={24} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Request Summary</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-4 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-xl transition-all">
                   <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-12 space-y-16 italic">
                <div className="space-y-10 italic">
                   <div className="flex flex-col items-center text-center space-y-8 bg-red-600 rounded-[3rem] p-16 text-white relative overflow-hidden shadow-2xl italic">
                      <div className="relative z-10 w-36 h-36 bg-white p-3 rounded-[3rem] shadow-2xl italic">
                         <div className="w-full h-full bg-red-50 rounded-[2.5rem] flex flex-col items-center justify-center text-red-600 shadow-inner border border-red-100 italic">
                            <span className="text-5xl font-black italic tracking-tighter leading-none italic">{selectedRequest.bloodGroup.replace(/_POS/g, '+').replace(/_NEG/g, '-')}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-50 italic">Group</span>
                         </div>
                      </div>
                      <div className="relative z-10 italic">
                         <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-tight italic">{selectedRequest.units} Units Required</h2>
                         <div className="flex items-center justify-center gap-6 mt-6 italic">
                            <span className="text-[11px] font-black bg-white/20 text-white px-6 py-2.5 rounded-xl uppercase italic tracking-widest border border-white/20 italic">{selectedRequest.urgency} PRIORITY</span>
                            <span className="text-[10px] font-black text-red-100 uppercase tracking-widest italic">ID: #{selectedRequest.id?.slice(-8).toUpperCase()}</span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-8 italic">
                      <div className="bg-gray-50 p-10 rounded-[2.5rem] flex items-center gap-6 border border-gray-100 italic">
                         <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm italic">
                            <Stethoscope size={28} />
                         </div>
                         <div className="italic">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Patient Condition</p>
                            <p className="text-lg font-black text-gray-900 uppercase italic italic">{selectedRequest.patientCondition || 'Not Specified'}</p>
                         </div>
                      </div>
                      <div className="bg-gray-50 p-10 rounded-[2.5rem] flex items-center gap-6 border border-gray-100 italic">
                         <div className="w-14 h-14 bg-white text-red-600 rounded-2xl flex items-center justify-center shadow-sm italic">
                            <Thermometer size={28} />
                         </div>
                         <div className="italic">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Hemoglobin</p>
                            <p className="text-lg font-black text-gray-900 uppercase italic italic">{selectedRequest.hemoglobin || '0.0'} g/dL</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-8 italic">
                   <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-5 italic">Location & Hospital</h4>
                   <div className="space-y-6 italic">
                      <div className="p-10 bg-white border border-gray-100 rounded-[3rem] shadow-sm flex items-center gap-8 group italic">
                         <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 italic">
                            <Building2 size={28} className="text-red-600" />
                         </div>
                         <div className="italic">
                            <p className="text-xl font-black text-gray-900 uppercase italic leading-none mb-3 group-hover:text-red-600 transition-colors italic">{selectedRequest.hospitalName || 'Emergency Request'}</p>
                            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest italic">{selectedRequest.detailedAddress || 'Address not provided'}</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-8 italic">
                   <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-5 italic">Request Details</h4>
                   <div className="bg-gray-900 p-12 rounded-[3rem] space-y-8 text-white shadow-xl italic">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                         <span className="italic">Created By</span>
                         <span className="text-white italic">{selectedRequest.managerId ? `Hospital Manager` : 'System Admin'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                         <span className="italic">Contact Number</span>
                         <div className="flex items-center gap-3 italic">
                            <Phone size={14} className="text-red-600" />
                            <span className="text-white italic">{selectedRequest.contactPhone || 'Not provided'}</span>
                         </div>
                      </div>
                      <div className="pt-8 border-t border-white/10 italic">
                         <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic mb-4 italic">Additional Notes:</p>
                         <p className="text-sm font-medium italic text-gray-400 leading-relaxed italic">
                            {selectedRequest.notes || 'No additional notes provided.'}
                         </p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-10 border-t border-gray-100 bg-white pb-12 italic">
                <div className="flex gap-4 italic">
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
                      className="flex-[2] py-6 bg-gray-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 italic"
                   >
                      <Activity size={20} className="text-red-600" /> Edit Request
                   </button>
                   {selectedRequest.status === 'OPEN' && (
                     <button 
                       onClick={() => confirm('Cancel this request?') && cancelMutation.mutate(selectedRequest.id)}
                       disabled={cancelMutation.isPending}
                       className="flex-1 py-6 bg-red-50 text-red-600 rounded-[2rem] text-[12px] font-black uppercase tracking-widest border border-red-100 italic"
                     >
                       Cancel
                     </button>
                   )}
                </div>
                <button 
                   onClick={() => confirm('Delete PERMANENTLY?') && deleteRequest(selectedRequest.id)}
                   disabled={isDeleting}
                   className="w-full py-5 text-gray-300 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-all italic mt-6 italic"
                >
                   Delete Request
                </button>
             </div>
          </div>
        </>
      )}

      {/* Form Dialog */}
      {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] italic" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[210] shadow-2xl rounded-[3rem] p-16 animate-in zoom-in duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar italic flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-red-600 shadow-xl mb-8 italic">
                <Activity size={40} />
             </div>
             <h2 className="text-3xl font-black italic uppercase text-gray-900 tracking-tighter mb-4 text-center leading-none italic">
                {isAdding ? 'Create Request' : 'Edit Request'}
             </h2>
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-12 italic text-center italic">Management Tool</p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full italic">
                {[
                  { label: 'Blood Group', val: requestForm.bloodGroup, key: 'bloodGroup', type: 'select', items: ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'], icons: true },
                  { label: 'Units Required', val: requestForm.units, key: 'units', type: 'number' },
                  { label: 'Urgency', val: requestForm.urgency, key: 'urgency', type: 'select', items: ['NORMAL', 'URGENT', 'EMERGENCY'] },
                  { label: 'Hospital Name', val: requestForm.hospitalName, key: 'hospitalName', type: 'text', ph: 'Name' },
                  { label: 'District', val: requestForm.district, key: 'district', type: 'text' },
                  { label: 'Phone', val: requestForm.contactPhone, key: 'contactPhone', type: 'text' },
                  { label: 'Condition', val: requestForm.patientCondition, key: 'patientCondition', type: 'text' }
                ].map((input, idx) => (
                  <div key={idx} className="space-y-3 italic">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">{input.label}</label>
                     {input.type === 'select' ? (
                        <select 
                          className="w-full bg-gray-50 border border-gray-100 rounded-[1.8rem] py-5 px-10 outline-none font-black italic uppercase tracking-widest text-[11px] appearance-none focus:bg-white focus:border-red-600 transition-all font-mono italic"
                          value={input.val}
                          onChange={(e) => setRequestForm({...requestForm, [input.key]: e.target.value})}
                        >
                           {input.items?.map(item => (
                             <option key={item} value={item}>{input.icons ? item.replace('_POS', '+').replace('_NEG', '-') : item}</option>
                           ))}
                        </select>
                     ) : (
                       <input 
                         type={input.type} 
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-bold italic focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                         placeholder={input.ph || ''}
                         value={input.val}
                         onChange={(e) => setRequestForm({...requestForm, [input.key]: input.type === 'number' ? parseInt(e.target.value) : e.target.value})}
                       />
                     )}
                  </div>
                ))}
                
                <div className="md:col-span-2 flex items-center gap-6 bg-red-50 p-8 rounded-[2.5rem] border border-red-100 hover:border-red-600 transition-all cursor-pointer italic" onClick={() => setRequestForm({...requestForm, isEmergency: !requestForm.isEmergency})}>
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all italic ${requestForm.isEmergency ? 'bg-red-600 text-white shadow-xl' : 'bg-white text-gray-300 border border-gray-100'}`}>
                      <AlertTriangle size={30} />
                   </div>
                   <div className="flex-1 italic">
                      <p className={`text-[12px] font-black uppercase tracking-widest italic italic ${requestForm.isEmergency ? 'text-red-900' : 'text-gray-400'}`}>Emergency Marker</p>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">Mark this request as an urgent emergency.</p>
                   </div>
                </div>

                <div className="md:col-span-2 space-y-3 italic">
                   <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">Additional Notes</label>
                   <textarea 
                     rows={3}
                     className="w-full bg-gray-50 border border-transparent rounded-[2rem] py-6 px-10 outline-none font-medium italic resize-none focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                     placeholder="Notes for donors..."
                     value={requestForm.notes}
                     onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                   />
                </div>
             </div>

             <div className="mt-16 w-full flex gap-6 italic">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-6 bg-gray-100 text-gray-400 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest italic"
                >
                   Cancel
                </button>
                <button 
                   onClick={() => isAdding ? createRequest(requestForm) : (selectedRequest?.id && updateRequest({ id: selectedRequest.id, data: requestForm }))}
                   disabled={isCreating || isUpdating}
                   className="flex-[2] py-6 bg-red-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-xl active:scale-95 italic flex items-center justify-center gap-4"
                >
                   {isCreating || isUpdating ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                   {isAdding ? 'Create' : 'Save'}
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
