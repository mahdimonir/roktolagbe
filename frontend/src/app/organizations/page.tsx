'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import Link from 'next/link';
import CTASection from '@/components/common/CTASection';

export default function OrganizationsPage() {
  const { data: managersData, isLoading } = useQuery({
    queryKey: ['public-managers'],
    queryFn: () => api.get('/public/organizations'),
  });

  const organizations = managersData?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Our Medical Partners 🏥</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          We collaborate with verified hospitals and humanitarian organizations to ensure a fast and safe blood supply chain.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-64 animate-pulse rounded-3xl bg-gray-50"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizations.map((org: any) => (
            <div key={org.id} className="glass p-8 rounded-3xl hover:border-red-500/20 transition-all shadow-xl group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-3xl shadow-sm">
                  {org.type === 'hospital' ? '🏥' : '🏢'}
                </div>
                {org.isVerified && (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    Verified
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-500 transition-colors">{org.name}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{org.type}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="opacity-50 text-base">📍</span> {org.district}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="opacity-50 text-base">📞</span> {org.contactPhone}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                <Link href={`/organizations/${org.id}`} className="text-xs font-black text-red-500 hover:text-red-700 uppercase tracking-widest transition-colors flex items-center gap-2">
                  View Hero Hub 🛡️
                </Link>
                <div className="text-right">
                   <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Impact</p>
                   <p className="text-sm font-bold text-gray-900 leading-none">{org._count?.bloodRequests || 0} Requests</p>
                </div>
              </div>
            </div>
          ))}
          {organizations.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-gray-100 rounded-3xl p-20 text-center text-gray-400">
              No medical partners listed currently. Organizations can join via the registration page.
            </div>
          )}
        </div>
      )}

      {/* Join CTA */}
      <CTASection 
        title="REPRESENT AN ORGANIZATION?"
        subtitle="Join our network to manage your blood bank efficiently and reach thousands of volunteer donors instantly. Register as a medical partner today."
        primaryBtnText="REGISTER NOW"
        primaryBtnLink="/register"
        secondaryBtnText="ABOUT PARTNERSHIP"
        secondaryBtnLink="/about"
      />
    </div>
  );
}
