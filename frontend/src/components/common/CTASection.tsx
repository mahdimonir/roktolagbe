'use client';

import Link from 'next/link';

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  secondaryBtnLink?: string;
  className?: string;
  noPadding?: boolean;
}

export default function CTASection({
  title = "ACTIVATE LIFE-SAVING PROTOCOL.",
  subtitle = "Immediate action mandatory. The network depends on your vital contribution to maintain grid stability.",
  primaryBtnText = "INITIALIZE REGISTRY",
  primaryBtnLink = "/register",
  secondaryBtnText = "ACCESS PROTOCOLS",
  secondaryBtnLink = "/how-it-works",
  className = "",
  noPadding = false
}: CTASectionProps) {
  return (
    <section className={`${noPadding ? 'py-0' : 'py-8 md:py-12'} px-4 md:px-0 relative overflow-hidden bg-white dark:bg-[#0a0a0d] transition-colors duration-500 ${className} italic`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-50/30 dark:bg-white/[0.02] backdrop-blur-[40px] rounded-[4.5rem] px-8 py-16 md:py-24 md:px-20 text-center relative overflow-hidden group border border-gray-100 dark:border-white/[0.08] shadow-sm italic">
          {/* Subtle Pinkish/Reddish Corner Arcs */}
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 group-hover:scale-110 italic" />
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[40rem] h-[40rem] bg-red-600/[0.03] rounded-full blur-[160px] pointer-events-none transition-all duration-1000 group-hover:scale-110 italic" />

          <div className="relative z-10 space-y-10 md:space-y-14 italic">
             <div className="space-y-6 md:space-y-8 italic">
               <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4 uppercase italic italic mx-auto">
                 {title}
               </h2>
               <p className="text-gray-500 dark:text-gray-400 font-medium italic text-sm md:text-xl max-w-2xl mx-auto leading-relaxed px-4 md:px-0 italic">
                 {subtitle}
               </p>
             </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 italic">
              <Link 
                href={primaryBtnLink} 
                className="w-full sm:w-auto bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-14 py-8 rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-95 italic flex items-center justify-center italic"
              >
                {primaryBtnText}
              </Link>
              <Link 
                href={secondaryBtnLink} 
                className="w-full sm:w-auto bg-white dark:bg-white/10 text-gray-900 dark:text-white px-14 py-8 rounded-full text-[11px] font-black uppercase tracking-[0.4em] shadow-sm hover:bg-gray-50 dark:hover:bg-white/20 transition-all active:scale-95 border border-gray-100 dark:border-white/10 italic flex items-center justify-center italic"
              >
                {secondaryBtnText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
