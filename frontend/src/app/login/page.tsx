'use client';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Building2, Eye, EyeOff, Lock, Mail, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const fillDemo = (role: 'DONOR' | 'MANAGER' | 'ADMIN') => {
    const creds = {
      DONOR: { email: 'mahdimoniruzzaman@gmail.com', password: 'RoktoLagbe123' },
      MANAGER: { email: 'contactrbm15@gmail.com', password: 'RoktoLagbe123' },
      ADMIN: { email: 'admin@roktolagbe.com', password: 'Admin@123456' },
    };
    setFormData(creds[role]);
    toast.success(`${role.charAt(0) + role.slice(1).toLowerCase()} credentials loaded!`);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/login', data),
    onSuccess: (res: any) => {
      // Backend returns { success, message, data: { user, accessToken } }
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      
      toast.success('Welcome back, Hero! 🩸');

      // Redirect to unified dynamic dashboard
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] flex items-center justify-center px-4 py-20 relative overflow-hidden transition-colors duration-500 italic">
      {/* Background Decorative - Controlled Pulse */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[30rem] h-[30rem] bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 rounded-[1.8rem] bg-red-600 dark:bg-red-600/10 text-white dark:text-red-600 mb-6 shadow-2xl shadow-red-600/20 border border-white/10">
            <Lock size={28} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black mb-3 text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">
            WELCOME <br /> BACK <span className="text-red-600">HERO</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-[0.2em] italic">YOUR MISSION CONTINUES TODAY.</p>
        </div>

        <div className="p-8 md:p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-2xl dark:shadow-black/50 backdrop-blur-[40px] transition-all duration-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">SECURE ACCESS EMAIL</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="HERO@ROKTOLAGBE.ORG"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">MISSION CLEARANCE KEY</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl pl-12 pr-12 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pr-1">
              <Link href="/forgot-password" title="Under development" className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-500 transition-colors italic">
                LOST CLEARANCE?
              </Link>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] italic flex items-center justify-center gap-3 shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {mutation.isPending ? 'VERIFYING IDENTITY...' : (
                <>SIGN IN TO MISSION <ArrowRight size={18} /></>
              )}
            </button>
          </form>

          {/* Quick Access - Minimal Glass */}
          <div className="mt-10 pt-8 border-t border-gray-50 dark:border-white/5">
            <p className="text-[8px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.4em] text-center mb-6 italic">RAPID DEMO CLEARANCE</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { role: 'DONOR', icon: Users, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-600/10' },
                { role: 'MANAGER', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-600/10' },
                { role: 'ADMIN', icon: ShieldCheck, color: 'text-gray-900 dark:text-white', bg: 'bg-gray-100 dark:bg-white/10' },
              ].map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => fillDemo(demo.role as any)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${demo.bg} ${demo.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                    <demo.icon size={16} />
                  </div>
                  <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{demo.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] italic">
          NEW TO THE MISSION? <br />
          <Link href="/register" className="text-red-600 mt-2 inline-block hover:underline decoration-2 underline-offset-4 tracking-widest">
            JOIN THE LIFE-SAVING NETWORK
          </Link>
        </p>
      </div>
    </main>
  );
}
