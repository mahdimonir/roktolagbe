'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { 
  ShieldCheck, ShieldAlert, 
  Activity, Clock, User, 
  Search, Lock, Zap,
  Terminal, Database, 
  ChevronRight, ArrowRight,
  Send, Package
} from 'lucide-react';
import { PaginatedResponse, AuditLog } from '@/lib/types/models';
import { useState } from 'react';

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);

  const { data: logsResponse, isLoading } = useQuery<PaginatedResponse<AuditLog>>({
    queryKey: ['admin-audit-logs', page],
    queryFn: async () => {
      const res = await api.get(`/admin/audit-logs?page=${page}&limit=15`);
      return res.data;
    },
  });

  const logs = logsResponse?.data || [];
  const meta = logsResponse?.meta;

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
      case 'REQUEST_CREATE': 
        return 'bg-green-50 text-green-700 border-green-100';
      case 'UPDATE':
      case 'PROFILE_UPDATE':
      case 'INVENTORY_SYNC':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'DELETE':
      case 'REQUEST_DELETE':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      case 'BAN':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'VERIFY':
      case 'DONATION_VERIFY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'CONFIG_CHANGE':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'MESSAGE_SEND':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'USER': return <User size={14} />;
      case 'MANAGER': return <ShieldCheck size={14} />;
      case 'REQUEST': return <Activity size={14} />;
      case 'REWARD': return <Zap size={14} />;
      case 'CONFIG': return <Lock size={14} />;
      case 'DONATION': return <Database size={14} />;
      case 'MESSAGE': return <Send size={14} />;
      case 'INVENTORY': return <Package size={14} />;
      default: return <Terminal size={14} />;
    }
  };

  if (isLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center italic">
       <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading audit logs...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 italic">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl text-white">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase italic leading-none">Audit Logs</h1>
            <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] mt-2 bg-gray-100 px-3 py-1 rounded-full inline-block italic">Platform Transparency & Accountability</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden italic">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-gray-50/50 italic">
           <div className="flex items-center gap-3 italic">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <h3 className="text-sm font-black italic uppercase text-gray-900 tracking-tight italic">Recent Activity Feed</h3>
           </div>
           <div className="relative group w-64 italic">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 outline-none text-xs font-bold italic"
              />
           </div>
        </div>

        <div className="overflow-x-auto italic">
          <table className="w-full text-left italic">
            <thead>
              <tr className="border-b border-gray-50 italic">
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Timestamp</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">User</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Action</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Entity</th>
                <th className="px-8 py-6 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right italic">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 italic">
              {logs.map((log: AuditLog) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-all italic">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 italic">
                       <Clock size={14} className="text-gray-300" />
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">{new Date(log.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 italic">
                       <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white text-[10px] font-black uppercase shadow-lg italic">
                          {log.actor?.email?.slice(0, 1)}
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-gray-900 italic lowercase leading-none italic">{log.actor?.email}</p>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">{log.actor?.role}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase italic tracking-widest border italic ${getActionColor(log.action)}`}>
                        {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-gray-900 italic">
                    <div className="flex items-center gap-3 italic">
                       <div className="p-2 bg-gray-50 text-gray-400 rounded-lg border border-gray-100 italic">
                          {getEntityIcon(log.entity)}
                       </div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 italic">{log.entity}</p>
                          <p className="text-[8px] text-gray-400 font-bold tracking-tighter italic">ID: {log.entityId?.slice(-8)}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right italic">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-lg italic">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-center items-center italic">
           {meta && meta.totalPages > 1 && (
             <div className="flex items-center gap-6 italic">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 shadow-sm italic"
                >
                   <ChevronRight className="rotate-180" size={18} />
                </button>
                <span className="text-[10px] font-black italic uppercase tracking-widest italic">Page {page} of {meta.totalPages}</span>
                <button 
                  disabled={page === meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-3 bg-white border border-gray-100 rounded-xl text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-30 shadow-sm italic"
                >
                   <ChevronRight size={18} />
                </button>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 italic">
         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex items-center justify-between group overflow-hidden relative shadow-xl italic">
            <div className="relative z-10 italic">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2 italic">Total Actions Logged</p>
               <p className="text-4xl font-black text-gray-900 tracking-tighter italic italic">{meta?.total || 0}</p>
            </div>
            <Terminal size={40} className="text-red-600" />
         </div>
         <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex items-center justify-between group overflow-hidden relative shadow-xl italic">
            <div className="relative z-10 italic">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2 italic">Status</p>
               <p className="text-4xl font-black text-gray-900 tracking-tighter italic italic">Immutable</p>
            </div>
            <Lock size={40} className="text-red-600" />
         </div>
      </div>
    </div>
  );
}
