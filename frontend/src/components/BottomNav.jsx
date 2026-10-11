import React from 'react';
import { Home, Sparkles, Map, User } from 'lucide-react';

export default function BottomNav({
  activeNav,
  setActiveNav,
  onOpenPostFeed,
  unreadBookings = 0
}) {
  const items = [
    { id: 'home', label: 'Asosiy', icon: Home, action: () => setActiveNav('home') },
    {
      id: 'reels',
      label: 'Reels',
      icon: Sparkles,
      action: () => {
        onOpenPostFeed?.();
      },
    },
    { id: 'map', label: 'Xarita', icon: Map, action: () => setActiveNav('map') },
    { id: 'profile', label: 'Profil', icon: User, action: () => setActiveNav('profile') },
  ];

  return (
    <>
      {/* Spacer to prevent content from hiding under floating dock */}
      <div className="pb-16 sm:pb-20">{/* spacer */}</div>

      {/* Floating glass nav dock — on both mobile and desktop */}
      <div className="fixed bottom-2.5 sm:bottom-3 left-0 right-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none">
        <nav className="glass-nav px-2 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-2xl flex items-center gap-1 sm:gap-3 pointer-events-auto border border-white/80 max-w-md w-full justify-around backdrop-blur-xl">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.action) {
                    item.action();
                    return;
                  }
                  setActiveNav(item.id);
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 sm:px-4 transition-all active:scale-95 flex-1 rounded-2xl ${
                  isActive
                    ? 'text-[#2E5A27] font-extrabold'
                    : 'text-gray-400 hover:text-gray-600 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-[#2E5A27] rounded-full" />
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
