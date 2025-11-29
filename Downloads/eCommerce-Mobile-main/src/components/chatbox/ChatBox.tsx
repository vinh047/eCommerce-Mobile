"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  user: boolean;
  text: string;
}

export const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { user: true, text: input }]);
    const messageText = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { user: false, text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { user: false, text: "Lỗi khi kết nối GPT API." },
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999999] font-sans">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-5 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Chat với Groq
        </button>
      )}

      {open && (
        <div className="w-96 h-[450px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <span className="font-bold text-lg">Groq</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200 font-bold text-xl"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`
        px-4 py-2 rounded-2xl break-words 
        ${
          msg.user
            ? "bg-blue-100 self-end text-right"
            : "bg-gray-200 self-start text-left"
        } 
        inline-block max-w-[70%] shadow-sm
      `}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-3 border-t border-gray-200 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập câu hỏi..."
              className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
