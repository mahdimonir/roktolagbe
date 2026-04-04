'use client';
import { useAuthStore } from '@/store/auth-store';
import { ChevronDown, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as HTMLElement).closest('.nav-dropdown')) {
        setIsDropdownOpen(false);
      }
      if (isMenuOpen && !(event.target as HTMLElement).closest('.mobile-menu-container') && !(event.target as HTMLElement).closest('.menu-toggle-btn')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, isMenuOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    return '/dashboard';
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMenuOpen(false);
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
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } glass border-b border-gray-100 shadow-sm shadow-gray-200/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Logo />

          {/* Nav Links - Desktop UNTOUCHED */}
          <div className="hidden lg:flex items-center gap-8">
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

          {/* CTA / Auth / Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
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

            {/* Mobile Toggle Button - Strictly Right of the existing Auth elements */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors menu-toggle-btn"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Sidebar Overlay */}
    {isMenuOpen && (
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden transition-opacity animate-in fade-in duration-300" 
        onClick={() => setIsMenuOpen(false)} 
      />
    )}

    {/* Mobile Sidebar - Right side 50% */}
    <div className={`fixed top-0 right-0 h-screen w-[65%] sm:w-[50%] bg-white z-[60] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden mobile-menu-container ${
      isMenuOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="flex flex-col h-full italic font-black text-gray-900">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Protocol Menu</p>
          <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-red-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {/* Navigation Links */}
          <div className="space-y-5">
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6">Clinical Access</p>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-black italic uppercase tracking-widest transition-colors ${
                  pathname === link.href ? 'text-red-600' : 'text-gray-900 hover:text-red-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="pt-10 border-t border-gray-50 space-y-8">
            {!mounted ? null : isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-black text-gray-900 uppercase tracking-tighter truncate">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 italic truncate font-medium">{user?.email}</p>
                </div>
                <Link 
                  href={getDashboardLink()}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center gap-3 text-sm font-black text-gray-600 hover:text-red-600 transition-all uppercase tracking-widest italic"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 text-sm font-black text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest italic pt-4"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white border border-gray-100 text-gray-900 px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest italic text-center"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-red-600 text-white px-6 py-4 rounded-full text-xs font-black uppercase tracking-widest italic text-center shadow-lg shadow-red-600/20"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
