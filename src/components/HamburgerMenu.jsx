import React from 'react';
import {
  X, ChevronRight, UserCheck, Car, Home, Hotel, UtensilsCrossed,
  Bot, Train, Plane, Bus, Pizza, Ticket, Compass, LogOut, Briefcase,
  Building2, Sparkles, Shield, Video, Camera
} from 'lucide-react';

export default function HamburgerMenu({
  isOpen,
  onClose,
  onOpenService, // (serviceKey) => void
  onLogout
}) {
  if (!isOpen) return null;

  const menuSections = [
    {
      id: 'feed',
      title: 'Asosiy feed',
      subtitle: 'Bosh sahifaga qaytish',
      icon: Sparkles,
      iconColor: 'text-[#38B0DC]',
      bgColor: 'bg-[#38B0DC]/10',
      action: () => onOpenService('feed'),
    },
    {
      id: 'reels',
      title: 'Reels (Sayohatchilar Tasmasi)',
      subtitle: "Instagram uslubidagi video va rasm postlari",
      icon: Sparkles,
      iconColor: 'text-rose-500',
      bgColor: 'bg-rose-50',
      badge: 'TOP',
      action: () => onOpenService('reels'),
    },
    {
      id: 'guide',
      title: "Gid bo'lish",
      subtitle: "Ro'yxatdan o'tish",
      icon: UserCheck,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      action: () => onOpenService('register_guide'),
    },
    {
      id: 'taxi',
      title: "Taksi bo'lish",
      subtitle: "Ro'yxatdan o'tish",
      icon: Car,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      action: () => onOpenService('register_taxi'),
    },
    {
      id: 'home_rent',
      title: 'Uy va dachalar ijaraga berish',
      subtitle: "E'lon joylash",
      icon: Home,
      iconColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      action: () => onOpenService('register_home_rent'),
    },
    {
      id: 'hotel',
      title: 'Mehmonxona',
      subtitle: "Ro'yxatdan o'tish",
      icon: Hotel,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => onOpenService('register_hotel'),
    },
    {
      id: 'restoran',
      title: 'Restoran',
      subtitle: "Xizmat qo'shish",
      icon: UtensilsCrossed,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => onOpenService('register_restoran'),
    },
    {
      id: 'tour_company',
      title: 'Tour kompaniyani ro\'yxatdan o\'tkazish',
      subtitle: 'Tur paketlar joylash & hamkorlik',
      icon: Building2,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Yangi',
      action: () => onOpenService('register_tour_company'),
    },
    {
      id: 'ai_assistant',
      title: 'AI Yordamchi',
      subtitle: 'Sayohat maslahati & chat',
      icon: Bot,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      action: () => onOpenService('ai_assistant'),
    },
    {
      id: 'train_ticket',
      title: 'Poyezd bilet',
      subtitle: 'Chipta band qilish',
      icon: Train,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      action: () => onOpenService('train_ticket'),
    },
    {
      id: 'flight_ticket',
      title: 'Aviabilet',
      subtitle: 'Parvoz band qilish',
      icon: Plane,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => onOpenService('flight_ticket'),
    },
    {
      id: 'bus_ticket',
      title: 'Express avtobus',
      subtitle: 'Chipta band qilish',
      icon: Bus,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      action: () => onOpenService('bus_ticket'),
    },
    {
      id: 'food_order',
      title: 'Ovqat buyurtma',
      subtitle: 'Yetkazib berish (Dacha & Mehmonxonaga)',
      icon: Pizza,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      action: () => onOpenService('food_order'),
    },
    {
      id: 'attraction_ticket',
      title: 'Attraksion chiptasi',
      subtitle: 'Chipta xarid qilish (Amirsoy, Magic City)',
      icon: Ticket,
      iconColor: 'text-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      action: () => onOpenService('attraction_ticket'),
    },
    {
      id: 'tour_packages',
      title: 'Tour sotib olish',
      subtitle: 'Tayyor tur paketlar',
      icon: Compass,
      iconColor: 'text-emerald-700',
      bgColor: 'bg-emerald-100/50',
      action: () => onOpenService('tour_packages'),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-start animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md h-full bg-white/75 backdrop-blur-3xl shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-left duration-300 border-r border-white/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Menu Top Bar */}
        <div className="p-4 sm:p-5 border-b border-white/60 flex items-center justify-between bg-white/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-sm border border-white/20 bg-white/40 backdrop-blur-md p-1 flex items-center justify-center flex-shrink-0">
              <img src="/images/tourly_logo.png" alt="Tourly" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 tracking-tight text-base sm:text-lg">
                TOURLY MENYU
              </h3>
              <span className="text-[11px] text-gray-500">Xizmatlar va imkoniyatlar</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition active:scale-95"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable List of Menu Items (Matching Image 1) */}
        <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-gray-50 space-y-1">
          {menuSections.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-2xl hover:bg-[#38B0DC]/8 cursor-pointer transition-all flex items-center justify-between group active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl ${item.bgColor} ${item.iconColor} flex items-center justify-center flex-shrink-0 shadow-sm border border-white/80 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800 group-hover:text-[#38B0DC] transition">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 font-medium block">
                      {item.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            );
          })}
        </div>

        {/* Menu Bottom: Chiqish (Logout) button (Matching Image 1) */}
        <div className="p-4 sm:p-5 border-t border-white/60 bg-white/50 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => {
              if (onLogout) onLogout();
              onClose();
            }}
            className="w-full py-3 rounded-2xl border-2 border-red-500 text-red-600 hover:bg-red-50 font-bold text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
