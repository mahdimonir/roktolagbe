'use client';
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useRouter } from 'next/navigation';
import { 
  Droplet, Upload, AlertCircle, CheckCircle2, 
  ChevronLeft, Info, Star, Scan, 
  Target, Activity, ShieldCheck, Zap,
  Loader2, Camera
} from 'lucide-react';
import { toast } from 'sonner';

export default function LogDonationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    requestId: '',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/donors/me/donation', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-profile'] });
      queryClient.invalidateQueries({ queryKey: ['my-history'] });
      toast.success('Donation logged successfully! Points added to your profile.');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to log donation.');
    }
  });

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'RoktoLagbe');
    formData.append('folder', 'RoktoLagbe');
    
    const res = await fetch('https://api.cloudinary.com/v1_1/devmahdi/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to upload image');
    return data.secure_url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imagePath = '';
      if (file) {
        setIsUploading(true);
        imagePath = await uploadToCloudinary(file);
        setIsUploading(false);
      }
      
      mutation.mutate({
        ...(formData.requestId ? { requestId: formData.requestId } : {}),
        notes: formData.notes,
        ...(imagePath ? { imagePath } : {})
      });
    } catch (error: any) {
      setIsUploading(false);
      toast.error(error.message || 'Failed to submit. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20 italic">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 italic">
        <div className="flex items-center gap-6 italic">
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-600 shadow-sm border border-gray-100 hover:border-red-100 transition-all active:scale-95 italic"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="italic">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase italic leading-none italic">Log Donation</h1>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2 bg-gray-50 px-4 py-1.5 rounded-full inline-block border border-gray-100 italic">Record your life-saving contribution</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white p-4 pl-8 rounded-3xl border border-gray-100 shadow-xl italic">
           <div className="leading-none text-right italic">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 italic">Potential Points</p>
              <p className="text-2xl font-black text-red-600 tracking-tighter italic">+150 POINTS</p>
           </div>
           <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 border border-red-100 italic">
              <Zap className="w-6 h-6" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 italic">
        <div className="lg:col-span-8 space-y-8 italic">
          <form onSubmit={handleSubmit} className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-12 relative overflow-hidden group italic">
            
            <div className="space-y-10 relative z-10 italic">
              {/* Request ID */}
              <div className="space-y-4 italic">
                <div className="flex items-center justify-between px-2 italic">
                  <label className="text-[11px] font-black uppercase text-gray-900 tracking-widest italic flex items-center gap-3 italic">
                    <Target size={14} className="text-red-600" /> Request ID (Optional)
                  </label>
                </div>
                <input 
                  type="text" 
                  placeholder="Enter Request ID if applicable"
                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-8 py-5 outline-none focus:bg-white focus:border-red-600 transition-all font-black text-gray-900 placeholder:text-gray-300 italic"
                  value={formData.requestId}
                  onChange={(e) => setFormData({...formData, requestId: e.target.value})}
                />
              </div>

              {/* Certificate Upload */}
              <div className="space-y-4 italic">
                <div className="flex items-center justify-between px-2 italic">
                  <label className="text-[11px] font-black uppercase text-gray-900 tracking-widest italic flex items-center gap-3 italic">
                    <Camera size={14} className="text-red-600" /> Donation Certificate
                  </label>
                  <span className="text-[9px] font-black uppercase text-gray-400 italic">Required for verification</span>
                </div>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative h-64 border-2 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center justify-center text-center cursor-pointer italic ${
                    file ? 'border-green-500 bg-green-50/50' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden italic" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-4 italic">
                       <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                       <p className="text-[11px] font-black uppercase text-red-600 tracking-widest italic">Processing Image...</p>
                    </div>
                  ) : file ? (
                    <div className="flex flex-col items-center gap-4 italic">
                      <CheckCircle2 size={48} className="text-green-600" />
                      <div className="space-y-1 italic">
                        <p className="text-lg font-black text-gray-900 italic">{file.name}</p>
                        <p className="text-[10px] text-green-600 font-black uppercase italic">Uploaded Successfully</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 italic">
                      <Upload size={32} className="text-gray-300 italic" />
                      <div className="italic">
                        <p className="text-sm font-black text-gray-900 uppercase italic">Click to upload certificate</p>
                        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-black italic mt-2 italic">PNG, JPG or PDF</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4 italic">
                <label className="text-[11px] font-black uppercase text-gray-900 tracking-widest italic flex items-center gap-3 px-2 italic">
                  <Activity size={14} className="text-red-600" /> Additional Notes
                </label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about your donation experience..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-10 py-8 outline-none focus:bg-white focus:border-red-600 transition-all font-bold italic text-gray-900 placeholder:text-gray-300 resize-none italic"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending || isUploading || isProcessing || !file}
              className="w-full bg-gray-900 hover:bg-red-600 disabled:opacity-50 text-white py-6 rounded-[2.5rem] font-black text-[13px] uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 italic"
            >
              {mutation.isPending || isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging Donation...
                </>
              ) : (
                'Submit Donation Log'
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-4 space-y-8 italic">
           {/* Guidelines */}
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative shadow-2xl italic">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/10 italic">
                 <ShieldCheck className="text-red-600" size={28} />
              </div>
              <h3 className="text-2xl font-black mb-4 italic uppercase tracking-tighter italic">Verification</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-10 italic font-medium italic">
                Every donation log is manually verified by our team. Please ensure the certificate is clear and readable. Verified donations earn points and badges.
              </p>
           </div>

           {/* Rest Period */}
           <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8 text-center italic">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 italic border border-gray-100 shadow-inner">
                 <Droplet className="text-red-600" fill="currentColor" size={32} />
              </div>
              <div className="space-y-3 italic">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic mb-2 italic">Rest Period</p>
                 <p className="text-xl font-black text-gray-900 tracking-tighter italic uppercase leading-tight italic">Next donation available in 90 days</p>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden italic">
                 <div className="h-full bg-red-600 w-full animate-pulse italic"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
