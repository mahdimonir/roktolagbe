'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { ApiResponse, Reward, Badge } from '@/lib/types/models';
import { 
  Award, ShieldCheck, ShieldAlert, Sparkles, Plus, 
  Trash2, Edit3, Globe, Zap, History, Star, 
  Search, Loader2, X, CheckCircle2, ChevronRight,
  Gift, Package, ShoppingBag, Coins, TrendingUp,
  Download, Filter, LayoutDashboard
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminBadgesPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'badges' | 'rewards'>('badges');
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Forms
  const [badgeForm, setBadgeForm] = useState({ name: '', description: '', icon: 'Star', category: 'Milestone' });
  const [rewardForm, setRewardForm] = useState({ title: '', description: '', pointsCost: 100, category: 'Health', totalStock: 50 });

  // Queries
  const { data: badgesResponse, isLoading: badgesLoading } = useQuery<ApiResponse<Badge[]>>({
    queryKey: ['admin-badges'],
    queryFn: () => api.get('/admin/badges'),
  });

  const { data: rewardsResponse, isLoading: rewardsLoading } = useQuery<ApiResponse<Reward[]>>({
    queryKey: ['admin-rewards'],
    queryFn: () => api.get('/admin/rewards'),
  });

  // Mutations
  const createBadgeMutation = useMutation({
    mutationFn: (data: typeof badgeForm) => api.post('/admin/badges', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      setIsAdding(false);
      toast.success('Badge created. 🏆');
    }
  });

  const updateBadgeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Badge> }) => api.patch(`/admin/badges/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      setIsEditing(false);
      toast.success('Badge updated. 🔄');
    }
  });

  const createRewardMutation = useMutation({
    mutationFn: (data: typeof rewardForm) => api.post('/admin/rewards', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      setIsAdding(false);
      toast.success('Reward added. 🎁');
    }
  });

  const updateRewardMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Reward> }) => api.patch(`/admin/rewards/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      setIsEditing(false);
      toast.success('Reward updated. 💎');
    }
  });

  const deleteBadgeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/badges/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      toast.success('Badge deleted.');
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/rewards/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
      toast.success('Reward deleted.');
    },
  });

  const handleExport = async () => {
    try {
      const entity = activeTab === 'badges' ? 'badges' : 'rewards';
      const response = await api.get(`/admin/export/${entity}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}_List_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Data exported. 📂');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const badges = badgesResponse?.data || [];
  const rewards = rewardsResponse?.data || [];

  if (badgesLoading || rewardsLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Header & Mode Switch */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
         <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-red-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl text-white">
               {activeTab === 'badges' ? <Award className="w-8 h-8" /> : <Gift className="w-8 h-8" />}
            </div>
            <div>
               <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">
                 {activeTab === 'badges' ? 'Badge Management' : 'Rewards System'}
               </h1>
               <div className="flex items-center gap-3 mt-3 p-1 bg-gray-100 rounded-2xl w-fit">
                 <button 
                   onClick={() => setActiveTab('badges')}
                   className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all ${activeTab === 'badges' ? 'bg-gray-900 text-white shadow-xl italic' : 'text-gray-400 hover:text-gray-900'}`}
                 >Achievements</button>
                 <button 
                   onClick={() => setActiveTab('rewards')}
                   className={`text-[9px] font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all ${activeTab === 'rewards' ? 'bg-gray-900 text-white shadow-xl italic' : 'text-gray-400 hover:text-gray-900'}`}
                 >Rewards List</button>
               </div>
            </div>
         </div>

         <div className="flex gap-4">
            <button 
               onClick={handleExport}
               className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95 italic"
            >
               <Download size={14} /> Export List
            </button>
            <button 
               onClick={() => setIsAdding(true)}
               className="px-8 py-4 bg-gray-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-red-600 transition-all shadow-xl active:scale-95 italic"
            >
               <Plus size={16} /> Add New
            </button>
         </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 italic">
        {activeTab === 'badges' ? (
          badges.map((badge: Badge) => (
            <div key={badge.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center">
               <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gray-50 text-red-600 rounded-[2.5rem] flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                     <Star size={40} className="group-hover:rotate-12 transition-transform duration-700" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xl border-2 border-white" onClick={() => { setBadgeForm({ name: badge.name, description: badge.description, icon: badge.icon, category: badge.category }); setSelectedId(badge.id); setIsEditing(true); }}>
                     <Edit3 size={14} />
                  </div>
               </div>

               <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 italic italic">{badge.category}</p>
               <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase mb-4 leading-none italic">{badge.name}</h3>
               <p className="text-[11px] text-gray-400 font-bold italic line-clamp-2 leading-relaxed mb-8 italic">{badge.description}</p>
               
               <button onClick={() => confirm('Delete badge?') && deleteBadgeMutation.mutate(badge.id)} className="mt-auto text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors flex items-center gap-2 italic">
                  <Trash2 size={12} /> Delete
               </button>
            </div>
          ))
        ) : (
          rewards.map((reward: Reward) => (
            <div key={reward.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 hover:border-red-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col italic">
               <div className="flex justify-between items-start mb-10 italic">
                  <div className="w-20 h-20 bg-gray-50 text-red-600 rounded-[2rem] flex items-center justify-center border border-gray-100 shadow-inner group-hover:scale-105 transition-transform duration-700">
                     <ShoppingBag size={36} />
                  </div>
                   <div className="flex flex-col items-end gap-3 italic">
                      <div className="flex gap-2 italic">
                         <button 
                            onClick={() => {
                               setRewardForm({ title: reward.title, description: reward.description, pointsCost: reward.pointsCost, category: reward.category, totalStock: reward.totalStock });
                               setSelectedId(reward.id);
                               setIsEditing(true);
                            }}
                            className="p-3 bg-white text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all border border-gray-100 shadow-sm active:scale-90"
                         >
                            <Edit3 size={16} />
                         </button>
                         <button onClick={() => confirm('Delete reward?') && deleteRewardMutation.mutate(reward.id)} className="p-3 bg-white text-gray-300 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all border border-gray-100 active:scale-90 shadow-sm">
                            <Trash2 size={16} />
                         </button>
                      </div>
                   </div>
               </div>
               
               <div className="flex items-center gap-3 mb-4 italic">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center italic">
                    <Coins size={18} className="text-red-600" />
                  </div>
                  <span className="text-3xl font-black text-gray-900 tracking-tighter italic italic">{reward.pointsCost} <span className="text-[11px] uppercase font-black text-gray-400 not-italic ml-1 tracking-widest italic">Points</span></span>
               </div>
               
               <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter uppercase mb-3 leading-tight truncate italic">{reward.title}</h3>
               <p className="text-[11px] text-gray-400 font-bold italic line-clamp-2 leading-relaxed mb-10 h-10 italic">{reward.description}</p>
               
               <div className="space-y-4 pt-8 border-t border-gray-100 mt-auto italic">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic">
                     <span className="text-gray-400 italic">Remaining Stock</span>
                     <span className="text-gray-900 italic">{reward.totalStock} Units</span>
                  </div>
               </div>
            </div>
          ))
        )}

        {(activeTab === 'badges' && badges.length === 0) || (activeTab === 'rewards' && rewards.length === 0) ? (
            <div className="col-span-full py-40 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 italic">
               <Zap className="w-20 h-20 text-gray-200 mx-auto mb-8" />
               <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">No items found</h3>
               <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-4 italic">No active achievements or rewards detected.</p>
            </div>
        ) : null}
      </div>

       {/* Editor Drawer */}
       {(isAdding || isEditing) && (
        <>
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] italic" onClick={() => { setIsAdding(false); setIsEditing(false); }} />
          <div className="fixed top-0 right-0 h-screen w-full md:w-[42rem] bg-white z-[110] shadow-2xl p-0 flex flex-col animate-in slide-in-from-right duration-500 italic">
             <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 italic">
                <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-gray-400 italic">
                   <div className={`w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl text-white`}>
                      {isAdding ? <Plus size={24} /> : <History size={24} />} 
                   </div>
                   Editor: {activeTab === 'badges' ? 'Badge Details' : 'Reward Details'}
                </div>
                <button onClick={() => { setIsAdding(false); setIsEditing(false); }} className="p-4 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all">
                   <X size={24} />
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-12 space-y-12 italic">
                {activeTab === 'badges' ? (
                  <div className="space-y-8 italic">
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Badge Name</label>
                        <input type="text" placeholder="e.g. Life Saver" className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic focus:bg-white focus:border-red-600 transition-all shadow-inner" value={badgeForm.name} onChange={e => setBadgeForm({...badgeForm, name: e.target.value})} />
                     </div>
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Category</label>
                        <select className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic uppercase tracking-widest text-[11px] appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all shadow-inner" value={badgeForm.category} onChange={e => setBadgeForm({...badgeForm, category: e.target.value})}>
                           <option>Milestone</option>
                           <option>Community</option>
                           <option>Special</option>
                        </select>
                     </div>
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Description</label>
                        <textarea placeholder="Description of the achievement..." className="w-full h-32 bg-gray-50 border border-transparent rounded-[2rem] py-6 px-8 outline-none font-medium italic resize-none shadow-inner focus:bg-white focus:border-red-600 transition-all" value={badgeForm.description} onChange={e => setBadgeForm({...badgeForm, description: e.target.value})} />
                     </div>
                  </div>
                ) : (
                  <div className="space-y-8 italic">
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Reward Title</label>
                        <input type="text" placeholder="e.g. Gift Voucher" className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic shadow-inner focus:bg-white focus:border-red-600 transition-all" value={rewardForm.title} onChange={e => setRewardForm({...rewardForm, title: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-8 italic">
                        <div className="space-y-3 italic">
                           <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Points Cost</label>
                           <input type="number" className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic shadow-inner focus:bg-white focus:border-red-600 transition-all" value={rewardForm.pointsCost} onChange={e => setRewardForm({...rewardForm, pointsCost: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-3 italic">
                           <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Stock Count</label>
                           <input type="number" className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic shadow-inner focus:bg-white focus:border-red-600 transition-all" value={rewardForm.totalStock} onChange={e => setRewardForm({...rewardForm, totalStock: Number(e.target.value)})} />
                        </div>
                     </div>
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Category</label>
                        <select className="w-full bg-gray-50 border border-transparent rounded-2xl py-5 px-8 outline-none font-black italic uppercase tracking-widest text-[11px] appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all shadow-inner" value={rewardForm.category} onChange={e => setRewardForm({...rewardForm, category: e.target.value})}>
                           <option>Health</option>
                           <option>Food</option>
                           <option>Lifestyle</option>
                        </select>
                     </div>
                     <div className="space-y-3 italic">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Description</label>
                        <textarea placeholder="Details about this reward..." className="w-full h-32 bg-gray-50 border border-transparent rounded-[2rem] py-6 px-8 outline-none font-medium italic resize-none shadow-inner focus:bg-white focus:border-red-600 transition-all" value={rewardForm.description} onChange={e => setRewardForm({...rewardForm, description: e.target.value})} />
                     </div>
                  </div>
                )}

                <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 shadow-inner flex items-center gap-6 italic">
                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-50 text-red-600">
                      {activeTab === 'badges' ? <Award size={28} /> : <Gift size={28} />}
                   </div>
                   <div className="flex-1 italic">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1 italic">Preview</p>
                      <p className="text-lg font-black text-gray-900 uppercase italic leading-none truncate italic">
                        {activeTab === 'badges' ? (badgeForm.name || 'Untitled Badge') : (rewardForm.title || 'Untitled Reward')}
                      </p>
                   </div>
                </div>
             </div>

             <div className="p-10 border-t border-gray-100 bg-white pb-12 italic">
                <button 
                  onClick={() => {
                    if (isAdding) {
                      activeTab === 'badges' ? createBadgeMutation.mutate(badgeForm) : createRewardMutation.mutate(rewardForm);
                    } else if (selectedId) {
                      activeTab === 'badges' ? updateBadgeMutation.mutate({ id: selectedId, data: badgeForm }) : updateRewardMutation.mutate({ id: selectedId, data: rewardForm });
                    }
                  }}
                  className="w-full bg-gray-900 text-white hover:bg-red-600 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 italic flex items-center justify-center gap-3"
                >
                   {isAdding ? 'Create Item' : 'Save Changes'}
                </button>
             </div>
          </div>
        </>
       )}
    </div>
  );
}
