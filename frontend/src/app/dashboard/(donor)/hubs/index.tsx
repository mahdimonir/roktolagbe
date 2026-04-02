'use client';

import { api } from '@/lib/api/axios';
import { ManagerProfile, PaginatedResponse } from '@/lib/types/models';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Hospital,
  Landmark,
  MapPin,
  Phone,
  Search,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

export default function HospitalDiscovery() {
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  const { data: hospitalsData, isLoading } = useQuery<PaginatedResponse<ManagerProfile>>({
    queryKey: ['hospitals-discovery', search, district],
    queryFn: () => api.get(`/admin/hospitals?search=${search}&district=${district}&verified=true`),
  });

  const hospitals = hospitalsData?.data || [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 italic">
        <div className="flex items-center gap-6 italic">
          <div className="w-16 h-16 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-xl text-white italic">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="italic">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none italic">Partner Hospitals</h1>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 bg-gray-50 px-4 py-1.5 rounded-full inline-block border border-gray-100 italic">Browse registered healthcare facilities</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center italic">
        <div className="relative group flex-1 w-full italic">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors italic" size={18} />
          <input 
            type="text" 
            placeholder="Search by hospital name..." 
            className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-16 pr-6 outline-none font-bold italic focus:bg-white focus:border-red-600 transition-all shadow-inner italic"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto italic">
           <div className="relative flex-1 md:w-48 italic">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-red-600" size={16} />
              <input 
                type="text"
                placeholder="District..."
                className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-12 pr-4 outline-none font-bold italic focus:bg-white focus:border-red-600 transition-all shadow-inner italic text-xs"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
           </div>
        </div>
      </div>

      {/* Hospital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 italic">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-50 rounded-[3rem] animate-pulse italic" />
          ))
        ) : hospitals.map((hospital) => (
          <div 
            key={hospital.id} 
            className="bg-white p-8 rounded-[3.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col italic"
          >
            <div className="flex justify-between items-start mb-8 italic">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden shadow-inner italic">
                {hospital.logoUrl ? (
                  <img src={hospital.logoUrl} alt={hospital.name} className="w-full h-full object-cover" />
                ) : (
                  <Landmark className="text-gray-300" size={28} />
                )}
              </div>
              <div className="flex flex-col items-end gap-2 italic">
                 <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 italic">
                   {hospital.type}
                 </span>
                 {hospital.isVerified && (
                   <div className="p-1 bg-green-50 text-green-600 rounded-lg italic">
                      <ShieldCheck size={14} />
                   </div>
                 )}
              </div>
            </div>

            <div className="flex-1 space-y-4 italic">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter italic uppercase truncate leading-none group-hover:text-red-600 transition-colors italic">
                {hospital.name}
              </h3>
              <div className="flex items-center gap-2 text-gray-400 italic">
                <MapPin size={12} className="text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-widest italic">{hospital.district}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50 italic">
                <div className="italic">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1 italic">Staff</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none italic">{hospital._count?.members || 0}</p>
                </div>
                <div className="italic">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-1 italic">Requests</p>
                    <p className="text-2xl font-black text-gray-900 tracking-tighter italic leading-none italic">{hospital._count?.bloodRequests || 0}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 italic">
              <a 
                href={`tel:${hospital.contactPhone}`}
                className="w-full h-14 bg-gray-50 text-gray-900 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all shadow-sm italic"
              >
                <Phone size={14} className="text-red-600" /> Contact Facility
              </a>
            </div>
          </div>
        ))}

        {hospitals.length === 0 && !isLoading && (
          <div className="col-span-full py-40 text-center bg-gray-50 rounded-[4rem] border-4 border-dashed border-gray-100 italic">
             <Hospital className="w-20 h-20 text-gray-200 mx-auto mb-8 italic" />
             <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter italic">No hospitals found</h3>
             <p className="text-gray-400 italic text-[11px] font-black uppercase tracking-widest mt-4 italic">No matching healthcare facilities detected.</p>
          </div>
        )}
      </div>

    </div>
  );
}
