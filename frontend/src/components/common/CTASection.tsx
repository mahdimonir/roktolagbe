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
  title = "START SAVING LIVES TODAY.",
  subtitle = "Whether you're looking to donate or you're in an emergency, our platform is built to help you instantly.",
  primaryBtnText = "REGISTER NOW",
  primaryBtnLink = "/register",
  secondaryBtnText = "LEARN MORE",
  secondaryBtnLink = "/how-it-works",
  className = "",
  noPadding = false
}: CTASectionProps) {
  return (
    <section className={`${noPadding ? 'py-0' : 'py-12 md:py-16'} px-4 md:px-6 relative overflow-hidden bg-white ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#f2f4f7] rounded-[2rem] md:rounded-[2.5rem] px-8 py-12 md:p-20 text-center relative overflow-hidden group border border-gray-100 shadow-sm outline outline-1 outline-gray-200/50">
          {/* Subtle Pinkish Corner Arcs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FBEBEB] rounded-full blur-[40px] opacity-60 transition-opacity duration-1000 group-hover:scale-105" />
          <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] bg-[#FBEBEB] rounded-full blur-[60px] opacity-60 transition-opacity duration-1000 group-hover:scale-105" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-7xl font-black text-[#112135] tracking-tighter leading-[1] md:leading-[0.85] mb-4 uppercase italic max-w-5xl mx-auto">
              {title}
            </h2>
            <p className="text-gray-500 font-medium italic text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed opacity-80 px-2 md:px-0">
              {subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link 
                href={primaryBtnLink} 
                className="w-full sm:w-auto bg-[#CC0000] text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_rgba(204,0,0,0.25)] hover:bg-[#B30000] hover:-translate-y-1 transition-all active:scale-95 italic flex items-center justify-center"
              >
                {primaryBtnText}
              </Link>
              <Link 
                href={secondaryBtnLink} 
                className="w-full sm:w-auto bg-white text-gray-900 px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(0,0,0,0.04)] hover:bg-gray-50 hover:-translate-y-1 transition-all active:scale-95 border border-gray-100 italic flex items-center justify-center"
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
