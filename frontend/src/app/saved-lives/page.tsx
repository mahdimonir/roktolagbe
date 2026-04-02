'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';

export default function SavedLivesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['saved-lives'],
    queryFn: () => api.get('/media/saved-lives?limit=20'),
  });

  if (isLoading) return <div className="p-12 text-center">Loading heroic stories...</div>;

  const stories = data?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Saved Lives Feed 🩸</h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic">
          "The best amongst you is the one who is most beneficial to people."
          <br />
          Experience the impact of our heroic donation community.
        </p>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {stories.map((story: any) => (
          <div key={story.id} className="break-inside-avoid glass rounded-3xl overflow-hidden hover:border-red-500/30 transition-all shadow-lg group">
            {/* Story Card/Image */}
            <div className="aspect-[4/5] bg-red-50 relative group-hover:bg-red-100 transition-colors">
              {story.cardPath || story.imagePath ? (
                <img 
                  src={(story.cardPath || story.imagePath).startsWith('http') 
                    ? (story.cardPath || story.imagePath) 
                    : `http://localhost:8000/${story.cardPath || story.imagePath}`} 
                  alt="Donation Story" 
                  className="w-full h-full object-contain bg-white"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <div className="text-5xl mb-4">🩸</div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Life Saved</h3>
                  <div className="my-4 w-12 h-0.5 bg-white/30"></div>
                  <p className="text-sm font-medium opacity-90">Thank you, {story.donor.name}!</p>
                  <p className="text-xs opacity-70 mt-1">{story.donor.district}</p>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">{story.donor.name}</h4>
                  <p className="text-xs text-gray-500">{story.donor.district} • {new Date(story.donatedAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
                  {story.donor.bloodGroup.replace('_POS', '+')}
                </div>
              </div>
              
              {story.notes && (
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{story.notes}"
                </p>
              )}
            </div>
          </div>
        ))}

        {stories.length === 0 && (
          <div className="col-span-full py-24 text-center glass rounded-3xl opacity-50 italic">
            Be the first hero to share a donation story! 🩸
          </div>
        )}
      </div>
    </div>
  );
}
