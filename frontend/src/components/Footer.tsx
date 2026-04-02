import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Logo />
            <p className="text-sm text-gray-600 leading-relaxed">
              Simplifying blood donation for everyone. Connecting heroes with those in need 🩸
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/urgent-requests" className="hover:text-red-500">Urgent Requests</Link></li>
              <li><Link href="/donors" className="hover:text-red-500">Find Donors</Link></li>
              <li><Link href="/register" className="hover:text-red-500">Become a Donor</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-900 uppercase text-[10px] tracking-widest italic">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/faq" className="hover:text-red-500 italic">FAQ Center</Link></li>
              <li><Link href="/how-it-works" className="hover:text-red-500 italic">How it Works</Link></li>
              <li><Link href="/eligibility" className="hover:text-red-500 italic">Donor Eligibility</Link></li>
              <li><Link href="/about" className="hover:text-red-500 italic">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 italic">Contact Help</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-gray-900">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/privacy" className="hover:text-red-500">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-red-500">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} RoktoLagbe. Simplified blood donation for everyone.</p>
        </div>
      </div>
    </footer>
  );
}
