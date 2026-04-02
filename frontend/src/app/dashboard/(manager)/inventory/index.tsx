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
    <div className="max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-4 md:px-0">
      
      {/* 1. Inventory Overview Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-12 bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl group">
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-20 h-20 bg-gray-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
            <Warehouse className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none mb-3">Blood Stock</h1>
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 italic bg-gray-50 px-4 py-1.5 rounded-full inline-block border border-gray-100">Live Inventory Status: Active</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10 relative z-10 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 group/stat hover:bg-white transition-all shadow-inner">
          <div className="leading-none text-right">
             <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 italic">Total Stock Capacity</p>
             <p className="text-5xl font-black text-gray-900 tracking-tighter italic">{totalUnits} UNITS</p>
          </div>
          <Activity className="w-12 h-12 text-red-600 animate-pulse" />
        </div>
      </div>

      {/* 2. Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        {BLOOD_GROUPS.map((group) => {
          const units = getUnits(group);
          const isUpdating = updating === group;
          const isCritical = units <= 2;

          return (
            <div 
              key={group} 
              className={`bg-white p-10 rounded-[3.5rem] border-2 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-2xl ${isCritical ? 'border-red-100 bg-red-50/10' : 'border-gray-50 hover:border-red-600'}`}
            >
               <div className="flex flex-col items-center gap-10">
                  <div className={`w-24 h-24 rounded-[2rem] flex flex-col items-center justify-center border-2 border-white shadow-xl transition-all duration-500 relative overflow-hidden group-hover:scale-110 ${isCritical ? 'bg-red-600 text-white' : 'bg-gray-50 group-hover:bg-red-600 group-hover:text-white'}`}>
                     <p className="text-3xl font-black mb-1 italic tracking-tighter leading-none">{group.replace('_POS', '+').replace('_NEG', '-')}</p>
                     <span className="text-[10px] font-black uppercase tracking-tighter opacity-50 italic">Group</span>
                  </div>

                  <div className="text-center group-hover:scale-110 transition-transform space-y-3">
                     <p className="text-6xl font-black text-gray-900 tracking-tighter leading-none italic">{units}</p>
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Available Units</p>
                  </div>

                  <div className="flex items-center gap-4 w-full pt-4">
                     <button 
                       onClick={() => handleUpdate(group, -1)}
                       disabled={isUpdating || units === 0}
                       className="flex-1 bg-gray-50 hover:bg-gray-100 disabled:opacity-30 py-4 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all border border-gray-100 active:scale-95"
                     >
                       <Minus size={20} />
                     </button>
                     <button 
                       onClick={() => handleUpdate(group, 1)}
                       disabled={isUpdating}
                       className={`flex-1 disabled:opacity-30 py-4 rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all group/btn ${isCritical ? 'bg-red-600' : 'bg-gray-900 hover:bg-red-600'}`}
                     >
                       {isUpdating ? <RefreshCcw size={20} className="animate-spin" /> : <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" />}
                     </button>
                  </div>
               </div>

               {isCritical && (
                 <div className="absolute top-8 right-10">
                    <AlertCircle size={20} className="text-red-600 animate-pulse" />
                 </div>
               )}
            </div>
          );
        })}
      </div>

      {/* 3. Integrity & History */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pt-10">
         <div className="xl:col-span-8 space-y-12">
            <div className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-gray-100 relative overflow-hidden group shadow-xl">
               <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center justify-center shrink-0">
                     <ShieldCheck className="w-10 h-10 text-green-600" />
                  </div>
                  <div className="space-y-4 text-center md:text-left">
                     <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none italic">Storage & Handling <br/><span className="text-red-600 italic">Inventory Standards</span></h2>
                     <p className="text-gray-400 text-sm font-medium italic max-w-xl leading-relaxed">
                        Inventory levels are tracked in real-time. Accurate reporting ensures that donors are directed to the facilities with the greatest need.
                     </p>
                  </div>
               </div>
            </div>

            {/* Inventory Activity */}
            <div className="bg-white rounded-[3.5rem] p-12 border border-gray-100 shadow-xl space-y-10 group relative overflow-hidden">
               <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase italic">Activity Log</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">Recent Transactions • Inventory History</p>
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-red-600 border border-gray-100">
                     <Activity size={24} />
                  </div>
               </div>

               <div className="space-y-6 relative z-10">
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row items-center justify-between p-8 bg-gray-50 rounded-[2rem] border border-transparent hover:border-red-100 hover:bg-white transition-all group/log">
                         <div className="flex items-center gap-8">
                            <div className="w-14 h-14 bg-white rounded-2xl border border-gray-100 flex items-center justify-center shadow-sm group-hover/log:scale-110 transition-transform">
                               <Droplets size={24} className="text-red-500" />
                            </div>
                            <div>
                               <div className="flex items-center gap-3">
                                  <h4 className="text-xl font-black text-gray-900 italic tracking-tighter text-red-600">{log.details?.group?.replace('_POS', '+')?.replace('_NEG', '-')}</h4>
                                  <span className="text-[9px] font-black px-3 py-1 bg-gray-900 text-white rounded-lg uppercase tracking-widest italic">{log.action}</span>
                               </div>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5 italic font-mono">{new Date(log.createdAt).toLocaleString()} • ID: #{log.id.slice(-6).toUpperCase()}</p>
                            </div>
                         </div>
                         <div className="mt-6 sm:mt-0 leading-none text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Adjustment</p>
                            <p className="text-2xl font-black text-gray-900 italic">{log.details?.units} Units</p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center space-y-6 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                       <RefreshCcw className="w-12 h-12 text-gray-200 mx-auto" />
                       <p className="text-gray-400 font-black text-xs uppercase tracking-widest italic leading-none">No recent activity found.</p>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Stats Sidebar */}
         <div className="xl:col-span-4 space-y-10">
            <div className="p-12 bg-white rounded-[3.5rem] border border-gray-100 shadow-xl space-y-10 relative overflow-hidden group">
               <div className="flex items-center gap-5 text-gray-900">
                  <TrendingUp className="text-red-600" size={32} />
                  <h4 className="text-xl font-black italic uppercase tracking-tighter">Inventory Stats</h4>
               </div>
               
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Weekly Usage</p>
                     <p className="text-2xl font-black text-gray-900 tracking-tighter italic">-12%</p>
                  </div>
                  <div className="flex justify-between items-center">
                     <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest italic">Restock Rate</p>
                     <p className="text-2xl font-black text-gray-900 tracking-tighter italic">+18.4%</p>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100 mt-6">
                     <div className="h-full bg-red-600 rounded-full transition-all duration-1000" style={{ width: '64%' }}></div>
                  </div>
               </div>
            </div>

            <div className="bg-red-600 rounded-[3.5rem] p-10 text-white text-center space-y-6 shadow-2xl group hover:scale-105 transition-all duration-700">
               <ShieldCheck size={48} className="mx-auto text-red-100" />
               <p className="text-[11px] font-black text-red-100 uppercase tracking-[0.4em] italic leading-none">Verified System</p>
               <p className="text-sm font-black italic tracking-tighter leading-relaxed">Inventory is updated automatically based on confirmed donations.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
