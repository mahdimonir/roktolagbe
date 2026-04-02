'use client';

import { Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { Mail, ShieldCheck, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const id = searchParams.get('id');

  const { data, isLoading, error } = useQuery({
    queryKey: ['verify-email', token, id],
    queryFn: async () => {
      if (!token || !id) throw new Error('Invalid verification link.');
      const res: any = await api.get(`/auth/verify-email?token=${token}&id=${id}`);
      return res.data;
    },
    enabled: !!token && !!id,
    retry: false,
  });

  // Use useEffect for side effects in TanStack Query v5
  useEffect(() => {
    if (data) {
      toast.success('Your hero account is now active! 🩸');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error((error as any).response?.data?.message || error.message || 'Verification failed.');
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center">

        {/* State 1: Invalid Link */}
        {(!token || !id) && (
          <div className="glass p-12 rounded-[4rem] bg-white border-gray-100 shadow-2xl">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 italic uppercase mb-4 tracking-tighter">Broken Link</h1>
            <p className="text-gray-500 italic font-bold mb-10 leading-relaxed">
              The verification link appears to be malformed or incomplete. Please check your email again.
            </p>
            <Link href="/register" className="btn-primary w-full block text-center py-4 rounded-2xl">
              Back to Registration
            </Link>
          </div>
        )}

        {/* State 2: Loading / Verifying */}
        {isLoading && (token && id) && (
          <div className="space-y-8 animate-pulse">
            <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-spin-slow">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 italic uppercase tracking-widest">Verifying Hero Stat...</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Establishing secure connection</p>
          </div>
        )}

        {/* State 3: Success */}
        {data && (
          <div className="glass p-12 rounded-[4rem] bg-white border-gray-100 shadow-2xl animate-scale-in">
            <div className="relative">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="absolute top-0 right-1/4">
                <ShieldCheck className="w-6 h-6 text-green-500/20" />
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 italic uppercase mb-2 tracking-tighter">Welcome, Hero!</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 italic">Account Verified Successfully</p>

            <p className="text-gray-500 italic font-bold mb-10 leading-relaxed px-4">
              {data.message || "Your medical record is now active. You are officially part of our life-saving network."}
            </p>

            <Link href="/login" className="bg-gray-900 text-white w-full py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 group">
              Proceed to Login
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}

        {/* State 4: Error / Expired */}
        {error && (
          <div className="glass p-12 rounded-[4rem] bg-white border-gray-100 shadow-2xl animate-shake">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Mail className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 italic uppercase mb-4 tracking-tighter">Verification Failed</h1>
            <p className="text-gray-500 italic font-bold mb-10 leading-relaxed">
              {(error as any).response?.data?.message || (error as any).message || "The verification link might have expired after 24 hours."}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/contact" className="py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                Support
              </Link>
              <Link href="/register" className="py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">
                Try Again
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer Branding */}
      <div className="mt-16 flex items-center gap-2 opacity-20">
        <span className="text-2xl font-black italic text-gray-900 uppercase tracking-tighter">RoktoLagbe</span>
        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
        <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Official Verification Portal</span>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex justify-center items-center"><span className="animate-pulse">Loading verification...</span></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
