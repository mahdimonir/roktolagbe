'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { PaginatedResponse, ManagerProfile, ApiResponse, BloodRequest } from '@/lib/types/models';
import { 
  Hospital, ShieldCheck, ShieldAlert, CheckCircle2, 
  XCircle, Search, Mail, Phone, MapPin, 
  Loader2, Award, Landmark, Building2, 
  ChevronRight, ExternalLink, Globe, X,
  Activity, Package, Users, Filter, Download, Plus
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminOrganizationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<ManagerProfile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [orgForm, setOrgForm] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    type: 'hospital', 
    district: '', 
    contactPhone: '',
    address: '' 
  });

  const { data: managersResponse, isLoading } = useQuery<PaginatedResponse<ManagerProfile>>({
    queryKey: ['admin-managers', filter, page, searchTerm],
    queryFn: () => api.get(`/admin/managers?verified=${filter === 'ALL' ? '' : filter}&page=${page}&limit=10&search=${searchTerm}`),
  });

  const { data: managerDetail, isLoading: isDetailLoading } = useQuery<ApiResponse<ManagerProfile>>({
    queryKey: ['admin-manager-detail', selectedManager?.id],
    queryFn: async () => {
      const res = await api.get(`/admin/managers/${selectedManager?.id}`);
      return res.data;
    },
    enabled: !!selectedManager,
  });

  const { mutate: toggleVerification, isPending: isVerifying } = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/managers/${id}/verify`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-manager-detail'] });
      toast.success('Hospital verify status updated.');
    },
    onError: () => toast.error('Verification update failed')
  });

  const { mutate: createManager, isPending: isCreating } = useMutation({
    mutationFn: (data: Partial<ManagerProfile> & { email?: string; password?: string }) => api.post('/admin/managers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
      setIsAdding(false);
      setOrgForm({ email: '', password: '', name: '', type: 'hospital', district: '', contactPhone: '', address: '' });
      toast.success('Hospital added.');
    },
    onError: () => toast.error('Registration failed')
  });

  const { mutate: updateManager, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ManagerProfile> & { email?: string } }) => api.patch(`/admin/managers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-manager-detail'] });
      setIsEditing(false);
      toast.success('Hospital profile updated.');
    },
    onError: () => toast.error('Update failed')
  });

  const { mutate: deleteManager, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/managers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-managers'] });
      setSelectedManager(null);
      toast.success('Hospital removed successfully.');
    },
    onError: () => toast.error('Deletion failed')
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/managers', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Hospital_List_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Data exported.');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const managers = managersResponse?.data || [];
  const meta = managersResponse?.meta;
  const managerData = managerDetail?.data;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading hospitals...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white">
               <Building2 className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">Hospitals & Organizations</h1>
               <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">Oversee all registered healthcare facilities</p>
            </div>
         </div>

         <div className="flex gap-4">
            <button 
               onClick={handleExport}
               className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95 italic"
            >
               <Download size={14} /> Export List
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 italic"
            >
               <Hospital size={16} /> Add New Hospital
            </button>
         </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center italic">
        <div className="relative group flex-1 w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
           <input 
             type="text" 
             placeholder="Search by name or district..." 
             className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-16 pr-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 transition-all"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 w-full md:w-auto">
           {['ALL', 'VERIFIED', 'PENDING'].map((f) => (
             <button 
               key={f}
               onClick={() => { setFilter(f); setPage(1); }}
               className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-xl italic' : 'text-gray-400 hover:text-gray-900'}`}
             >
                {f}
             </button>
           ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 italic">
        {managers.length > 0 ? (
          managers.map((manager: ManagerProfile) => (
            <div 
              key={manager.id} 
              className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col sm:flex-row items-center gap-10"
            >
               <div className="shrink-0 relative">
                  <div className="w-32 h-32 bg-gray-50 rounded-[2rem] flex items-center justify-center border border-gray-100 overflow-hidden relative z-10 shadow-inner">
                     {manager.logoUrl ? (
                       <img src={manager.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                     ) : (
                       <Landmark size={40} className="text-gray-300" />
                     )}
                  </div>
                  {manager.isVerified && (
                     <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shadow-lg border-4 border-white z-20">
                        <CheckCircle2 size={24} />
                     </div>
                  )}
               </div>

               <div className="flex-1 text-center sm:text-left space-y-4 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                     <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-[0.2em] border border-gray-200">
                        {manager.type}
                     </span>
                     {!manager.isVerified && (
                        <span className="bg-red-50 text-red-600 text-[9px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest border border-red-100 flex items-center gap-2">
                           <ShieldAlert size={14} /> Verification Pending
                        </span>
                     )}
                  </div>
                  
                  <h3 className="text-3xl font-black text-gray-900 italic tracking-tighter uppercase leading-none truncate italic">
                     {manager.name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest italic">
                     <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-red-600" />
                        {manager.district}
                     </div>
                     <div className="flex items-center gap-2.5 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {manager.contactPhone}
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                     <button 
                        onClick={() => setSelectedManager(manager)}
                        className="flex-1 py-4 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm border border-gray-100 italic"
                     >
                       View Details
                     </button>
                     <button 
                       onClick={() => toggleVerification(manager.id)}
                       disabled={isVerifying}
                       className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 italic ${manager.isVerified ? 'bg-red-50 text-red-600' : 'bg-red-600 text-white'}`}
                     >
                        {manager.isVerified ? 'Remove Verification' : 'Verify'}
                     </button>
                  </div>
               </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2 py-40 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 italic">
             <Landmark className="w-20 h-20 text-gray-200 mx-auto mb-8" />
             <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter">No organizations found</h3>
             <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-4">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl italic">
           <button 
             disabled={page === 1}
             onClick={() => setPage(p => p - 1)}
             className="px-8 py-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-widest"
           >
             Previous
           </button>
           <div className="text-center">
              <span className="text-2xl font-black italic uppercase tracking-tighter">Page {page} of {meta.totalPages}</span>
           </div>
           <button 
             disabled={page === meta.totalPages}
             onClick={() => setPage(p => p + 1)}
             className="px-8 py-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 italic font-black text-[10px] uppercase tracking-widest"
           >
             Next
           </button>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedManager && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] italic" onClick={() => setSelectedManager(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[50rem] bg-white z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-500 italic">
             <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-gray-400 italic">
                   <Landmark size={20} className="text-red-500" />
                   Organization Details
                </div>
                <button onClick={() => setSelectedManager(null)} className="p-4 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all">
                   <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-12 space-y-16 italic">
                {isDetailLoading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 italic">
                    <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                    <p className="text-[12px] font-black text-gray-400 uppercase tracking-widest italic">Loading details...</p>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center space-y-8 bg-white border border-gray-100 rounded-[3rem] p-16 shadow-xl relative overflow-hidden group">
                       <div className="relative w-40 h-40 bg-gray-50 p-4 rounded-[2rem] shadow-inner border border-gray-100">
                          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-gray-300 overflow-hidden">
                             {managerData?.logoUrl ? <img src={managerData.logoUrl} className="w-full h-full object-cover" /> : <Hospital size={64} />}
                          </div>
                          {managerData?.isVerified && (
                             <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                <CheckCircle2 size={24} />
                             </div>
                          )}
                       </div>
                       <div>
                          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 text-gray-900 italic">{managerData?.name}</h2>
                          <div className="flex items-center justify-center gap-4">
                             <span className="text-[10px] font-black bg-gray-900 text-white px-6 py-2 rounded-lg uppercase italic tracking-widest italic">{managerData?.type}</span>
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-lg italic">ID: #{managerData?.id?.slice(-8)}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 italic">
                       {[
                         { label: 'Staff/Members', val: managerData?._count?.members || 0, icon: <Users size={24} /> },
                         { label: 'Blood Requests', val: managerData?._count?.bloodRequests || 0, icon: <Activity size={24} /> },
                         { label: 'Access Token', val: managerData?.inviteToken, icon: <ShieldCheck size={24} />, token: true }
                       ].map((stat, i) => (
                         <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-sm">
                            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl mx-auto mb-4 flex items-center justify-center">
                               {stat.icon}
                            </div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 italic">{stat.label}</p>
                            <p className={`text-2xl font-black italic tracking-tighter ${stat.token ? 'text-red-600 select-all cursor-pointer' : 'text-gray-900'}`}>
                               {stat.val}
                            </p>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-8 italic">
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-6 italic">Recent Activity</h4>
                       <div className="space-y-4 italic">
                          {managerData?.bloodRequests && managerData.bloodRequests.length > 0 ? (
                            managerData.bloodRequests.map((req: BloodRequest) => (
                              <div key={req.id} className="p-6 bg-white border border-gray-100 rounded-[2rem] flex items-center justify-between hover:shadow-lg transition-all italic">
                                 <div className="flex items-center gap-6 italic">
                                    <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex flex-col items-center justify-center font-black text-lg border border-red-50 italic">
                                       {req.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                                    </div>
                                    <div>
                                       <p className="text-lg font-black text-gray-900 uppercase italic leading-none mb-2 italic">{req.units} Units Requested</p>
                                       <div className="flex items-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">
                                          <span className="bg-gray-50 px-2 py-1 rounded-md italic">Date: {new Date(req.createdAt).toLocaleDateString()}</span>
                                          <span className={`px-2 py-1 rounded-md border italic ${req.status === 'OPEN' ? 'border-green-200 text-green-600 bg-green-50' : 'border-gray-200 text-gray-500'}`}>
                                             {req.status}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                                 <ChevronRight className="text-gray-300" />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 italic">
                               <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">No recent activity found</p>
                            </div>
                          )}
                       </div>
                    </div>
                  </>
                )}
             </div>

             <div className="p-10 border-t border-gray-100 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.02)] space-y-4 italic">
                <div className="flex gap-4 italic">
                   <button 
                      onClick={() => {
                        if (!managerData || !managerData.user) return;
                        setOrgForm({
                           email: managerData.user.email,
                           password: '',
                           name: managerData.name,
                           type: managerData.type,
                           district: managerData.district,
                           contactPhone: managerData.contactPhone,
                           address: managerData.address || ''
                        });
                        setIsEditing(true);
                      }}
                      className="flex-[2] py-6 bg-gray-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 italic"
                   >
                      <Activity size={18} /> Edit Organization
                   </button>
                   <button 
                      onClick={() => managerData && toggleVerification(managerData.id)}
                      disabled={isVerifying}
                      className={`flex-1 py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 italic ${managerData?.isVerified ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-red-600 text-white'}`}
                   >
                      {managerData?.isVerified ? 'Unverify' : 'Verify'}
                   </button>
                </div>
                <button 
                   onClick={() => managerData && confirm('Are you sure you want to delete this hospital profile?') && deleteManager(managerData.id)}
                   disabled={isDeleting}
                   className="w-full py-4 text-gray-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest transition-all italic underline underline-offset-4"
                >
                   Remove Organization
                </button>
             </div>
          </div>
        </>
      )}

      {/* Modal */}
      {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[200] italic" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[210] shadow-2xl rounded-[3rem] p-16 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar italic flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-red-600 shadow-xl mb-10 italic">
                <Hospital size={40} />
             </div>
             <h2 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter mb-12 text-center italic">
                {isAdding ? 'Add Hospital' : 'Edit Profile'}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full italic">
                {[
                  { label: 'Hospital Name', val: orgForm.name, key: 'name', type: 'text', ph: 'Name' },
                  { label: 'Type', val: orgForm.type, key: 'type', type: 'select', items: ['hospital', 'organization', 'government'] },
                  { label: 'District', val: orgForm.district, key: 'district', type: 'text' },
                  { label: 'Phone', val: orgForm.contactPhone, key: 'contactPhone', type: 'text' },
                  { label: 'Email', val: orgForm.email, key: 'email', type: 'email' },
                  ...(isAdding ? [{ label: 'Password', val: orgForm.password, key: 'password', type: 'password' }] : [])
                ].map((input, idx) => (
                  <div key={idx} className="space-y-2 italic">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic italic">{input.label}</label>
                     {input.type === 'select' ? (
                       <select 
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 outline-none font-black italic uppercase text-xs italic"
                         value={input.val}
                         onChange={(e) => setOrgForm({...orgForm, type: e.target.value})}
                       >
                          {input.items?.map(item => (
                            <option key={item} value={item}>{item.toUpperCase()}</option>
                         ))}
                       </select>
                     ) : (
                       <input 
                         type={input.type} 
                         className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 px-6 outline-none font-bold italic focus:bg-white focus:border-red-500 transition-all italic"
                         placeholder={input.ph}
                         value={input.val}
                         onChange={(e) => setOrgForm({...orgForm, [input.key]: e.target.value})}
                       />
                     )}
                  </div>
                ))}
                <div className="md:col-span-2 space-y-2 italic">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic italic">Address</label>
                   <textarea 
                     rows={3}
                     className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-6 px-8 outline-none font-medium italic resize-none focus:bg-white focus:border-red-500 transition-all italic"
                     placeholder="Street address..."
                     value={orgForm.address}
                     onChange={(e) => setOrgForm({...orgForm, address: e.target.value})}
                   />
                </div>
             </div>

             <div className="mt-16 w-full flex gap-6 italic">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-6 bg-gray-100 text-gray-400 rounded-xl text-[12px] font-black uppercase tracking-widest italic"
                >
                   Cancel
                </button>
                <button 
                   onClick={() => isAdding ? createManager(orgForm) : (selectedManager && updateManager({ id: selectedManager.id, data: orgForm }))}
                   disabled={isCreating || isUpdating}
                   className="flex-[2] py-6 bg-red-600 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 italic flex items-center justify-center gap-4"
                >
                   {isCreating || isUpdating ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                   {isAdding ? 'Register' : 'Save Changes'}
                </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
}
