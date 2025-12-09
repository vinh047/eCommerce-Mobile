'use client';

import { useState, useRef, useEffect } from 'react';

// Định nghĩa kiểu tin nhắn
type Message = { 
  id: number; 
  role: 'user' | 'assistant'; 
  content: string; 
};

export default function ChatBot() {
  // 1. Thêm state để quản lý đóng/mở chat
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tự động cuộn xuống dưới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 1. Hiện tin nhắn của user
    const userMsg: Message = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Gọi API
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      const data = await res.json(); 

      // 3. Hiện tin nhắn của Bot
      const botMsg: Message = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: typeof data.answer === 'string' ? data.answer : "Lỗi hiển thị."
      };
      
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now() + 2, role: 'assistant', content: "Có lỗi kết nối." };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 2. Nút Bấm Tròn (Luôn hiện khi chat đóng) */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-transform hover:scale-110 active:scale-95"
        >
          {/* Icon Chat */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}

      {/* 3. Khung Chat (Chỉ hiện khi isOpen = true) */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-80 sm:w-96 shadow-2xl rounded-xl bg-white flex flex-col h-[500px] border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-200">
          
          {/* Header có nút đóng */}
          <div className="bg-blue-600 p-4 text-white font-bold flex justify-between items-center rounded-t-xl">
            <div className="flex items-center gap-2">
              <span>🤖 Tư vấn AI</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded p-1 transition-colors"
            >
              {/* Icon X đóng */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-sm text-gray-500 mt-10">
                👋 Xin chào! Tôi có thể giúp gì cho bạn?
              </div>
            )}
            
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-800 border'
                }`}>
                  <span className="whitespace-pre-wrap">{m.content}</span>
                </div>
              </div>
            ))}
            
            {isLoading && <div className="text-xs text-gray-500 ml-2 italic">Đang trả lời...</div>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t flex gap-2">
            <input 
              className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Nhập câu hỏi..." 
              disabled={isLoading}
              autoFocus // Tự động focus khi mở
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}