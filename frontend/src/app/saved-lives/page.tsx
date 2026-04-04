'use client';

import CTASection from '@/components/common/CTASection';
import { Skeleton } from '@/components/common/Skeleton';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import {
   ArrowRight,
   Calendar,
   Heart,
   History,
   MapPin,
   MessageSquare,
   Quote,
   Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SavedLives() {
  const { data: stories, isLoading } = useQuery({
    queryKey: ['success-stories'],
    queryFn: async () => {
      const res: any = await api.get('/success-stories');
      return res?.data || [];
    }
  });

  return (
    <main className="min-h-screen bg-white pb-28 italic font-black">
      {/* 1. Hero Section - Section Specific Loading */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-[#112135] text-white">
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
         <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-600/20 rounded-full blur-[100px]" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-red-600/10 border border-red-600/20 px-6 py-2 rounded-full text-red-500 text-[10px] uppercase tracking-[0.3em] font-black italic mb-4">
               <Sparkles size={14} />
               Platform Impact
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
               REAL STORIES.<br />
               <span className="text-red-600">REAL LIVES.</span>
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed italic px-4">
               Every drop tells a story. Witness the power of community and the lives transformed through the RoktoLagbe emergency network.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
               <Link href="/register" className="w-full sm:w-auto bg-red-600 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 italic flex items-center justify-center gap-3">
                  <Heart className="w-5 h-5 fill-white" />
                  Start Donating
               </Link>
               <button className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all active:scale-95 italic flex items-center justify-center gap-3">
                  <MessageSquare size={18} />
                  Submit a Story
               </button>
            </div>
         </div>
      </section>

      {/* 2. Success Stories Grid - Full Mobile Refinement */}
      <section className="relative z-20 -mt-24">
         <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl border border-gray-100 min-h-[600px]">
               
               {isLoading ? (
                  /* SKELETON LOADING STATE */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                     {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-6">
                           <Skeleton className="aspect-[4/3] rounded-[2.5rem]" />
                           <div className="space-y-3">
                              <Skeleton className="h-8 w-3/4 rounded-full" />
                              <Skeleton className="h-4 w-1/2 rounded-full" />
                           </div>
                        </div>
                     ))}
                  </div>
               ) : stories && stories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                     {stories.map((story: any) => (
                        <div key={story.id} className="group cursor-pointer">
                           <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 shadow-xl border-4 border-white transition-transform duration-700 group-hover:scale-[1.02]">
                              <Image 
                                 src={story.imageUrl || '/story-placeholder.png'} 
                                 alt={story.title} 
                                 fill 
                                 className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute top-6 right-6">
                                 <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-600 shadow-xl border border-white">
                                    <Quote size={24} />
                                 </div>
                              </div>
                           </div>
                           
                           <div className="space-y-4 px-2">
                              <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                                 <span className="flex items-center gap-1.5"><MapPin size={12} className="text-red-500" /> {story.location}</span>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                 <span className="flex items-center gap-1.5"><Calendar size={12} className="text-red-500" /> {new Date(story.date).toLocaleDateString()}</span>
                              </div>
                              <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none italic group-hover:text-red-600 transition-colors uppercase">
                                 {story.title}
                              </h3>
                              <p className="text-gray-500 text-sm font-medium leading-relaxed italic line-clamp-2">
                                 {story.excerpt}
                              </p>
                              <div className="pt-4 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest italic group-hover:gap-6 transition-all">
                                 Read Full Impact <ArrowRight size={14} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  /* EMPTY STATE - Enhanced Mobile Sizing */
                  <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-10 group px-4 md:px-0">
                     <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                           <History className="w-10 h-10 md:w-12 md:h-12 text-gray-200" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-red-600 rounded-full border-4 border-white animate-pulse" />
                     </div>
                     
                     <div className="space-y-4">
                        <h2 className="text-2xl md:text-4xl font-black text-gray-200 tracking-tighter italic uppercase transition-colors group-hover:text-gray-400">History in the Making.</h2>
                        <p className="text-gray-400 text-base md:text-lg italic font-medium max-w-md mx-auto leading-relaxed">
                           Our emergency impact logs are clear. We&apos;re waiting to document the next life-saving milestone from our clinical network.
                        </p>
                     </div>

                     <div className="pt-6">
                        <Link href="/register" className="w-full sm:w-auto inline-block bg-red-600 text-white px-8 md:px-12 py-4 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all italic shadow-xl active:scale-95">
                           Start Your Story
                        </Link>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* 3. Community Stats */}
      <section className="py-32 italic">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
               <div className="space-y-4 text-center">
                  <div className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic">1.2K</div>
                  <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest italic">Lives Restored</div>
               </div>
               <div className="space-y-4 text-center">
                  <div className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic">450+</div>
                  <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest italic">Emergency Responses</div>
               </div>
               <div className="col-span-2 md:col-span-1 space-y-4 text-center">
                  <div className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter italic">98%</div>
                  <div className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest italic">Success Rate</div>
               </div>
            </div>
         </div>
      </section>

      <CTASection 
         title="BECOME A SUCCESS STORY."
         subtitle="One donation can lead to a lifetime of impact. Join our elite circle of heroes and help us write the next chapter of hope."
         primaryBtnText="START DONATING"
         primaryBtnLink="/register"
         secondaryBtnText="SUBMIT RESPONSE"
         secondaryBtnLink="/saved-lives/submit"
      />
    </main>
  );
}
