import React from 'react';
import { Home, UtensilsCrossed, Hotel, Car, ChevronRight, Camera, Plus, MessageSquare, Phone, MapPin } from 'lucide-react';
import InitialsAvatar from './ui/InitialsAvatar';

function VerticalFeedCard({ image, title, subtitle, onClick, hostName, onChat }) {
  return (
    <div className="flex-shrink-0 w-[160px] sm:w-[175px] bg-white rounded-2xl overflow-hidden border border-[#2E5A27]/20 shadow-sm hover:shadow-md transition text-left flex flex-col group">
      <button
        type="button"
        onClick={onClick}
        className="w-full h-28 sm:h-32 bg-gray-100 overflow-hidden relative active:scale-[0.98] transition block text-left"
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </button>
      <div className="p-2.5 min-w-0 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs sm:text-sm font-bold text-gray-900 truncate leading-snug">
            {title}
          </p>
          <p className="text-[11px] font-medium text-[#4E7643] mt-0.5 truncate leading-none">
            {subtitle}
          </p>
        </div>

        {hostName && (
          <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <InitialsAvatar name={hostName} size="xs" />
              <span className="text-[10px] font-semibold text-gray-700 truncate">{hostName}</span>
            </div>
            {onChat && (
              <button
                type="button"
                onClick={onChat}
                className="w-6 h-6 rounded-lg bg-[#2E5A27]/10 hover:bg-[#2E5A27] text-[#2E5A27] hover:text-white flex items-center justify-center transition active:scale-90"
                title="Xabar yozish"
              >
                <MessageSquare className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedSectionRow({ icon: Icon, title, items, renderCard, onSeeAll }) {
  if (!items.length) {
    return (
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#2E5A27]" strokeWidth={2.5} />
            <h2 className="text-sm font-extrabold text-[#2E5A27]">{title}</h2>
          </div>
        </div>
        <div className="p-4 bg-white/70 rounded-2xl border border-[#2E5A27]/10 text-center text-xs text-gray-500">
          Ushbu hududda hali e&apos;lonlar yo&apos;q. Birinchi bo&apos;lib e&apos;lon joylang!
        </div>
      </section>
    );
  }
  return (
    <section className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[#2E5A27]" strokeWidth={2.5} />
          <h2 className="text-sm font-extrabold text-[#2E5A27]">{title}</h2>
        </div>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="text-xs font-bold text-[#2E5A27] hover:text-[#1b3d16] flex items-center gap-0.5 transition"
          >
            Barchasi <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {items.map((item) => renderCard(item))}
      </div>
    </section>
  );
}

export default function MobileHomeFeed({
  taxis = [],
  cottages = [],
  restaurants = [],
  hotels = [],
  posts = [],
  onBookItem,
  onOpenPostReel,
  onOpenCreatePost,
  onOpenChat,
}) {
  return (
    <div className="md:hidden px-4 py-3 space-y-6">

      {/* 1. TAKSILAR VA HAYDOVCHILAR (Tasdiqlangan taksi haydovchilari va chat) */}
      <FeedSectionRow
        icon={Car}
        title="Taksilar va Haydovchilar"
        items={taxis}
        onSeeAll={() => onBookItem?.({ ...taxis[0], type: 'taxi' })}
        renderCard={(item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[220px] bg-white rounded-2xl overflow-hidden border border-[#2E5A27]/25 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative h-28 bg-gray-100 overflow-hidden">
              <img
                src={item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600'}
                alt={item.carModel || item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-2 left-2 bg-[#2E5A27] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {item.price || "Kelishilgan narx"}
              </span>
            </div>

            <div className="p-3 space-y-2">
              <div>
                <p className="text-xs font-bold text-gray-900 truncate">
                  {item.carModel || item.title}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-[#4E7643] mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{item.regionName || `${item.viloyat}, ${item.tuman}`}</span>
                </div>
                {item.licensePlate && (
                  <span className="inline-block mt-1 font-mono text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded border border-gray-200">
                    {item.licensePlate}
                  </span>
                )}
              </div>

              {/* Haydovchi profili — Initials Avatar bilan */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <InitialsAvatar name={item.driverName || item.hostName || 'H'} size="xs" showOnline={true} />
                  <span className="text-[11px] font-bold text-gray-800 truncate">
                    {item.driverName || item.hostName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenChat?.(item)}
                  className="px-2.5 py-1 rounded-xl bg-[#2E5A27] hover:bg-[#23451d] text-white text-[11px] font-bold flex items-center gap-1 transition active:scale-95 shadow-2xs"
                  title="Xabar yozish"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Chat</span>
                </button>
              </div>
            </div>
          </div>
        )}
      />

      {/* 2. UY IJARASI */}
      <FeedSectionRow
        icon={Home}
        title="Uy va Dacha Ijarasi"
        items={cottages}
        onSeeAll={() => onBookItem?.({ ...cottages[0], type: 'cottage' })}
        renderCard={(item) => (
          <VerticalFeedCard
            key={item.id}
            image={item.images?.[0] || '/images/cottage_omonxona.jpg'}
            title={item.title || item.hostName}
            subtitle={item.address?.split(',')[0] || item.regionName?.split(',')[0] || 'Omonxona'}
            hostName={item.hostName}
            onClick={() => onBookItem?.({ ...item, type: 'cottage' })}
            onChat={() => onOpenChat?.(item)}
          />
        )}
      />

      {/* 3. RESTORANLAR */}
      <FeedSectionRow
        icon={UtensilsCrossed}
        title="Restoranlar"
        items={restaurants}
        onSeeAll={() => onBookItem?.({ ...restaurants[0], type: 'restaurant' })}
        renderCard={(item) => (
          <VerticalFeedCard
            key={item.id}
            image={item.images?.[0] || item.image || '/images/restaurant_milliy.jpg'}
            title={item.name || item.hostName}
            subtitle={item.cuisine || 'Milliy'}
            hostName={item.hostName || item.name}
            onClick={() => onBookItem?.({ ...item, type: 'restaurant' })}
            onChat={() => onOpenChat?.(item)}
          />
        )}
      />

      {/* 4. MEHMONXONALAR */}
      <FeedSectionRow
        icon={Hotel}
        title="Mehmonxonalar"
        items={hotels}
        onSeeAll={() => onBookItem?.({ ...hotels[0], type: 'hotel' })}
        renderCard={(item) => (
          <VerticalFeedCard
            key={item.id}
            image={item.images?.[0] || item.image || '/images/hotel_toshkent.jpg'}
            title={item.name || item.hostName}
            subtitle={item.address?.split(',')[0] || item.regionName || 'Toshkent'}
            hostName={item.hostName || item.name}
            onClick={() => onBookItem?.({ ...item, type: 'hotel' })}
            onChat={() => onOpenChat?.(item)}
          />
        )}
      />

      {/* 5. SO'NGGI POSTLAR (4 ta kvadrat foto + Post qoldirish) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#2E5A27]" strokeWidth={2.5} />
            <h2 className="text-sm font-extrabold text-[#2E5A27]">So&apos;nggi postlar</h2>
          </div>
          <button
            type="button"
            onClick={onOpenCreatePost}
            className="text-xs font-bold text-[#2E5A27] bg-white border border-[#2E5A27]/30 px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-[#2E5A27]/10 transition active:scale-95 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post qoldirish</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {posts.slice(0, 4).map((post, i) => {
            const fallbackImg = [
              '/images/hotel_toshkent.jpg',
              '/images/post_tandir_somsa.jpg',
              '/images/post_student_girl.jpg',
              '/images/post_student_boy.jpg',
            ][i];
            const img = post.image || fallbackImg;
            return (
              <button
                key={post.id || i}
                type="button"
                onClick={() => onOpenPostReel?.(post)}
                className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border border-[#2E5A27]/20 shadow-sm active:scale-95 relative group bg-gray-100"
                title={post.caption || "Reels ko'rish"}
              >
                <img
                  src={img}
                  alt={post.caption || ""}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </button>
            );
          })}
        </div>

        <div
          onClick={onOpenCreatePost}
          className="bg-white/80 border border-[#2E5A27]/20 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:bg-white transition shadow-2xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#2E5A27]/10 text-[#2E5A27] flex items-center justify-center">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-gray-600 font-medium">
              Sayohat taassurotlaringiz bilan bo&apos;lishing...
            </span>
          </div>
          <span className="text-xs font-bold text-[#2E5A27]">Ulashish →</span>
        </div>
      </section>
    </div>
  );
}
