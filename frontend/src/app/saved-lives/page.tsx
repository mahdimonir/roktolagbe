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
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] pb-28 italic font-black text-gray-900 dark:text-gray-100 transition-colors duration-500">
      {/* 1. Page Header - Compact Glass Header */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-transparent">
         <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[35rem] h-[35rem] bg-red-600/[0.05] dark:bg-red-600/[0.08] rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 text-center lg:text-left">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
               <div className="max-w-2xl space-y-6">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                     <span className="bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase italic shadow-xl shadow-red-600/10">
                        Platform Impact
                     </span>
                     <div className="flex items-center gap-2 text-[10px] text-red-600 font-black uppercase tracking-widest bg-white dark:bg-white/10 px-4 py-1.5 rounded-full border border-red-100 dark:border-white/10 italic shadow-sm">
                        <Sparkles size={14} className="text-red-500" />
                        Live Milestones
                     </div>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter leading-none">
                     Real Stories. <br />
                     <span className="text-red-600">Real Lives.</span>
                  </h1>
                  
                  <p className="text-gray-500 dark:text-gray-400 font-medium italic text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                     Every drop tells a story. Witness the power of community and the lives transformed through the RoktoLagbe emergency network.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5 w-full lg:w-auto">
                  <Link href="/register" className="w-full sm:w-auto bg-red-600 text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95 italic flex items-center justify-center gap-3">
                     <Heart className="w-5 h-5 fill-white" />
                     Start Donating
                  </Link>
                  <button className="w-full sm:w-auto bg-white dark:bg-white/10 border border-gray-100 dark:border-white/10 text-gray-900 dark:text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-50 dark:hover:bg-white/20 transition-all active:scale-95 italic flex items-center justify-center gap-3">
                     <MessageSquare size={18} />
                     Share Story
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* 2. Success Stories Grid - Compact Standard */}
      <section className="py-20 px-4 md:px-0">
         <div className="max-w-7xl mx-auto px-6">
            {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <div key={i} className="space-y-6">
                        <Skeleton className="aspect-[4/3] rounded-[2.5rem]" />
                        <div className="space-y-3 px-4">
                           <Skeleton className="h-8 w-3/4 rounded-full" />
                           <Skeleton className="h-4 w-1/2 rounded-full" />
                        </div>
                     </div>
                  ))}
               </div>
            ) : stories && stories.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {stories.map((story: any) => (
                     <div key={story.id} className="group p-6 rounded-[3rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-red-100 dark:hover:border-red-500/30 transition-all duration-700 shadow-sm hover:shadow-2xl dark:hover:shadow-black/40 backdrop-blur-sm">
                        <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-lg border-2 border-white dark:border-gray-800 transition-transform duration-700 group-hover:scale-[1.05]">
                           <Image 
                              src={story.imageUrl || '/story-placeholder.png'} 
                              alt={story.title} 
                              fill 
                              className="object-cover"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                           <div className="absolute top-4 right-4">
                              <div className="w-12 h-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-600 shadow-xl border border-white dark:border-gray-800">
                                 <Quote size={20} />
                              </div>
                           </div>
                        </div>
                        
                        <div className="space-y-4 px-2">
                           <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest italic">
                              <span className="flex items-center gap-1.5"><MapPin size={10} className="text-red-500" /> {story.location}</span>
                              <span className="w-1 h-1 bg-gray-200 dark:bg-gray-800 rounded-full" />
                              <span className="flex items-center gap-1.5"><Calendar size={10} className="text-red-500" /> {new Date(story.date).toLocaleDateString()}</span>
                           </div>
                           <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight italic group-hover:text-red-600 transition-colors uppercase">
                              {story.title}
                           </h3>
                           <p className="text-gray-500 dark:text-gray-400 text-[13px] font-medium leading-relaxed italic line-clamp-2">
                              {story.excerpt}
                           </p>
                           <div className="pt-2 flex items-center gap-3 text-red-600 text-[9px] font-black uppercase tracking-widest italic group-hover:gap-5 transition-all">
                              Read Impact <ArrowRight size={14} />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 bg-gray-50 dark:bg-white/5 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-white/10 group relative overflow-hidden italic">
                  <div className="relative">
                     <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                        <History className="w-10 h-10 text-gray-200 dark:text-gray-700" />
                     </div>
                     <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-4 border-white dark:border-gray-900 animate-pulse" />
                  </div>
                  
                  <div className="space-y-3">
                     <h2 className="text-3xl font-black text-gray-300 dark:text-gray-700 tracking-tighter italic uppercase">History in the Making.</h2>
                     <p className="text-gray-400 dark:text-gray-500 text-sm italic font-medium max-w-sm mx-auto leading-relaxed">
                        Our emergency impact logs are clear. We&apos;re waiting to document the next life-saving milestone.
                     </p>
                  </div>

                  <div className="pt-4">
                     <Link href="/register" className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all italic shadow-xl active:scale-95">
                        Start Your Story
                     </Link>
                  </div>
               </div>
            )}
         </div>
      </section>

      {/* 3. Community Stats - Compact */}
      <section className="py-16 md:py-24 border-t border-gray-100 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center overflow-hidden">
               {[
                 { label: 'Lives Restored', value: '1.2K' },
                 { label: 'Emergency Responses', value: '450+' },
                 { label: 'Success Rate', value: '98%' }
               ].map((stat, i) => (
                 <div key={i} className="space-y-2 group">
                    <div className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter italic group-hover:scale-110 group-hover:text-red-600 transition-all duration-700">{stat.value}</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">{stat.label}</div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      <CTASection 
         title="BECOME A HERO."
         subtitle="One donation can lead to a lifetime of impact. Join our elite circle of donors today."
         primaryBtnText="START DONATING"
         primaryBtnLink="/register"
         secondaryBtnText="SUBMIT STORY"
         secondaryBtnLink="/saved-lives/submit"
      />
    </main>
  );
}
