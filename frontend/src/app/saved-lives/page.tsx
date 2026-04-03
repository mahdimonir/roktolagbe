'use client';
import CTASection from '@/components/common/CTASection';
import { Skeleton, SkeletonCircle, SkeletonText } from '@/components/common/Skeleton';
import { api } from '@/lib/api/axios';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Calendar, Heart, History, MapPin, Quote, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SavedLivesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['saved-lives'],
    queryFn: () => api.get('/media/saved-lives?limit=20'),
  });

  const stories = data?.data || [];

  return (
    <main className="min-h-screen bg-white pb-20 relative overflow-hidden">
      {/* Background Decorative Arcs */}
      <div className="absolute top-0 right-0 w-[50rem] h-[50rem] bg-[#FBEBEB] rounded-full blur-[120px] -mr-64 -mt-64 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#FBEBEB] rounded-full blur-[100px] -ml-48 -mb-48 opacity-30 pointer-events-none" />

      {/* 1. Hero Section - Renders Instantly */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gray-50/30 border-b border-gray-100 italic font-black">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-red-50 shadow-sm">
                <Heart size={16} className="text-red-500 fill-current animate-pulse" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] italic">Community Impact</span>
             </div>
             
             <h1 className="text-7xl md:text-[8rem] font-black text-[#112135] leading-[0.8] tracking-tighter italic uppercase drop-shadow-sm">
                Real Stories. <br /> <span className="text-red-600 italic">Real Lives</span>.
             </h1>
             
             <div className="max-w-3xl mx-auto space-y-6">
               <p className="text-xl md:text-2xl text-gray-500 font-medium italic leading-relaxed">
                  "The best amongst you is the one who is most beneficial to people."
               </p>
               <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] italic opacity-60">— Prophet Muhammad (PBUH)</p>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Stories Feed OR Enhanced Empty State */}
      <section className="-mt-32 relative z-20 px-6 mb-24 min-h-[400px]">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            /* SECTION-SPECIFIC SKELETON: Renders while stories load */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="bg-white rounded-[3.5rem] border border-gray-100 p-12 space-y-8 animate-pulse">
                    <Skeleton className="w-full aspect-[4/5] rounded-[2.5rem]" />
                    <div className="flex items-center gap-4">
                       <SkeletonCircle size="w-14 h-14" />
                       <SkeletonText lines={2} className="flex-1" />
                    </div>
                    <SkeletonText lines={3} />
                 </div>
               ))}
            </div>
          ) : stories.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
              {stories.map((story: any) => (
                <div key={story.id} className="break-inside-avoid bg-[#F9FAFB] rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col hover:-translate-y-2">
                  {/* Visual content */}
                  <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    {story.cardPath || story.imagePath ? (
                      <img 
                        src={(story.cardPath || story.imagePath).startsWith('http') 
                          ? (story.cardPath || story.imagePath) 
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${story.cardPath || story.imagePath}`} 
                        alt="Donation Story" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-[#CC0000] to-[#990000] text-white relative font-black">
                        <Sparkles className="absolute top-10 right-10 w-12 h-12 opacity-20" />
                        <div className="w-24 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-10 backdrop-blur-md border border-white/10">
                           <Heart size={40} className="fill-current" />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-[1] mb-4">Mission <br/> Accomplished</h3>
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest italic italic">Life Saved via {story.donor.name}</p>
                        <div className="mt-12 px-8 py-2.5 bg-white text-red-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-lg shadow-black/10">Verified Hero</div>
                      </div>
                    )}
                  </div>

                  {/* Story text */}
                  <div className="p-12 space-y-8 italic font-black">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-white text-red-600 rounded-2xl flex items-center justify-center font-black italic text-xl border border-red-50 shadow-sm transition-all group-hover:bg-red-600 group-hover:text-white group-hover:scale-110">
                          {story.donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{story.donor.name}</h4>
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 italic opacity-80">
                             <MapPin size={12} className="text-red-500" />
                             {story.donor.district}
                          </div>
                       </div>
                    </div>
                    
                    {story.notes && (
                      <div className="relative">
                        <Quote className="absolute -top-6 -left-6 w-12 h-12 text-gray-100 opacity-50 transition-all group-hover:text-red-100 group-hover:opacity-100" />
                        <p className="text-gray-600 font-medium italic text-lg leading-relaxed relative z-10 pl-4 border-l-4 border-red-50/50">
                          &ldquo;{story.notes}&rdquo;
                        </p>
                      </div>
                    )}

                    <div className="pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] italic">
                       <div className="flex items-center gap-3">
                          <Calendar size={14} className="text-gray-200" />
                          {new Date(story.donatedAt).toLocaleDateString()}
                       </div>
                       <Sparkles size={14} className="text-amber-500 opacity-60 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border-4 border-dashed border-gray-100 p-20 text-center space-y-12 animate-in fade-in duration-1000 shadow-sm relative overflow-hidden group italic font-black">
               {/* Impact invitation */}
               <div className="max-w-4xl mx-auto space-y-10 relative z-10">
                  <div className="w-28 h-28 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto transition-all group-hover:bg-red-50 group-hover:text-red-200 group-hover:scale-110 duration-700">
                     <History size={48} />
                  </div>
                  
                  <div className="space-y-4">
                     <h3 className="text-5xl md:text-7xl font-black text-gray-200 uppercase italic tracking-tighter leading-[0.8] transition-colors group-hover:text-gray-300">
                        History in the <br /> <span className="italic italic">Making.</span>
                     </h3>
                     <p className="text-gray-400 italic text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Every heroic donation becomes a legend here. Our feed is currently waiting for it&apos;s first story—will it be yours?
                     </p>
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-8">
                     <Link href="/register" className="w-full sm:w-auto bg-gray-50 text-gray-400 px-14 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all italic active:scale-95 shadow-sm border border-gray-100 flex items-center justify-center gap-4 group/btn">
                        Start Donating <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                     </Link>
                     <Link href="/contact" className="w-full sm:w-auto bg-white text-gray-400 px-14 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all italic active:scale-95 border border-gray-100 flex items-center justify-center">
                        Submit a Story
                     </Link>
                  </div>
               </div>

               {/* Decorative background for empty state */}
               <div className="absolute inset-0 bg-gradient-to-br from-red-600/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          )}
        </div>
      </section>

      {/* 3. Global CTA - Renders Instantly */}
      <CTASection 
        title="READY TO BE A HERO?"
        subtitle="Your single donation can save up to three lives. Start your journey today and be the beacon of hope someone is waiting for."
        primaryBtnText="START DONATING"
        primaryBtnLink="/register"
        secondaryBtnText="TELL YOUR STORY"
        secondaryBtnLink="/contact"
      />
    </main>
  );
}
