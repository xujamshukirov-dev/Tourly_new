import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle2, MapPin, Phone, Clock, Pizza } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FOOD_MENU } from '../../data/mockData';

export default function FoodOrderModal({ isOpen, onClose, onOrderSuccess }) {
  if (!isOpen) return null;

  const [cart, setCart] = useState({});
  const [address, setAddress] = useState("Chorvoq, Yusufxona qishlog'i, 14-kottej");
  const [phone, setPhone] = useState("+998 90 123 45 67");
  const [orderDone, setOrderDone] = useState(false);

  const updateQuantity = (foodId, delta) => {
    setCart((prev) => {
      const current = prev[foodId] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return { ...prev, [foodId]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = FOOD_MENU.find((f) => f.id === id);
      return sum + (item ? item.priceNum * qty : 0);
    }, 0);
  };

  const totalSum = calculateTotal();
  const totalItemsCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleOrder = () => {
    if (totalItemsCount === 0) {
      alert("Iltimos, kamida bitta taom tanlang!");
      return;
    }

    setOrderDone(true);
    confetti({ particleCount: 70, spread: 60 });

    if (onOrderSuccess) {
      onOrderSuccess({
        id: Date.now(),
        service_type: 'food',
        service_title: `Ovqat yetkazish (${totalItemsCount} ta taom)`,
        date: new Date().toISOString().substring(0, 10),
        total_price: `${totalSum.toLocaleString('uz-UZ')} so'm`,
        status: 'Tasdiqlangan',
        deliveryAddress: address,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
              <Pizza className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                Milliy Taomlar Yetkazib Berish
              </h3>
              <span className="text-xs text-gray-500">Dacha, kottej yoki mehmonxonangizga issiq holda</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {orderDone ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">Buyurtmangiz Qabul Qilindi!</h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
              Oshpaz taomlarni tayyorlashga kirishdi. Kuryer 35-45 daqiqa ichida dachangizga issiq holda yetkazib beradi!
            </p>
            <div className="bg-gray-50 rounded-2xl p-3 max-w-xs mx-auto text-xs text-left">
              <span className="text-gray-400 block">Yetkazish manzili:</span>
              <strong className="text-gray-800">{address}</strong>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-[#38B0DC] hover:bg-[#2695BF] text-white font-bold text-sm shadow transition"
            >
              Yopish
            </button>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4 max-h-[78vh] overflow-y-auto">
            {/* Food Menu Items */}
            <div className="space-y-3">
              {FOOD_MENU.map((food) => {
                const count = cart[food.id] || 0;
                return (
                  <div
                    key={food.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-[#38B0DC]/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-14 h-14 rounded-xl object-cover shadow-sm flex-shrink-0"
                      />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1">
                          {food.name}
                        </h4>
                        <span className="text-[11px] text-gray-400 block">{food.restaurant}</span>
                        <span className="text-xs font-extrabold text-[#38B0DC] mt-0.5 block">
                          {food.price}
                        </span>
                      </div>
                    </div>

                    {/* Counter Buttons */}
                    <div className="flex items-center gap-2">
                      {count > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateQuantity(food.id, -1)}
                            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-5 text-center">
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(food.id, 1)}
                            className="w-7 h-7 rounded-lg bg-[#38B0DC] hover:bg-[#2695BF] text-white font-bold flex items-center justify-center text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateQuantity(food.id, 1)}
                          className="px-3 py-1.5 rounded-xl bg-[#38B0DC]/10 hover:bg-[#38B0DC] text-[#2695BF] hover:text-white text-xs font-bold transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Qo'shish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Address & Contact */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Yetkazish manzili (Dacha / Mehmonxona)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:bg-white focus:outline-none"
                  />
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Telefon raqam
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:bg-white focus:outline-none"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Footer with Total and Order */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">Jami summa:</span>
                <span className="text-base font-black text-gray-900">
                  {totalSum.toLocaleString('uz-UZ')} so'm
                </span>
              </div>
              <button
                type="button"
                disabled={totalItemsCount === 0}
                onClick={handleOrder}
                className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buyurtma berish ({totalItemsCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
