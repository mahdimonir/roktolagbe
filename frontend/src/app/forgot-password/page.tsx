'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle2, Lock } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden italic">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-500/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl shadow-red-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.01] blur-3xl -mr-16 -mt-16" />
          
          <div className="relative z-10">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 ${isSent ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {isSent ? <CheckCircle2 size={32} /> : <Lock size={32} />}
            </div>

            <h1 className="text-4xl font-black text-gray-900 tracking-tight italic uppercase leading-none mb-4">
              {isSent ? 'Check Your Email' : 'Reset Password'}
            </h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10 leading-relaxed italic">
              {isSent 
                ? `We've sent a password reset link to ${email}. Check your inbox to proceed.`
                : 'Enter your email address to receive a link to reset your password.'}
            </p>

            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4 italic px-2">Email Address</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      placeholder="your@email.com"
                      className="w-full bg-gray-50 border border-transparent rounded-[1.5rem] py-4 px-12 outline-none focus:bg-white focus:border-red-600 transition-all font-bold italic placeholder:text-gray-300 shadow-inner"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-red-600 transition-all" size={18} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-red-600 transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase italic tracking-widest text-xs"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setIsSent(false)}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-black transition-all uppercase italic tracking-widest text-xs"
                >
                  Try Different Email
                </button>
                <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4 italic">
                  Didn't receive email? <button className="text-red-600 hover:underline">Resend Email</button>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] italic leading-none">RoktoLagbe Security</p>
        </div>
      </div>
    </div>
  );
}
