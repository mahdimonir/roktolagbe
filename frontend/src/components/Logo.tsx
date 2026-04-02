'use client';

import NextLink from 'next/link';

interface LogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  iconSize?: number;
}

export default function Logo({ variant = 'full', className = '', iconSize = 28 }: LogoProps) {
  return (
    <NextLink href="/" className={`flex items-center gap-2 group ${className}`}>
      <div className="relative">
        <div className="bg-red-500 text-white p-2 rounded-2xl shadow-xl shadow-red-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-out">
           <svg 
             width={iconSize} 
             height={iconSize} 
             viewBox="0 0 24 24" 
             fill="none" 
             xmlns="http://www.w3.org/2000/svg"
           >
             <path 
               d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 9.85786 12 3 12 3C12 3 4.5 9.85786 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" 
               fill="currentColor" 
             />
             <path 
                d="M12 5L12 11" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                className="opacity-20"
             />
             <circle cx="9" cy="14" r="1.5" fill="white" className="opacity-40" />
           </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full blur-[3px] animate-pulse opacity-30" />
      </div>
      
      {variant === 'full' && (
        <span className="text-2xl font-black tracking-tighter italic uppercase text-gray-900 group-hover:text-red-500 transition-colors duration-700 ease-in-out">
          Rokto<span className="text-red-500">Lagbe</span>
        </span>
      )}
    </NextLink>
  );
}
