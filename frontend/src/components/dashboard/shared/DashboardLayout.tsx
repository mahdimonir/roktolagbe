'use client';

import { useAuthStore } from '@/store/auth-store';
import { api } from '@/lib/api/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Activity,
  Award,
  Bell,
  Building2,
  ChevronRight,
  Droplet,
  Flame,
  Globe,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  PieChart,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
  CheckCircle2,
  X,
  ShieldAlert,
  Heart,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SOSTicker } from './SOSTicker';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTab = searchParams.get('tab') || 'overview';
  const queryClient = useQueryClient();

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications'),
    refetchInterval: 10000,
  });

  const notifications = (notificationsData as any)?.data?.data?.items || [];

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.post('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notifications cleared!');
    }
  });

  useEffect(() => setMounted(true), []);

  if (!mounted || !user) return null;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const roleConfigs = {
    ADMIN: { 
      theme: 'red', 
      label: 'Admin Dashboard', 
      badge: 'Administrator',
      icon: <ShieldCheck className="text-red-500" size={18} />
    },
    MANAGER: { 
      theme: 'red', 
      label: 'Manager Dashboard', 
      badge: 'Hospital Manager',
      icon: <Building2 className="text-red-500" size={18} />
    },
    DONOR: { 
      theme: 'red', 
      label: 'Donor Dashboard', 
      badge: 'Blood Donor',
      icon: <Heart className="text-red-500" size={18} />
    }
  };

  const activeConfig = roleConfigs[user.role as keyof typeof roleConfigs] || roleConfigs.DONOR;

  const menuGroups = {
    ADMIN: [
      { 
        label: 'Platform Management',
        items: [
          { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
          { name: 'User Management', tab: 'users', icon: Users },
          { name: 'Organizations', tab: 'organizations', icon: Building2 },
          { name: 'Blood Requests', tab: 'requests', icon: Droplet },
        ]
      },
      {
        label: 'System Maintenance',
        items: [
          { name: 'Donations', tab: 'donations', icon: History },
          { name: 'Security Logs', tab: 'audit-logs', icon: ShieldCheck },
          { name: 'Rewards', tab: 'badges', icon: Award },
          { name: 'Analytics', tab: 'analytics', icon: PieChart },
          { name: 'Settings', tab: 'settings', icon: Settings },
        ]
      }
    ],
    MANAGER: [
      {
        label: 'Hospital Operations',
        items: [
          { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
          { name: 'Verifications', tab: 'verify', icon: ShieldCheck },
          { name: 'Blood Requests', tab: 'requests', icon: Activity },
          { name: 'New Request', tab: 'requests-new', icon: Zap },
        ]
      },
      {
        label: 'Management',
        items: [
          { name: 'Blood Inventory', tab: 'inventory', icon: Droplet },
          { name: 'Donor Directory', tab: 'donors', icon: Users },
          { name: 'Profile Settings', tab: 'profile', icon: Settings },
        ]
      }
    ],
    DONOR: [
      {
        label: 'Donation Activities',
        items: [
          { name: 'Overview', tab: 'overview', icon: LayoutDashboard },
          { name: 'Nearby Hospitals', tab: 'hubs', icon: Building2 },
          { name: 'Rewards', tab: 'rewards', icon: Award },
          { name: 'Donation History', tab: 'history', icon: History },
        ]
      },
      {
        label: 'Profile',
        items: [
          { name: 'My Profile', tab: 'profile', icon: User },
          { name: 'Settings', tab: 'settings', icon: Settings },
        ]
      }
    ]
  };

  const groups = menuGroups[user.role as keyof typeof menuGroups] || menuGroups.DONOR;

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex font-sans selection:bg-red-100 selection:text-red-600 italic">
      {/* 1. Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-[60] lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] 
        w-[20rem] bg-white border-r border-gray-100 flex flex-col transition-all duration-700 ease-in-out
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Branding Header */}
        <div className="h-24 flex items-center px-10 border-b border-gray-50 shrink-0">
          <Link href="/" className="flex items-center gap-4 group">
            <div className={`w-12 h-12 rounded-[1.2rem] bg-gray-900 text-white flex items-center justify-center font-black group-hover:scale-110 transition-all shadow-xl relative`}>
              <Droplet className={`w-6 h-6 text-red-600 animate-pulse`} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter text-gray-900 uppercase italic leading-none">Rokto<span className="text-red-600">Lagbe</span></span>
              <div className="flex items-center gap-2 mt-2">
                 <span className={`text-[9px] font-black uppercase tracking-widest text-red-600 italic`}>{activeConfig.label}</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-10 space-y-12 custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-6">
              <div className="px-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60 italic">
                   {group.label}
                 </h3>
              </div>
              <nav className="space-y-2">
                {group.items.map((item) => {
                  const isActive = currentTab === item.tab;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.tab}
                      href={`/dashboard${item.tab === 'overview' ? '' : `?tab=${item.tab}`}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] font-black italic transition-all relative group uppercase tracking-widest
                        ${isActive 
                          ? 'bg-red-600 text-white shadow-xl shadow-red-600/10' 
                          : 'text-gray-500 hover:text-red-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon size={20} className={`${isActive ? `text-white` : 'group-hover:translate-x-1 transition-transform'}`} />
                      <span className="leading-none">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Identity Card */}
        <div className="p-6 mt-auto border-t border-gray-50">
          <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center gap-4 group cursor-pointer hover:bg-white transition-all shadow-sm">
             <div className={`w-12 h-12 rounded-[1rem] bg-gray-900 border-4 border-white shadow-xl flex items-center justify-center text-white overflow-hidden font-black italic`}>
               {user.image ? (
                 <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="flex flex-col items-center gap-0.5 opacity-60">
                    <User size={16} className="text-red-500" />
                 </div>
               )}
             </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-black text-gray-900 truncate leading-none mb-1.5 group-hover:text-red-600 transition-colors uppercase italic">{user.name}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">{activeConfig.badge}</span>
                </div>
              </div>
             <button onClick={handleLogout} className="p-3 rounded-xl text-gray-300 hover:text-red-600 hover:bg-white transition-all active:scale-90">
               <LogOut size={18} />
             </button>
          </div>
        </div>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f8f9fb] relative">
        <SOSTicker />
        
        {/* Main Header */}
        <header className="h-24 bg-white/60 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-8 lg:px-16 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl lg:hidden shadow-sm active:scale-95 transition-all"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
               <Home size={14} className="hover:text-red-600 cursor-pointer transition-colors" onClick={() => router.push('/dashboard')} />
               <ChevronRight size={12} className="text-gray-200" />
               <span className="text-gray-900 font-black italic underline decoration-red-600/10 underline-offset-4 uppercase">{currentTab.replace('-', ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3 border-l border-gray-100 pl-8">
               <div className="relative group">
                 <button className="p-3.5 relative text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-95">
                   <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                   {notifications.filter((n:any) => !n.isRead).length > 0 && (
                     <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-600 border-2 border-white animate-pulse"></span>
                   )}
                 </button>

                  {/* Notification Dropdown */}
                  <div className="absolute right-0 mt-4 w-[26rem] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] overflow-hidden translate-y-4 group-hover:translate-y-0">
                     <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                       <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 italic">Notifications</h3>
                       <button 
                         onClick={() => markAllReadMutation.mutate()}
                         className="text-[9px] font-black uppercase text-red-600 hover:underline tracking-widest italic"
                       >
                         Clear All
                       </button>
                     </div>
                    <div className="max-h-[30rem] overflow-y-auto custom-scrollbar">
                      {notifications.map((notif: any) => (
                        <div 
                          key={notif.id} 
                          className={`p-6 border-b border-gray-50 hover:bg-gray-50/50 transition-all flex gap-4 ${!notif.isRead ? 'bg-red-50/20' : ''}`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            notif.type === 'BLOOD_REQUEST' ? 'bg-red-100 text-red-600' : 
                            notif.type === 'DONOR_COMMIT' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                             {notif.type === 'BLOOD_REQUEST' ? <ShieldAlert size={18} /> : 
                              notif.type === 'DONOR_COMMIT' ? <Activity size={18} /> : <CheckCircle2 size={18} />}
                          </div>
                          <div className="flex-1 space-y-1 text-left">
                            <p className="text-[11px] font-bold text-gray-900 leading-relaxed italic">{notif.message}</p>
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest italic">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                          </div>
                          {!notif.isRead && (
                            <button 
                              onClick={() => markReadMutation.mutate(notif.id)}
                              className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-red-600 transition-all shadow-sm"
                            >
                               <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                            </button>
                          )}
                        </div>
                      ))}
                       {notifications.length === 0 && (
                        <div className="py-20 text-center space-y-4 text-gray-300">
                          <Bell size={40} className="mx-auto opacity-10" />
                          <p className="text-[10px] font-black uppercase tracking-widest italic">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </div>
               </div>

               <Link href="/" className="p-3.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm">
                 <Globe size={22} />
               </Link>
             </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar italic">
          <div className="max-w-[1500px] mx-auto p-8 lg:p-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
