'use client';
import { useAuthStore } from '@/store/auth-store';
import { ChevronDown, LayoutDashboard, LogOut, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import ThemeSwitcher from './ThemeSwitcher';

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
    { name: 'Organizations', href: '/organizations' },
  ];

  const resourceLinks = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Eligibility', href: '/eligibility' },
    { name: 'Support Hub', href: '/help' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <>
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    } bg-white/70 dark:bg-[#0a0a0d]/40 backdrop-blur-[50px] border-b border-gray-100 dark:border-white/[0.08]`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-14 md:h-16 items-center">
          {/* Logo */}
          <div className="scale-90 md:scale-100 origin-left">
            <Logo />
          </div>

          {/* Nav Links - Desktop Center */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-black uppercase tracking-[0.2em] italic transition-all hover:text-red-500 hover:scale-105 ${
                  pathname === link.href ? 'text-red-500' : 'text-gray-900 dark:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative group/res">
              <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] italic text-gray-900 dark:text-white group-hover/res:text-red-500 transition-all">
                Resources <ChevronDown size={12} className="group-hover/res:rotate-180 transition-transform duration-300" />
              </button>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/res:opacity-100 group-hover/res:visible transition-all duration-300">
                <div className="w-52 bg-white/90 dark:bg-[#0a0a0d]/80 backdrop-blur-[40px] rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-white/[0.08] py-3 overflow-hidden">
                  {resourceLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className="block px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] italic text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 transition-all"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA / Auth / Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block"><ThemeSwitcher /></div>
            <div className="hidden md:flex items-center gap-4">
              {!mounted ? (
                <div className="w-20 h-8 bg-gray-50 dark:bg-white/5 rounded-xl animate-pulse" />
              ) : isAuthenticated ? (
                <div className="relative nav-dropdown">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 group p-0.5 pr-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-[10px] italic shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                      {user?.name?.charAt(0).toUpperCase() || <User size={12} />}
                    </div>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-56 bg-white/90 dark:bg-[#0a0a0d]/90 backdrop-blur-[40px] rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-white/[0.08] py-3 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-5 py-3 border-b border-gray-100 dark:border-white/5 mb-2">
                         <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Authorized Hero</p>
                         <p className="text-xs font-black text-gray-900 dark:text-white truncate italic uppercase tracking-tighter">{user?.name || 'Verified Hero'}</p>
                         <p className="text-[9px] text-gray-400 truncate italic">{user?.email}</p>
                      </div>
                      
                      <Link 
                        href={getDashboardLink()}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest italic text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
                      >
                        <LayoutDashboard size={16} />
                        My Dashboard
                      </Link>

                      <button
                        onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-[11px] font-black uppercase tracking-widest italic text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all border-t border-gray-100 dark:border-white/5"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-[11px] font-black uppercase tracking-widest italic text-gray-600 dark:text-gray-400 hover:text-red-500 hidden sm:block"
                  >
                    Login
                  </Link>
                  <Link href="/register" className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest italic px-5 py-2 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/10">
                    Join Now
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors menu-toggle-btn"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Sidebar Overlay */}
    {isMenuOpen && (
      <div 
        className="fixed inset-0 bg-[#0a0a0d]/40 backdrop-blur-md z-[55] lg:hidden transition-opacity animate-in fade-in duration-300" 
        onClick={() => setIsMenuOpen(false)} 
      />
    )}

    {/* Mobile Sidebar - Enhanced Glassmorphism */}
    <div className={`fixed top-0 right-0 h-screen w-[70%] sm:w-[50%] bg-white/95 dark:bg-[#0a0a0d]/90 backdrop-blur-[50px] z-[60] shadow-2xl transition-transform duration-500 ease-in-out lg:hidden mobile-menu-container border-l border-gray-100 dark:border-white/[0.08] ${
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
              
              <div className="pt-4 space-y-4">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4">Resources</p>
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-xs font-black italic uppercase tracking-widest transition-colors ${
                      pathname === link.href ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

          {/* Theme Toggle */}
          <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Appearance</span>
            <ThemeSwitcher />
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
