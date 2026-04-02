'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from 'sonner';
import GlobalAlert from "@/components/common/GlobalAlert";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <QueryProvider>
      <Toaster 
        position="top-center"
        richColors
        expand={false}
      />
      <GlobalAlert />
      {!isDashboard && <Navbar />}
      <main className={`min-h-screen ${!isDashboard ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!isDashboard && <Footer />}
    </QueryProvider>
  );
}
