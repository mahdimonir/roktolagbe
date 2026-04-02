'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

// Dynamic import to avoid SSR errors with Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

// Helper to update map view
const ChangeView = dynamic(() => import('react-leaflet').then(mod => {
  return function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = mod.useMap();
    useEffect(() => {
      map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
  };
}), { ssr: false });

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  if (typeof window === 'undefined') return;
  const L = require('leaflet');
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

// Helper to simulate coordinates for Bangladesh districts (Center points)
const districtCoords: Record<string, [number, number]> = {
  'Dhaka': [23.8103, 90.4125],
  'Chittagong': [22.3569, 91.7832],
  'Sylhet': [24.8949, 91.8687],
  'Rajshahi': [24.3745, 88.6042],
  'Khulna': [22.8456, 89.5403],
  'Barisal': [22.7010, 90.3535],
  'Rangpur': [25.7439, 89.2752],
  'Mymensingh': [24.7471, 90.4203],
};

export default function DonorMap() {
  const [activeDistrict, setActiveDistrict] = useState('Dhaka');

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const { data: donorsData } = useQuery({
    queryKey: ['map-donors'],
    queryFn: () => api.get('/donors'), // This gets anonymized donors
  });

  const { data: orgsData } = useQuery({
    queryKey: ['map-orgs'],
    queryFn: () => api.get('/public/organizations'),
  });

  const donors = donorsData?.data || [];
  const orgs = orgsData?.data || [];

  return (
    <div className="h-[calc(100vh-64px)] w-full relative flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white shadow-2xl z-10 p-6 flex flex-col">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Social Map 📍</h1>
        <p className="text-xs text-gray-500 mb-6">Explore the RoktoLagbe network in real-time across districts.</p>
        
        <div className="space-y-4 mb-8">
           <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Active Donors</p>
              <p className="text-2xl font-black text-gray-900">{donors.length}</p>
           </div>
           <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Verified Partners</p>
              <p className="text-2xl font-black text-gray-900">{orgs.length}</p>
           </div>
        </div>

        <div className="mt-auto">
          <p className="text-xs font-bold text-gray-400 uppercase mb-4">Jump To District</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(districtCoords).map(d => (
              <button 
                key={d}
                onClick={() => setActiveDistrict(d)}
                className={`px-3 py-2 rounded-xl text-[10px] font-bold transition-all ${activeDistrict === d ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 bg-gray-100 relative">
        <MapContainer 
          center={districtCoords[activeDistrict]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={districtCoords[activeDistrict]} zoom={12} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Org Markers */}
          {orgs.map((org: any) => {
            const coords = districtCoords[org.district];
            if (!coords) return null;
            // Add slight jitter for multiple Orgs in same district
            const pos: [number, number] = [coords[0] + (Math.random() - 0.5) * 0.05, coords[1] + (Math.random() - 0.5) * 0.05];
            
            return (
              <Marker key={org.id} position={pos}>
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-gray-900">{org.name}</p>
                    <p className="text-xs text-red-500 font-bold uppercase">{org.type}</p>
                    <p className="text-[10px] text-gray-500 mt-2">Verified Partner 🏥</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Donor Clusters (Approximate) */}
          {donors.map((donor: any, idx: number) => {
            const coords = districtCoords[donor.district];
            if (!coords) return null;
            const pos: [number, number] = [coords[0] + (Math.random() - 0.5) * 0.08, coords[1] + (Math.random() - 0.5) * 0.08];
            
            return (
              <Marker key={idx} position={pos}>
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-gray-900">Hero Donor 🩸</p>
                    <p className="text-xs text-red-500 font-bold uppercase">{donor.bloodGroup}</p>
                    <p className="text-[10px] text-gray-500 mt-2">Ready to save a life!</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
