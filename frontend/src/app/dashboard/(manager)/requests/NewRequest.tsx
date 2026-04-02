'use client';

import { api } from '@/lib/api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
   ArrowRight,
   Droplets,
   Loader2,
   ShieldCheck,
   Activity,
   Building2,
   MapPin,
   Phone,
   AlertTriangle,
   Thermometer,
   HeartPulse
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function NewRequestPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    bloodGroup: '',
    unitsRequired: 1,
    hospitalName: '',
    detailedAddress: '',
    district: '',
    thana: '',
    deadline: '',
    contactPhone: '',
    isEmergency: false,
    patientCondition: '',
    hemoglobin: '',
    notes: ''
  });

  const { mutate: createRequest, isPending } = useMutation({
    mutationFn: (data: any) => api.post('/blood-requests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-requests'] });
      toast.success('Blood request created successfully!');
      router.push('/dashboard/manager/requests');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create request. Please check your connection.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bloodGroup || !formData.district || !formData.contactPhone) {
      return toast.error('Please fill in all required fields.');
    }
    createRequest(formData);
  };

  return (
    <div className="max-w-7xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16 px-4 md:px-0">
         <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl text-red-600 border border-gray-100 group">
               <Droplets className="w-10 h-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
               <h1 className="text-5xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none mb-3">New Blood Request</h1>
               <p className="text-gray-400 font-bold tracking-widest uppercase text-[10px] bg-gray-50 px-5 py-2 rounded-full inline-block italic border border-gray-50">Create an urgent request for donors</p>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-12 px-4 md:px-0">
         {/* Main Form Area */}
         <div className="xl:col-span-8 space-y-12">
            <div className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-xl space-y-16 relative overflow-hidden group">
               
               {/* 1. Patient Details */}
               <section className="space-y-12 relative z-10">
                  <div className="flex items-center gap-6">
                     <span className="w-10 h-10 bg-gray-900 text-white rounded-[1.2rem] flex items-center justify-center text-[11px] font-black italic shadow-xl">01</span>
                     <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Patient & Blood Details</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">Essential medical information</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Blood Group Required</label>
                        <div className="relative">
                           <select 
                             className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic uppercase tracking-widest text-[11px] appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all font-mono"
                             value={formData.bloodGroup}
                             onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                           >
                              <option value="">Select blood group</option>
                              {['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'].map(g => (
                                 <option key={g} value={g}>{g.replace('_POS', '+').replace('_NEG', '-')}</option>
                              ))}
                           </select>
                           <Droplets className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Units Required</label>
                        <input 
                           type="number"
                           min="1"
                           className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                           value={formData.unitsRequired}
                           onChange={(e) => setFormData({...formData, unitsRequired: parseInt(e.target.value)})}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Patient Condition</label>
                        <input 
                           type="text"
                           placeholder="e.g. Surgery, Accident, Anemia..."
                           className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                           value={formData.patientCondition}
                           onChange={(e) => setFormData({...formData, patientCondition: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Hemoglobin Level (g/dL)</label>
                        <div className="relative">
                           <input 
                              type="text"
                              placeholder="0.0"
                              className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                              value={formData.hemoglobin}
                              onChange={(e) => setFormData({...formData, hemoglobin: e.target.value})}
                           />
                           <Thermometer className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                     </div>
                  </div>
               </section>

               {/* 2. Logistics & Location Section */}
               <section className="space-y-12 relative z-10 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                     <span className="w-10 h-10 bg-gray-900 text-white rounded-[1.2rem] flex items-center justify-center text-[11px] font-black italic shadow-xl">02</span>
                     <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Location & Timing</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">Where and when donors are needed</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Hospital Name</label>
                        <div className="relative">
                           <input 
                              type="text"
                              placeholder="Hospital Name..."
                              className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                              value={formData.hospitalName}
                              onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                           />
                           <Building2 className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">District</label>
                        <input 
                           type="text"
                           placeholder="Enter District..."
                           className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                           value={formData.district}
                           onChange={(e) => setFormData({...formData, district: e.target.value})}
                        />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Deadline</label>
                        <input 
                           type="date"
                           className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner cursor-pointer"
                           value={formData.deadline}
                           onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Detailed Address</label>
                     <div className="relative">
                        <input 
                           type="text"
                           placeholder="Street address, floor, etc."
                           className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner"
                           value={formData.detailedAddress}
                           onChange={(e) => setFormData({...formData, detailedAddress: e.target.value})}
                        />
                        <MapPin className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                     </div>
                  </div>
               </section>

               {/* 3. Contact & Notes Section */}
               <section className="space-y-12 relative z-10 pt-10 border-t border-gray-100">
                  <div className="flex items-center gap-6">
                     <span className="w-10 h-10 bg-gray-900 text-white rounded-[1.2rem] flex items-center justify-center text-[11px] font-black italic shadow-xl">03</span>
                     <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Contact Information</h3>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 italic">How donors can reach you</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                     <div className="space-y-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Contact Phone Number</label>
                        <div className="relative">
                           <input 
                              type="text"
                              placeholder="01XXXXXXXXX"
                              className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-black italic text-gray-900 focus:bg-white focus:border-red-600 transition-all font-mono"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                           />
                           <Phone className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        </div>
                     </div>
                     <div className="space-y-4">
                          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Additional Notes</label>
                          <input 
                             type="text"
                             placeholder="Any additional information..."
                             className="w-full bg-gray-50 border-2 border-transparent rounded-[1.8rem] py-5 px-10 outline-none font-medium italic text-gray-900 focus:bg-white focus:border-red-600 transition-all font-bold"
                             value={formData.notes}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          />
                     </div>
                  </div>
               </section>
            </div>
         </div>

         {/* Sidebar Controls */}
         <div className="xl:col-span-4 space-y-10">
            <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-xl overflow-hidden group">
               <div className="relative z-10 space-y-12">
                  <div className="space-y-3">
                     <p className="text-red-600 font-black text-[10px] uppercase tracking-widest italic leading-none">Urgency Status</p>
                     <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none italic">Priority <br/>Settings</h4>
                  </div>

                  <div 
                     onClick={() => setFormData({...formData, isEmergency: !formData.isEmergency})}
                     className={`p-10 rounded-[3rem] border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group/opt ${formData.isEmergency ? 'bg-red-600 border-red-500 shadow-xl' : 'bg-gray-50 border-gray-100 hover:border-red-600'}`}
                  >
                     <div className="relative z-10 flex flex-col items-center text-center gap-6">
                        <AlertTriangle size={48} className={`transition-all duration-300 ${formData.isEmergency ? 'text-white' : 'text-gray-400 group-hover/opt:text-red-500'}`} />
                        <div>
                           <p className={`text-[12px] font-black uppercase tracking-widest italic leading-none mb-3 ${formData.isEmergency ? 'text-white' : 'text-gray-900'}`}>{formData.isEmergency ? 'EMERGENCY' : 'Standard'}</p>
                           <p className={`text-[9px] font-black uppercase tracking-widest italic max-w-[150px] leading-relaxed ${formData.isEmergency ? 'text-red-100' : 'text-gray-400'}`}>Sends instant notifications to all matching donors nearby</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8 pt-6 border-t border-gray-50">
                     <div className="flex gap-5">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                           <Activity size={20} className="text-red-600" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5 italic font-mono leading-none">Instant Alerts</p>
                           <p className="text-xs text-gray-400 italic font-medium leading-relaxed">Alerts are sent to all matching donors in your area immediately.</p>
                        </div>
                     </div>
                     <div className="flex gap-5">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                           <ShieldCheck size={20} className="text-green-600" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-1.5 italic font-mono leading-none">Verified Request</p>
                           <p className="text-xs text-gray-400 italic font-medium leading-relaxed">Your request will be verified by our system for accuracy.</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-10">
                     <button 
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="w-full bg-gray-900 text-white py-6 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 italic flex items-center justify-center gap-5 group/submit"
                     >
                        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                           <>
                              Create Request <ArrowRight className="w-6 h-6 group-hover/submit:translate-x-3 transition-transform" />
                           </>
                        )}
                     </button>
                  </div>
               </div>
            </div>

            <div className="bg-red-50 p-10 rounded-[3.5rem] border border-red-100 text-center space-y-6">
                <HeartPulse size={48} className="text-red-600 mx-auto" />
                <p className="text-[11px] font-black text-red-600 uppercase tracking-widest italic mb-2">Network Status</p>
                <p className="text-xs text-red-400 font-bold italic leading-relaxed">Average response time for this area is currently <span className="text-red-600 font-black">less than 30 minutes</span></p>
            </div>
         </div>
      </form>
    </div>
  );
}
