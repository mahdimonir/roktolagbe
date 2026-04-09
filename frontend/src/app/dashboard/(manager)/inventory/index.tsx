'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { ApiResponse, InventoryItem, AuditLog } from '@/lib/types/models';
import { useState } from 'react';
import { 
  Droplets, Plus, Minus,
  Warehouse, Activity, ShieldCheck, 
  Loader2, RefreshCcw, Snowflake,
  Thermometer, AlertCircle, TrendingUp,
  Zap, ArrowRight, ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

export default function InventoryManagement() {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: inventoryData, isLoading } = useQuery<ApiResponse<InventoryItem[]>>({
    queryKey: ['my-inventory'],
    queryFn: () => api.get('/managers/me/inventory'),
  });

   const { data: logsData, isLoading: logsLoading } = useQuery<ApiResponse<AuditLog[]>>({
    queryKey: ['inventory-logs'],
    queryFn: () => api.get('/managers/me/inventory/logs'),
  });

  const mutation = useMutation({
    mutationFn: (data: { group: string; units: number }) => api.post('/managers/me/inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-logs'] });
      setUpdating(null);
      toast.success('Inventory updated successfully!');
    },
    onError: () => {
      setUpdating(null);
      toast.error('Failed to update inventory.');
    }
  });

  if (isLoading || logsLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white">
       <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading inventory data...</p>
    </div>
  );

  const stock = inventoryData?.data || [];
  const logs = logsData?.data || [];
  const getUnits = (group: string) => stock.find((s) => s.group === group)?.units || 0;
  const totalUnits = BLOOD_GROUPS.reduce((acc, g) => acc + getUnits(g), 0);

  const handleUpdate = (group: string, delta: number) => {
    const current = getUnits(group);
    const newVal = Math.max(0, current + delta);
    setUpdating(group);
    mutation.mutate({ group, units: newVal });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-4 md:px-0 italic">
      
      {/* 1. Inventory Overview Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 md:p-16 rounded-[4rem] border border-gray-100 dark:border-white/[0.08] shadow-sm group italic">
        <div className="flex items-center gap-10 relative z-10 italic">
          <div className="w-20 h-20 bg-gray-900 border border-white/10 text-white rounded-[2rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 italic">
            <Warehouse className="w-10 h-10 text-red-500 italic" />
          </div>
          <div className="italic">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none mb-4 italic">Blood Stock</h1>
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400 dark:text-gray-600 italic bg-white dark:bg-white/5 px-5 py-2 rounded-xl border border-gray-100 dark:border-white/10 inline-block">LIVE MATRIX STATUS: OPERATIONAL</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10 relative z-10 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-gray-100 dark:border-white/10 group/stat hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all shadow-sm italic">
          <div className="leading-none text-right italic">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 dark:text-gray-600 mb-3 italic">TOTAL CAPACITY</p>
             <p className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter italic leading-none">{totalUnits} UNITS</p>
          </div>
          <Activity className="w-12 h-12 text-red-600 animate-pulse italic" />
        </div>
      </div>

      {/* 2. Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 italic">
        {BLOOD_GROUPS.map((group) => {
          const units = getUnits(group);
          const isUpdating = updating === group;
          const isCritical = units <= 2;

          return (
            <div 
              key={group} 
              className={`bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-10 rounded-[3.5rem] border-2 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl ${isCritical ? 'border-red-600/30 bg-red-600/[0.02]' : 'border-gray-100 dark:border-white/[0.08] hover:border-red-600'}`}
            >
               <div className="flex flex-col items-center gap-10 italic">
                  <div className={`w-28 h-28 rounded-[2.5rem] flex flex-col items-center justify-center border-4 border-white dark:border-[#0f0f13] shadow-2xl transition-all duration-500 relative overflow-hidden group-hover:scale-110 ${isCritical ? 'bg-red-600 text-white' : 'bg-white dark:bg-white/5 group-hover:bg-red-600 group-hover:text-white'}`}>
                     <p className="text-4xl font-black mb-1 italic tracking-tighter leading-none">{group.replace('_POS', '+').replace('_NEG', '-')}</p>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 italic">GROUP</span>
                  </div>

                  <div className="text-center group-hover:scale-110 transition-transform space-y-3 italic">
                     <p className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-none italic">{units}</p>
                     <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic">AVAILABLE UNITS</p>
                  </div>

                  <div className="flex items-center gap-4 w-full pt-4 italic">
                     <button 
                       onClick={() => handleUpdate(group, -1)}
                       disabled={isUpdating || units === 0}
                       className="flex-1 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-red-600 hover:text-gray-950 dark:hover:text-white disabled:opacity-30 py-5 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-600 transition-all border border-gray-100 dark:border-white/10 active:scale-95 shadow-sm italic"
                     >
                       <Minus size={22} className="italic" />
                     </button>
                     <button 
                       onClick={() => handleUpdate(group, 1)}
                       disabled={isUpdating}
                       className={`flex-1 disabled:opacity-30 py-5 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-95 transition-all group/btn ${isCritical ? 'bg-red-600' : 'bg-gray-900 hover:bg-red-600'}`}
                     >
                       {isUpdating ? <RefreshCcw size={22} className="animate-spin italic" /> : <Plus size={22} className="group-hover/btn:rotate-90 transition-transform italic" />}
                     </button>
                  </div>
               </div>

               {isCritical && (
                 <div className="absolute top-10 right-10">
                    <AlertCircle size={24} className="text-red-600 animate-pulse italic" />
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {/* 3. Integrity & History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-10 italic">
         <div className="xl:col-span-8 space-y-12 italic">
            <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 lg:p-20 rounded-[4.5rem] border border-gray-100 dark:border-white/[0.08] relative overflow-hidden group shadow-sm italic text-left">
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center italic">
                  <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0 shadow-lg italic">
                     <ShieldCheck className="w-12 h-12 text-green-600 italic" />
                  </div>
                  <div className="space-y-6 text-center md:text-left italic">
                     <h2 className="text-4xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none italic text-left">Storage Protocols <br/><span className="text-red-600 italic">Matrix Operations</span></h2>
                     <p className="text-gray-500 dark:text-gray-400 text-base font-medium italic max-w-2xl leading-relaxed italic text-left">
                        Platform synchronizes regional demand with real-time inventory assets. Precision adjustments ensure life-saving efficiency across the network.
                     </p>
                  </div>
               </div>
            </div>

            {/* Inventory Activity */}
            <div className="bg-white dark:bg-white/[0.01] rounded-[4rem] p-12 border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-12 group relative overflow-hidden italic text-left">
               <div className="flex justify-between items-center relative z-10 italic">
                  <div className="italic text-left">
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Activity Feed</h3>
                    <p className="text-[9px] text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.3em] mt-3 italic">HISTORICAL DYNAMICS • LOGGED SIGNALS</p>
                  </div>
                  <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100 dark:border-white/10 shadow-sm italic">
                     <Activity size={28} className="italic" />
                  </div>
               </div>

               <div className="space-y-6 relative z-10 italic">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row items-center justify-between p-10 bg-gray-50/50 dark:bg-white/5 rounded-[3rem] border border-transparent hover:border-red-600/20 hover:bg-white dark:hover:bg-white/10 transition-all group/log italic">
                         <div className="flex items-center gap-10 italic">
                            <div className="w-16 h-16 bg-white dark:bg-red-600/10 rounded-2xl border border-gray-100 dark:border-red-500/20 flex items-center justify-center shadow-lg group-hover/log:scale-110 transition-transform italic text-red-600">
                               <Droplets size={28} className="italic" />
                            </div>
                            <div className="italic text-left">
                               <div className="flex items-center gap-4 italic justify-start">
                                  <h4 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tighter text-red-600 uppercase italic">{log.details?.group?.replace('_POS', '+')?.replace('_NEG', '-')}</h4>
                                  <span className="text-[9px] font-black px-4 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl uppercase tracking-widest italic">{log.action}</span>
                               </div>
                               <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mt-3 italic font-mono">{new Date(log.createdAt).toLocaleString()} • CORE: #{log.id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                         <div className="mt-8 sm:mt-0 leading-none text-right italic">
                            <p className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] mb-2 italic">DELTA VARIANCE</p>
                            <p className="text-3xl font-black text-gray-900 dark:text-white italic leading-none">{log.details?.units} UNITS</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-32 text-center space-y-8 bg-gray-50/30 dark:bg-white/5 rounded-[4rem] border-2 border-dashed border-gray-100 dark:border-white/10 italic">
                       <RefreshCcw className="w-16 h-16 text-gray-200 dark:text-gray-800 mx-auto italic" />
                       <p className="text-gray-400 dark:text-gray-600 font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">NO DETECTED ACTIVITY LOGS</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="xl:col-span-4 space-y-12 italic">
            <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[4rem] border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-12 relative overflow-hidden group italic text-left">
               <div className="flex items-center gap-6 text-gray-900 dark:text-white italic text-left">
                  <TrendingUp className="text-red-600 italic" size={40} />
                  <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Matrix <br/> Analytics</h4>
               </div>
               
               <div className="space-y-10 italic">
                  <div className="flex justify-between items-center italic">
                     <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic">WEEKLY VARIANCE</p>
                     <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">-12%</p>
                  </div>
                  <div className="flex justify-between items-center italic">
                     <p className="text-[11px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] italic">RESTOCK MATRIX</p>
                     <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic">+18.4%</p>
                  </div>
                  <div className="h-3 w-full bg-white dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 p-1 italic mt-10 shadow-inner">
                     <div className="h-full bg-red-600 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.5)]" style={{ width: '64%' }}></div>
                  </div>
               </div>
            </div>

            <div className="bg-red-600 rounded-[4rem] p-14 text-white text-center space-y-10 shadow-2xl group hover:scale-[1.03] transition-all duration-700 italic border border-white/10">
               <div className="w-24 h-24 bg-white/20 rounded-[3rem] border border-white/20 flex items-center justify-center mx-auto shadow-2xl italic">
                  <ShieldCheck size={56} className="text-white italic" />
               </div>
               <div className="space-y-4 italic">
                  <p className="text-[10px] font-black text-red-100 uppercase tracking-[0.4em] italic leading-none">SECURED NETWORK</p>
                  <p className="text-lg font-black italic tracking-tighter leading-relaxed">
                     Core synchronization active. Inventory assets are auto-logged via validated donor hits.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
