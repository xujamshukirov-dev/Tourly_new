import React, { useState, useEffect, useRef } from 'react';
import {
  X, Send, Phone, MapPin, Sparkles, CheckCheck, Mic, MicOff,
  Smile, Play, Pause, Paperclip, ChevronLeft, Volume2
} from 'lucide-react';
import InitialsAvatar from '../ui/InitialsAvatar';
import { getChatMessages, sendChatMessage } from '../../utils/chatStorage';
import { api } from '../../services/api';

const EMOJI_LIST = [
  '😀', '😂', '😍', '🥰', '😎', '🤩', '👍', '👏', '🤝', '🔥',
  '❤️', '🎉', '✈️', '🏔️', '🚕', '🚗', '🏠', '🏨', '🍽️', '🇺🇿',
  '☕', '⛺', '🎒', '📸', '💯', '✨', '🙌', '👌', '☀️', '🌸'
];

const STICKER_LIST = [
  { id: 'stk_1', label: 'Xush kelibsiz!', emoji: '👋', text: 'Assalomu alaykum!' },
  { id: 'stk_2', label: 'Yo\'lga chiqdik!', emoji: '🚕', text: 'Yo\'lga chiqdik, kutib oling!' },
  { id: 'stk_3', label: 'Manzilga yetdik', emoji: '🏔️', text: 'Go\'zal tabiat qo\'ynidamiz!' },
  { id: 'stk_4', label: 'Katta rahmat!', emoji: '🤝', text: 'Katta rahmat sizga!' },
  { id: 'stk_5', label: 'Super!', emoji: '🔥', text: 'Hammasi a\'lo darajada!' },
  { id: 'stk_6', label: 'Kutmoqdaman', emoji: '⏳', text: 'Aytilgan joyda kutmoqdaman' },
];

