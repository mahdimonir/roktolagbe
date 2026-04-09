import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0a0a0d] border-t border-gray-100 dark:border-white/[0.08] pt-16 pb-8 italic">
      <div className="max-w-7xl mx-auto px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-600/[0.01] dark:bg-red-600/[0.02] blur-[120px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left mb-16 relative z-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
            <div className="scale-90 md:scale-100 origin-left">
              <Logo />
            </div>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed mt-6 mb-8 max-w-xs font-medium">
               Empowering communities through life-saving donations. Every drop counts. 🩸
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#', color: 'hover:text-blue-600' },
                { icon: Twitter, href: '#', color: 'hover:text-sky-500' },
                { icon: Instagram, href: '#', color: 'hover:text-pink-600' },
                { icon: Youtube, href: '#', color: 'hover:text-red-600' },
              ].map((social, i) => (
                <a key={i} href={social.href} className={`w-9 h-9 rounded-xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.08] flex items-center justify-center text-gray-400 ${social.color} transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 backdrop-blur-md group`}>
                  <social.icon size={16} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase text-[9px] tracking-[0.3em]">Quick Access</h4>
            <ul className="space-y-3 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              <li><Link href="/urgent-requests" className="hover:text-red-600 transition-colors">Urgent Requests</Link></li>
              <li><Link href="/donors" className="hover:text-red-600 transition-colors">Find Donors</Link></li>
              <li><Link href="/register" className="hover:text-red-600 transition-colors">Become a Donor</Link></li>
              <li><Link href="/saved-lives" className="hover:text-red-600 transition-colors text-red-600 font-black">History Wall 🩸</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase text-[9px] tracking-[0.3em]">Support Hub</h4>
            <ul className="space-y-3 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              <li><Link href="/help" className="hover:text-red-600 transition-colors font-black text-red-600">Protocol Help 🛡️</Link></li>
              <li><Link href="/how-it-works" className="hover:text-red-600 transition-colors">Flow & Process</Link></li>
              <li><Link href="/eligibility" className="hover:text-red-600 transition-colors">Donor Safety</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">Our Vision</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-black mb-6 text-gray-900 dark:text-white uppercase text-[9px] tracking-[0.3em]">Legalese</h4>
            <ul className="space-y-3 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              <li><Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-600 transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500 font-medium italic">
          <p>© {new Date().getFullYear()} RoktoLagbe. Simplified blood donation for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
