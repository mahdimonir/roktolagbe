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
    <div className="min-h-[60vh] flex flex-col justify-center items-center">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading users...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4 md:px-0 italic">
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-xl border border-gray-50 text-red-600">
               <Shield className="w-8 h-8" />
            </div>
            <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">User Management</h1>
               <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">Manage all platform users and roles</p>
            </div>
         </div>

         <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <button 
               onClick={handleExport}
               className="flex-1 xl:flex-none px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm italic"
            >
               <Download size={14} className="text-red-600" /> Export CSV
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="flex-1 xl:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 italic"
            >
               <User size={16} /> Add New User
            </button>
         </div>
      </div>

      {/* Control Module */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col xl:flex-row gap-4 items-center">
        <div className="relative group flex-1 w-full">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-colors" size={20} />
           <input 
             type="text" 
             placeholder="Search users by email or ID..." 
             className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-4 pl-16 pr-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all shadow-inner placeholder:text-gray-400"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] border border-gray-100 w-full xl:w-auto shadow-inner overflow-x-auto no-scrollbar">
           {['ALL', 'DONOR', 'MANAGER', 'ADMIN'].map((r) => (
             <button 
               key={r}
               onClick={() => { setRoleFilter(r); setPage(1); }}
               className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === r ? 'bg-gray-900 text-white shadow-xl italic' : 'text-gray-400 hover:text-gray-900'}`}
             >
                {r}
             </button>
           ))}
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-6">
        {users.length > 0 ? (
          users.map((user: UserType) => (
            <div 
              key={user.id} 
              className="bg-white p-8 rounded-[3rem] border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden"
            >
               <div className={`shrink-0 w-20 h-20 rounded-[1.2rem] flex items-center justify-center border-2 transition-all duration-500 ${!user.isActive ? 'bg-red-50 border-red-100 text-red-600 shadow-sm' : 'bg-gray-50 border-gray-50 text-gray-400 group-hover:bg-red-50 group-hover:border-red-100 group-hover:text-red-600 shadow-sm'}`}>
                  {user.role === 'ADMIN' ? <ShieldCheck size={32} /> : user.role === 'MANAGER' ? <Building2 size={32} /> : <User size={32} />}
               </div>

               <div className="flex-1 w-full text-center lg:text-left min-w-0">
                  <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                     <span className={`text-[8px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest shadow-sm ${user.role === 'ADMIN' ? 'bg-red-600 text-white' : user.role === 'MANAGER' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'}`}>
                        {user.role}
                     </span>
                     {!user.isActive && (
                        <span className="bg-red-50 text-red-600 text-[8px] font-black px-4 py-1.5 rounded-lg uppercase italic tracking-widest border border-red-100 animate-pulse">
                           Account Banned
                        </span>
                      )}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase truncate leading-none mb-3 group-hover:text-red-600 transition-colors">
                     {user.email}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic font-mono">
                     <span className="flex items-center gap-2"><Phone size={14} className="text-red-500" /> {user.phone || 'No phone'}</span>
                     <span className="flex items-center gap-2"><Clock size={14} className="text-gray-300" /> JOINED: {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full lg:w-auto shrink-0 border-t lg:border-t-0 lg:border-l border-gray-50 pt-8 lg:pt-0 lg:pl-10">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 lg:w-52 py-4.5 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-sm border border-gray-100 italic flex items-center justify-center gap-3"
                  >
                     View Profile <ChevronRight size={16} />
                  </button>
                  <button 
                    disabled={user.role === 'ADMIN' || isBanning}
                    onClick={() => toggleBan(user.id)}
                    className={`p-4 rounded-xl transition-all active:scale-90 border ${!user.isActive ? 'bg-green-600 text-white border-green-500 shadow-xl shadow-green-600/20' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100 shadow-xl shadow-red-600/5 disabled:opacity-30'}`}
                  >
                     {!user.isActive ? <UserCheck size={20} /> : <Ban size={20} />}
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="py-48 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-200">
             <ShieldAlert size={64} className="mx-auto text-gray-200 mb-8" />
             <h3 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">No users found</h3>
             <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-3">Try resetting filters or searching for someone else.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center bg-gray-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-red-600 border border-white/10">
                 <Users size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-red-500 italic">Platform Users</p>
                 <p className="text-xs font-bold text-gray-400 leading-none mt-1">{meta.total} Total Users</p>
              </div>
           </div>

           <div className="flex items-center gap-8 relative z-10">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-4 bg-white/5 rounded-xl text-white hover:bg-red-600 transition-all disabled:opacity-20 active:scale-95 border border-white/5 italic font-black text-[10px] uppercase tracking-widest"
              >
                Previous
              </button>
              <div className="text-center">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-2">Page Index</p>
                 <span className="text-2xl font-black italic uppercase tracking-tighter">PAGE {page}</span>
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-2 italic">OF {meta.totalPages}</p>
              </div>
              <button 
                disabled={page === meta.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-4 bg-white/5 rounded-xl text-white hover:bg-red-600 transition-all disabled:opacity-20 active:scale-95 border border-white/5 italic font-black text-[10px] uppercase tracking-widest"
              >
                Next
              </button>
           </div>
        </div>
      )}

      {/* User Detail Drawer */}
      {selectedUser && (
        <>
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-3xl z-[100] transition-all duration-500" onClick={() => setSelectedUser(null)} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[45rem] bg-white z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-700">
             <div className="p-10 border-b border-gray-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-red-600 shadow-xl">
                      <Shield size={22} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">User Profile Analysis</p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-4 hover:bg-red-50 hover:text-red-600 text-gray-400 rounded-xl transition-all active:scale-90">
                   <X size={22} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-16">
                {isDetailLoading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-8 animate-pulse text-gray-400">
                     <Loader2 size={48} className="text-red-600 animate-spin" />
                     <p className="text-[11px] font-black uppercase tracking-widest italic">Loading profile data...</p>
                   </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center text-center space-y-8 bg-gray-900 rounded-[4rem] p-16 text-white relative overflow-hidden shadow-2xl">
                       <div className="relative z-10 w-36 h-36 bg-white p-2 rounded-[3.5rem] shadow-2xl">
                          <div className="w-full h-full bg-red-50 rounded-[3rem] flex items-center justify-center text-red-600 overflow-hidden font-black italic text-5xl border-2 border-red-100">
                             {userData?.donorProfile?.profileImage || userData?.managerProfile?.logoUrl ? (
                               <img src={userData?.donorProfile?.profileImage || userData?.managerProfile?.logoUrl} className="w-full h-full object-cover" />
                             ) : (userData?.donorProfile?.name || userData?.email)?.slice(0, 1).toUpperCase()}
                          </div>
                       </div>
                       <div className="relative z-10">
                          <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-tight">{userData?.donorProfile?.name || userData?.managerProfile?.name || userData?.email}</h2>
                          <div className="flex items-center justify-center gap-4">
                             <span className={`text-[10px] font-black px-6 py-2 rounded-xl uppercase italic tracking-widest shadow-lg ${userData?.role === 'ADMIN' ? 'bg-red-600' : userData?.role === 'MANAGER' ? 'bg-blue-600' : 'bg-green-600'} text-white`}>{userData?.role}</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-white/5 px-6 py-2 rounded-xl border border-white/10 font-mono italic">ID: #{userData?.id?.slice(-8).toUpperCase()}</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                       <div className="bg-gray-50 p-8 rounded-[2.5rem] text-center border border-gray-100 shadow-inner group transition-all hover:bg-white">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 italic group-hover:text-red-600 transition-colors">Donation Points</p>
                          <p className="text-3xl font-black italic tracking-tighter text-gray-900">{userData?.donorProfile?.points || 0} <span className="text-[10px] uppercase text-gray-400">PTS</span></p>
                       </div>
                       <div className="bg-gray-50 p-8 rounded-[2.5rem] text-center border border-gray-100 shadow-inner group transition-all hover:bg-white">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 italic group-hover:text-red-600 transition-colors">Lives Impacted</p>
                          <p className="text-3xl font-black italic tracking-tighter text-gray-900">{userData?.donorProfile?.totalDonations || 0}</p>
                       </div>
                       <div className="bg-gray-50 p-8 rounded-[2.5rem] text-center border border-gray-100 shadow-inner group transition-all hover:bg-white">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 italic group-hover:text-red-600 transition-colors">Account Status</p>
                          <p className={`text-xl font-black italic tracking-widest italic ${userData?.isActive ? 'text-green-600' : 'text-red-600'}`}>{userData?.isActive ? 'ACTIVE' : 'BANNED'}</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-5 italic">Contact Information</h4>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl group hover:border-red-100 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-red-600 border border-gray-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                                   <Mail size={20} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Email Address</p>
                                   <span className="text-sm font-black text-gray-900 truncate block lowercase italic leading-none">{userData?.email}</span>
                                </div>
                             </div>
                             <button onClick={() => { if (userData?.email) { navigator.clipboard.writeText(userData.email); toast.success('Email Copied 📋'); } }} className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all italic">Copy</button>
                          </div>
                          <div className="flex items-center justify-between p-8 bg-gray-50 border border-gray-100 rounded-[2.5rem] shadow-inner group hover:bg-white hover:border-red-100 transition-all">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-600 border border-gray-100 shadow-sm">
                                   <Phone size={20} />
                                </div>
                                <div>
                                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Phone Number</p>
                                   <span className="text-sm font-black text-gray-900 font-mono tracking-widest">{userData?.phone || 'Not available'}</span>
                                </div>
                             </div>
                             <span className="text-[8px] font-black text-gray-400 bg-white px-4 py-2 rounded-lg border border-gray-100 uppercase tracking-widest italic">Verified</span>
                          </div>
                       </div>
                    </div>

                    <div className="pb-16 pt-8">
                       <button 
                         onClick={() => { if(userData?.id && confirm('Are you sure you want to delete this user PERMANENTLY? This cannot be undone.')) { deleteUser(userData.id); } }}
                         className="w-full py-8 bg-red-50 text-red-600 rounded-[3rem] text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-red-600 hover:text-white transition-all italic shadow-xl shadow-red-600/5 group"
                       >
                          <Trash2 size={24} className="group-hover:rotate-12 transition-transform" /> Delete User Permanently
                       </button>
                    </div>
                  </>
                )}
             </div>

             <div className="p-10 border-t border-gray-100 bg-white shrink-0 pb-12 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
                <div className="flex gap-4">
                   <button 
                      onClick={() => {
                         if (userData) {
                            setUserForm({ email: userData.email, phone: userData.phone || '', role: userData.role, password: '' });
                            setIsEditing(true);
                         }
                      }}
                      className="flex-1 py-6 bg-gray-900 text-white rounded-[2rem] text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl italic"
                   >
                      <History size={20} className="text-red-600" /> Edit User Profile
                   </button>
                   <button 
                      onClick={() => userData?.id && toggleBan(userData.id)}
                      disabled={userData?.role === 'ADMIN' || isBanning}
                      className={`flex-1 py-6 rounded-[2rem] text-[12px] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl italic disabled:opacity-30 ${!userData?.isActive ? 'bg-green-600 text-white' : 'bg-red-50 text-red-600 border border-red-100'}`}
                   >
                      {userData?.isActive ? <Ban size={20} /> : <UserCheck size={20} />}
                      {userData?.isActive ? 'Ban User' : 'Unban User'}
                   </button>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-3xl z-[200]" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[210] shadow-2xl rounded-[4rem] p-16 animate-in zoom-in duration-500 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col items-center">
             <div className="w-24 h-24 bg-gray-900 rounded-[2.5rem] flex items-center justify-center text-red-600 shadow-2xl mb-8">
                {isAdding ? <UserPlus size={44} className="text-red-600" /> : <UserCheck size={44} className="text-red-600" />}
             </div>
             <h2 className="text-4xl font-black italic uppercase text-gray-900 tracking-tighter mb-4 text-center leading-none">
                {isAdding ? 'Add New User' : 'Edit User Profile'}
             </h2>
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-16 italic text-center underline decoration-red-500 decoration-2 underline-offset-8">Administrative Tool</p>

             <div className="space-y-8 w-full">
                {[
                  { label: 'Email Address', type: 'email', val: userForm.email, key: 'email', icon: <Mail size={16} /> },
                  { label: 'Phone Number', type: 'text', val: userForm.phone, key: 'phone', icon: <Phone size={16} /> },
                  ...(isAdding ? [{ label: 'Account Password', type: 'password', val: userForm.password, key: 'password', icon: <LockIcon size={16} /> }] : [])
                ].map((input, idx) => (
                  <div key={idx} className="space-y-3">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2">{input.label}</label>
                     <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 transition-colors">{input.icon}</div>
                        <input 
                           type={input.type} 
                           className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 pl-16 pr-8 outline-none font-bold italic focus:bg-white focus:border-red-600 transition-all shadow-inner"
                           placeholder="Required"
                           value={input.val}
                           onChange={(e) => setUserForm({...userForm, [input.key]: e.target.value})}
                        />
                     </div>
                  </div>
                ))}
                
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2">System Role</label>
                   <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300"><Shield size={16} /></div>
                      <select 
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 pl-16 pr-8 outline-none font-black italic uppercase tracking-widest text-xs appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all shadow-inner"
                         value={userForm.role}
                         onChange={(e) => setUserForm({...userForm, role: e.target.value as Role})}
                      >
                         <option value="DONOR">Blood Donor</option>
                         <option value="MANAGER">Hospital Manager</option>
                         <option value="ADMIN">System Admin</option>
                      </select>
                   </div>
                </div>
             </div>

             <div className="mt-20 w-full flex gap-4">
                <button 
                  onClick={() => { setIsAdding(false); setIsEditing(false); }}
                  className="flex-1 py-6 bg-gray-100 text-gray-400 rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest italic hover:text-gray-900 transition-all"
                >
                   Cancel
                </button>
                <button 
                   onClick={() => isAdding ? createUser(userForm) : (userData?.id && updateUser({ id: userData.id, data: userForm }))}
                   disabled={isCreating || isUpdating}
                   className="flex-[2] py-6 bg-red-600 text-white rounded-[2.5rem] text-[12px] font-black uppercase tracking-widest shadow-2xl hover:bg-red-700 transition-all active:scale-95 flex items-center justify-center gap-4 italic"
                >
                   {isCreating || isUpdating ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
                   {isAdding ? 'Create User' : 'Save Changes'}
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
