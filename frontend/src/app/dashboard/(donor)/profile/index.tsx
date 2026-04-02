'use client';

import { api } from '@/lib/api/axios';
import { ApiResponse, DonorProfile } from '@/lib/types/models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
   Activity,
   Award,
   Camera,
   Droplet,
   Globe,
   HeartPulse,
   Loader2,
   MapPin,
   ShieldAlert,
   ShieldCheck,
   Sparkles,
   Target,
   User,
   Zap
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  phone: z.string().min(11, 'Enter a valid phone number'),
  division: z.string().min(1, 'Select a division'),
  district: z.string().min(1, 'Select a district'),
  thana: z.string().optional(),
  isAvailable: z.boolean(),
  profileImage: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function DonorProfilePage() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  const { data: profileData, isLoading } = useQuery<ApiResponse<DonorProfile>>({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const res = await api.get('/donors/me');
      return res.data;
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: ProfileForm) => api.patch('/donors/me', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Update failed.');
    }
  });

  const donor = profileData?.data;

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: donor ? {
      name: donor.name,
      phone: donor.user?.phone || '',
      division: donor.division || '',
      district: donor.district || '',
      thana: donor.thana || '',
      isAvailable: donor.isAvailable,
      profileImage: donor.profileImage || '',
    } : undefined
  });

  const isAvailable = watch('isAvailable');

  const lastDonation = donor?.lastDonationDate ? new Date(donor.lastDonationDate) : null;
  const nextEligibleDate = lastDonation ? new Date(lastDonation.getTime() + 90 * 24 * 60 * 60 * 1000) : new Date();
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((nextEligibleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercent = lastDonation ? Math.min(100, Math.max(0, ((90 - daysRemaining) / 90) * 100)) : 100;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setValue('profileImage', data.secure_url);
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

     <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white italic">
        <div className="w-16 h-16 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse italic">Loading profile...</p>
     </div>

   return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-40 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 italic">
      
      {/* 1. Profile Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
         {/* Avatar Section */}
         <div className="lg:col-span-4 flex flex-col items-center gap-8 group">
            <div className="relative">
               <div className="w-56 h-56 bg-white rounded-[2.5rem] border-8 border-gray-50 shadow-xl overflow-hidden relative">
                  {donor?.profileImage ? (
                    <img src={donor.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-100">
                       <User size={64} />
                    </div>
                  )}
               </div>
               
               <button 
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="absolute -bottom-2 -right-2 w-14 h-14 bg-gray-900 text-white border-4 border-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all active:scale-95"
               >
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
               </button>
               <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">{donor?.name}</h2>
               <div className="flex items-center gap-3 justify-center">
                  <span className="text-[9px] font-black uppercase text-red-600 bg-red-50 px-4 py-1.5 rounded-full border border-red-100 italic tracking-widest">Verified</span>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic">{donor?.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')}</span>
               </div>
            </div>
         </div>

         {/* Donation Status */}
         <div className="lg:col-span-8 bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center gap-14 relative z-10">
               <div className="relative w-44 h-44 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-gray-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="88" cy="88" />
                    <circle 
                       className={`${daysRemaining === 0 ? 'text-green-500' : 'text-red-600'} transition-all duration-1000`} 
                       strokeWidth="8" 
                       strokeDasharray={440}
                       strokeDashoffset={440 - (440 * progressPercent) / 100}
                       strokeLinecap="round" 
                       stroke="currentColor" 
                       fill="transparent" 
                       r="70" cx="88" cy="88" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                     <p className={`text-4xl font-black italic tracking-tighter leading-none ${daysRemaining === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {daysRemaining === 0 ? 'READY' : `${daysRemaining}d`}
                     </p>
                     <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mt-2 italic">Status</p>
                  </div>
               </div>

               <div className="flex-1 space-y-6 text-center md:text-left">
                  <div className="space-y-4">
                     <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic leading-none">Donation Eligibility</h3>
                     <p className="text-gray-400 text-xs font-medium italic leading-relaxed max-w-sm">
                        {daysRemaining === 0 
                          ? "You are currently eligible to donate blood. Your contribution can save lives today." 
                          : `You will be eligible to donate again in ${daysRemaining} days. Thank you for your support.`}
                     </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                     <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                        <Activity size={14} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase text-gray-900 italic tracking-widest">{donor?.points} Points</span>
                     </div>
                     <div className="flex items-center gap-3 bg-gray-50 px-5 py-2.5 rounded-xl border border-gray-100">
                        <Droplet size={14} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase text-gray-900 italic tracking-widest">{donor?.totalDonations || 0} Donations</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <form onSubmit={handleSubmit((data) => updateProfile(data))} className="space-y-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-12 space-y-10">
              {/* Availability Toggle */}
              <div className={`p-10 rounded-[2.5rem] border transition-all duration-700 relative overflow-hidden group ${isAvailable ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                 <div className="flex justify-between items-center relative z-10">
                    <div className="space-y-2">
                       <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">Availability for Requests</h4>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{isAvailable ? 'Hospitals can find and contact you' : 'You are currently hidden from regional searches'}</p>
                    </div>
                    <button 
                       type="button"
                       onClick={() => setValue('isAvailable', !isAvailable)}
                       className={`w-16 h-8 rounded-full p-1 transition-colors duration-500 ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                       <div className={`w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-500 ${isAvailable ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                    <input type="checkbox" {...register('isAvailable')} className="hidden" />
                 </div>
              </div>

              {/* Profile Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 <section className="bg-white p-12 rounded-[2.5rem] border border-gray-100 space-y-10 shadow-sm">
                    <div className="flex items-center gap-4 border-b border-gray-50 pb-6">
                       <User className="text-red-600" size={24} />
                       <h3 className="text-lg font-black uppercase italic tracking-widest leading-none">Account Details</h3>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Full Name</label>
                          <input 
                            {...register('name')}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-8 outline-none font-bold italic text-gray-900 focus:bg-white focus:border-red-600 transition-all shadow-inner" 
                          />
                       </div>
                       
                       <div className="space-y-2 opacity-60">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Phone Number (Verified)</label>
                          <div className="w-full bg-gray-100 border border-transparent rounded-2xl py-4 px-8 font-black italic text-gray-400 flex items-center justify-between">
                             {donor?.user?.phone}
                             <ShieldCheck size={16} />
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-10 flex flex-col">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                       <div className="flex items-center gap-4">
                          <Award className="text-red-600" size={24} />
                          <h3 className="text-lg font-black uppercase italic tracking-widest leading-none">Badges</h3>
                       </div>
                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{donor?.badges?.length || 0} Earned</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-4 flex-1">
                       {[
                         { name: 'First Donation', icon: Zap, unlocked: true },
                         { name: 'Verified Account', icon: ShieldCheck, unlocked: true },
                         { name: 'Regular Donor', icon: Target, unlocked: (donor?.totalDonations || 0) >= 3 },
                         { name: 'Top Donor', icon: Globe, unlocked: (donor?.points || 0) >= 1000 },
                         { name: 'Hero Donor', icon: HeartPulse, unlocked: (donor?.totalDonations || 0) >= 5 },
                         { name: 'Legendary Donor', icon: Sparkles, unlocked: (donor?.totalDonations || 0) >= 10 },
                       ].map((badge, i) => (
                         <div 
                           key={i} 
                           className={`p-4 rounded-[2rem] border flex flex-col items-center justify-center text-center gap-3 transition-all ${
                             badge.unlocked 
                               ? 'bg-gray-50 border-gray-100' 
                               : 'bg-white border-dashed border-gray-200 grayscale opacity-40'
                           }`}
                         >
                            <badge.icon className={`w-8 h-8 ${badge.unlocked ? 'text-red-600' : 'text-gray-300'}`} />
                            <p className={`text-[8px] font-black uppercase tracking-widest leading-tight italic ${badge.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{badge.name}</p>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
           </div>
        </div>

        {/* Location Section */}
        <section className="bg-white p-14 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-50 pb-10">
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic leading-none">Location</h3>
                 <p className="text-gray-400 font-medium italic text-sm">Set your area to receive help requests nearby.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Division</label>
                 <select {...register('division')} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-4 px-8 outline-none font-bold italic uppercase tracking-widest text-[10px] focus:bg-white focus:border-red-600 transition-all cursor-pointer shadow-inner">
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                       <option key={d} value={d}>{d}</option>
                    ))}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">District</label>
                 <input {...register('district')} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-4 px-8 outline-none font-bold italic uppercase tracking-widest text-[10px] focus:bg-white focus:border-red-600 transition-all shadow-inner" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 italic">Thana</label>
                 <input {...register('thana')} className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] py-4 px-8 outline-none font-bold italic uppercase tracking-widest text-[10px] focus:bg-white focus:border-red-600 transition-all shadow-inner" />
              </div>
           </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-center">
           <button 
             type="submit"
             disabled={isUpdating}
             className="bg-red-600 text-white hover:bg-black px-24 py-6 rounded-[2rem] font-black text-[14px] uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-6 active:scale-95 italic group/btn"
           >
              {isUpdating ? <Loader2 className="animate-spin" /> : (
                <>
                  <ShieldCheck size={28} className="group-hover/btn:scale-110 transition-transform" />
                  Save Changes
                </>
              )}
           </button>
        </div>
      </form>
    </div>
  );
}
