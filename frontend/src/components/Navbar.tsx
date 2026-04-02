'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard, ChevronDown, Search, MapPin, Phone } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as HTMLElement).closest('.nav-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    return '/dashboard';
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  const navLinks = [
    { name: 'Urgent Requests', href: '/urgent-requests' },
    { name: 'Find Donors', href: '/donors' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Organizations', href: '/organizations' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } glass border-b border-gray-100 shadow-sm shadow-gray-200/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Logo />

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  pathname === link.href ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA / Auth */}
          <div className="flex items-center gap-4">
            {!mounted ? (
              <div className="w-24 h-9 bg-gray-50 rounded-xl animate-pulse" />
            ) : isAuthenticated ? (
              <div className="relative nav-dropdown">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 group p-1 pr-2 rounded-full hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-red-500 border border-red-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                    {user?.name?.charAt(0).toUpperCase() || <User size={14} />}
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-5 py-3 border-b border-gray-50 mb-2">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 italic">Welcome back,</p>
                       <p className="text-sm font-black text-gray-900 truncate">{user?.name || 'Verified Hero'}</p>
                       <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                    </div>
                    
                    <Link 
                      href={getDashboardLink()}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all"
                    >
                      <LayoutDashboard size={18} />
                      My Dashboard
                    </Link>

                    <button
                      onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border-t border-gray-50"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-gray-600 hover:text-red-500 hidden sm:block"
                >
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm px-6 py-2">
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
