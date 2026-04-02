'use client';

import Link from 'next/link';
import { Search, Home, ArrowLeft, Ghost, Zap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden italic">
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-100/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-2xl w-full text-center relative z-10 animate-fade-in">
        <div className="mb-12 relative flex justify-center">
            {Ghost && <Ghost className="w-32 h-32 text-red-500/10 absolute -top-8 animate-bounce" />}
            <h1 className="text-[12rem] font-black text-gray-900 leading-none tracking-tighter opacity-5">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic underline decoration-red-500/20 underline-offset-8">Page <span className="text-red-500 italic">Lost</span></span>
            </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight italic leading-tight">
          Even Heroes <br /> Get <span className="text-red-500 italic">Lost</span> Sometimes.
        </h2>
        
        <p className="text-gray-400 mb-12 max-w-md mx-auto italic font-bold text-sm">
          The page you are looking for might have been moved, deleted, or perhaps it never existed in our network.
        </p>

        {/* Search Suggestion - Refactored bg-gray-900 */}
        <div className="max-w-md mx-auto relative mb-12 group">
            <input 
              type="text" 
              placeholder="Try searching for 'donor', 'hospitals', or 'faq'..." 
              className="w-full bg-white border-2 border-gray-100 rounded-full py-4 px-6 pr-14 focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all text-sm italic font-bold shadow-xl shadow-gray-200/40"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-gray-900 transition-all cursor-pointer">
                <Search className="w-4 h-4" />
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link href="/" className="px-10 py-4 bg-red-600 text-white rounded-full flex items-center gap-3 text-xs uppercase tracking-widest font-black w-full sm:w-auto justify-center shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all">
              <Home className="w-4 h-4" />
              Return Home
           </Link>
           <button onClick={() => window.history.back()} className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-full flex items-center gap-3 text-xs uppercase tracking-widest font-black hover:bg-gray-50 transition-all w-full sm:w-auto justify-center shadow-sm">
              <ArrowLeft className="w-4 h-4" />
              Go Back
           </button>
        </div>

        <div className="mt-20 pt-12 border-t border-gray-50">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-6 italic underline decoration-red-500/10">Help Resources</p>
           <div className="flex justify-center gap-10 text-xs font-bold text-gray-400 uppercase italic">
              <Link href="/faq" className="hover:text-red-500 transition-colors">Help Center</Link>
              <Link href="/contact" className="hover:text-red-500 transition-colors">Emergency Support</Link>
              <Link href="/how-it-works" className="hover:text-red-500 transition-colors">Process Guide</Link>
           </div>
        </div>
      </div>
    </div>
  );
}
