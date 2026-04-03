'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { Heart, Sparkles, Quote, Calendar, MapPin, Loader2, History } from 'lucide-react';
import CTASection from '@/components/common/CTASection';

export default function SavedLivesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['saved-lives'],
    queryFn: () => api.get('/media/saved-lives?limit=20'),
  });

  const stories = data?.data || [];

  if (isLoading) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
      <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest italic animate-pulse">Loading Heroic Stories...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gray-50/50 border-b border-gray-100">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-[40rem] h-[40rem] bg-red-600/[0.03] rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="flex flex-col items-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-full border border-red-100 shadow-sm">
                <Heart size={16} className="text-red-500 fill-current" />
                <span className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Community Impact</span>
             </div>
             
             <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-tight tracking-tighter italic uppercase">
                Real Stories. <br /> <span className="text-red-600 italic">Real Lives</span>.
             </h1>
             
             <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium italic leading-relaxed">
                "The best amongst you is the one who is most beneficial to people."
                <br />
                <span className="text-sm opacity-60 mt-4 block">— Prophet Muhammad (PBUH)</span>
             </p>
          </div>
        </div>
      </section>

      {/* 2. Stories Feed */}
      <section className="-mt-32 relative z-20 px-6">
        <div className="max-w-7xl mx-auto">
          {stories.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
              {stories.map((story: any) => (
                <div key={story.id} className="break-inside-avoid bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-700 group flex flex-col">
                  {/* Visual content */}
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                    {story.cardPath || story.imagePath ? (
                      <img 
                        src={(story.cardPath || story.imagePath).startsWith('http') 
                          ? (story.cardPath || story.imagePath) 
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${story.cardPath || story.imagePath}`} 
                        alt="Donation Story" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-red-600 to-red-800 text-white relative">
                        <Sparkles className="absolute top-10 right-10 w-12 h-12 opacity-20" />
                        <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
                           <Heart size={40} className="fill-current" />
                        </div>
                        <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none mb-4">Mission Accomplished</h3>
                        <p className="text-sm font-bold opacity-80 italic italic">A life was saved thanks to the bravery of {story.donor.name}.</p>
                        <div className="mt-10 px-6 py-2 bg-white text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">Verified Hero</div>
                      </div>
                    )}
                  </div>

                  {/* Story text */}
                  <div className="p-10 space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-black italic text-lg border border-red-100">
                          {story.donor.bloodGroup.replace('_POS', '+').replace('_NEG', '-')}
                       </div>
                       <div>
                          <h4 className="font-black text-gray-900 uppercase italic tracking-tighter leading-none">{story.donor.name}</h4>
                          <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">
                             <MapPin size={12} className="text-red-500" />
                             {story.donor.district}
                          </div>
                       </div>
                    </div>
                    
                    {story.notes && (
                      <div className="relative">
                        <Quote className="absolute -top-4 -left-4 w-10 h-10 text-gray-50" />
                        <p className="text-gray-600 font-medium italic leading-relaxed relative z-10 pl-4">
                          "{story.notes}"
                        </p>
                      </div>
                    )}

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] italic">
                       <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-gray-300" />
                          {new Date(story.donatedAt).toLocaleDateString()}
                       </div>
                       <Sparkles size={12} className="text-amber-500 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-44 text-center bg-white rounded-[5rem] border-4 border-dashed border-gray-100 shadow-sm animate-in fade-in duration-1000">
               <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-10">
                  <History size={48} />
               </div>
               <h3 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">No stories shared yet</h3>
               <p className="text-gray-400 italic text-sm font-medium mb-12 max-w-sm mx-auto">Be the first hero to share a donation story and inspire the world. 🩸</p>
               <CTASection 
                  title="READY TO BE A HERO?"
                  subtitle="Your single donation can save up to three lives. Start your journey today."
                  primaryBtnText="START DONATING"
                  primaryBtnLink="/register"
                  secondaryBtnText="TELL YOUR STORY"
                  secondaryBtnLink="/contact"
               />
            </div>
          )}
        </div>
      </section>

      {/* 3. Global CTA */}
      {stories.length > 0 && (
        <CTASection 
          title="YOUR BLOOD CAN SAVE LIVES."
          subtitle="Join thousands of heroes already making a difference in the community."
          primaryBtnText="JOIN THE NETWORK"
          secondaryBtnText="HOW IT WORKS"
        />
      )}
    </main>
  );
}
