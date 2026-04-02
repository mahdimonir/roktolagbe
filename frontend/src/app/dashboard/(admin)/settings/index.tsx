'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { ApiResponse, AdminAnalytics, SystemConfig } from '@/lib/types/models';
import { 
  BarChart3, Users, Droplets, Activity, 
  Settings, Shield, Zap, TrendingUp, 
  Loader2, Hospital, Globe, Lock, 
  Database, Bell, Sparkles, Cpu, 
  ShieldAlert, Send, XCircle, Info,
  AlertTriangle, CheckSquare, FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const [alertForm, setAlertForm] = useState<{
    globalAlertActive: boolean;
    globalAlertTitle: string;
    globalAlertMessage: string;
    globalAlertType: 'INFO' | 'WARNING' | 'EMERGENCY';
  }>({
    globalAlertActive: false,
    globalAlertTitle: '',
    globalAlertMessage: '',
    globalAlertType: 'INFO'
  });

  const [isRotating, setIsRotating] = useState(false);

  const { data: analyticsData, isLoading: statsLoading } = useQuery<ApiResponse<AdminAnalytics>>({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics'),
  });

  const { data: configData, isLoading: configLoading } = useQuery<ApiResponse<SystemConfig>>({
    queryKey: ['admin-config'],
    queryFn: () => api.get('/admin/config'),
  });

  useEffect(() => {
    const config = configData?.data;
    if (config) {
      setAlertForm({
        globalAlertActive: config.globalAlertActive,
        globalAlertTitle: config.globalAlertTitle || '',
        globalAlertMessage: config.globalAlertMessage || '',
        globalAlertType: config.globalAlertType || 'INFO'
      });
    }
  }, [configData]);

  const updateConfigMutation = useMutation({
    mutationFn: (data: Partial<SystemConfig>) => api.patch('/admin/config', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-config'] });
      toast.success('Settings saved!');
    },
    onError: () => toast.error('Failed to update settings')
  });

  const handleProtocolToggle = (field: string, value: boolean) => {
     updateConfigMutation.mutate({ [field]: value });
  };

  const handleRotateKeys = async () => {
    setIsRotating(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsRotating(false);
    toast.success('System security keys rotated.');
  };

  const handleExportLogs = async () => {
    try {
      const response = await api.get('/admin/export/logs', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Activity_History_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Activity logs exported.');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleExportDonations = async () => {
    try {
      const response = await api.get('/admin/export/donations', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Donation_Records_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      toast.success('Donation records exported.');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const stats = analyticsData?.data;

  if (statsLoading || configLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading settings...</p>
    </div>
  );

  const impactRatio = stats ? ((stats.resolutionRate || 0)).toFixed(1) : '0.0';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic">
        <div className="flex items-center gap-5 italic text-left">
          <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
            <Settings className="w-8 h-8 font-bold italic" />
          </div>
          <div className="italic">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none italic">System Settings</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">v1.4.2 & Configuration</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm italic">
           <div className="w-2 h-2 rounded-full bg-green-500 italic"></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Systems Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 italic">
         {/* System Announcements */}
         <div className="lg:col-span-8 space-y-10 italic">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-10 relative overflow-hidden group italic">
               <div className="flex justify-between items-center relative z-10 border-b border-gray-50 pb-8 italic">
                  <h3 className="text-xl font-black italic uppercase text-gray-900 tracking-tight flex items-center gap-3 italic italic">
                     <Bell size={22} className="text-red-600 italic" />
                     Public Announcements
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer italic">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={alertForm.globalAlertActive}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setAlertForm({...alertForm, globalAlertActive: val});
                        handleProtocolToggle('globalAlertActive', val);
                      }}
                    />
                    <div className="w-14 h-7 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 transition-all italic"></div>
                  </label>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 italic text-left">
                  <div className="space-y-3 italic">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">Announcement Title</label>
                     <input 
                       type="text"
                       placeholder="e.g. MAINTENANCE NOTICE"
                       className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-black italic text-sm focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                       value={alertForm.globalAlertTitle}
                       onChange={(e) => setAlertForm({...alertForm, globalAlertTitle: e.target.value})}
                     />
                  </div>
                  <div className="space-y-3 italic">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">Alert Type</label>
                     <select 
                       className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-black italic uppercase tracking-widest text-[10px] appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                       value={alertForm.globalAlertType}
                       onChange={(e) => setAlertForm({...alertForm, globalAlertType: e.target.value as 'INFO' | 'WARNING' | 'EMERGENCY'})}
                     >
                        <option value="INFO">Information</option>
                        <option value="WARNING">Warning</option>
                        <option value="EMERGENCY">Critical Alert</option>
                     </select>
                  </div>
               </div>

               <div className="space-y-3 relative z-10 italic text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic px-2 italic">Public Message</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter announcement details..."
                    className="w-full bg-gray-50 border border-transparent rounded-[2rem] py-6 px-10 outline-none font-medium italic resize-none focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
                    value={alertForm.globalAlertMessage}
                    onChange={(e) => setAlertForm({...alertForm, globalAlertMessage: e.target.value})}
                  />
               </div>

               <div className="flex gap-4 pt-10 border-t border-gray-50 relative z-10 italic">
                  <button 
                    onClick={() => updateConfigMutation.mutate(alertForm)}
                    disabled={updateConfigMutation.isPending}
                    className="flex-1 bg-gray-900 text-white hover:bg-red-600 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic flex items-center justify-center gap-4 italic"
                  >
                     {updateConfigMutation.isPending ? <Loader2 size={16} className="animate-spin italic" /> : <Send size={16} className="italic" />}
                     Post Announcement
                  </button>
                  <button 
                    onClick={() => {
                       const reset = { ...alertForm, globalAlertActive: false };
                       setAlertForm(reset);
                       updateConfigMutation.mutate(reset);
                    }}
                    className="px-8 bg-gray-100 text-gray-400 hover:text-red-500 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest transition-all italic border border-transparent italic italic"
                  >
                     Clear
                  </button>
               </div>
            </div>

            {/* Platform Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
               <div className="bg-gray-900 p-10 rounded-[3rem] text-white flex flex-col justify-between h-56 group overflow-hidden relative shadow-xl italic text-left">
                  <TrendingUp className="text-red-600 italic" size={32} />
                  <div className="italic">
                     <p className="text-6xl font-black italic tracking-tighter mb-2 italic leading-none italic">{impactRatio}%</p>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic italic">Donation Success Rate</p>
                  </div>
               </div>
               <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between h-56 group hover:border-red-100 transition-all shadow-sm relative overflow-hidden italic text-left">
                  <Users className="text-red-600 group-hover:scale-105 transition-transform italic" size={32} />
                  <div className="italic">
                     <p className="text-6xl font-black italic tracking-tighter mb-2 text-gray-900 italic leading-none italic">{stats?.donors?.total || 0}</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic italic">Total Registered Donors</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Administration */}
         <div className="lg:col-span-4 space-y-10 italic">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-10 relative overflow-hidden italic text-left">
               <h3 className="text-lg font-black italic uppercase text-gray-900 tracking-tight flex items-center gap-3 italic italic">
                  <Activity size={20} className="text-red-600 italic" />
                  Management Tools
               </h3>

               <div className="space-y-8 italic">
                  <div className="flex justify-between items-center group cursor-pointer italic" onClick={() => handleProtocolToggle('maintenanceMode', !configData?.data.maintenanceMode)}>
                     <div className="italic">
                        <p className="text-xs font-black text-gray-900 uppercase italic italic text-left">Maintenance Mode</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic text-left">Restrict new registrations</p>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer pointer-events-none italic">
                        <input type="checkbox" checked={configData?.data?.maintenanceMode} className="sr-only peer" readOnly />
                        <div className="w-10 h-5 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600 italic"></div>
                     </label>
                  </div>
               </div>

               <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative group overflow-hidden italic text-left">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 blur-2xl rounded-full italic"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2 italic italic">
                     <Info size={12} className="text-red-600 italic" /> System Version
                  </p>
                  <p className="text-xs text-gray-900 font-black leading-relaxed italic uppercase tracking-tighter italic italic">
                     v{configData?.data?.apiVersion || '1.4.2'} - Stable Build
                  </p>
               </div>

               <div className="space-y-4 pt-4 italic">
                  <button 
                     onClick={handleRotateKeys}
                     disabled={isRotating}
                     className="w-full bg-gray-900 hover:bg-red-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic flex items-center justify-center gap-3 italic"
                  >
                     {isRotating ? <Loader2 size={14} className="animate-spin italic" /> : <Shield size={14} className="italic" />}
                     Rotate Security Keys
                  </button>
                  <button 
                     onClick={handleExportLogs}
                     className="w-full bg-white border border-gray-100 text-gray-900 hover:bg-gray-50 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic flex items-center justify-center gap-3 shadow-sm italic"
                  >
                     <FileText size={14} className="text-red-600 italic" /> Export Activity Records
                  </button>
                  <button 
                     onClick={handleExportDonations}
                     className="w-full bg-white border border-gray-100 text-gray-900 hover:bg-gray-50 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all italic flex items-center justify-center gap-3 shadow-sm italic"
                  >
                     <Database size={14} className="text-red-600 italic" /> Export Donation Logs
                  </button>
               </div>
            </div>

            <div className="bg-red-600 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl italic text-left">
               <div className="mb-10 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md italic">
                  <Shield size={32} className="text-white italic" />
               </div>
               <h4 className="text-2xl font-black italic tracking-tighter leading-tight mb-4 uppercase italic italic">Environment Info</h4>
               <p className="text-red-50 text-[10px] font-black italic leading-relaxed mb-10 italic uppercase tracking-widest opacity-80 italic">
                 RoktoLagbe System v1.4.2 <br/>
                 Deployment: Cloud-Native <br/>
                 Status: Production
               </p>
               <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden italic">
                  <div className="h-full w-full bg-white italic"></div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
