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
    <div className="max-w-md mx-auto px-4 py-12">
      {/* ... header ... */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Join the Mission 🩸</h1>
        <p className="text-gray-500">Pick your role and start saving lives today.</p>
        {formData.orgRef && (
          <div className="mt-4 inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold animate-pulse">
            Organization Invite Active 🏥
          </div>
        )}
      </div>

      <div className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Step Indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'w-8 bg-red-500' : 'w-4 bg-gray-200'}`}></div>
          ))}
        </div>

        {/* Step 1: Role Selection */}
        {/* ... same step 1 ... */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold mb-6 text-center">I want to join as a...</h2>
            <button
              onClick={() => { setRole('DONOR'); setStep(2); }}
              className="w-full p-6 border-2 border-gray-100 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all text-left flex items-center gap-4 group"
            >
              <div className="text-3xl">🩸</div>
              <div>
                <p className="font-bold group-hover:text-red-500">Volunteer Donor</p>
                <p className="text-xs text-gray-500 uppercase">Saving lives personally</p>
              </div>
            </button>
            <button
              onClick={() => { setRole('MANAGER'); setStep(2); }}
              className="w-full p-6 border-2 border-gray-100 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all text-left flex items-center gap-4 group"
            >
              <div className="text-3xl">🏥</div>
              <div>
                <p className="font-bold group-hover:text-red-500">Hospital / Org Manager</p>
                <p className="text-xs text-gray-500 uppercase">Managing blood requests</p>
              </div>
            </button>
          </div>
        )}

        {/* Combined Step 2: Account Creation (Email, Password, Phone) */}
        {step === 2 && (
          <form onSubmit={handleAccountSubmit} className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-center">Set up your account</h2>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 01712345678"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="hero@example.com"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="relative">
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 pr-12"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[38px] text-gray-400 hover:text-red-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={checkPhoneMutation.isPending}
              className="w-full btn-primary py-4"
            >
              {checkPhoneMutation.isPending ? 'Verifying...' : 'Next Step'}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-gray-400 text-sm hover:text-gray-600">Back</button>
          </form>
        )}

        {/* Combined Step 3: Profile Details */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-center">Personal Details</h2>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Full Name / Org Name</label>
              <input
                type="text"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Verified Phone</label>
              <p className="text-sm font-bold text-gray-600">{formData.phone}</p>
            </div>

            {role === 'DONOR' ? (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Blood Group</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  required
                >
                  <option value="">Select Group</option>
                  {['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'].map(g => <option key={g} value={g}>{g.replace('_POS', '+')}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Type</label>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.managerType}
                  onChange={(e) => setFormData({ ...formData, managerType: e.target.value })}
                  required
                >
                  <option value="hospital">Hospital</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
            )}

            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-xs font-black uppercase text-gray-400 mb-4 tracking-widest italic">Hub Location</label>
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

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full btn-primary py-4"
            >
              {mutation.isPending ? 'Joining...' : 'Complete Registration 🩸'}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-gray-400 text-sm hover:text-gray-600">Back</button>
          </form>
        )}
      </div>

      <p className="mt-8 text-center text-sm text-gray-500">
        Already have an account? <Link href="/login" className="text-red-500 font-bold">Login here</Link>
      </p>
    </div>
  );
}
