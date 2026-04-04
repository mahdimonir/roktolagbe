import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Logo />
            <p className="text-sm text-gray-600 leading-relaxed mt-4 max-w-xs md:max-w-none">
              Simplifying blood donation for everyone. Connecting heroes with those in need 🩸
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold mb-4 text-gray-900 uppercase text-[10px] tracking-widest italic">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium italic">
              <li><Link href="/urgent-requests" className="hover:text-red-500 transition-colors">Urgent Requests</Link></li>
              <li><Link href="/donors" className="hover:text-red-500 transition-colors">Find Donors</Link></li>
              <li><Link href="/register" className="hover:text-red-500 transition-colors">Become a Donor</Link></li>
              <li><Link href="/saved-lives" className="hover:text-red-500 transition-colors">Saved Lives Stories 🩸</Link></li>
              <li><Link href="/rewards" className="hover:text-red-500 transition-colors text-red-600 font-black">Donor Rewards 🎁</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold mb-4 text-gray-900 uppercase text-[10px] tracking-widest italic">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium italic">
              <li><Link href="/faq" className="hover:text-red-500 transition-colors">FAQ Center</Link></li>
              <li><Link href="/how-it-works" className="hover:text-red-500 transition-colors">How it Works</Link></li>
              <li><Link href="/eligibility" className="hover:text-red-500 transition-colors">Donor Eligibility</Link></li>
              <li><Link href="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact Help</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="font-bold mb-4 text-gray-900 uppercase text-[10px] tracking-widest italic">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-medium italic">
              <li><Link href="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-500 transition-colors">Terms of Use</Link></li>
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
