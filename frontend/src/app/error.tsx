'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw, Home, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-xl w-full text-center relative z-10 animate-fade-in">
        <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-red-500/10 border border-red-50">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-6 tracking-tighter uppercase italic">
          System <span className="text-red-500 underline decoration-red-500/20 underline-offset-8">Interruption</span>.
        </h1>
        
        <p className="text-gray-600 mb-8 max-w-sm mx-auto italic font-medium">
          Our specialized team has been alerted about this technical pulse interruption. We are working to restore the lifeline.
          <br /><br />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-100">
            Error ID: {error.digest || 'ERR-INTERNAL-001'}
          </span>
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <button 
             onClick={() => reset()} 
             className="btn-primary px-10 py-4 flex items-center gap-2 text-sm uppercase tracking-widest font-black w-full sm:w-auto justify-center"
           >
              <RefreshCcw className="w-4 h-4" />
              Pulse Restart
           </button>
           <Link href="/" className="bg-white border border-gray-100 text-gray-900 px-10 py-4 rounded-full flex items-center gap-2 text-sm uppercase tracking-widest font-black hover:bg-gray-50 transition-all w-full sm:w-auto justify-center">
              <Home className="w-4 h-4" />
              Withdraw Home
           </Link>
        </div>

        <div className="mt-16 p-6 bg-red-50 rounded-[2.5rem] border border-red-100/50">
           <p className="text-xs text-red-600 leading-relaxed font-bold italic">
              "Every drop counts, even the digital ones. We're on it."
           </p>
        </div>
      </div>
    </div>
  );
}
