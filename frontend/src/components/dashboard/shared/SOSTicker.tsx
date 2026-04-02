'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export const SOSTicker = () => {
  const { data } = useQuery({
    queryKey: ['sos-ticker'],
    queryFn: async () => {
      const res = await api.get('/blood-requests?limit=10&status=OPEN');
      return res.data;
    },
    refetchInterval: 30000,
  });

  const requests = (data as any)?.data?.data?.items || [];
  const urgentRequests = requests.filter((r: any) => r.isEmergency || r.urgency === 'HIGH' || r.urgency === 'CRITICAL');

  if (urgentRequests.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-100 h-10 flex items-center overflow-hidden relative shadow-sm">
      <div className="absolute left-0 top-0 bottom-0 px-6 bg-red-600 flex items-center gap-2 z-20 shadow-lg">
        <ShieldAlert size={14} className="text-white animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest text-white italic">Urgent Requests</span>
      </div>

      <motion.div 
        animate={{ x: [0, -1500] }}
        transition={{ 
          duration: 40, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex items-center gap-12 whitespace-nowrap pl-[200px]"
      >
        {urgentRequests.map((req: any, i: number) => (
          <div key={i} className="flex items-center gap-4 text-gray-500 hover:text-red-600 transition-colors cursor-default">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                {req.urgency}
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-tight italic text-gray-900">
              {req.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')} needed at {req.hospitalName}
            </span>
            <div className="flex items-center gap-1.5 opacity-60">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">{req.district}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 mx-2" />
          </div>
        ))}
        {/* Duplicate for seamless infinite scroll */}
        {urgentRequests.map((req: any, i: number) => (
          <div key={`dup-${i}`} className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-[10px] font-black uppercase italic tracking-widest text-red-600">
                {req.urgency}
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-tight italic text-gray-900">
              {req.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')} needed at {req.hospitalName}
            </span>
            <div className="flex items-center gap-1.5 opacity-60">
              <MapPin size={12} className="text-gray-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">{req.district}</span>
            </div>
            <div className="w-px h-4 bg-gray-200 mx-2" />
          </div>
        ))}
      </motion.div>

      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
    </div>
  );
};
