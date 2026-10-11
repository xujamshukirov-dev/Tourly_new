import React, { useState } from 'react';
import { Menu, Search, Bell, X, Mail, MessageSquare, User } from 'lucide-react';
import InitialsAvatar from './ui/InitialsAvatar';

export default function Navbar({
  onOpenMenu,
  onOpenProfile,
  onOpenMessages,
  searchQuery,
  setSearchQuery,
  unreadCount = 0,
  onOpenNotifications,
  messageUnread = 0,
  user,
}) {
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : '';

  return (
    <header className="sticky top-0 z-40 w-full px-2.5 sm:px-4 md:px-6 pt-2 sm:pt-3 pb-1.5 sm:pb-2">
      <div className="max-w-7xl mx-auto glass-card rounded-2xl sm:rounded-3xl p-2.5 sm:px-4 sm:py-3 shadow-lg border border-white/70 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 transition-all">

        {/* Top bar on mobile / Left brand on desktop */}
        <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-4 w-full md:w-auto">
          {/* Menu & Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenMenu}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/80 hover:bg-[#2d6a4f]/15 text-gray-800 flex items-center justify-center transition shadow-sm border border-white/60 active:scale-95 flex-shrink-0"
              aria-label="Menyu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5 select-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-sm border border-white/20 bg-white/40 backdrop-blur-md p-1 flex items-center justify-center flex-shrink-0">
                <img src="/images/tourly_logo.png" alt="Tourly" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-base sm:text-xl font-extrabold text-gray-900 tracking-tight leading-none block">TOURLY</span>
                <span className="text-[9px] sm:text-[10px] text-gray-500 block leading-tight mt-0.5">Sayyohlik platformasi</span>
              </div>
            </div>
          </div>

          {/* Action buttons on mobile (< md) */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={onOpenMessages}
              className="relative w-9 h-9 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center border border-white/60 active:scale-95 shadow-xs transition"
              title="Xabarlar"
              aria-label="Xabarlar"
            >
              <MessageSquare className="w-4 h-4 text-gray-700" />
              {messageUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">
                  {messageUnread}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center border border-white/60 active:scale-95 shadow-xs transition"
              title="Bildirishnomalar"
              aria-label="Bildirishnomalar"
            >
              <Bell className="w-4 h-4 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-1 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition active:scale-95 shadow-xs border border-white/60 bg-white/80 overflow-hidden"
              title={userName || 'Profil'}
              aria-label="Profil"
            >
              {userName ? (
                <InitialsAvatar name={userName} size="xs" />
              ) : (
                <User className="w-4 h-4 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Live Search Bar — direct access on mobile and desktop */}
        <div className="w-full md:flex-1 md:max-w-md md:mx-4 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Shahar, dacha, mehmonxona yoki tur qidirish..."
            className="tourly-input pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full bg-white/90 focus:bg-white border-white/70 shadow-inner"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
              title="Tozalash"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action buttons on desktop (>= md) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMessages}
            className="relative w-10 h-10 rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center border border-white/60 transition shadow-xs active:scale-95"
            title="Xabarlar"
          >
            <MessageSquare className="w-5 h-5 text-gray-700" />
            {messageUnread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                {messageUnread}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-2xl bg-white/80 hover:bg-white flex items-center justify-center border border-white/60 transition shadow-xs active:scale-95"
            title="Bildirishnomalar"
          >
            <Bell className="w-5 h-5 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenProfile}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition active:scale-95 shadow-sm overflow-hidden"
            title={userName || 'Profil'}
          >
            {userName ? (
              <InitialsAvatar name={userName} size="sm" />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-white/80 border border-white/60 text-gray-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
