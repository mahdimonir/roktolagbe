'use client';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { getDivisions, getDistricts, getThanas } from '@/constants/locations';
import { LocationSelector } from '@/components/common/LocationSelector';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Account Creation, 3: Profile Details
  const [role, setRole] = useState<'DONOR' | 'MANAGER' | ''>('');
  const [phoneStatus, setPhoneStatus] = useState<{ status: 'idle' | 'checking' | 'available' | 'mergeable' | 'taken', message?: string }>({ status: 'idle' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    bloodGroup: '',
    division: '',
    district: '',
    thana: '',
    managerType: 'hospital',
    orgRef: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Capture orgRef from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orgRef = params.get('orgRef');
    if (orgRef) {
      setFormData(prev => ({ ...prev, orgRef }));
      console.log('Org referral link detected:', orgRef);
    }
  }, []);

  const checkPhoneMutation = useMutation({
    mutationFn: (phone: string) => api.get(`/auth/check-phone?phone=${encodeURIComponent(phone)}`),
    onSuccess: (res: any) => {
      console.log('Phone check response:', res);
      // The backend successResponse wraps the service result in a 'data' field
      const serviceResult = res?.data || res;
      const status = serviceResult?.status;
      const message = serviceResult?.message;
      const profileData = serviceResult?.data; // The inner profile data

      setPhoneStatus({ status, message });

      if (status === 'available' || status === 'mergeable') {
        if (status === 'mergeable') {
          toast.info(message || 'Hero detected! Your legacy records have been loaded.', { duration: 6000 });
          // Pre-fill existing data from the serviceResult.data object
          if (profileData) {
            setFormData(prev => ({
              ...prev,
              name: profileData.name || prev.name,
              bloodGroup: profileData.bloodGroup || prev.bloodGroup,
              division: profileData.division || prev.division,
              district: profileData.district || prev.district,
              thana: profileData.thana || prev.thana,
              managerType: profileData.managerType || prev.managerType,
            }));
          }
        }
        setStep(3); // Proceed to Profile Details
      } else {
        toast.error(message || 'Phone number already registered. Try another or login.');
      }
    },
    onError: (err: any) => {
      console.error('Phone verification error:', err);
      toast.error('Failed to verify identity. Please try again.');
      setPhoneStatus({ status: 'idle' });
    }
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/auth/register', data),
    onSuccess: () => {
      toast.success('Registration successful! Please verify your email. ✉️');
      router.push('/login');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.phone) {
      return toast.error('Please fill in all account fields.');
    }
    if (formData.phone.length < 11) {
      return toast.error('Please enter a valid phone number.');
    }
    setPhoneStatus({ status: 'checking' });
    checkPhoneMutation.mutate(formData.phone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      role,
      orgRef: formData.orgRef,
      ...(role === 'DONOR'
        ? {
          name: formData.name,
          phone: formData.phone,
          division: formData.division,
          district: formData.district,
          thana: formData.thana,
          bloodGroup: formData.bloodGroup
        }
        : {
          managerName: formData.name,
          contactPhone: formData.phone,
          managerDistrict: formData.district,
          managerType: formData.managerType
        }
      )
    };
    mutation.mutate(payload);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] py-20 px-4 relative overflow-hidden transition-colors duration-500 italic">
      {/* Background Decorative - Pulse Logic */}
      <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[40rem] h-[40rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-[30rem] h-[30rem] bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md mx-auto relative z-10">
        {/* Header - Mission Scale */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-black mb-3 text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">
            JOIN THE <span className="text-red-600 italic">MISSION</span>
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] italic">PICK YOUR ROLE AND START SAVING LIVES.</p>
          {formData.orgRef && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 dark:bg-red-600/20 text-red-600 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse border border-red-600/10">
              ORGANIZATION INVITE ACTIVE 🏥
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl dark:shadow-black/50 backdrop-blur-[40px] transition-all duration-700">
          {/* Step Indicator - Premium Glass */}
          <div className="flex gap-2 mb-10 justify-center">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all duration-700 ${
                  step >= s ? 'w-10 bg-red-600 shadow-lg shadow-red-600/20' : 'w-4 bg-gray-100 dark:bg-white/10'
                }`}
              ></div>
            ))}
          </div>

          {/* Step 1: Role Selection - High Density */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] text-center mb-6 italic">SELECT THE CLEARANCE TYPE</h2>
              <button
                onClick={() => { setRole('DONOR'); setStep(2); }}
                className="w-full p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-red-600 dark:hover:border-red-600/30 transition-all text-left flex items-center gap-5 group backdrop-blur-[40px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🩸</div>
                <div>
                  <p className="font-black text-sm text-gray-900 dark:text-white uppercase italic tracking-tighter">VOLUNTEER DONOR</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">SAVING LIVES PERSONALLY</p>
                </div>
              </button>
              <button
                onClick={() => { setRole('MANAGER'); setStep(2); }}
                className="w-full p-6 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl hover:border-red-600 dark:hover:border-red-600/30 transition-all text-left flex items-center gap-5 group backdrop-blur-[40px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-600/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">🏥</div>
                <div>
                  <p className="font-black text-sm text-gray-900 dark:text-white uppercase italic tracking-tighter">MISSION MANAGER</p>
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1">COORDINATING UNIT REQUESTS</p>
                </div>
              </button>
            </div>
          )}

          {/* Step 2: Account Activation */}
          {step === 2 && (
            <form onSubmit={handleAccountSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] text-center mb-6 italic">MISSION ACCOUNT SETUP</h2>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">MISSION PHONE</label>
                <input
                  type="tel"
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">SECURE EMAIL</label>
                <input
                  type="email"
                  placeholder="HERO@ROKTOLAGBE.ORG"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">MISSION KEY</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white pr-14"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-[34px] text-gray-400 hover:text-red-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={checkPhoneMutation.isPending}
                className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {checkPhoneMutation.isPending ? 'VERIFYING IDENTITY...' : 'SECURE IDENTITY ->'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 dark:text-gray-600 text-[9px] font-black uppercase tracking-widest hover:text-red-600 transition-colors italic">BACK TO ROLES</button>
            </form>
          )}

          {/* Step 3: Mission Profile */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <h2 className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em] text-center mb-6 italic">MISSION PROFILE DATA</h2>
              
              <div className="space-y-2">
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">FULL IDENTITY NAME</label>
                <input
                  type="text"
                  placeholder="FULL NAME..."
                  className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic placeholder:text-gray-300 dark:placeholder:text-gray-700 uppercase tracking-widest text-gray-900 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">
                    {role === 'DONOR' ? 'BLOOD TYPE' : 'MISSION TYPE'}
                  </label>
                  <select
                    className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-red-600 transition-all font-black text-[10px] italic uppercase tracking-widest text-gray-900 dark:text-white appearance-none h-[54px]"
                    value={role === 'DONOR' ? formData.bloodGroup : formData.managerType}
                    onChange={(e) => setFormData({ ...formData, [role === 'DONOR' ? 'bloodGroup' : 'managerType']: e.target.value })}
                    required
                  >
                    {role === 'DONOR' ? (
                      <>
                        <option value="">SELECT GROUP</option>
                        {['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'].map(g => <option key={g} value={g}>{g.replace('_POS', '+')}</option>)}
                      </>
                    ) : (
                      <>
                        <option value="hospital">HOSPITAL</option>
                        <option value="organization">ORGANIZATION</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-1 tracking-[0.3em] italic ml-1">PHONE LINKED</label>
                  <div className="w-full bg-red-600/5 dark:bg-red-600/10 border border-red-600/10 rounded-2xl px-4 py-4 flex items-center justify-center h-[54px]">
                    <span className="text-[10px] font-black text-red-600 italic tracking-widest">{formData.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/30 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/10 italic">
                <label className="block text-[9px] font-black uppercase text-gray-400 dark:text-gray-600 mb-6 tracking-[0.3em] italic text-center">MISSION DEPLOYMENT ZONE</label>
                <div className="space-y-4">
                  <LocationSelector
                    division={formData.division}
                    district={formData.district}
                    thana={formData.thana}
                    onChange={(field, value) => {
                      if (field === 'division') setFormData(prev => ({ ...prev, division: value, district: '', thana: '' }));
                      else if (field === 'district') setFormData(prev => ({ ...prev, district: value, thana: '' }));
                      else setFormData(prev => ({ ...prev, [field]: value }));
                    }}
                    required={true}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-red-600 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.3em] italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {mutation.isPending ? 'JOINING NETWORK...' : 'COMPLETE DEPLOYMENT 🩸'}
              </button>
              <button type="button" onClick={() => setStep(2)} className="w-full text-gray-400 dark:text-gray-600 text-[9px] font-black uppercase tracking-widest hover:text-red-600 transition-colors italic">RE-VERIFY IDENTITY</button>
            </form>
          )}
        </div>

        <p className="mt-10 text-center text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] italic">
          ALREADY IN THE NETWORK? <br />
          <Link href="/login" className="text-red-600 mt-2 inline-block hover:underline decoration-2 underline-offset-4 tracking-widest">
            LOGIN TO MISSION HUB
          </Link>
        </p>
      </div>
    </main>
  );
}
