import React, { useState, useEffect } from 'react';
import {
  User, Calendar, Heart, MessageSquare, Settings, ShieldCheck,
  CheckCircle2, Clock, Trash2, ExternalLink, Ticket, MapPin,
  ChevronRight, Send, Globe, Bell, Plus, Edit3, Sparkles, Type,
  Phone, ArrowLeft, Camera, Video, Play, X
} from 'lucide-react';
import InitialsAvatar from './ui/InitialsAvatar';
import { updateUserProfile } from '../utils/authStorage';
import { api } from '../services/api';

export default function UserProfile({
  user,
  viewingUser = null, // External profile to view: { name, role, phone, location, avatar, id, ... }
  onCloseViewingUser,
  bookings = [],
  favorites = [],
  posts = [],
  allListings = [],
  onCancelBooking,
  onRequestLogin,
  onOpenCreatePost,
  onUserUpdated,
  onOpenChat,
  onOpenPostFeed,
  onDeletePost,
  onUpdatePost,
}) {
  const isViewingOther = !!viewingUser;
  const activeProfile = isViewingOther ? viewingUser : user;

  // Single unified "posts" tab — No separated Reels!
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' | 'bookings' | 'favorites' | 'settings'

  // Settings form states
  const [firstName, setFirstName] = useState(user?.firstName || user?.first_name || '');
  const [lastName, setLastName] = useState(user?.lastName || user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [fontStyle, setFontStyle] = useState(() => localStorage.getItem('tourly_font_style') || 'sans');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Post Modal inside profile
  const [editingPost, setEditingPost] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editLocation, setEditLocation] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || user.first_name || '');
      setLastName(user.lastName || user.last_name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
    }
  }, [user]);

  // Apply font style immediately to body
  const applyFont = (font) => {
    setFontStyle(font);
    localStorage.setItem('tourly_font_style', font);
    document.body.classList.remove('font-theme-sans', 'font-theme-serif', 'font-theme-mono');
    document.body.classList.add(`font-theme-${font}`);
  };

  // Filter all posts (images & videos combined) for this profile
  const displayedPosts = posts.filter((p) => {
    if (isViewingOther) {
      return (
        p.author === viewingUser.name ||
        p.authorId === viewingUser.id ||
        (viewingUser.name && p.author?.toLowerCase().includes(viewingUser.name.toLowerCase()))
      );
    }
    if (!user) return false;
    const myName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return (
      p.author === myName ||
      p.authorId === user.id ||
      p.authorEmail === user.email ||
      (!p.authorId && myName && p.author === myName)
    );
  });

  // Save profile settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await api.completeProfile({
        username: user.username || user.email.split('@')[0],
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
      });
    } catch (err) {
      console.warn('Backend complete-profile xatosi:', err.message);
    }

    const updated = updateUserProfile(user.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
    });

    applyFont(fontStyle);
    onUserUpdated?.(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Delete own post
  const handleDeletePost = (postId, e) => {
    e?.stopPropagation();
    if (window.confirm("Haqiqatan ham ushbu postni o'chirishni xohlaysizmi?")) {
      onDeletePost?.(postId);
    }
  };

  // Open edit modal for own post
  const handleOpenEditPost = (post, e) => {
    e?.stopPropagation();
    setEditingPost(post);
    setEditCaption(post.caption || '');
    setEditLocation(post.location || '');
  };

  // Save post edit
  const handleSavePostEdit = (e) => {
    e.preventDefault();
    if (!editingPost) return;
    onUpdatePost?.(editingPost.id, {
      caption: editCaption.trim(),
      location: editLocation.trim(),
    });
    setEditingPost(null);
  };

  // Get favorite objects
  const favoriteItems = (allListings || []).filter((item) => favorites.includes(item.id));

  // If viewing my profile but not logged in
  if (!isViewingOther && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center glass-card rounded-3xl border border-white/80 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-[#2E5A27]/15 text-[#2E5A27] flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Profil uchun tizimga kiring</h2>
        <p className="text-xs text-gray-500 mt-2 mb-6">
          O'zingizning barcha rasm va video postlaringiz, buyurtmalaringiz va sozlamalarni boshqarish uchun profilingizga kiring.
        </p>
        <button
          type="button"
          onClick={onRequestLogin}
          className="w-full py-3 rounded-2xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold transition shadow-lg active:scale-95"
        >
          Kirish / Ro'yxatdan o'tish
        </button>
      </div>
    );
  }

  const profileDisplayName = isViewingOther
    ? (viewingUser.name || viewingUser.driverName || viewingUser.hostName || 'Foydalanuvchi')
    : (`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);

  const profileRole = isViewingOther
    ? (viewingUser.role || viewingUser.serviceTypeName || (viewingUser.carModel ? 'Taksi haydovchisi' : 'Xizmat ko\'rsatuvchi'))
    : (user.isAdmin ? 'Administrator' : 'Sayyoh');

  const profileLocation = isViewingOther
    ? (viewingUser.viloyat || viewingUser.location || "O'zbekiston")
    : "O'zbekiston";

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6">

      {/* Back button if viewing another user's profile */}
      {isViewingOther && (
        <button
          type="button"
          onClick={onCloseViewingUser}
          className="flex items-center gap-2 text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] bg-white/80 px-3.5 py-2 rounded-xl border border-white shadow-xs transition active:scale-95 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Orqaga qaytish</span>
        </button>
      )}

      {/* 1. Profile Header Card */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/80 shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative">
              <div className="p-1 rounded-3xl bg-gradient-to-tr from-[#2E5A27] via-[#38B0DC] to-amber-500 shadow-md">
                <InitialsAvatar name={profileDisplayName} size="xl" />
              </div>
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {profileDisplayName}
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#2E5A27]/15 text-[#2E5A27]">
                  {profileRole}
                </span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2E5A27]" />
                  {profileLocation}
                </span>
                {viewingUser?.phone && (
                  <span className="font-medium text-gray-700">📞 {viewingUser.phone}</span>
                )}
              </div>

              {viewingUser?.carModel && (
                <p className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 inline-block mt-1">
                  🚗 {viewingUser.carModel} {viewingUser.licensePlate ? `• ${viewingUser.licensePlate}` : ''}
                </p>
              )}

              {user?.bio && !isViewingOther && (
                <p className="text-xs text-gray-600 max-w-md pt-1 italic">
                  "{user.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Action buttons on Profile Header */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {isViewingOther ? (
              <>
                <button
                  type="button"
                  onClick={() => onOpenChat?.(viewingUser)}
                  className="px-4 py-2.5 rounded-2xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold shadow-md shadow-[#2E5A27]/25 flex items-center gap-2 transition active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Xabar yozish (Telegram)</span>
                </button>

                {viewingUser?.phone && (
                  <a
                    href={`tel:${viewingUser.phone}`}
                    className="p-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center shadow-xs transition active:scale-95"
                    title="Qo'ng'iroq qilish"
                  >
                    <Phone className="w-4 h-4 text-[#2E5A27]" />
                  </a>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={onOpenCreatePost}
                className="px-4 py-2 rounded-2xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold shadow-md shadow-[#2E5A27]/25 flex items-center gap-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Post Yuklash</span>
              </button>
            )}
          </div>

        </div>

        {/* Unified Stats counter */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-6 pt-5 border-t border-gray-100 text-center">
          <div className="bg-white/60 p-2 sm:p-3 rounded-2xl border border-white">
            <span className="block text-base sm:text-xl font-extrabold text-gray-900">
              {displayedPosts.length}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Barcha Postlar</span>
          </div>

          <div className="bg-white/60 p-2 sm:p-3 rounded-2xl border border-white">
            <span className="block text-base sm:text-xl font-extrabold text-gray-900">
              {isViewingOther ? (viewingUser.rating || '5.0') : bookings.length}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">
              {isViewingOther ? 'Reyting ⭐' : 'Buyurtmalar'}
            </span>
          </div>

          {!isViewingOther && (
            <div className="col-span-2 sm:col-span-1 bg-white/60 p-2 sm:p-3 rounded-2xl border border-white">
              <span className="block text-base sm:text-xl font-extrabold text-gray-900">
                {favorites.length}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">Saqlanganlar</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs (No separated Reels tab!) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-gray-200/80 pb-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
            activeTab === 'posts'
              ? 'bg-[#2E5A27] text-white shadow-md'
              : 'bg-white/70 text-gray-700 hover:bg-white'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Postlar ({displayedPosts.length})</span>
        </button>

        {!isViewingOther && (
          <>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'bookings'
                  ? 'bg-[#2E5A27] text-white shadow-md'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Buyurtmalar ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'favorites'
                  ? 'bg-[#2E5A27] text-white shadow-md'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Saralanganlar ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition flex-shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-[#2E5A27] text-white shadow-md'
                  : 'bg-white/70 text-gray-700 hover:bg-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Sozlamalar</span>
            </button>
          </>
        )}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: ALL POSTS (Images & Videos in one unified Grid with Edit & Delete) */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {displayedPosts.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-3xl border border-white/80">
              <Camera className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Hozircha hech qanday post joylanmagan</p>
              <p className="text-xs text-gray-500 mt-1">Sayohatlaringiz davomidagi rasm va videolarni yuklang</p>
              {!isViewingOther && (
                <button
                  type="button"
                  onClick={onOpenCreatePost}
                  className="mt-3 text-xs font-bold text-[#2E5A27] hover:underline"
                >
                  + Birinchi postni yuklang
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {displayedPosts.map((post) => {
                const isVideo = Boolean(post.videoUrl || (typeof post.image === 'string' && post.image.endsWith('.mp4')));

                return (
                  <div
                    key={post.id}
                    onClick={() => onOpenPostFeed?.(post.id)}
                    className="group relative aspect-[9/14] rounded-3xl overflow-hidden cursor-pointer shadow-md border border-white/80 transition-all hover:scale-[1.02] hover:shadow-xl bg-gray-950"
                  >
                    {/* Media render */}
                    {isVideo ? (
                      <div className="w-full h-full relative">
                        <video
                          src={post.videoUrl || post.image}
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/20">
                          <Play className="w-3 h-3 fill-white ml-0.5" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={post.image}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Own post action bar: Edit & Delete buttons */}
                    {!isViewingOther && (
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => handleOpenEditPost(post, e)}
                          className="w-7 h-7 rounded-xl bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition active:scale-90"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeletePost(post.id, e)}
                          className="w-7 h-7 rounded-xl bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-xs transition active:scale-90"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Bottom caption & likes */}
                    <div className="absolute bottom-3 left-3 right-3 text-white space-y-1 pointer-events-none">
                      <p className="text-[11px] text-white/95 line-clamp-2 leading-snug drop-shadow font-medium">
                        {post.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-white/80 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          {post.likes || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.commentsCount || 0}
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: BOOKINGS */}
      {activeTab === 'bookings' && !isViewingOther && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-3xl border border-white/80">
              <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Hozircha buyurtmalar yo'q</p>
              <p className="text-xs text-gray-500 mt-1">Poyezd, mehmonxona yoki dacha bron qiling</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold">
                      {booking.status || 'Tasdiqlangan'}
                    </span>
                    {booking.ticketCode && (
                      <span className="text-xs font-mono font-bold text-gray-500">
                        {booking.ticketCode}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{booking.service_title}</h3>
                  <p className="text-xs text-gray-500">
                    Sana: {booking.date || 'Belgilanmagan'} • Mehmonlar: {booking.guests || 1} kishi
                  </p>
                  <p className="text-xs font-bold text-[#2E5A27]">
                    Jami: {booking.total_price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onCancelBooking?.(booking.id)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 transition active:scale-95 w-fit"
                >
                  Bekor qilish
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: FAVORITES */}
      {activeTab === 'favorites' && !isViewingOther && (
        <div className="space-y-4">
          {favoriteItems.length === 0 ? (
            <div className="p-8 text-center glass-card rounded-3xl border border-white/80">
              <Heart className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">Saralangan joylar yo'q</p>
              <p className="text-xs text-gray-500 mt-1">Yoqqan dacha yoki mehmonxonalarni yurakcha orqali saqlang</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favoriteItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-3">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.title || item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                        {item.title || item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{item.regionName || item.address}</p>
                    </div>
                    <span className="text-xs font-extrabold text-[#2E5A27]">
                      {item.price || item.pricePerNight}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && !isViewingOther && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Profil Sozlamalari</h2>
          
          {saveSuccess && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Ma'lumotlar muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Ism</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Familiya</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Telefon raqam</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Bio (O'zingiz haqingizda)</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Sayohatchi, fotoblogger yoki tog' ishqibozi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Shrift dizayni</label>
              <div className="flex gap-2">
                {[
                  { id: 'sans', label: 'Zamonaviy (Sans)' },
                  { id: 'serif', label: 'Klassik (Serif)' },
                  { id: 'mono', label: 'Texnologik (Mono)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => applyFont(f.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                      fontStyle === f.id
                        ? 'border-[#2E5A27] bg-[#2E5A27]/10 text-[#2E5A27]'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold transition shadow-sm active:scale-95"
            >
              Saqlash
            </button>
          </form>
        </div>
      )}

      {/* EDIT POST MODAL */}
      {editingPost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setEditingPost(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-sm text-gray-900">Postni tahrirlash</h3>
              <button
                onClick={() => setEditingPost(null)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePostEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Post matni</label>
                <textarea
                  rows={4}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Joylashuv</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-[#2E5A27]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2E5A27] text-white text-xs font-bold shadow transition"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
