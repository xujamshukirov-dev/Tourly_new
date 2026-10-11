import React, { useState } from 'react';
import {
  Home, UtensilsCrossed, Hotel, Compass, Star, MapPin, Car,
  Heart, Calendar, Users, ChevronRight, Navigation,
  Sparkles, MessageSquare, ShieldCheck, Phone, UserCheck
} from 'lucide-react';
import InitialsAvatar from './ui/InitialsAvatar';

export default function FeedSection({
  taxis = [],
  cottages = [],
  restaurants = [],
  hotels = [],
  guides = [],
  posts = [],
  tours = [],
  userLocation = { lat: 41.311081, lng: 69.240562 },
  onBookItem,
  onOpenMapLocation,
  onOpenReel,
  favorites = [],
  onToggleFavorite,
  onCreatePost,
  onOpenChat,
  onOpenUserProfile,
  onOpenPostFeed,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'taxis' | 'cottages' | 'restaurants' | 'hotels' | 'guides' | 'tours'

  // Helper for Yandex Maps URL
  const getYandexMapsUrl = (destLat, destLng) => {
    const uLat = userLocation?.lat || 41.311081;
    const uLng = userLocation?.lng || 69.240562;
    return `https://yandex.com/maps/?rtext=${uLat},${uLng}~${destLat},${destLng}&rtt=auto`;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-10">

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'Barcha Takliflar', icon: Sparkles },
          { id: 'taxis', label: 'Taksilar', icon: Car },
          { id: 'cottages', label: 'Uy va Dachalar', icon: Home },
          { id: 'restaurants', label: 'Restoranlar', icon: UtensilsCrossed },
          { id: 'hotels', label: 'Mehmonxonalar', icon: Hotel },
          { id: 'guides', label: 'Gidlar', icon: UserCheck },
          { id: 'tours', label: 'Tur Paketlar', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm flex-shrink-0 ${
                isActive
                  ? 'bg-[#2E5A27] text-white shadow-md shadow-[#2E5A27]/25 scale-[1.02]'
                  : 'glass-card text-gray-700 hover:bg-white hover:text-gray-900 border border-white/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= SECTION: TAKSILAR VA HAYDOVCHILAR ================= */}
      {(activeTab === 'all' || activeTab === 'taxis') && taxis.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center shadow-inner">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Taksilar va Haydovchilar
                </h2>
                <p className="text-xs text-gray-500">Viloyatlararo, aeroport va tog'li hududlarga qulay transport</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('taxis')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {taxis.map((item) => (
              <div
                key={item.id}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col justify-between group shadow-xs hover:shadow-md transition ${
                  activeTab === 'all' ? 'w-[285px] sm:w-[325px] flex-shrink-0 snap-start' : ''
                }`}
              >
                {/* Car Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'}
                    alt={item.carModel || item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
                    <span className="text-xs sm:text-sm font-extrabold text-[#2E5A27]">
                      {item.price || "Kelishilgan narx"}
                    </span>
                  </div>

                  {/* License Plate Badge */}
                  {item.licensePlate && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-mono font-bold text-gray-800 shadow">
                      {item.licensePlate}
                    </div>
                  )}
                </div>

                {/* Info & Driver Profile */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#2E5A27] transition line-clamp-1">
                      {item.carModel || item.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E5A27] flex-shrink-0" />
                      <span className="truncate">{item.regionName || `${item.viloyat}, ${item.tuman}`}</span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Haydovchi profili: Initials Avatar va ismi */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div
                      className="flex items-center gap-2 min-w-0 cursor-pointer group/driver hover:opacity-85 transition"
                      onClick={() => onOpenUserProfile?.({
                        id: item.id,
                        name: item.driverName || item.hostName || 'Haydovchi',
                        role: 'Taksi haydovchisi',
                        phone: item.phone,
                        carModel: item.carModel,
                        licensePlate: item.licensePlate,
                        viloyat: item.viloyat || item.regionName,
                        tuman: item.tuman,
                        rating: item.rating || '5.0',
                      })}
                      title="Haydovchi profilini ko'rish"
                    >
                      <InitialsAvatar
                        name={item.driverName || item.hostName || 'Haydovchi'}
                        size="sm"
                        showOnline={true}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-gray-900 group-hover/driver:text-[#2E5A27] transition block truncate">
                          {item.driverName || item.hostName}
                        </span>
                        <span className="text-[10px] text-gray-400 block -mt-0.5">
                          Haydovchi • Profil ↗
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-[#2E5A27]/10 text-gray-700 hover:text-[#2E5A27] flex items-center justify-center transition"
                          title="Qo'ng'iroq qilish"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenChat?.(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Xabar yozish</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SECTION 1: UY VA DACHA IJARASI ================= */}
      {(activeTab === 'all' || activeTab === 'cottages') && cottages.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2E5A27]/15 text-[#2E5A27] flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Uy va Dacha Ijarasi
                </h2>
                <p className="text-xs text-gray-500">Chorvoq, Chimgan, Zomin va tog' yonbag'rida</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('cottages')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {cottages.map((item) => {
              const isFav = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col justify-between group ${
                    activeTab === 'all' ? 'w-[285px] sm:w-[325px] flex-shrink-0 snap-start' : ''
                  }`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
                      <span className="text-xs sm:text-sm font-extrabold text-[#2E5A27]">
                        {item.price}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow ${
                        isFav ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white text-gray-700'
                      }`}
                      title={isFav ? "Saqlanganlardan o'chirish" : "Saqlash"}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#2E5A27] transition line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#2E5A27] flex-shrink-0" />
                        <span className="truncate">{item.regionName}</span>
                      </div>
                    </div>

                    {/* Host Info: Initials Avatar bilan */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div
                        className="flex items-center gap-2 cursor-pointer group/host hover:opacity-85 transition"
                        onClick={() => onOpenUserProfile?.({
                          id: item.id,
                          name: item.hostName || 'Dacha egasi',
                          role: 'Uy va Dacha egasi',
                          phone: item.hostPhone || item.phone,
                          location: item.regionName,
                          rating: item.rating || '5.0',
                        })}
                        title="Egasi profilini ko'rish"
                      >
                        <InitialsAvatar name={item.hostName || 'Egasi'} size="xs" />
                        <div className="text-xs">
                          <span className="font-semibold text-gray-800 group-hover/host:text-[#2E5A27] transition">{item.hostName}</span>
                          <span className="text-[10px] text-gray-400 block -mt-0.5">Dacha egasi • Profil ↗</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenChat?.(item)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#2E5A27]/10 text-gray-700 hover:text-[#2E5A27] text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Xabar</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onBookItem({ ...item, type: 'cottage' })}
                        className="flex-1 py-2 rounded-xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Bron qilish
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenMapLocation(item.lat, item.lng, item.title)}
                        className="p-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition"
                        title="Xaritada ko'rish"
                      >
                        <MapPin className="w-4 h-4 text-[#2E5A27]" />
                      </button>

                      <a
                        href={getYandexMapsUrl(item.lat, item.lng)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-200 transition"
                        title="Yandex Maps orqali borish"
                      >
                        <Navigation className="w-4 h-4 text-amber-600" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= SECTION 2: RESTORANLAR ================= */}
      {(activeTab === 'all' || activeTab === 'restaurants') && restaurants.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Restoranlar va Oshxonalar
                </h2>
                <p className="text-xs text-gray-500">Milliy taomlar, palov markazlari va shinam kafelar</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('restaurants')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {restaurants.map((item) => (
              <div
                key={item.id}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col justify-between group ${
                  activeTab === 'all' ? 'w-[285px] sm:w-[325px] flex-shrink-0 snap-start' : ''
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-gray-800">{item.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow">
                    <span className="text-xs font-bold text-orange-600">{item.cuisine}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-orange-600 transition line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <InitialsAvatar name={item.hostName || item.name} size="xs" />
                      <span className="text-xs font-medium text-gray-700 truncate">{item.hostName || item.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenChat?.(item)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#2E5A27]/10 text-gray-700 hover:text-[#2E5A27] text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Xabar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onBookItem({ ...item, type: 'restaurant' })}
                      className="flex-1 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
                    >
                      Stol band qilish
                    </button>
                    <a
                      href={getYandexMapsUrl(item.lat, item.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-200 transition"
                      title="Yandex Maps orqali borish"
                    >
                      <Navigation className="w-4 h-4 text-amber-600" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SECTION 3: MEHMONXONALAR ================= */}
      {(activeTab === 'all' || activeTab === 'hotels') && hotels.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
                <Hotel className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Mehmonxonalar va Sanatoriylar
                </h2>
                <p className="text-xs text-gray-500">Zamonaviy qulayliklar va premium xizmat</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('hotels')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {hotels.map((item) => (
              <div
                key={item.id}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col justify-between group ${
                  activeTab === 'all' ? 'w-[285px] sm:w-[325px] flex-shrink-0 snap-start' : ''
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                    {Array.from({ length: item.stars || 3 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-current" />
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
                    <span className="text-xs sm:text-sm font-extrabold text-purple-700">
                      {item.pricePerNight || item.price}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-purple-600 transition line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <InitialsAvatar name={item.hostName || item.name} size="xs" />
                      <span className="text-xs font-medium text-gray-700 truncate">{item.hostName || item.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenChat?.(item)}
                      className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-[#2E5A27]/10 text-gray-700 hover:text-[#2E5A27] text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Xabar</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onBookItem({ ...item, type: 'hotel' })}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
                    >
                      Xona tanlash
                    </button>
                    <a
                      href={getYandexMapsUrl(item.lat, item.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-200 transition"
                      title="Yandex Maps orqali borish"
                    >
                      <Navigation className="w-4 h-4 text-amber-600" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SECTION: PROFESSIONAL GIDLAR ================= */}
      {(activeTab === 'all' || activeTab === 'guides') && guides.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Professional Gidlar va Yo'lboshchilar
                </h2>
                <p className="text-xs text-gray-500">Tarixiy obidalar, qadimiy shaharlar va shahar sayohatlari</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('guides')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"}>
            {guides.map((item) => (
              <div
                key={item.id}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col justify-between group shadow-sm hover:shadow-md transition ${
                  activeTab === 'all' ? 'w-[285px] sm:w-[325px] flex-shrink-0 snap-start' : ''
                }`}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                    <span className="text-xs font-bold text-gray-800">{item.rating || 5.0}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl shadow-md">
                    <span className="text-xs sm:text-sm font-extrabold text-[#2E5A27]">
                      {item.price || "Kelishilgan narx"}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#2E5A27] transition line-clamp-1">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2E5A27] flex-shrink-0" />
                      <span className="truncate">{item.regionName || `${item.viloyat || ''}${item.tuman ? `, ${item.tuman}` : ''}`}</span>
                    </div>

                    {item.languages && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(Array.isArray(item.languages) ? item.languages : (item.languages || '').split(',')).map((lang, lIdx) => (
                          <span key={lIdx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            {typeof lang === 'string' ? lang.trim() : lang}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <InitialsAvatar
                        name={item.hostName || item.name || 'Gid'}
                        size="sm"
                        showOnline={true}
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-gray-900 block truncate">
                          {item.hostName || item.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block -mt-0.5">
                          Professional Gid
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-[#2E5A27]/10 text-gray-700 hover:text-[#2E5A27] flex items-center justify-center transition"
                          title="Qo'ng'iroq qilish"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => onOpenChat?.(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-xs font-bold transition active:scale-95 flex items-center gap-1.5 shadow-2xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Xabar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= SECTION 4: TAYYOR TUR PAKETLAR ================= */}
      {(activeTab === 'all' || activeTab === 'tours') && tours.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Tayyor Tur Paketlar
                </h2>
                <p className="text-xs text-gray-500">Litsenziyaga ega professional turoperatorlar takliflari</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('tours')}
              className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5"
            >
              Barchasi <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={activeTab === 'all' ? "flex overflow-x-auto no-scrollbar gap-4 pb-3 snap-x" : "grid grid-cols-1 md:grid-cols-2 gap-5"}>
            {tours.map((item) => (
              <div
                key={item.id}
                className={`glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/80 flex flex-col ${
                  activeTab === 'all' ? 'w-[300px] sm:w-[350px] flex-shrink-0 snap-start' : 'sm:flex-row'
                } group`}
              >
                <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-xs font-bold shadow">
                    {item.duration}
                  </div>
                </div>

                <div className="p-4 sm:p-5 sm:w-3/5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.companyName}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      Marshrut: {item.route}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Kishi boshiga:</span>
                      <span className="text-sm sm:text-base font-extrabold text-emerald-800">
                        {item.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onBookItem({ ...item, type: 'tour' })}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-sm active:scale-95"
                    >
                      Tur sotib olish
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Empty States */}
      {activeTab === 'taxis' && taxis.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha tasdiqlangan taksilar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Ushbu hududda yangi haydovchilar hali e'lon bermagan. Yangi haydovchilar arizalari tasdiqlangach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {activeTab === 'cottages' && cottages.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
            <Home className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha tasdiqlangan dachalar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Dam olish maskanlari va xonadonlar arizalari tasdiqlangach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {activeTab === 'restaurants' && restaurants.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha tasdiqlangan restoranlar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Milliy taomlar oshxonalari va restoranlar arizalari tasdiqlangach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {activeTab === 'hotels' && hotels.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-inner">
            <Hotel className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha tasdiqlangan mehmonxonalar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Mehmonxonalar va sanatoriylar arizalari tasdiqlangach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {activeTab === 'guides' && guides.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <UserCheck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha tasdiqlangan gidlar mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Gid yo'lboshchilar arizalari moderatorlar tomonidan tasdiqlangach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {activeTab === 'tours' && tours.length === 0 && (
        <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-white/80 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Hozircha faol tur paketlari mavjud emas</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Litsenziyalangan tur operatorlar yangi paketlar joylashtirgach shu yerda paydo bo'ladi.
          </p>
        </div>
      )}

      {/* ================= SECTION 5: SO'NGGI POSTLAR (ANIQ ENG SO'NGGI 4 TA POST) ================= */}
      {posts.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                </div>
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  So'nggi postlar
                </h2>
                <p className="text-xs text-gray-500">Sayohatchilar fotolavhalari va haqiqiy taassurotlari</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenPostFeed?.()}
                className="text-xs font-bold text-[#2E5A27] hover:text-[#1E3F19] flex items-center gap-0.5 bg-white/90 hover:bg-white px-3 py-1.5 rounded-xl border border-white/80 shadow-xs transition active:scale-95"
              >
                Barchasi <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {onCreatePost && (
                <button
                  type="button"
                  onClick={onCreatePost}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#2E5A27] text-white hover:bg-[#1E3F19] shadow-sm transition active:scale-95 flex items-center gap-1"
                >
                  <span>+ Post</span>
                </button>
              )}
            </div>
          </div>

          {/* Compact 4-item Row (Eng so'nggi 4 ta post, ixcham va estetik) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {posts.slice(0, 4).map((post) => {
              const isVideo = Boolean(post.videoUrl || (typeof post.image === 'string' && post.image.endsWith('.mp4')));

              return (
                <div
                  key={post.id}
                  onClick={() => onOpenPostFeed?.(post.id)}
                  className="group relative aspect-[9/13] rounded-3xl overflow-hidden cursor-pointer shadow-md border border-white/70 transition-all hover:scale-[1.03] hover:shadow-xl bg-gray-950"
                >
                  {isVideo ? (
                    <div className="w-full h-full relative">
                      <video
                        src={post.videoUrl || post.image}
                        muted
                        playsInline
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                        <span className="text-[10px]">▶</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Author Info with Initials Avatar */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center gap-2 pointer-events-none">
                    <InitialsAvatar name={post.author} size="xs" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-white block leading-tight drop-shadow truncate">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-white/80 block leading-tight truncate">
                        {post.location || "O'zbekiston"}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Caption & Stats */}
                  <div className="absolute bottom-3 left-3 right-3 text-white space-y-1 pointer-events-none">
                    <p className="text-[11px] text-white/95 line-clamp-2 leading-snug drop-shadow-sm font-medium">
                      {post.caption}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-white/80 pt-1">
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
        </section>
      )}

    </div>
  );
}
