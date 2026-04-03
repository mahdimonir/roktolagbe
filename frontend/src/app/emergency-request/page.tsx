'use client';
import { LocationSelector } from '@/components/common/LocationSelector';
import { api } from '@/lib/api/axios';
import { useMutation } from '@tanstack/react-query';
import {
  Activity, AlertTriangle, Calendar, ChevronLeft,
  Droplets,
  Hospital,
  Info,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope, Thermometer,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const BLOOD_GROUPS = ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'];

export default function EmergencyRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bloodGroup: '',
    division: '',
    district: '',
    thana: '',
    contactPhone: '',
    units: 1,
    hospitalName: '',
    patientCondition: '',
    patientName: '',
    patientAge: '',
    patientGender: 'MALE',
    relationship: '',
    hemoglobin: '',
    deadline: '',
    detailedAddress: '',
    isEmergency: true,
    notes: '',
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/blood-requests/emergency', data),
    onSuccess: (res: any) => {
      toast.success('Emergency Broadcast Dispatched! 🚨 Nearby heroes notified.');
      router.push(`/urgent-requests/${res.data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to dispatch broadcast.');
    }
  });

  const handleLocationChange = (field: string, value: string) => {
    if (field === 'division') {
      setFormData(prev => ({ ...prev, division: value, district: '', thana: '' }));
    } else if (field === 'district') {
      setFormData(prev => ({ ...prev, district: value, thana: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bloodGroup || !formData.district || !formData.contactPhone || !formData.hospitalName) {
      toast.error('Essential parameters missing for broadcast initiation.');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20 selection:bg-red-100 selection:text-red-600">
      {/* Dynamic Hero Header */}
      <div className="relative h-64 lg:h-80 overflow-hidden bg-gray-900 flex items-center justify-center text-center px-6">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.15)_0%,transparent_70%)] opacity-50" />
         <div className="relative z-10 space-y-6 animate-in slide-in-from-top-8 duration-1000">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-red-500 tracking-[0.4em] bg-red-500/10 px-6 py-2 rounded-full border border-red-500/20 mb-4 hover:scale-105 transition-all">
               <ChevronLeft size={14} /> Back to Nexus
            </Link>
            <h1 className="text-4xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">Emergency <span className="text-red-500 shadow-red-500/20">SOS Broadcast</span></h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] max-w-2xl mx-auto opacity-70">Initiate global Lifeline protocols. Near-real-time donor synchronization will activate across regional nodes.</p>
         </div>
         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-16 lg:-mt-20 relative z-20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Dispatch Form */}
          <div className="lg:col-span-8 space-y-10">
            <div className="bg-white p-10 lg:p-16 rounded-[4rem] shadow-2xl shadow-red-500/5 border border-gray-100 space-y-12">
               
               {/* Clinical Parameters */}
                <div className="space-y-10">
                   <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.4em] flex items-center gap-4 italic border-b border-gray-50 pb-6">
                      <Stethoscope size={18} className="text-red-500" /> Clinical Data Protocol
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Blood Group Matrix *</label>
                       <div className="relative group">
                         <select
                           className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all font-black text-gray-900 appearance-none italic shadow-inner"
                           value={formData.bloodGroup}
                           onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                           required
                         >
                           <option value="">Select Group</option>
                           {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g.replace('_POS', '+').replace('_NEG', '-')}</option>)}
                         </select>
                         <Droplets className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 group-focus-within:animate-bounce" fill="currentColor" />
                       </div>
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Volume (Bags) *</label>
                       <input
                         type="number"
                         min="1"
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black text-gray-900 italic shadow-inner"
                         value={formData.units}
                         onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) })}
                         required
                       />
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Patient Name</label>
                       <input
                         type="text"
                         placeholder="Full name of patient"
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold italic shadow-inner"
                         value={formData.patientName}
                         onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                       />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Age</label>
                          <input
                            type="text"
                            placeholder="e.g. 25"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold italic shadow-inner"
                            value={formData.patientAge}
                            onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Gender</label>
                          <select
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black text-gray-900 appearance-none italic shadow-inner"
                            value={formData.patientGender}
                            onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Relationship to Seeker</label>
                       <input
                         type="text"
                         placeholder="e.g. Brother, Self, Friend"
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold italic shadow-inner"
                         value={formData.relationship}
                         onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                       />
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Patient Condition</label>
                       <input
                         type="text"
                         placeholder="e.g. Critical Surgery"
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold italic shadow-inner"
                         value={formData.patientCondition}
                         onChange={(e) => setFormData({ ...formData, patientCondition: e.target.value })}
                       />
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Hb Level (g/dL)</label>
                       <div className="relative group">
                          <input
                            type="text"
                            placeholder="e.g. 7.2"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black italic shadow-inner"
                            value={formData.hemoglobin}
                            onChange={(e) => setFormData({ ...formData, hemoglobin: e.target.value })}
                          />
                          <Thermometer className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-500 transition-colors" />
                       </div>
                     </div>

                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Required Before *</label>
                       <div className="relative group">
                          <input
                            type="datetime-local"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black italic shadow-inner"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            required
                          />
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                       </div>
                     </div>
                   </div>
                </div>

               {/* Logistics Cluster */}
               <div className="space-y-10">
                  <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.4em] flex items-center gap-4 italic border-b border-gray-50 pb-6">
                     <MapPin size={18} className="text-blue-500" /> Logistics Intelligence
                  </h3>
                  
                  <div className="space-y-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Institutional Destination (Hospital) *</label>
                        <div className="relative group">
                           <input
                             type="text"
                             placeholder="Search hospital or center name..."
                             className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black italic shadow-inner"
                             value={formData.hospitalName}
                             onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                             required
                           />
                           <Hospital className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                        </div>
                     </div>

                     <div className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 shadow-inner">
                        <LocationSelector
                           division={formData.division}
                           district={formData.district}
                           thana={formData.thana}
                           onChange={handleLocationChange}
                           required={true}
                        />
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Floor / Room / Block Details</label>
                        <input
                          type="text"
                          placeholder="e.g. Ward 4, Room 102"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-bold italic shadow-inner"
                          value={formData.detailedAddress}
                          onChange={(e) => setFormData({ ...formData, detailedAddress: e.target.value })}
                        />
                     </div>
                  </div>
               </div>

                {/* Communications */}
                <div className="space-y-10">
                   <h3 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.4em] flex items-center gap-4 italic border-b border-gray-50 pb-6">
                      <Phone size={18} className="text-gray-900" /> Communcation Protocol
                   </h3>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Emergency Contact Line *</label>
                       <div className="relative group">
                          <input
                            type="tel"
                            placeholder="Authorized 11-digit number"
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-black italic shadow-inner"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            required
                          />
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-red-500 transition-colors" />
                       </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Prioritize as Emergency?</label>
                        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus-within:ring-4 focus-within:ring-red-500/10 focus-within:border-red-500 transition-all font-black text-gray-900 italic shadow-inner">
                            <input
                                type="checkbox"
                                className="w-5 h-5 accent-red-600 rounded-lg cursor-pointer"
                                checked={formData.isEmergency}
                                onChange={(e) => setFormData({ ...formData, isEmergency: e.target.checked })}
                            />
                            <span className="text-xs uppercase tracking-wider">Yes, this is an critical SOS</span>
                        </div>
                     </div>

                     <div className="space-y-3 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Platform Instructions (Optional)</label>
                       <textarea
                         rows={4}
                         placeholder="Provide any additional mission context..."
                         className="w-full bg-gray-50 border border-gray-100 rounded-3xl px-8 py-6 outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 font-medium italic shadow-inner resize-none"
                         value={formData.notes}
                         onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                       />
                     </div>
                   </div>
                </div>

               <button
                 type="submit"
                 disabled={mutation.isPending}
                 className="w-full py-6 rounded-3xl bg-red-500 text-white font-black uppercase tracking-[0.3em] italic text-sm hover:bg-black transition-all shadow-2xl shadow-red-500/30 active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50 group"
               >
                 {mutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : (
                   <>
                     Dispatch SOS Broadcast <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </>
                 )}
               </button>
            </div>
          </div>

          {/* Right Sidebar Protocol */}
          <div className="lg:col-span-4 space-y-10">
             <div className="bg-gray-900 rounded-[3.5rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-gray-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-3xl rounded-full pointer-events-none group-hover:bg-red-500/20 transition-all duration-1000" />
                <Activity className="text-red-500 mb-8 w-12 h-12 animate-pulse" />
                <h4 className="text-2xl font-black italic uppercase leading-none mb-6">Lifeline Radar</h4>
                <ul className="space-y-6">
                   {[
                     { icon: Zap, label: "Instant Sync", text: "Verified donors within 15km receive Push & Global node alerts." },
                     { icon: ShieldCheck, label: "Encrypted Data", text: "Identity is shielded until a hero commits to your mission." },
                     { icon: AlertTriangle, label: "Critical Priority", text: "SOS requests bypass standard platform queue algorithms." }
                   ].map((p, i) => (
                     <li key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 border border-white/10 group-hover:border-red-500/50 transition-colors">
                           <p.icon size={18} className="text-red-500" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{p.label}</p>
                           <p className="text-xs text-gray-500 font-bold italic leading-relaxed">{p.text}</p>
                        </div>
                     </li>
                   ))}
                </ul>
             </div>

             <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                <Info className="text-gray-300 mb-6 w-10 h-10" />
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 italic">Security Note</h4>
                <p className="text-xs text-gray-500 font-medium italic leading-relaxed">
                  Platform monitoring is active. False SOS broadcasts may lead to regional node blacklisting or legal compliance audit. Use with absolute discretion.
                </p>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full" />
             </div>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
