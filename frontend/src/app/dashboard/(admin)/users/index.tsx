'use client';
import { api } from '@/lib/api/axios';
import { ApiResponse, PaginatedResponse, Role, User as UserType } from '@/lib/types/models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Ban, Building2,
   ChevronRight,
   Clock,
   Download,
   History,
   Loader2, Mail, Phone, Search,
   Shield, ShieldAlert, ShieldCheck,
   Trash2,
   Users,
   User, UserCheck, X,
   Lock
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [page, setPage] = useState(1);
  const [userForm, setUserForm] = useState({ email: '', phone: '', role: 'DONOR' as Role, password: '' });

  const { data: usersResponse, isLoading } = useQuery<PaginatedResponse<UserType>>({
    queryKey: ['admin-users', roleFilter, page, searchTerm],
    queryFn: () => api.get(`/admin/users?role=${roleFilter === 'ALL' ? '' : roleFilter}&page=${page}&limit=10&search=${searchTerm}`),
  });

  const { data: userDetail, isLoading: isDetailLoading } = useQuery<ApiResponse<UserType>>({
    queryKey: ['admin-user-detail', selectedUser?.id],
    queryFn: () => api.get(`/admin/users/${selectedUser?.id}`),
    enabled: !!selectedUser,
  });

  const { mutate: toggleBan, isPending: isBanning } = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/users/${id}/ban`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
      toast.success('User status updated successfully.');
    },
    onError: () => toast.error('Failed to update user status.')
  });

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: (data: Partial<UserType> & { password?: string }) => api.post('/admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setIsAdding(false);
      setUserForm({ email: '', phone: '', role: 'DONOR', password: '' });
      toast.success('User registered successfully!');
    },
    onError: () => toast.error('Failed to register user.')
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserType> }) => api.patch(`/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
      setIsEditing(false);
      toast.success('User profile updated successfully.');
    },
    onError: () => toast.error('Failed to update profile.')
  });

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSelectedUser(null);
      toast.success('User account deleted.');
    },
    onError: () => toast.error('Failed to delete user.')
  });

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export/users', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Users_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Users report exported successfully!');
    } catch (err) {
      toast.error('Failed to export users.');
    }
  };

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta;
  const userData = userDetail?.data;

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] italic">
       <div className="w-16 h-16 border-4 border-red-50 dark:border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-8 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse italic">Scanning user database...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-40 px-4 md:px-0 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 lg:p-14 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm italic">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-600/30 text-white italic">
               <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-2">
               <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Intelligence</h1>
               <p className="text-[9px] text-gray-400 dark:text-gray-500 font-black tracking-[0.3em] uppercase italic bg-white dark:bg-white/5 px-5 py-2 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm">GLOBAL USER REGISTRY</p>
            </div>
         </div>

         <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <button 
               onClick={handleExport}
               className="flex-1 xl:flex-none px-10 py-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white border border-gray-100 dark:border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gray-50 dark:hover:bg-red-600 transition-all shadow-sm italic active:scale-95"
            >
               <Download size={16} className="text-red-600 dark:text-inherit" /> PORT LOGS
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="flex-1 xl:flex-none px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-4 hover:bg-red-600 transition-all shadow-2xl active:scale-95 italic"
            >
               <User size={18} /> INITIALIZE USER
            </button>
         </div>
      </div>

      {/* Control Module */}
      <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm flex flex-col xl:flex-row gap-6 items-center italic">
        <div className="relative group flex-1 w-full italic">
           <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600 group-focus-within:text-red-600 transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="SCANNING BY IDENTITY..." 
             className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.8rem] py-5 pl-16 pr-10 outline-none font-black italic text-[11px] uppercase tracking-[0.2em] focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-700"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex bg-white dark:bg-white/5 p-2 rounded-[2rem] border border-gray-100 dark:border-white/10 w-full xl:w-auto shadow-sm overflow-x-auto no-scrollbar italic">
           {['ALL', 'DONOR', 'MANAGER', 'ADMIN'].map((r) => (
             <button 
               key={r}
               onClick={() => { setRoleFilter(r); setPage(1); }}
               className={`px-8 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap italic ${roleFilter === r ? 'bg-red-600 text-white shadow-xl shadow-red-600/20' : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white'}`}
             >
                {r}
             </button>
           ))}
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-10">
        {users.length > 0 ? (
          users.map((user: UserType) => (
            <div 
              key={user.id} 
              className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-10 lg:p-12 rounded-[3.5rem] border border-gray-100 dark:border-white/[0.08] hover:bg-white dark:hover:bg-white/[0.05] transition-all duration-700 group flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden italic"
            >
               <div className={`shrink-0 w-24 h-24 rounded-[1.8rem] flex items-center justify-center border transition-all duration-700 shadow-2xl ${!user.isActive ? 'bg-red-500/10 border-red-500/20 text-red-600' : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-600 group-hover:border-red-500/20 group-hover:text-red-600 italic'}`}>
                  {user.role === 'ADMIN' ? <ShieldCheck size={40} /> : user.role === 'MANAGER' ? <Building2 size={40} /> : <User size={40} />}
               </div>

               <div className="flex-1 w-full text-center lg:text-left min-w-0 italic">
                  <div className="flex items-center gap-3 justify-center lg:justify-start mb-6 italic">
                     <span className={`text-[8px] font-black px-6 py-2 rounded-xl uppercase italic tracking-[0.3em] shadow-lg border ${user.role === 'ADMIN' ? 'bg-red-600 text-white border-red-600' : user.role === 'MANAGER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white'}`}>
                        {user.role}
                     </span>
                     {!user.isActive && (
                        <span className="bg-red-600/10 text-red-600 border border-red-600/20 text-[8px] font-black px-6 py-2 rounded-xl uppercase italic tracking-[0.3em] animate-pulse">
                           SYSTEM BANNED
                        </span>
                      )}
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase truncate leading-none mb-6 group-hover:text-red-600 transition-colors">
                     {user.email}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-10 text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.25em] italic">
                     <span className="flex items-center gap-3"><Phone size={16} className="text-red-600" /> {user.phone || 'NO SECURE LINE'}</span>
                     <span className="flex items-center gap-3"><Clock size={16} /> LOGGED: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>

               <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-10 lg:pt-0 lg:pl-12 italic">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 lg:w-60 py-5 bg-white dark:bg-white/5 text-gray-900 dark:text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-[1.8rem] hover:bg-gray-900 dark:hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100 dark:border-white/10 italic flex items-center justify-center gap-4 active:scale-95"
                  >
                     OPEN DOSSIER <ChevronRight size={18} />
                  </button>
                  <button 
                    disabled={user.role === 'ADMIN' || isBanning}
                    onClick={() => toggleBan(user.id)}
                    className={`p-5 rounded-2xl transition-all active:scale-90 border shadow-2xl ${!user.isActive ? 'bg-green-600 text-white border-green-500 shadow-green-600/20' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white border-red-100 dark:border-red-500/20 shadow-red-600/5 disabled:opacity-30'}`}
                  >
                     {!user.isActive ? <UserCheck size={24} /> : <Ban size={24} />}
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="py-60 text-center bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4rem] border-4 border-dashed border-gray-200 dark:border-white/5 italic">
             <ShieldAlert size={80} className="mx-auto text-gray-200 dark:text-gray-800 mb-10 animate-pulse" />
             <h3 className="text-4xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">Negative Detection</h3>
             <p className="text-gray-400 dark:text-gray-600 italic text-[10px] font-black uppercase tracking-[0.4em] mt-6">NO AGENTS MATCHING SEARCH PARAMETERS</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-gray-900 dark:bg-white/[0.05] p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group border border-white/5 italic">
           <div className="flex items-center gap-8 relative z-10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-red-600 border border-white/10 shadow-inner">
                 <Users size={24} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 italic">PLATFORM AGENTS</p>
                 <p className="text-[11px] font-black uppercase tracking-tighter text-gray-400">{meta.total} ENTRIES RECORDED</p>
              </div>
           </div>

           <div className="flex items-center gap-10 relative z-10">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-8 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all disabled:opacity-20 active:scale-95 border border-white/5 italic"
              >
                PREVIOUS
              </button>
              <div className="text-center italic">
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.4em] mb-2">INDEX</p>
                 <span className="text-3xl font-black italic uppercase tracking-tighter text-white">{page}</span>
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mt-2 italic">OF {meta.totalPages}</p>
              </div>
              <button 
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-8 py-4 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-white hover:bg-red-600 transition-all disabled:opacity-20 active:scale-95 border border-white/5 italic"
              >
                NEXT
              </button>
           </div>
        </div>
      )}

      {/* User Detail Drawer */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[60px] z-[100] transition-all duration-700" onClick={() => setSelectedUser(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[50rem] bg-white dark:bg-[#0a0a0d] z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-1000 border-l border-gray-100 dark:border-white/5 italic">
             <div className="p-10 lg:p-12 border-b border-gray-100 dark:border-white/5 flex items-center justify-between shrink-0 italic">
                <div className="flex items-center gap-6 italic">
                   <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/30">
                      <Shield size={26} />
                   </div>
                   <div className="space-y-1">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic leading-none">Intelligence</h2>
                      <p className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-600 italic">CORE PROFILE ANALYSIS</p>
                   </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-5 hover:bg-red-50 dark:hover:bg-red-600/10 hover:text-red-600 text-gray-400 dark:text-gray-700 rounded-2xl transition-all active:scale-90 italic">
                   <X size={26} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto no-scrollbar p-12 lg:p-16 space-y-16 italic">
                {isDetailLoading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-10 animate-pulse text-gray-400 dark:text-gray-700 italic">
                     <Loader2 size={60} className="text-red-600 animate-spin" />
                     <p className="text-[12px] font-black uppercase tracking-[0.4em] italic leading-none">RETRIEVING ENCRYPTED DATA...</p>
                   </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center space-y-10 bg-gray-900 dark:bg-white/[0.03] backdrop-blur-[40px] rounded-[4.5rem] p-16 lg:p-20 text-white relative overflow-hidden shadow-2xl border border-white/5 italic">
                       <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/[0.05] rounded-full blur-[100px]"></div>
                       <div className="relative z-10 w-44 h-44 bg-white dark:bg-white/10 p-2.5 rounded-[4rem] shadow-2xl border border-white/10">
                          <div className="w-full h-full bg-red-50 dark:bg-black rounded-[3.5rem] flex items-center justify-center text-red-600 overflow-hidden font-black italic text-6xl border-2 border-red-100 dark:border-white/10">
                             {userData?.donorProfile?.profileImage || userData?.managerProfile?.logoUrl ? (
                               <img src={userData?.donorProfile?.profileImage || userData?.managerProfile?.logoUrl} className="w-full h-full object-cover" />
                             ) : (userData?.donorProfile?.name || userData?.email)?.slice(0, 1).toUpperCase()}
                          </div>
                       </div>
                       <div className="relative z-10 space-y-6">
                          <h2 className="text-4xl lg:text-6xl font-black italic uppercase tracking-tighter leading-none">{userData?.donorProfile?.name || userData?.managerProfile?.name || userData?.email}</h2>
                          <div className="flex items-center justify-center gap-5">
                             <span className={`text-[10px] font-black px-8 py-3 rounded-2xl uppercase italic tracking-[0.3em] shadow-2xl ${userData?.role === 'ADMIN' ? 'bg-red-600' : userData?.role === 'MANAGER' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>{userData?.role}</span>
                             <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.4em] bg-white/5 px-8 py-3 rounded-2xl border border-white/10 font-mono italic shadow-inner">ID: #{userData?.id?.slice(-8).toUpperCase()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 italic">
                       <div className="bg-gray-50/50 dark:bg-white/[0.02] p-10 rounded-[3rem] text-center border border-gray-100 dark:border-white/5 shadow-sm group transition-all hover:bg-white dark:hover:bg-white/5 italic">
                          <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-6 italic group-hover:text-red-600 transition-colors">CREDITS</p>
                          <p className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{userData?.donorProfile?.points || 0}</p>
                       </div>
                       <div className="bg-gray-50/50 dark:bg-white/[0.02] p-10 rounded-[3rem] text-center border border-gray-100 dark:border-white/5 shadow-sm group transition-all hover:bg-white dark:hover:bg-white/5 italic">
                          <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-6 italic group-hover:text-red-600 transition-colors">IMPACT</p>
                          <p className="text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{userData?.donorProfile?.totalDonations || 0}</p>
                       </div>
                       <div className="bg-gray-50/50 dark:bg-white/[0.02] p-10 rounded-[3rem] text-center border border-gray-100 dark:border-white/5 shadow-sm group transition-all hover:bg-white dark:hover:bg-white/5 italic">
                          <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-6 italic group-hover:text-red-600 transition-colors">STATUS</p>
                          <p className={`text-xl font-black italic tracking-[0.3em] ${userData?.isActive ? 'text-green-600' : 'text-red-600'}`}>{userData?.isActive ? 'NOMINAL' : 'INACTIVE'}</p>
                       </div>
                    </div>

                    <div className="space-y-10 italic">
                       <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-700 border-b border-gray-100 dark:border-white/5 pb-8 italic text-center lg:text-left">COMMUNICATIONS CHANNEL</h4>
                       <div className="grid grid-cols-1 gap-6 italic">
                          <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[3.5rem] shadow-xl group hover:border-red-600 transition-all gap-8 italic">
                             <div className="flex flex-col md:flex-row items-center gap-8 italic text-center md:text-left">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100 dark:border-white/10 group-hover:bg-red-600 group-hover:text-white transition-all shadow-inner">
                                   <Mail size={24} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-2 italic">ENCRYPTED MAIL</p>
                                   <span className="text-xl font-black text-gray-900 dark:text-white truncate block lowercase italic leading-none">{userData?.email}</span>
                                </div>
                             </div>
                             <button onClick={() => { if (userData?.email) { navigator.clipboard.writeText(userData.email); toast.success('Frequency Copied 📋'); } }} className="w-full md:w-auto px-10 py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all italic active:scale-95 shadow-xl">COPY PORT</button>
                          </div>
                          
                          <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/5 rounded-[3.5rem] shadow-inner group hover:bg-white dark:hover:bg-white/[0.03] hover:border-red-600 transition-all gap-8 italic">
                             <div className="flex flex-col md:flex-row items-center gap-8 italic text-center md:text-left">
                                <div className="w-16 h-16 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100 dark:border-white/10 shadow-sm">
                                   <Phone size={24} />
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-2 italic">SECURE LINE</p>
                                   <span className="text-xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">{userData?.phone || 'UNREGISTERED'}</span>
                                </div>
                             </div>
                             <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 bg-white dark:bg-white/5 px-8 py-3 rounded-2xl border border-gray-100 dark:border-white/10 uppercase tracking-[0.3em] italic shadow-sm">AUTHENTICATED</span>
                          </div>
                       </div>
                    </div>

                    <div className="pb-20 pt-10 italic">
                       <button 
                         onClick={() => { if(userData?.id && confirm('EXECUTE TERMINATION? THIS ACTION IS FINAL.')) { deleteUser(userData.id); } }}
                         className="w-full py-10 bg-red-500/10 text-red-600 rounded-[4rem] text-[12px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-6 hover:bg-red-600 hover:text-white transition-all italic shadow-2xl shadow-red-600/10 group border border-red-500/20"
                       >
                          <Trash2 size={28} className="group-hover:rotate-12 transition-transform" /> TERMINATE ENTITY PERMANENTLY
                       </button>
                    </div>
                  </>
                )}
             </div>

             <div className="p-10 lg:p-14 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0d] shrink-0 pb-16 shadow-[0_-25px_50px_rgba(0,0,0,0.05)] italic">
                <div className="flex flex-col sm:flex-row gap-6 italic">
                   <button 
                      onClick={() => {
                         if (userData) {
                            setUserForm({ email: userData.email, phone: userData.phone || '', role: userData.role, password: '' });
                            setIsEditing(true);
                         }
                      }}
                      className="flex-1 py-8 bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 transition-all shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white active:scale-95 italic"
                   >
                      <History size={24} className="text-red-600" /> MODIFY LOGS
                   </button>
                   <button 
                      onClick={() => userData?.id && toggleBan(userData.id)}
                      disabled={userData?.role === 'ADMIN' || isBanning}
                      className={`flex-1 py-8 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-6 transition-all shadow-2xl italic disabled:opacity-30 active:scale-95 ${!userData?.isActive ? 'bg-green-600 text-white' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}
                   >
                      {userData?.isActive ? <Ban size={24} /> : <UserCheck size={24} />}
                      {userData?.isActive ? 'EXECUTE BAN' : 'RESTORE ACCESS'}
                   </button>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[60px] z-[200] transition-all duration-700" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white dark:bg-[#0a0a0d] z-[210] shadow-2xl rounded-[4rem] p-12 lg:p-20 animate-in zoom-in duration-700 max-h-[90vh] overflow-y-auto no-scrollbar flex flex-col items-center border border-gray-100 dark:border-white/5 italic">
             <div className="w-24 h-24 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-red-600/30 mb-10">
                {isAdding ? <UserPlus size={44} /> : <UserCheck size={44} />}
             </div>
             <h2 className="text-4xl font-black italic uppercase text-gray-900 dark:text-white tracking-tighter mb-4 text-center leading-none">
                {isAdding ? 'INITIALIZE USER' : 'MODIFY CREDENTIALS'}
             </h2>
             <p className="text-[10px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.4em] mb-16 italic text-center">ADMINISTRATIVE OVERRIDE</p>

             <div className="space-y-10 w-full italic">
                {[
                   { label: 'NETWORK IDENTITY (EMAIL)', type: 'email', val: userForm.email, key: 'email', icon: <Mail size={18} /> },
                   { label: 'SECURE LINE (PHONE)', type: 'text', val: userForm.phone, key: 'phone', icon: <Phone size={18} /> },
                   ...(isAdding ? [{ label: 'ACCESS PROTOCOL (PASSWORD)', type: 'password', val: userForm.password, key: 'password', icon: <LockIcon size={18} /> }] : [])
                ].map((input, idx) => (
                  <div key={idx} className="space-y-4 italic">
                     <label className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-8 italic">{input.label}</label>
                     <div className="relative group italic">
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700 group-focus-within:text-red-600 transition-colors">{input.icon}</div>
                        <input 
                           type={input.type} 
                           className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-6 pl-16 pr-10 outline-none font-black italic text-xs tracking-tighter placeholder:text-gray-300 dark:placeholder:text-gray-800 focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-inner dark:text-white"
                           placeholder="REQUIRED ENTRY..."
                           value={input.val}
                           onChange={(e) => setUserForm({...userForm, [input.key]: e.target.value})}
                        />
                     </div>
                  </div>
                ))}
                
                <div className="space-y-4 italic">
                   <label className="text-[9px] font-black text-gray-400 dark:text-gray-700 uppercase tracking-[0.3em] ml-8 italic">ASSIGNED ROLE</label>
                   <div className="relative group italic">
                      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700"><Shield size={18} /></div>
                      <select 
                         className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-6 pl-16 pr-12 outline-none font-black italic uppercase tracking-[0.3em] text-[10px] appearance-none cursor-pointer focus:border-red-600 focus:ring-8 focus:ring-red-600/5 transition-all shadow-inner dark:text-white"
                         value={userForm.role}
                         onChange={(e) => setUserForm({...userForm, role: e.target.value as Role})}
                      >
                         <option className="bg-white dark:bg-[#0a0a0d]" value="DONOR">BLOOD DONOR [ACCESS: STANDARD]</option>
                         <option className="bg-white dark:bg-[#0a0a0d]" value="MANAGER">HOSPITAL MANAGER [ACCESS: PARTNER]</option>
                         <option className="bg-white dark:bg-[#0a0a0d]" value="ADMIN">SYSTEM ADMIN [ACCESS: GLOBAL]</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="mt-20 w-full flex flex-col sm:flex-row gap-6 italic">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-6 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] italic hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:text-white transition-all active:scale-95 shadow-sm border border-transparent dark:border-white/5"
                >
                   ABORT 
                </button>
                <button 
                   onClick={() => isAdding ? createUser(userForm) : (userData?.id && updateUser({ id: userData.id, data: userForm }))}
                   disabled={isCreating || isUpdating}
                   className="flex-[2] py-6 bg-red-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-600/30 hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-6 italic"
                >
                   {isCreating || isUpdating ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                   {isAdding ? 'COMMIT USER' : 'UPKEEP DATA'}
                </button>
             </div>
          </div>
        </>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
}

function UserPlus({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="16" x2="22" y1="11" y2="11" />
    </svg>
  );
}

function LockIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
