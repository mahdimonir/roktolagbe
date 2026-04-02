'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth-store';
import { useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, Suspense } from 'react';
import { 
  Send, 
  User, 
  Activity, 
  ShieldAlert, 
  Clock, 
  Search, 
  ChevronLeft,
  MoreVertical,
  MessageSquare,
  Globe,
  Zap,
  Target,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

function MessagesContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<string | null>(searchParams.get('contactId'));
  const [message, setMessage] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Conversations
  const { data: conversationsData, isLoading: convoLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
       const res: any = await api.get('/messages/conversations');
       return res?.data?.data || [];
    },
    refetchInterval: 10000,
  });

  // 2. Fetch Messages
  const { data: messagesData, isLoading: msgsLoading } = useQuery({
    queryKey: ['messages', selectedContact],
    queryFn: async () => {
       if (!selectedContact) return [];
       const res: any = await api.get(`/messages/${selectedContact}`);
       return res?.data?.data || [];
    },
    enabled: !!selectedContact,
    refetchInterval: 5000,
  });

  // 3. Send Message
  const sendMutation = useMutation({
    mutationFn: async () => {
       if (!selectedContact || !message.trim()) return;
       return api.post('/messages', {
          receiverId: selectedContact,
          content: message,
          isEmergency
       });
    },
    onSuccess: () => {
       setMessage('');
       setIsEmergency(false);
       queryClient.invalidateQueries({ queryKey: ['messages', selectedContact] });
       queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: () => toast.error('Message failed to send.')
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMutation.isPending) return;
    sendMutation.mutate();
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData]);

  const conversations = conversationsData || [];
  const messages = messagesData || [];
  const currentContact = conversations.find((c: any) => c.id === selectedContact) || 
                         (selectedContact ? { id: selectedContact, email: 'Loading...', role: 'USER' } : null);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* 1. Conversations Sidebar */}
      <aside className={`
        ${selectedContact ? 'hidden lg:flex' : 'flex'}
        w-full lg:w-[24rem] flex-col bg-gray-50 border-r border-gray-100 shrink-0
      `}>
        <div className="p-8 border-b border-gray-100 bg-white">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gray-900 text-red-500 rounded-xl flex items-center justify-center shadow-lg">
                 <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">Messages</h2>
                 <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-2">Recent Conversations</p>
              </div>
           </div>
           
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search contacts..."
                className="w-full bg-gray-50 border border-transparent rounded-xl py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white focus:border-red-200 transition-all font-bold italic"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
           {convoLoading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest italic animate-pulse">Loading conversations...</span>
             </div>
           ) : conversations.length > 0 ? (
             conversations.map((convo: any) => (
               <button 
                 key={convo.id}
                 onClick={() => setSelectedContact(convo.id)}
                 className={`w-full p-6 rounded-[2rem] border transition-all flex items-center gap-5 group relative overflow-hidden ${
                   selectedContact === convo.id 
                     ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                     : 'bg-white border-transparent hover:border-red-100 shadow-sm'
                 }`}
               >
                  <div className={`w-14 h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-white shadow-sm transition-all group-hover:scale-110 ${selectedContact === convo.id ? 'text-gray-900' : 'text-gray-400'}`}>
                     <User size={24} />
                  </div>
                  <div className="flex-1 text-left">
                     <p className={`text-xs font-black uppercase tracking-tight truncate ${selectedContact === convo.id ? 'text-white' : 'text-gray-900'}`}>{convo.name || convo.email.split('@')[0]}</p>
                     <p className={`text-[9px] font-black uppercase tracking-widest mt-1 italic ${selectedContact === convo.id ? 'text-red-400' : 'text-gray-400'}`}>{convo.role}</p>
                  </div>
               </button>
             ))
           ) : (
             <div className="py-20 text-center space-y-6">
                <MessageSquare className="w-12 h-12 text-gray-200 mx-auto" />
                <p className="text-[10px] font-black uppercase text-gray-300 italic px-8 leading-relaxed">No messages found.</p>
             </div>
           )}
        </div>
      </aside>

      {/* 2. Chat Area */}
      {selectedContact ? (
        <main className="flex-1 flex flex-col bg-white relative">
           {/* Chat Header */}
           <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
              <div className="flex items-center gap-6">
                 <button onClick={() => setSelectedContact(null)} className="lg:hidden p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                    <ChevronLeft size={20} />
                  </button>
                 <div className="relative">
                    <div className="w-14 h-14 bg-gray-50 rounded-[1.2rem] flex items-center justify-center text-red-600 border border-gray-100">
                       <User size={24} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                 </div>
                 <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">{currentContact?.name || currentContact?.email}</h3>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{currentContact?.role}</span>
                       <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                       <span className="text-[9px] font-black uppercase text-green-600 tracking-widest italic">Online</span>
                    </div>
                 </div>
              </div>
              <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-red-600 transition-all">
                 <MoreVertical size={20} />
              </button>
           </div>

           {/* Message History */}
           <div 
             ref={scrollRef}
             className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-gray-50/20"
           >
              {msgsLoading ? (
                 <div className="h-full flex flex-col items-center justify-center gap-6">
                    <Loader2 className="w-12 h-12 text-gray-200 animate-spin" />
                    <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest italic">Loading messages...</p>
                 </div>
              ) : messages.length > 0 ? (
                messages.map((msg: any) => {
                  const isOwn = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}>
                       <div className="space-y-2 max-w-[85%] lg:max-w-[70%]">
                          <div className={`p-6 rounded-[2rem] shadow-sm relative overflow-hidden ${
                            isOwn 
                              ? 'bg-gray-900 text-white rounded-tr-none' 
                              : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                          } ${msg.isEmergency ? 'border-2 border-red-500' : ''}`}>
                             <p className="text-sm font-medium italic leading-relaxed relative z-10">{msg.content}</p>
                          </div>
                          <div className={`flex items-center gap-3 px-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                             {msg.isEmergency && <ShieldAlert size={10} className="text-red-500 animate-pulse" />}
                             <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest italic flex items-center gap-1.5">
                                 <Clock size={10} /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                       </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-6 opacity-30">
                   <div className="w-20 h-20 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center">
                      <MessageSquare size={32} className="text-gray-300" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest italic text-center max-w-sm px-10">Select a contact to start messaging.</p>
                </div>
              )}
           </div>

           {/* Message Input */}
           <div className="p-8 border-t border-gray-100 bg-white relative z-10">
              <form onSubmit={handleSend} className="max-w-5xl mx-auto flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                    <button 
                      type="button"
                      onClick={() => setIsEmergency(!isEmergency)}
                      className={`h-12 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 italic border-2 ${
                        isEmergency 
                          ? 'bg-red-600 text-white border-red-500 shadow-lg animate-pulse' 
                          : 'bg-white text-gray-400 border-gray-100 hover:border-red-200 hover:text-red-600'
                      }`}
                    >
                       <ShieldAlert size={16} /> {isEmergency ? 'EMERGENCY' : 'STANDARD'}
                    </button>
                    <div className="h-[1px] flex-1 bg-gray-100" />
                 </div>
                 
                 <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-[1.8rem] border border-gray-100 group-focus-within:bg-white group-focus-within:border-red-500 transition-all">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm font-medium italic text-gray-900 placeholder:text-gray-400"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button 
                       type="submit"
                       disabled={!message.trim() || sendMutation.isPending}
                       className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                       {sendMutation.isPending ? (
                         <Loader2 className="w-5 h-5 animate-spin" />
                       ) : (
                         <Send size={20} />
                       )}
                    </button>
                 </div>
              </form>
           </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col items-center justify-center bg-white p-20 text-center relative">
           <div className="relative z-10 space-y-8">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center mx-auto shadow-inner">
                 <Globe className="w-12 h-12 text-gray-200" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 italic leading-none">Select a Conversation</h2>
                 <p className="text-gray-400 italic font-medium text-sm max-w-sm mx-auto leading-relaxed">
                   Communicate with donors and hospitals in real-time. Select a contact from the list to start chatting.
                 </p>
              </div>
              <div className="flex justify-center gap-4 pt-6">
                 <div className="flex items-center gap-3 bg-red-50 px-5 py-2 rounded-xl text-[9px] font-black uppercase text-red-600 tracking-widest border border-red-100 italic">
                    <Activity size={14} /> 24/7 Monitoring
                 </div>
                 <div className="flex items-center gap-3 bg-blue-50 px-5 py-2 rounded-xl text-[9px] font-black uppercase text-blue-600 tracking-widest border border-blue-100 italic">
                    <Zap size={14} /> Low Latency
                 </div>
              </div>
           </div>
        </main>
      )}
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
       <div className="h-[calc(100vh-140px)] flex flex-col justify-center items-center bg-white rounded-[4rem] border border-gray-100 shadow-2xl">
          <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading messages...</p>
       </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