export default function ChatModal({
  isOpen,
  onClose,
  currentUser,
  partner, // { id, name, role, phone, serviceTitle, carModel, licensePlate, viloyat, tuman }
  onNewMessageNotification,
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activePickerTab, setActivePickerTab] = useState('emoji'); // 'emoji' | 'stickers'

  // Voice recording simulation
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const recordTimerRef = useRef(null);

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const messagesEndRef = useRef(null);

  const partnerId = partner?.id || 'provider';
  const currentUserId = currentUser?.id || 'guest';
  const chatId = `chat_${Math.min(String(currentUserId), String(partnerId))}_${Math.max(String(currentUserId), String(partnerId))}`;

  useEffect(() => {
    if (isOpen && partner) {
      const loaded = getChatMessages(chatId, {
        id: partner.id,
        name: partner.name || partner.hostName || partner.driverName || 'Xizmat ko\'rsatuvchi',
        serviceType: partner.serviceType || 'taxi',
      });
      setMessages(loaded);
    }
  }, [isOpen, partner, chatId]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Voice recording timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((d) => d + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecordingVoice]);

  if (!isOpen || !partner) return null;

  const partnerName = partner.name || partner.driverName || partner.hostName || partner.contactPerson || 'Haydovchi';
  const currentUserName = currentUser ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'Siz' : 'Siz';

  const handleSend = (contentToSend, type = 'text') => {
    const text = (typeof contentToSend === 'string' ? contentToSend : inputText).trim();
    if (!text && type === 'text') return;

    const userMsg = sendChatMessage(chatId, {
      senderId: currentUserId,
      senderName: currentUserName,
      text: type === 'voice' ? '🎤 Ovozli xabar' : text,
      isProvider: false,
      type, // 'text' | 'voice' | 'sticker'
      duration: type === 'voice' ? (recordDuration || 4) : undefined,
    });

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setShowEmojiPicker(false);

    // Send real message to backend if partner has valid integer id
    const recId = parseInt(partnerId, 10);
    if (!isNaN(recId) && recId > 0) {
      api.sendMessage(recId, text).catch((err) => {
        console.warn('Backend chat sendMessage failed:', err.message);
      });
    }

    // Realistic driver / provider simulated response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let randomResponse = "";
      if (type === 'voice') {
        randomResponse = "Ovozli xabaringizni eshitdim, hammasi tushunarli! Aytilgan vaqtda tayyor bo'laman.";
      } else {
        const responses = [
          `Assalomu alaykum, ${currentUser?.firstName || 'qadrdon sayyoh'}! Xabaringizni oldim. Hozir qulay vaqt bo'lsa telefon orqali aniqlashtirib olamiz.`,
          `Salom! Ha, albatta, ma'lumotlar qabul qilindi. Siz aytgan manzilga o'z vaqtida boramiz.`,
          `Rahmat murojaatingiz uchun! Xizmatimiz sifatli va narxlar maqbul. Yana qanday savollaringiz bor?`,
        ];
        randomResponse = responses[Math.floor(Math.random() * responses.length)];
      }

      const replyMsg = sendChatMessage(chatId, {
        senderId: partnerId,
        senderName: partnerName,
        text: randomResponse,
        isProvider: true,
      });

      setMessages((prev) => [...prev, replyMsg]);

      // Trigger realistic notification event
      if (onNewMessageNotification) {
        onNewMessageNotification({
          partnerName,
          text: randomResponse,
        });
      }
    }, 1200);
  };

  const handleSendVoice = () => {
    setIsRecordingVoice(false);
    handleSend('🎤 Ovozli xabar', 'voice');
  };

  const handleCancelVoice = () => {
    setIsRecordingVoice(false);
    setRecordDuration(0);
  };

  const handlePlayVoice = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 4000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatSec = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#efeae2] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-[680px] max-h-[92vh] border border-gray-300"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `radial-gradient(#00000008 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      >
        {/* Telegram Header */}
        <div className="px-4 py-3 bg-[#2E5A27] text-white flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="sm:hidden -ml-1 text-white hover:text-gray-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <InitialsAvatar name={partnerName} size="md" showOnline={true} />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-snug">{partnerName}</h3>
              <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                online
                {partner.carModel && <span className="text-white/80">• {partner.carModel}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {partner.phone && (
              <a
                href={`tel:${partner.phone}`}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition active:scale-95"
                title="Qo'ng'iroq qilish"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telegram Info Bar */}
        {(partner.viloyat || partner.carModel) && (
          <div className="bg-[#2E5A27]/10 px-4 py-1.5 border-b border-[#2E5A27]/15 flex items-center justify-between text-xs text-[#2E5A27]">
            <div className="flex items-center gap-1.5 font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">
                {partner.viloyat}{partner.tuman ? `, ${partner.tuman}` : ''}
              </span>
            </div>
            {partner.licensePlate && (
              <span className="bg-white/80 border border-[#2E5A27]/20 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                {partner.licensePlate}
              </span>
            )}
          </div>
        )}

        {/* Telegram Messages Stream */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-2.5">
          <div className="text-center my-1">
            <span className="text-[10px] text-gray-500 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-gray-200 shadow-2xs font-medium">
              Telegram xavfsiz shifrlangan muloqot
            </span>
          </div>

          {messages.map((m) => {
            const isMe = !m.isProvider && m.senderId === currentUserId;
            const isVoice = m.type === 'voice';
            const isSticker = m.type === 'sticker';

            return (
              <div
                key={m.id}
                className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <InitialsAvatar name={m.senderName || partnerName} size="xs" />
                )}

                <div
                  className={`relative max-w-[82%] sm:max-w-[75%] rounded-2xl px-3.5 py-2 text-xs sm:text-sm shadow-sm transition ${
                    isMe
                      ? 'bg-[#d9fdd3] text-gray-900 rounded-br-none border border-[#b2e5a7]/40'
                      : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                  }`}
                >
                  {/* Voice message bubble */}
                  {isVoice ? (
                    <div className="flex items-center gap-3 py-1 pr-1">
                      <button
                        type="button"
                        onClick={() => handlePlayVoice(m.id)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition shadow-sm ${
                          isMe ? 'bg-[#2E5A27]' : 'bg-[#38B0DC]'
                        }`}
                      >
                        {playingAudioId === m.id ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                      <div className="space-y-1 min-w-[120px]">
                        {/* Audio waveform visualization */}
                        <div className="flex items-center gap-0.5 h-4">
                          {[3, 8, 12, 6, 14, 9, 15, 7, 11, 4, 10, 13, 5, 8, 12].map((h, i) => (
                            <span
                              key={i}
                              className={`w-1 rounded-full transition-all ${
                                playingAudioId === m.id
                                  ? 'bg-[#2E5A27] animate-pulse'
                                  : isMe ? 'bg-[#2E5A27]/50' : 'bg-gray-400'
                              }`}
                              style={{ height: `${h}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          0:0{m.duration || 4} • Ovozli xabar
                        </span>
                      </div>
                    </div>
                  ) : isSticker ? (
                    <div className="py-1">
                      <span className="text-3xl block">{m.emoji || '✨'}</span>
                      <p className="font-bold text-xs mt-1">{m.text}</p>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                  )}

                  {/* Timestamp & Telegram Double Checkmark (✓✓) */}
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-gray-400 select-none">
                    <span>{m.time}</span>
                    {isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <InitialsAvatar name={partnerName} size="xs" />
              <div className="bg-white border border-gray-200 px-3.5 py-1.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A27] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A27] animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E5A27] animate-bounce delay-300" />
                <span className="text-[11px] text-gray-500 ml-1">{partnerName} yozmoqda...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice recording in-progress banner */}
        {isRecordingVoice && (
          <div className="bg-red-50 border-t border-red-200 px-4 py-2 flex items-center justify-between text-xs text-red-600 animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">Ovoz yozilmoqda: {formatSec(recordDuration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelVoice}
                className="text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1 rounded-lg"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSendVoice}
                className="text-xs font-bold bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm"
              >
                Yuborish ✓
              </button>
            </div>
          </div>
        )}

        {/* Emojis & Stickers Tabbed Panel */}
        {showEmojiPicker && (
          <div className="bg-white border-t border-gray-200 p-3 max-h-56 overflow-y-auto animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
              <button
                type="button"
                onClick={() => setActivePickerTab('emoji')}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                  activePickerTab === 'emoji' ? 'bg-[#2E5A27] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                😀 Emojilar
              </button>
              <button
                type="button"
                onClick={() => setActivePickerTab('stickers')}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                  activePickerTab === 'stickers' ? 'bg-[#2E5A27] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎭 Stikerlar
              </button>
            </div>

            {activePickerTab === 'emoji' ? (
              <div className="grid grid-cols-10 gap-1 text-xl select-none">
                {EMOJI_LIST.map((em, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText((prev) => prev + em)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition text-center hover:scale-125"
                  >
                    {em}
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {STICKER_LIST.map((stk) => (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => {
                      handleSend(stk.text, 'sticker');
                    }}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-[#2E5A27]/10 border border-gray-200 flex items-center gap-2 text-left transition active:scale-95"
                  >
                    <span className="text-2xl">{stk.emoji}</span>
                    <span className="text-xs font-bold text-gray-800 line-clamp-1">{stk.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Telegram Footer Input Bar */}
        <div className="p-2 sm:p-3 bg-white border-t border-gray-200 flex items-center gap-2">
          {/* Emoji / Sticker Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
              showEmojiPicker ? 'text-[#2E5A27] bg-[#2E5A27]/10' : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Emoji va stikerlar"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Xabar..."
            className="flex-1 resize-none py-2 px-3.5 rounded-2xl bg-gray-100 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-[#2E5A27] focus:bg-white transition"
          />

          {/* Voice Record / Send Button */}
          {inputText.trim() ? (
            <button
              type="button"
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-full bg-[#2E5A27] hover:bg-[#23451d] text-white flex items-center justify-center transition active:scale-95 shadow-md flex-shrink-0"
              title="Yuborish"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isRecordingVoice) {
                  handleSendVoice();
                } else {
                  setIsRecordingVoice(true);
                }
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 shadow-md flex-shrink-0 ${
                isRecordingVoice
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-[#2E5A27] hover:bg-[#23451d] text-white'
              }`}
              title="Ovozli xabar"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
