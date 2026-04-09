'use client';

import { Shield, Bell, Trash2, Lock, Smartphone, Mail, ChevronRight, Settings, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function DonorSettingsPage() {
  const [loading, setLoading] = useState(false);

  const settingsGroups = [
    {
      title: 'Security & Access',
      icon: <Lock className="w-5 h-5 text-gray-900" />,
      items: [
        { label: 'Change Password', desc: 'Secure your account with a strong password.', action: 'Update' },
        { label: 'Two-Factor Auth', desc: 'Add an extra layer of protection to your donor profile.', action: 'Enable', status: 'Disabled' },
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5 text-red-500" />,
      items: [
        { label: 'Push Notifications', desc: 'Get instant alerts for urgent blood requests near you.', toggle: true, checked: true },
        { label: 'SMS Alerts', desc: 'Receive emergency requests via SMS for immediate action.', toggle: true, checked: false },
        { label: 'Email Updates', desc: 'Stay informed about community impact and rewards.', toggle: true, checked: true },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-40 space-y-20 italic">
      {/* Header */}
      <div className="flex items-center gap-6 animate-in fade-in slide-in-from-left-8 duration-1000">
         <div className="w-16 h-16 bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] text-gray-900 dark:text-white rounded-[2rem] flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/10">
            <Settings className="w-8 h-8 text-red-600" />
         </div>
         <div className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase leading-none">Command Center</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] italic leading-none">Account Configuration</p>
         </div>
      </div>

      <div className="space-y-16">
        {settingsGroups.map((group, groupIdx) => (
          <section key={groupIdx} className="animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: `${groupIdx * 150}ms` }}>
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-100 dark:border-red-500/20">
                   {/* Wrap icon to handle coloring */}
                   <div className="text-red-600">
                      {group.icon}
                   </div>
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">{group.title}</h2>
             </div>

             <div className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[3rem] border border-gray-100 dark:border-white/[0.08] overflow-hidden shadow-sm">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-10 border-b border-gray-50 dark:border-white/[0.05] last:border-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-500 relative overflow-hidden">
                     <div className="flex-1 relative z-10">
                        <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 uppercase italic tracking-widest flex items-center gap-3">
                           {item.label}
                           {'status' in item && item.status && <span className="text-[7px] font-black bg-red-50 dark:bg-red-500/10 text-red-600 px-3 py-1 rounded-full uppercase italic tracking-[0.2em]">{item.status}</span>}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-2 font-medium leading-relaxed max-w-lg">{item.desc}</p>
                     </div>
                     
                     <div className="shrink-0 w-full md:w-auto relative z-10">
                        {'toggle' in item && item.toggle ? (
                          <label className="relative inline-flex items-center cursor-pointer group/toggle">
                             <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                             <div className="w-16 h-8 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600 transition-all duration-500 shadow-inner"></div>
                          </label>
                        ) : 'action' in item ? (
                          <button className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white hover:border-red-600 dark:hover:bg-red-600 transition-all flex items-center gap-4 italic shadow-sm hover:shadow-xl hover:shadow-red-600/20">
                             {item.action}
                             <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : null}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        ))}

        {/* Danger Zone */}
        <section className="pt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000" style={{ animationDelay: '450ms' }}>
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-2xl border border-red-200 dark:border-red-500/40">
                 <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-red-600 uppercase tracking-tighter italic">Termination Protocol</h2>
           </div>

           <div className="p-12 md:p-16 rounded-[4rem] bg-gray-50/30 dark:bg-red-500/[0.01] border-2 border-dashed border-red-200 dark:border-red-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                 <div className="text-center md:text-left space-y-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Deactivate Identity</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-md leading-relaxed font-medium">Once initiated, this protocol is irreversible. All donation history, merit badges, and matrix credits will be permanently purged from the global network.</p>
                 </div>
                 <button className="bg-red-600 text-white px-12 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black dark:hover:bg-white dark:hover:text-red-600 transition-all shadow-2xl shadow-red-600/30 whitespace-nowrap italic active:scale-95">
                    Execute Purge
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
