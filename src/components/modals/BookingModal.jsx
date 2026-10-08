import React, { useState } from 'react';
import {
  X, CheckCircle2, Calendar, Users, Train, Plane, Bus, Ticket,
  CreditCard, ShieldCheck, Download, Sparkles, MapPin, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export default function BookingModal({
  bookingItem,
  isOpen,
  onClose,
  onBookingComplete
}) {
  if (!isOpen || !bookingItem) return null;

  const [step, setStep] = useState(1); // 1: Select details/passengers, 2: Success Voucher
  const [passengerName, setPassengerName] = useState('');
  const [passportInfo, setPassportInfo] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('Band qilingan');
  const [phone, setPhone] = useState('+998 ');
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [passengersCount, setPassengersCount] = useState(1);
  const [selectedClass, setSelectedClass] = useState('Ekonom');
  const [paymentMethod, setPaymentMethod] = useState('payme'); // 'payme' | 'click' | 'cash'
  const [createdBooking, setCreatedBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getNumericPrice = () => {
    let base = 250000;
    if (bookingItem.priceNum) base = Number(bookingItem.priceNum);
    else if (bookingItem.price && typeof bookingItem.price === 'number') base = bookingItem.price;
    else if (bookingItem.classes) {
      const cls = bookingItem.classes.find((c) => c.name === selectedClass);
      if (cls) {
        base = parseInt(cls.price.replace(/\D/g, ''), 10) || 180000;
      }
    } else if (bookingItem.price && typeof bookingItem.price === 'string') {
      const parsed = parseInt(bookingItem.price.replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) base = parsed;
    }
    return base * passengersCount;
  };

  const calculateTotalPrice = () => {
    return getNumericPrice().toLocaleString('uz-UZ') + " so'm";
  };

  const handleConfirm = async () => {
    setErrorMessage('');
    setIsSubmitting(true);

    // Map service_type to backend SERVICE_TYPES: {"guide", "taxi", "house", "hotel", "restaurant"}
    let sType = 'guide';
    const rawType = (bookingItem.type || bookingItem.serviceType || bookingItem.category || '').toLowerCase();
    if (rawType.includes('taxi') || rawType.includes('transport') || rawType.includes('car')) sType = 'taxi';
    else if (rawType.includes('hotel') || rawType.includes('mehmonxona')) sType = 'hotel';
    else if (rawType.includes('rest') || rawType.includes('oshxona')) sType = 'restaurant';
    else if (rawType.includes('house') || rawType.includes('cottage') || rawType.includes('dacha') || rawType.includes('home')) sType = 'house';
    else sType = 'guide';

    // Payment validation: {"payme", "click", "cash"}
    const validPayment = ['payme', 'click', 'cash'].includes(paymentMethod) ? paymentMethod : 'payme';

    const bookingPayload = {
      service_type: sType,
      service_id: typeof bookingItem.id === 'number' && bookingItem.id > 0 ? bookingItem.id : 1,
      check_in: travelDate,
      check_out: null,
      total: getNumericPrice(),
      payment: validPayment,
    };

    try {
      const response = await api.createBooking(bookingPayload);
      const ticketId = `TRL-${response.id || Math.floor(100000 + Math.random() * 900000)}`;
      const completedBooking = {
        id: response.id || Date.now(),
        service_type: sType,
        service_title: bookingItem.title || bookingItem.name || bookingItem.trainNumber || bookingItem.airline || 'Tourly Bron',
        date: travelDate,
        guests: passengersCount,
        total_price: calculateTotalPrice(),
        status: response.status || 'Tasdiqlangan',
        ticketCode: ticketId,
        passengerName,
        phone,
      };

      setCreatedBooking(completedBooking);
      setStep(2);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });

      if (onBookingComplete) {
        onBookingComplete(completedBooking);
      }
    } catch (err) {
      console.error('Booking failed:', err);
      let msg = err.message || 'Bron qilishda xatolik yuz berdi';
      if (err.status === 401 || msg.includes('401') || msg.toLowerCase().includes('authenticated')) {
        msg = "Bron qilish uchun avval platformaga kiring (Login qiling)!";
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#38B0DC]/15 text-[#38B0DC] flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                {step === 1 ? 'Chipta va Bron Qilish' : 'Chipta Tasdiqlandi!'}
              </h3>
              <span className="text-xs text-gray-500">
                {bookingItem.title || bookingItem.name || bookingItem.trainNumber || bookingItem.airline}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Input details */}
        {step === 1 && (
          <div className="p-5 space-y-4">
            {/* Item summary banner */}
            <div className="bg-[#38B0DC]/8 rounded-2xl p-3 border border-[#38B0DC]/20 flex items-center gap-3">
              <div className="flex-1">
                <span className="text-xs font-bold text-gray-800 block">
                  {bookingItem.from && bookingItem.to
                    ? `${bookingItem.from} → ${bookingItem.to}`
                    : bookingItem.address || bookingItem.regionName || "O'zbekiston"}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {bookingItem.departure ? `Jo'nash: ${bookingItem.departure}` : bookingItem.duration || 'Tezkor tasdiqlash'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black text-[#2695BF]">
                {calculateTotalPrice()}
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Yo'lovchi / Buyurtmachi F.I.Sh.
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Pasport seriyasi / raqami
                  </label>
                  <input
                    type="text"
                    required
                    value={passportInfo}
                    onChange={(e) => setPassportInfo(e.target.value)}
                    placeholder="AA 1234567"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    O&apos;rindiq raqami
                  </label>
                  <input
                    type="text"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    placeholder="12A"
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Buyurtma holati
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm"
                >
                  <option>Band qilingan</option>
                  <option>To&apos;langan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Telefon raqam
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Sana
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:border-[#38B0DC] focus:outline-none"
                  />
                </div>
              </div>

              {/* Class selector if train */}
              {bookingItem.classes && (
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Vagon / O'rindiq toifasi
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {bookingItem.classes.map((cls) => (
                      <button
                        key={cls.name}
                        type="button"
                        onClick={() => setSelectedClass(cls.name)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold border transition text-center ${
                          selectedClass === cls.name
                            ? 'bg-[#38B0DC] text-white border-[#38B0DC] shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#38B0DC]'
                        }`}
                      >
                        <span className="block">{cls.name}</span>
                        <span className="text-[10px] block opacity-90">{cls.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Passengers Count */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Kishilar soni
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPassengersCount((p) => Math.max(1, p - 1))}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-gray-900 w-8 text-center">
                    {passengersCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassengersCount((p) => Math.min(10, p + 1))}
                    className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                  <span className="text-xs text-gray-500 ml-2">
                    Jami: {calculateTotalPrice()}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  To'lov usuli
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'payme', name: 'Payme' },
                    { id: 'click', name: 'Click' },
                    { id: 'uzum', name: 'Uzum' },
                    { id: 'cash', name: 'Joyida' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaymentMethod(p.id)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                        paymentMethod === p.id
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Confirm button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block">Jami to'lov:</span>
                <span className="text-base font-extrabold text-gray-900">
                  {calculateTotalPrice()}
                </span>
              </div>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-[#38B0DC] hover:bg-[#2695BF] disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-2"
              >
                {isSubmitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{isSubmitting ? "Bron qilinmoqda..." : "Tasdiqlash va Xarid qilish"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Digital Ticket Voucher */}
        {step === 2 && createdBooking && (
          <div className="p-5 space-y-4 text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-gray-900">
              Bron Muvaffaqiyatli Amalga Oshirildi!
            </h4>

            {/* Ticket Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 border border-gray-200 shadow-md text-left space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                <span className="text-xs font-extrabold text-[#38B0DC] uppercase tracking-wider">
                  TOURLY ELECTRONIC TICKET
                </span>
                <span className="text-[11px] font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                  {createdBooking.ticketCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400 text-[10px] block">Xizmat:</span>
                  <span className="font-bold text-gray-800 line-clamp-1">{createdBooking.service_title}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Xaridor / Yo'lovchi:</span>
                  <span className="font-bold text-gray-800">{createdBooking.passengerName || 'Sayyoh'}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Pasport ma'lumotlari:</span>
                  <span className="font-bold text-indigo-700 font-mono">{createdBooking.passportInfo || 'AA 1234567'}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">O'rindiq raqami:</span>
                  <span className="font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded w-fit">{createdBooking.seatNumber || '08A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Buyurtma holati:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1 ${
                    createdBooking.orderStatus === "To'langan" ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {createdBooking.orderStatus}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">To'lov miqdori:</span>
                  <span className="font-extrabold text-emerald-700">{createdBooking.total_price}</span>
                </div>
              </div>

              {/* Barcode visual */}
              <div className="pt-2 border-t border-dashed border-gray-200 flex flex-col items-center justify-center">
                <div className="h-8 w-44 bg-[repeating-linear-gradient(90deg,#1f2937,#1f2937_2px,transparent_2px,transparent_4px)] rounded opacity-75" />
                <span className="text-[9px] font-mono text-gray-400 mt-1">
                  * {createdBooking.ticketCode} *
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#38B0DC] hover:bg-[#2695BF] text-white text-xs sm:text-sm font-bold shadow transition"
              >
                Mening Profilimda Ko'rish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
