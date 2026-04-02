'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  const menuItems = [
    { name: 'Analytics', href: '/dashboard', tabMatch: 'overview', icon: '📊' },
    { name: 'Organizations', href: '/dashboard?tab=organizations', tabMatch: 'organizations', icon: '🏥' },
    { name: 'Users', href: '/dashboard?tab=users', tabMatch: 'users', icon: '👥' },
    { name: 'Requests', href: '/dashboard?tab=requests', tabMatch: 'requests', icon: '🚨' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass md:min-h-screen border-r border-gray-100 p-6">
        <div className="mb-10 text-center md:text-left">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <span className="text-red-500">🛡️</span> Admin Panel
           </h2>
           <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Platform Control</p>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = currentTab === item.tabMatch;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive 
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-10">
           <Link href="/" className="text-xs font-bold text-gray-400 hover:text-red-500 flex items-center gap-2">
             ← Exit to Site
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        {children}
      </main>
    </div>
  );
}
