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
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-16 animate-fade-in">
         <div className="w-16 h-16 bg-gray-50 text-gray-900 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-gray-200/50 border border-gray-100">
            <Settings className="w-8 h-8" />
         </div>
         <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Account Settings</h1>
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase italic border-r-4 border-red-500 pr-4 inline-block">Configuration</p>
         </div>
      </div>

      <div className="space-y-12">
        {settingsGroups.map((group, groupIdx) => (
          <section key={groupIdx} className="animate-fade-in" style={{ animationDelay: `${groupIdx * 100}ms` }}>
             <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                   {group.icon}
                </div>
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">{group.title}</h2>
             </div>

             <div className="glass rounded-[3rem] border-gray-100 bg-white overflow-hidden shadow-xl shadow-gray-200/20">
                {group.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="p-8 border-b border-gray-50 last:border-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:bg-red-50/5 transition-colors">
                     <div className="flex-1">
                        <h3 className="font-bold text-gray-900 uppercase italic tracking-tight flex items-center gap-2 group-hover:text-red-500 transition-colors">
                           {item.label}
                           {'status' in item && item.status && <span className="text-[8px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase italic tracking-widest ml-2">{item.status}</span>}
                        </h3>
                        <p className="text-sm text-gray-500 italic mt-1">{item.desc}</p>
                     </div>
                     
                     <div className="shrink-0 w-full md:w-auto">
                        {'toggle' in item && item.toggle ? (
                          <label className="relative inline-flex items-center cursor-pointer group/toggle">
                             <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                             <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500 transition-all"></div>
                          </label>
                        ) : 'action' in item ? (
                          <button className="bg-gray-50 border border-gray-100 text-gray-900 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center gap-2">
                             {item.action}
                             <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : null}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        ))}

        {/* Danger Zone */}
        <section className="pt-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 rounded-2xl shadow-sm border border-red-100">
                 <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-black text-red-600 uppercase tracking-tight italic">Danger Zone</h2>
           </div>

           <div className="p-8 md:p-12 rounded-[3.5rem] bg-red-50/30 border-2 border-dashed border-red-200 relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-gray-900 mb-2 italic">Delete Donor Account</h3>
                    <p className="text-sm text-gray-500 italic max-w-md">Once you delete your account, there is no going back. All your donation history and points will be permanently erased.</p>
                 </div>
                 <button className="bg-red-600 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-all shadow-xl shadow-red-600/20 whitespace-nowrap italic">
                    Delete Account
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
