import React from 'react';
import {
  X, Train, Plane, Bus, Ticket, Clock, ArrowRight, ShieldCheck,
  ChevronRight, Users, Sparkles
} from 'lucide-react';
import { TRAIN_ROUTES, FLIGHT_ROUTES, BUS_ROUTES, ATTRACTIONS_DATA } from '../../data/mockData';

export default function TransportModal({
  type = 'train', // 'train' | 'flight' | 'bus' | 'attraction'
  isOpen,
  onClose,
  onSelectBooking
}) {
  if (!isOpen) return null;

  const getMeta = () => {
    switch (type) {
      case 'train':
        return {
          title: "Poyezd Chiptalarini Band Qilish",
          subtitle: "Afrosiyob va tezyurar poyezdlar jadvali",
          icon: Train,
          color: 'text-emerald-600',
          bg: 'bg-emerald-50',
          items: TRAIN_ROUTES.map((t) => ({ ...t, type: 'train' })),
        };
      case 'flight':
        return {
          title: "Aviabilet Xarid Qilish",
          subtitle: "Uzbekistan Airways va Silk Avia qatnovlari",
          icon: Plane,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          items: FLIGHT_ROUTES.map((f) => ({ ...f, type: 'flight' })),
        };
      case 'bus':
        return {
          title: "Express Avtobus Chiptalari",
          subtitle: "Viloyatlararo qulay va tezyurar avtobuslar",
          icon: Bus,
          color: 'text-teal-600',
          bg: 'bg-teal-50',
          items: BUS_ROUTES.map((b) => ({ ...b, type: 'bus' })),
        };
      case 'attraction':
        return {
          title: "Attraksion va Dam Olish Maskani Chiptalari",
          subtitle: "Amirsoy kanat yo'li, Magic City va Boqiy Shahar",
          icon: Ticket,
          color: 'text-fuchsia-600',
          bg: 'bg-fuchsia-50',
          items: ATTRACTIONS_DATA.map((a) => ({ ...a, type: 'attraction' })),
        };
      default:
        return {
          title: "Chipta Band Qilish",
          subtitle: "Transport va attraksionlar",
          icon: Ticket,
          color: 'text-[#38B0DC]',
          bg: 'bg-cyan-50',
          items: [],
        };
    }
  };

  const meta = getMeta();
  const Icon = meta.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                {meta.title}
              </h3>
              <p className="text-xs text-gray-500">{meta.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Routes / Items List */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-3.5">
          {meta.items.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-2xl p-4 sm:p-5 border border-white/80 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              {/* Route details */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-gray-900 text-sm sm:text-base">
                    {item.trainNumber || item.airline || item.operator || item.title}
                  </span>
                  {item.flightNo && (
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold">
                      {item.flightNo}
                    </span>
                  )}
                  {item.trainType && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {item.trainType}
                    </span>
                  )}
                </div>

                {/* Cities or Location */}
                {item.from && item.to ? (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                    <span>{item.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#38B0DC]" />
                    <span>{item.to}</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">{item.location || item.description}</p>
                )}

                {/* Departure & Arrival times */}
                {item.departure && (
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Jo'nash: <strong className="text-gray-800">{item.departure}</strong>
                    </span>
                    <span>Yetib borish: <strong className="text-gray-800">{item.arrival}</strong></span>
                    {item.duration && <span>Davomiyligi: <strong className="text-gray-700">{item.duration}</strong></span>}
                  </div>
                )}

                {/* Seat counter & operator info */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  {item.operator && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-semibold text-[11px]">
                      Tashuvchi: {item.operator}
                    </span>
                  )}
                  {item.totalSeats && (
                    <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] flex items-center gap-1 ${
                      (item.availableSeats || 10) < 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <Users className="w-3 h-3" />
                      <span>Bo'sh joylar: {item.availableSeats || 12} / {item.totalSeats} ta</span>
                    </span>
                  )}
                </div>

                {/* Classes pills if train */}
                {item.classes && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.classes.map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {c.name}: <strong>{c.price}</strong> ({c.available} bo'sh joy)
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price and Book action */}
              <div className="flex items-center sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                <span className="text-sm sm:text-base font-black text-gray-900">
                  {item.price || item.classes?.[0]?.price}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onSelectBooking(item);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#38B0DC] hover:bg-[#2695BF] text-white text-xs font-bold transition shadow-sm active:scale-95 flex items-center gap-1"
                >
                  <span>Tanlash</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
