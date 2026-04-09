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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center bg-white dark:bg-[#0a0a0d] italic">
        <div className="w-16 h-16 border-4 border-red-50 dark:border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest animate-pulse italic">Initializing profile data...</p>
      </div>
    );
  }

   return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-40 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 italic">
      
      {/* 1. Profile Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
         {/* Avatar Section */}
         <div className="lg:col-span-4 flex flex-col items-center gap-8 group">
            <div className="relative">
               <div className="w-56 h-56 bg-gray-50/50 dark:bg-white/5 rounded-[2.5rem] border-8 border-white dark:border-white/[0.08] shadow-2xl overflow-hidden relative group-hover:scale-105 transition-transform duration-700">
                  {donor?.profileImage ? (
                    <img src={donor.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-200 dark:text-gray-700">
                       <User size={64} />
                    </div>
                  )}
               </div>
               
               <button 
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="absolute -bottom-2 -right-2 w-14 h-14 bg-gray-900 dark:bg-red-600 text-white border-4 border-white dark:border-[#0a0a0d] rounded-2xl flex items-center justify-center hover:bg-red-600 dark:hover:bg-white dark:hover:text-red-600 transition-all active:scale-95 shadow-xl"
               >
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={20} />}
               </button>
               <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="text-center space-y-2">
               <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">{donor?.name}</h2>
               <div className="flex items-center gap-3 justify-center">
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 px-4 py-1.5 rounded-full border border-red-100 dark:border-red-500/20 text-[8px] font-black uppercase tracking-[0.3em] italic">
                    <ShieldCheck size={12} />
                    Verified
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/10" />
                  <span className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest italic">{donor?.bloodGroup?.replace('_POS', '+')?.replace('_NEG', '-')} GROUP</span>
               </div>
            </div>
         </div>

         {/* Donation Status */}
         <div className="lg:col-span-8 bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-red-600/[0.03] rounded-full blur-[80px] pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-14 relative z-10">
               <div className="relative w-44 h-44 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-gray-100 dark:text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="88" cy="88" />
                    <circle 
                       className={`${daysRemaining === 0 ? 'text-green-500' : 'text-red-600'} transition-all duration-1000 shadow-[0_0_15px_rgba(220,38,38,0.3)]`} 
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
                     <p className={`text-4xl font-black italic tracking-tighter leading-none ${daysRemaining === 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>
                        {daysRemaining === 0 ? 'ACTIVE' : `${daysRemaining}D`}
                     </p>
                     <p className="text-[8px] font-black uppercase text-gray-400 dark:text-gray-600 tracking-[0.3em] mt-2 italic">Protocol</p>
                  </div>
               </div>

               <div className="flex-1 space-y-8 text-center md:text-left">
                  <div className="space-y-4">
                     <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Donation Eligibility</h3>
                     <p className="text-gray-400 dark:text-gray-500 text-xs font-medium italic leading-relaxed max-w-sm">
                        {daysRemaining === 0 
                          ? "You are currently combat-ready for urgent missions. Your blood can save a soul today." 
                          : `The system is running restoration cooldown. You will be combat-ready in ${daysRemaining} days.`}
                     </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                     <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                        <Activity size={14} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-300 italic tracking-widest">{donor?.points} CREDITS</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white/50 dark:bg-white/5 px-6 py-3 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm">
                        <Droplet size={14} className="text-red-600" />
                        <span className="text-[10px] font-black uppercase text-gray-900 dark:text-gray-300 italic tracking-widest">{donor?.totalDonations || 0} SAVES</span>
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
                  <section className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] space-y-10 shadow-sm">
                     <div className="flex items-center gap-4 border-b border-gray-50 dark:border-white/[0.05] pb-6">
                        <User className="text-red-600" size={24} />
                        <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none dark:text-white">Account Base</h3>
                     </div>

                     <div className="space-y-8">
                        <div className="space-y-2">
                           <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 italic">IDENTITY NAME</label>
                           <input 
                             {...register('name')}
                             className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-4 px-8 outline-none font-black italic text-gray-900 dark:text-white uppercase tracking-wider focus:border-red-600 transition-all shadow-sm" 
                           />
                        </div>
                        
                        <div className="space-y-2 opacity-60">
                           <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 italic">COMMS ENCRYPTED (LOCKED)</label>
                           <div className="w-full bg-gray-100/50 dark:bg-white/5 border border-transparent rounded-2xl py-4 px-8 font-black italic text-gray-400 dark:text-gray-600 flex items-center justify-between uppercase tracking-widest">
                              {donor?.user?.phone}
                              <ShieldCheck size={16} />
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-12 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-10 flex flex-col">
                     <div className="flex items-center justify-between border-b border-gray-50 dark:border-white/[0.05] pb-6">
                        <div className="flex items-center gap-4">
                           <Award className="text-red-600" size={24} />
                           <h3 className="text-lg font-black uppercase italic tracking-tighter leading-none dark:text-white">Merit Badges</h3>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{donor?.badges?.length || 0} SECURED</span>
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
        <section className="bg-gray-50/20 dark:bg-white/[0.02] backdrop-blur-[40px] p-14 rounded-[2.5rem] border border-gray-100 dark:border-white/[0.08] shadow-sm space-y-12">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-50 dark:border-white/[0.05] pb-10">
              <div className="space-y-4">
                 <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic leading-none">Regional Base</h3>
                 <p className="text-gray-400 dark:text-gray-500 font-medium italic text-sm">Configure your operational area for nearby mission alerts.</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 italic">DIVISION</label>
                 <select {...register('division')} className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] py-4 px-8 outline-none font-black italic uppercase tracking-[0.2em] text-[10px] text-gray-900 dark:text-white focus:border-red-600 transition-all cursor-pointer shadow-sm">
                    {['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'].map(d => (
                       <option key={d} value={d} className="bg-white dark:bg-[#0a0a0d]">{d}</option>
                    ))}
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 italic">DISTRICT</label>
                 <input {...register('district')} className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] py-4 px-8 outline-none font-black italic uppercase tracking-[0.2em] text-[10px] text-gray-900 dark:text-white focus:border-red-600 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-4 italic">THANA / AREA</label>
                 <input {...register('thana')} className="w-full bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] py-4 px-8 outline-none font-black italic uppercase tracking-[0.2em] text-[10px] text-gray-900 dark:text-white focus:border-red-600 transition-all shadow-sm" />
              </div>
           </div>
        </section>

        {/* Action Button */}
        <div className="flex justify-center">
           <button 
             type="submit"
             disabled={isUpdating}
             className="bg-red-600 text-white hover:bg-black dark:hover:bg-white dark:hover:text-red-600 px-24 py-8 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all shadow-2xl shadow-red-600/20 flex items-center justify-center gap-6 active:scale-95 italic group/btn"
           >
              {isUpdating ? <Loader2 className="animate-spin" /> : (
                <>
                  <ShieldCheck size={24} className="group-hover/btn:scale-110 transition-transform" />
                  Apply Signal Updates
                </>
              )}
           </button>
        </div>
      </form>
    </div>
  );
}
