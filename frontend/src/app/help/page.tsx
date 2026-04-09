'use client';

import {
   ChevronDown,
   Heart,
   Loader2,
   Mail,
   MessageSquare,
   Phone,
   Search,
   Send,
   Bot,
   User,
   RefreshCw,
   HelpCircle,
   Sparkles,
   X,
   Plus,
   ArrowRight
} from 'lucide-react';
import { Suspense, useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api/axios';

const faqData = [
  {
    category: 'Donation FAQs',
    items: [
      { q: 'How do I register as a blood donor?', a: 'You can register by visiting the "Register" page and providing your basic details, blood group, and location. Once registered, you can start responding to blood requests.' },
      { q: 'What is the eligibility for donating blood?', a: 'Generally, you must be between 18-65 years old, weigh at least 50kg, and be in good health. There should be a gap of 3-4 months since your last donation.' },
      { q: 'Is blood donation safe?', a: 'Yes, blood donation is a very safe process. We only partner with verified hospitals that use sterile, single-use equipment for every donor.' }
    ]
  },
  {
    category: 'Hospital & Organization FAQs',
    items: [
      { q: 'How can a hospital join the network?', a: 'Hospitals and organizations can apply through our partnership portal. Our team will manually verify the credentials before activating the account.' },
      { q: 'How do I post an urgent blood request?', a: 'Verified managers can post requests directly from their dashboard. These requests are instantly broadcasted to matching donors in the area.' }
    ]
  },
  {
    category: 'Privacy & Security',
    items: [
      { q: 'Is my personal information secure?', a: 'Yes, your data is encrypted. We only share your contact information with verified clinical managers when you actively commit to a donation.' },
      { q: 'How do you verify donors and requests?', a: 'We verify requests through our network of hospital managers and volunteer coordinators. Donors are encouraged to maintain a regular donation history to build trust within the community.' }
    ]
  }
];

const relevantQueries = [
  "How can I donate blood?",
  "What are the eligibility requirements?",
  "How to post an emergency request?",
  "How do the reward points work?",
  "Tell me about Thalassemia support."
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

function HelpContent() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showQueries, setShowQueries] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (queriesRef.current && !queriesRef.current.contains(event.target as Node)) {
        setShowQueries(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAsk = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: question.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setShowQueries(false);

    try {
      const res: any = await api.post('/ai/help', { question: question.trim() });
      const data = res?.data;
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: data?.answer || 'I could not find an answer to your question. Please try rephrasing or contact our support team.',
      };
      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting to the assistant. Please try again or contact us at team@roktolagbe.org',
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const selectQuery = (q: string) => {
    setInputValue(q);
    setShowQueries(false);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setChatMessages([]);
    setInputValue('');
    setShowQueries(false);
    inputRef.current?.focus();
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0d] transition-colors duration-500 pb-24 italic">
      {/* 1. Page Header */}
      <section className="relative pt-32 pb-16 overflow-hidden px-6">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-red-600/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4">
           <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">Help Center</p>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none !not-italic">
             HOW CAN WE <span className="text-red-600 italic">ASSIST?</span>
           </h1>
           <p className="text-gray-500 dark:text-gray-400 font-medium text-lg max-w-xl mx-auto not-italic opacity-80">
             Find real-time support using our AI assistant or browse common questions below.
           </p>
        </div>
      </section>

      {/* 2. Chat Window - Final Refined UI */}
      <section className="max-w-4xl mx-auto px-6 mb-24 relative z-20">
         <div className="bg-white dark:bg-[#111111]/40 border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-[0_42px_100px_rgba(0,0,0,0.06)] dark:shadow-none overflow-hidden flex flex-col min-h-[550px]">
            
            {/* Chat Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-white/[0.03] flex items-center justify-between bg-gray-50/30 dark:bg-transparent">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 rounded-2xl flex items-center justify-center text-red-600 shadow-sm">
                     <Bot size={20} />
                  </div>
                  <div className="flex flex-col leading-none gap-2">
                     <span className="text-[11px] font-black tracking-widest text-gray-900 dark:text-white uppercase">AI Assistant</span>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-[7.5px] font-black text-red-600 uppercase tracking-[0.2em] italic">Online Support</span>
                     </div>
                  </div>
               </div>
               {chatMessages.length > 0 && (
                  <button 
                    onClick={handleClearChat}
                    className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 transition-all"
                  >
                     <RefreshCw size={12} /> Reset Chat
                  </button>
               )}
            </div>

            {/* Chat Feed */}
            <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[500px] not-italic font-bold text-[13px] custom-scrollbar">
               {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-10 py-12">
                     <div className="space-y-4">
                        <HelpCircle className="w-14 h-14 text-gray-100 dark:text-white/5 mx-auto" />
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] italic">Commonly Asked Questions</p>
                     </div>
                     <div className="flex flex-wrap justify-center gap-3 max-w-2xl px-4">
                        {relevantQueries.map((q, i) => (
                           <button 
                              key={i}
                              onClick={() => selectQuery(q)}
                              className="px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] text-[10px] font-black text-gray-500 hover:text-red-600 hover:border-red-600/30 transition-all uppercase tracking-widest"
                           >
                              {q}
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-5 duration-700`}>
                     {msg.role === 'assistant' && (
                        <div className="w-9 h-9 bg-gray-50 dark:bg-white/8 rounded-2xl flex items-center justify-center text-red-600 shrink-0 mt-1 border border-gray-100 dark:border-white/10">
                           <Bot size={18} />
                        </div>
                     )}
                     <div className={`max-w-[85%] md:max-w-[70%] px-7 py-4.5 rounded-[1.75rem] text-[13px] leading-relaxed tracking-tight ${
                        msg.role === 'user' 
                        ? 'bg-red-600 text-white rounded-tr-none shadow-xl shadow-red-600/10' 
                        : 'bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/10 shadow-sm'
                     }`}>
                        {msg.content}
                     </div>
                     {msg.role === 'user' && (
                        <div className="w-9 h-9 bg-gray-900 dark:bg-red-600 text-white rounded-2xl flex items-center justify-center shrink-0 mt-1">
                           <User size={18} />
                        </div>
                     )}
                  </div>
               ))}
               {isLoading && (
                  <div className="flex gap-4 justify-start">
                     <div className="w-9 h-9 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-red-600 shrink-0">
                        <Bot size={18} />
                     </div>
                     <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-7 py-5 rounded-[1.75rem] rounded-tl-none">
                        <div className="flex gap-2.5">
                           <div className="w-2 h-2 bg-red-600/20 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                           <div className="w-2 h-2 bg-red-600/20 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                           <div className="w-2 h-2 bg-red-600/20 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                     </div>
                  </div>
               )}
               <div ref={chatEndRef} />
            </div>

            {/* Chat Input Area - Finalized Placement */}
            <div className="p-8 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/20 dark:bg-transparent relative">
               
               {/* Quick Query List Dropdown */}
               {showQueries && (
                  <div 
                    ref={queriesRef}
                    className="absolute bottom-full left-8 right-8 mb-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl p-4 space-y-2 animate-in slide-in-from-bottom-5 duration-500 z-50 backdrop-blur-3xl"
                  >
                     <div className="flex items-center justify-between px-2 pb-3 border-b border-gray-50 dark:border-white/5 mb-3">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Common Questions</span>
                        <button onClick={() => setShowQueries(false)} className="text-gray-400 hover:text-red-600">
                           <X size={14} />
                        </button>
                     </div>
                     {relevantQueries.map((q, i) => (
                        <button 
                           key={i}
                           onClick={() => selectQuery(q)}
                           className="w-full text-left p-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-[11px] font-black text-gray-600 dark:text-gray-400 hover:text-red-600 transition-all uppercase tracking-widest flex items-center gap-3"
                        >
                           <Search size={12} className="shrink-0 text-red-600" />
                           {q}
                        </button>
                     ))}
                  </div>
               )}

               <div className="flex items-center gap-3">
                  <button 
                     type="button"
                     onClick={() => setShowQueries(!showQueries)}
                     className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-90 ${showQueries ? 'bg-red-600 text-white shadow-red-600/20' : 'bg-white dark:bg-white/5 text-red-600 border border-gray-100 dark:border-white/10 hover:bg-red-50'}`}
                  >
                     <Sparkles size={20} />
                  </button>
                  <form 
                     onSubmit={(e) => { e.preventDefault(); handleAsk(inputValue); }}
                     className="flex-1 relative flex items-center bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 md:p-3 rounded-2xl shadow-sm focus-within:border-red-600 transition-all"
                  >
                     <input 
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-transparent py-3 px-4 text-gray-900 dark:text-white outline-none font-bold text-xs md:text-sm uppercase tracking-[0.15em] placeholder:text-gray-300 dark:placeholder:text-gray-700"
                        disabled={isLoading}
                     />
                     <button 
                        type="submit"
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-red-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-30"
                     >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Inline FAQs - Simple List */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
         <div className="space-y-16">
            {faqData.map((category, i) => (
               <div key={i} className="space-y-10">
                  <h3 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] flex items-center gap-4 italic opacity-80">
                     <span className="w-10 h-[2.5px] bg-red-600"></span>
                     {category.category}
                  </h3>
                  <div className="space-y-2">
                     {category.items.map((item, idx) => (
                        <div key={idx} className="border-b border-gray-100 dark:border-white/5 last:border-none">
                           <button 
                              onClick={() => setOpenFaq(openFaq === item.q ? null : item.q)}
                              className="w-full py-7 flex items-center justify-between text-left group transition-all"
                           >
                              <span className={`text-[13.5px] font-black uppercase tracking-[0.1em] transition-colors ${openFaq === item.q ? 'text-red-600' : 'text-gray-800 dark:text-gray-300 group-hover:text-red-600'}`}>
                                 {item.q}
                              </span>
                              <ChevronDown 
                                size={18} 
                                className={`text-red-600 transition-transform duration-500 shrink-0 ${openFaq === item.q ? 'rotate-180' : ''}`} 
                              />
                           </button>
                           {openFaq === item.q && (
                              <div className="pb-8 animate-in fade-in slide-in-from-top-2 duration-500">
                                 <p className="text-[14px] font-bold not-italic leading-relaxed text-gray-500 dark:text-gray-400 capitalize bg-gray-50/50 dark:bg-white/[0.02] p-8 rounded-[2rem] border border-gray-100/50 dark:border-white/5">
                                    {item.a}
                                 </p>
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(239, 68, 68, 0.1);
          border-radius: 9999px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </main>
  );
}

export default function HelpPage() {
  return (
     <Suspense fallback={
       <div className="min-h-screen pt-44 flex flex-col items-center justify-center bg-white dark:bg-[#0a0a0d] italic font-black">
         <div className="w-20 h-1 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden mb-8 relative">
            <div className="absolute inset-0 bg-red-600 w-1/3 animate-loading-slide"></div>
         </div>
         <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] animate-pulse">Loading Help Center...</p>
       </div>
    }>
      <HelpContent />
    </Suspense>
  );
}
