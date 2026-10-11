import React, { useState, useRef, useEffect } from 'react';
import { X, Bot, Send, User, Sparkles, Compass, MapPin, DollarSign } from 'lucide-react';
import { api } from '../../services/api';

export default function AiAdvisorModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Assalomu alaykum! Men Tourly AI sayohat maslahatchisiman 🇺🇿. O'zbekistonning 14 ta hududi bo'ylab eng go'zal maskanlar, tezyurar poyezdlar, dacha va mehmonxona ijarasi yoki byudjet rejalashtirishda yordam bera olaman. Sizga qanday yordam kerak?",
      time: 'Hozir',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInput('');
    setIsTyping(true);

    try {
      const response = await api.askAi(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: "Kechirasiz, vaqtincha aloqa uzildi. Iltimos qaytadan urinib ko'ring yoki boshqa savol bering.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts = [
    { label: "Samarqand 2 kunlik reja", query: "Samarqandda 2 kunlik sayohat marshrutini tuzib ber" },
    { label: "Zominda dam olish", query: "Zominda dam olish narxlari va eng yaxshi kottejlar" },
    { label: "O'rtacha sayohat byudjeti", query: "O'zbekiston ichida 3 kishi uchun qancha byudjet kerak?" },
    { label: "Xiva milliy taomlari", query: "Xorazm va Xivada qaysi taomlarni albatta tatib ko'rish kerak?" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className="w-full max-w-xl h-[85vh] max-h-[680px] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#38B0DC] to-cyan-400 text-white flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-gray-900 text-base">
                  Tourly AI Maslahatchi
                </h3>
                <span className="text-[10px] bg-[#38B0DC]/15 text-[#2695BF] px-1.5 py-0.2 rounded-md font-bold">
                  Aqlli Yordamchi
                </span>
              </div>
              <span className="text-xs text-gray-500">24/7 O'zbekiston sayohat yo'riqnomasi</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-b border-gray-100 bg-[#38B0DC]/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="w-3 h-3 text-[#38B0DC]" /> Tezkor:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="text-xs whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-[#38B0DC] hover:text-white text-gray-700 font-medium transition shadow-sm border border-gray-200/60"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                    isBot ? 'bg-[#38B0DC]' : 'bg-gray-800'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white text-gray-800 border border-gray-100'
                      : 'bg-[#38B0DC] text-white font-medium'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isBot ? 'text-gray-400' : 'text-white/75'
                    }`}
                  >
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs pl-10">
              <div className="flex items-center gap-1 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#38B0DC] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#38B0DC] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#38B0DC] animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-semibold text-gray-500 ml-1">Tourly AI javob tayyorlamoqda...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3 sm:p-4 border-t border-gray-100 bg-white/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sayohat haqida savolingizni yozing..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-2xl bg-[#38B0DC] hover:bg-[#2695BF] disabled:opacity-50 text-white flex items-center justify-center transition shadow-md active:scale-95 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
