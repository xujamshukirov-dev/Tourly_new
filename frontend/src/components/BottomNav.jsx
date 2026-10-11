import React from 'react';
import { Home, Sparkles, Map, User } from 'lucide-react';

export default function BottomNav({
  activeNav,
  setActiveNav,
  onOpenPostFeed,
  isReelsOpen = false,
  onCloseReels,
  unreadBookings = 0
}) {
  const items = [
    {
      id: 'home',
      label: 'Asosiy',
      icon: Home,
      action: () => {
        if (isReelsOpen) onCloseReels?.();
        setActiveNav('home');
      }
    },
    {
      id: 'reels',
      label: 'Reels',
      icon: Sparkles,
      action: () => {
        if (!isReelsOpen) {
          onOpenPostFeed?.();
        }
      },
    },
    {
      id: 'map',
      label: 'Xarita',
      icon: Map,
      action: () => {
        if (isReelsOpen) onCloseReels?.();
        setActiveNav('map');
      }
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      action: () => {
        if (isReelsOpen) onCloseReels?.();
        setActiveNav('profile');
      }
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from hiding under floating dock */}
      <div className="pb-16 sm:pb-20">{/* spacer */}</div>

      {/* Floating glass nav dock — on both mobile and desktop, persistent over Reels (z-[70]) */}
      <div className="fixed bottom-2.5 sm:bottom-3 left-0 right-0 z-[70] flex justify-center px-3 sm:px-4 pointer-events-none">
        <nav className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-2xl flex items-center gap-1 sm:gap-3 pointer-events-auto max-w-md w-full justify-around backdrop-blur-xl transition-all duration-300 ${
          isReelsOpen
            ? 'bg-black/75 border border-white/20 text-white shadow-black/50'
            : 'glass-nav border border-white/80 shadow-2xl'
        }`}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = isReelsOpen ? item.id === 'reels' : activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.action) {
                    item.action();
                    return;
                  }
                  if (isReelsOpen) onCloseReels?.();
                  setActiveNav(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 transition-all active:scale-95 flex-1 rounded-2xl ${
                  isActive
                    ? (isReelsOpen ? 'text-emerald-400 font-extrabold' : 'text-[#2E5A27] font-extrabold')
                    : (isReelsOpen ? 'text-white/60 hover:text-white font-medium' : 'text-gray-400 hover:text-gray-600 font-medium')
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 rounded-full ${
                    isReelsOpen ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-[#2E5A27]'
                  }`} />
                )}
                {item.id === 'profile' && unreadBookings > 0 && (
                  <span className="absolute top-1 right-2 sm:right-4 w-2 h-2 bg-[#2E5A27] rounded-full ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
