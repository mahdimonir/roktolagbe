'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Welcome Back 🩸</h1>
        <p className="text-gray-500">Your presence saves lives. Sign in to continue.</p>
      </div>

      <div className="glass p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Email Address</label>
            <input 
              type="email" 
              placeholder="e.g., hero@roktolagbe.com"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition-all pr-12"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-gray-400 hover:text-red-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" title="Coming soon!" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full btn-primary py-4 text-lg"
          >
            {mutation.isPending ? 'Verifying...' : 'Sign In 🩸'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Don't have an account yet? <br />
        <Link href="/register" className="text-red-500 font-black mt-2 inline-block hover:underline">
          Join the Life-Saving Network
        </Link>
      </p>
    </div>
  );
}
