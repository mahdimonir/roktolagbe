'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { ApiResponse, ManagerProfile } from '@/lib/types/models';
import { useForm } from 'react-hook-form';
import { 
  Hospital, MapPin, Phone, ShieldCheck, 
  Save, Loader2, Building2, Upload, 
  Building, Globe, Mail, Info, Activity,
  Target, Zap, ShieldAlert, Camera,
  TrendingUp, Award, Users
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ManagerProfilePage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: profileData, isLoading: profileLoading } = useQuery<ApiResponse<ManagerProfile>>({
    queryKey: ['manager-profile'],
    queryFn: () => api.get('/managers/me'),
  });

  const { data: analyticsData } = useQuery<ApiResponse<any>>({
    queryKey: ['manager-analytics'],
    queryFn: () => api.get('/managers/me/analytics'),
  });

  const manager = profileData?.data;
  const stats = analyticsData?.data;

  const { register, handleSubmit, setValue } = useForm({
    values: {
      name: manager?.name || '',
      district: manager?.district || '',
      contactPhone: manager?.contactPhone || '',
      type: manager?.type || 'HOSPITAL',
      logoUrl: manager?.logoUrl || ''
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.patch('/managers/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manager-profile'] });
      toast.success('Profile updated successfully.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'RoktoLagbe');
      
      const res = await fetch('https://api.cloudinary.com/v1_1/devmahdi/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setValue('logoUrl', data.secure_url);
      toast.success('Logo uploaded successfully!');
    } catch (err) {
      toast.error('Logo upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  if (profileLoading) return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white italic">
       <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
       <p className="mt-8 text-[11px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading profile...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 px-4 md:px-0 italic">
      
      {/* Header */}
      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-xl relative overflow-hidden group">
         <div className="relative z-10 flex flex-col xl:flex-row justify-between items-center gap-10">
            <div className="flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
               <div className="relative">
                  <div className="w-36 h-36 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform duration-700">
                     {manager?.logoUrl ? (
                       <img src={manager.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                     ) : (
                       <Building2 size={56} className="text-red-600" />
                     )}
                  </div>
                  <button 
                     type="button"
                     onClick={() => document.getElementById('org-logo-upload')?.click()}
                     className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all active:scale-90 shadow-xl border-4 border-white"
                  >
                     {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                  </button>
                  <input id="org-logo-upload" type="file" className="hidden" onChange={handleLogoUpload} />
               </div>

               <div className="space-y-3">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                     <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight italic">{manager?.name}</h1>
                     {manager?.isVerified && (
                        <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
                           <ShieldCheck size={18} className="text-white" />
                        </div>
                     )}
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-5 py-2 rounded-xl border border-red-100 italic">District: {manager?.district}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic bg-gray-50 px-5 py-2 rounded-xl border border-gray-100">ID: #{manager?.id?.slice(-8).toUpperCase()}</span>
                  </div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full xl:w-auto">
               <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center sm:text-right min-w-[14rem] shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 italic">Fulfilled Requests</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{stats?.fulfilledRequests || 0} Total</p>
               </div>
               <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 text-center sm:text-right min-w-[14rem] shadow-sm">
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-2 italic">Open Requests</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{stats?.openRequests || 0} Active</p>
               </div>
            </div>
         </div>
      </div>

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Hospital Details */}
        <div className="lg:col-span-8 space-y-10">
           <section className="bg-white p-10 lg:p-14 rounded-[3rem] border border-gray-100 shadow-sm space-y-10 group">
              <div className="flex items-center gap-5 border-b border-gray-50 pb-8">
                 <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 border border-red-100">
                    <Activity size={24} />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tight italic uppercase italic">Hospital Profile</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic px-2">Hospital Name</label>
                    <div className="relative">
                       <input 
                         {...register('name')}
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 transition-all shadow-inner" 
                       />
                       <Building className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic px-2">Hospital Type</label>
                    <div className="relative">
                       <select 
                         {...register('type')}
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-black italic uppercase tracking-widest text-[10px] appearance-none cursor-pointer focus:bg-white focus:border-red-600 transition-all shadow-inner"
                       >
                         <option value="HOSPITAL">General Hospital</option>
                         <option value="BLOOD_BANK">Blood Bank</option>
                         <option value="CLINIC">Medical Clinic</option>
                         <option value="NGO">Non-Profit / NGO</option>
                       </select>
                       <Target className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic px-2">Contact Hotline</label>
                    <div className="relative">
                       <input 
                         {...register('contactPhone')}
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 transition-all shadow-inner" 
                       />
                       <Phone className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-4 italic px-2">District</label>
                    <div className="relative">
                       <input 
                         {...register('district')}
                         className="w-full bg-gray-50 border border-transparent rounded-[1.8rem] py-5 px-8 outline-none font-bold italic text-sm focus:bg-white focus:border-red-600 transition-all shadow-inner" 
                       />
                       <MapPin className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-10">
           <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl space-y-8 group">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                 <ShieldCheck className="text-white" size={28} />
              </div>
              <div>
                 <h3 className="text-2xl font-black mb-3 italic uppercase tracking-tighter">Save Changes</h3>
                 <p className="text-gray-400 text-[11px] leading-relaxed italic font-black uppercase tracking-widest">
                   Update your hospital profile information to ensure accurate donor matching.
                 </p>
              </div>
              
              <button 
                type="submit"
                disabled={mutation.isPending || isUploading}
                className="w-full bg-gray-900 text-white hover:bg-red-600 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-widest transition-all shadow-xl active:scale-95 italic group/btn flex items-center justify-center gap-4"
              >
                {mutation.isPending || isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save size={20} className="group-hover/btn:scale-110 transition-transform" />
                    Save Profile
                  </>
                )}
              </button>
           </section>

           <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 shadow-inner space-y-6 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                 <Users className="text-red-500" size={28} />
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Donor Network</p>
                 <p className="text-xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">{stats?.totalMembers || 0} Registered Donors</p>
              </div>
              <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-white px-5 py-2 rounded-full border border-gray-100 italic">
                Regional Coordination
              </div>
           </div>
        </div>
      </form>
    </div>
  );
}
