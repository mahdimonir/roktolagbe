'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { MessageCircle, Send, X, User } from 'lucide-react';

export default function MessagingOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContact, setActiveContact] = useState<any>(null);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/messages/conversations'),
    enabled: isOpen,
  });

  const { data: messages } = useQuery({
    queryKey: ['messages', activeContact?.id],
    queryFn: () => api.get(`/messages/${activeContact.id}`),
    enabled: !!activeContact,
    refetchInterval: 5000, // Poll for now
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/messages', data),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeContact.id] });
    },
  });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeContact) return;
    mutation.mutate({ receiverId: activeContact.id, content: message });
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/40 z-50 hover:scale-110 transition-transform"
    >
      <MessageCircle size={32} />
    </button>
  );

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 sm:w-[400px] h-full sm:h-[600px] bg-white sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] z-50 flex flex-col border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
         <div className="flex items-center gap-3">
            {activeContact ? (
              <button onClick={() => setActiveContact(null)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <X size={18} className="text-gray-400" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                 <MessageCircle size={20} />
              </div>
            )}
            <div>
               <p className="font-bold text-gray-900">{activeContact ? activeContact.email.split('@')[0] : 'Social Messages'}</p>
               <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{activeContact ? 'Online' : 'Recent Chats'}</p>
            </div>
         </div>
         <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
         </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {activeContact ? (
          <>
            {messages?.data?.map((m: any) => (
              <div key={m.id} className={`flex ${m.senderId === activeContact.id ? 'justify-start' : 'justify-end'}`}>
                 <div className={`max-w-[80%] p-4 rounded-3xl text-sm ${m.senderId === activeContact.id ? 'bg-gray-100 text-gray-900 rounded-tl-none' : 'bg-red-500 text-white rounded-tr-none shadow-lg shadow-red-500/10'}`}>
                    {m.content}
                 </div>
              </div>
            ))}
          </>
        ) : (
          <div className="space-y-2">
            {conversations?.data?.map((c: any) => (
              <button 
                key={c.id} 
                onClick={() => setActiveContact(c)}
                className="w-full p-4 rounded-2xl hover:bg-red-50/50 transition-all flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-md transition-all">
                   <User size={24} />
                </div>
                <div className="text-left">
                   <p className="font-bold text-gray-900">{c.email.split('@')[0]}</p>
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.role}</p>
                </div>
              </button>
            ))}
            {conversations?.data?.length === 0 && (
              <div className="py-20 text-center">
                 <p className="text-gray-400 text-sm">No conversations yet.</p>
                 <p className="text-[10px] text-gray-300 mt-2 uppercase tracking-widest px-10">Messages will appear here once you coordinate with a donor or seeker.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Input */}
      {activeContact && (
        <form onSubmit={send} className="p-6 border-t border-gray-50 flex gap-2">
           <input 
             type="text" 
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             placeholder="Type a message..." 
             className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20"
           />
           <button 
             type="submit"
             disabled={!message.trim()}
             className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50"
           >
              <Send size={20} />
           </button>
        </form>
      )}
    </div>
  );
}
