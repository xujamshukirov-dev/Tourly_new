import React, { useState, useEffect } from 'react';
import {
  X, Compass, ShieldCheck, Star, Calendar, Users, CheckCircle2,
  MapPin, Clock, ArrowRight, Plus, Filter, Sparkles
} from 'lucide-react';
import { api } from '../../services/api';

export default function TourPackagesModal({
  isOpen,
  onClose,
  onBookTour,
  onCreateTour,
  canPublishTours = false,
}) {
  if (!isOpen) return null;

  const [toursList, setToursList] = useState([]);
  const [isLoadingTours, setIsLoadingTours] = useState(true);
  const [selectedTour, setSelectedTour] = useState(null);
  const [filterDuration, setFilterDuration] = useState('all');
  const [isComparing, setIsComparing] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createError, setCreateError] = useState('');

  // Fetch real tours from backend API (/menu/tour/)
  useEffect(() => {
    let isMounted = true;
    setIsLoadingTours(true);
    api.getTours()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setToursList(data.map((t) => ({
              id: t.id,
              title: t.title,
              description: t.description || '',
              route: t.route,
              price: typeof t.price === 'number' || !isNaN(Number(t.price)) ? `${Number(t.price).toLocaleString()} so'm` : t.price,
              priceNum: Number(t.price) || 0,
              duration: `${t.duration_days} kun`,
              availableSeats: t.available_seats,
              companyName: t.kompaniya?.company_name || 'Tour Operator',
              image: t.rasmlar?.[0]?.image || t.image || 'https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80',
              images: t.rasmlar?.map((r) => r.image) || (t.images || []),
              included: ['Mehmonxona', 'Transport', 'Gid xizmati'],
            })));
          } else {
            setToursList([]);
          }
        }
      })
      .catch((err) => {
        console.warn('[Tourly] Backenddan turlar yuklanmadi:', err.message);
        if (isMounted) setToursList([]);
      })
      .finally(() => {
        if (isMounted) setIsLoadingTours(false);
      });
    return () => { isMounted = false; };
  }, []);

  // New Tour Form state (Requirement 3.7)
  const [newTour, setNewTour] = useState({
    title: '',
    companyName: 'Silk Road Voyages LLC',
    route: '',
    duration: '3 kun',
    price: "1 800 000 so'm",
    priceNum: 1800000,
    availableSeats: 15,
    included: "Afrosiyob poyezdi, Mehmonxona, Gid xizmati, 3 mahal ovqat",
    image: 'https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80',
    images: [],
    description: ''
  });

  const [tourPhotoPreviews, setTourPhotoPreviews] = useState([]);

  const handleTourPhotosChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(readers).then((results) => {
      setTourPhotoPreviews((prev) => [...prev, ...results]);
      setNewTour((prev) => ({
        ...prev,
        images: [...prev.images, ...results],
        image: results[0] || prev.image,
      }));
    });
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateError('');
    try {
      const tourPayload = {
        title: newTour.title,
        description: newTour.description || '',
        route: newTour.route,
        price: parseFloat(newTour.priceNum || 1800000),
        duration_days: parseInt(newTour.duration) || 3,
        available_seats: parseInt(newTour.availableSeats) || 15,
        images: tourPhotoPreviews.length ? tourPhotoPreviews : (newTour.image ? [newTour.image] : []),
      };

      const res = await api.createTour(tourPayload);
      const created = {
        id: res?.id || Date.now(),
        title: res?.title || newTour.title,
        description: res?.description || newTour.description,
        route: res?.route || newTour.route,
        price: typeof res?.price === 'number' || !isNaN(Number(res?.price)) ? `${Number(res.price).toLocaleString()} so'm` : newTour.price,
        duration: `${res?.duration_days || newTour.duration} kun`,
        availableSeats: res?.available_seats || newTour.availableSeats,
        companyName: newTour.companyName,
        rating: 5.0,
        reviewsCount: 1,
        companyVerified: true,
        image: tourPhotoPreviews[0] || newTour.image,
        images: tourPhotoPreviews.length ? tourPhotoPreviews : [newTour.image],
        included: typeof newTour.included === 'string' ? newTour.included.split(',').map((s) => s.trim()) : newTour.included,
      };
      setToursList((prev) => [created, ...prev]);
      setShowCreateForm(false);
      alert("Yangi Tur Paketi muvaffaqiyatli saqlandi va sotuvga chiqarildi!");
      if (onCreateTour) onCreateTour(created);
    } catch (err) {
      console.error("Tur yaratish xatosi:", err);
      let msg = err.message || "Tur yaratishda xatolik yuz berdi.";
      if (err.status === 403 || msg.toLowerCase().includes('kompaniya') || msg.toLowerCase().includes('tasdiqlanmagan')) {
        msg = "Tur joylash uchun kompaniyangiz administrator tomonidan tasdiqlangan (approved) bo'lishi kerak.";
      }
      setCreateError(msg);
      alert(msg);
    }
  };

  const comparedTours = toursList.filter((t) => compareIds.includes(t.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div
        className="w-full max-w-4xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                Tayyor Tur Paketlar & Solishtirish
              </h3>
              <p className="text-xs text-gray-500">
                O'zbekistonning eng yaxshi sayohat paketlarini ko'rish, solishtirish va bron qilish
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canPublishTours && (
              <button
                type="button"
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi Tur Joylash</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {/* Create Form if toggled */}
          {showCreateForm && (
            <form onSubmit={handleCreateSubmit} className="glass-card rounded-2xl p-4 sm:p-5 space-y-3.5 border-2 border-emerald-500/30">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Yangi Tur Paketini Joylashtirish
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tur nomi *</label>
                  <input
                    type="text"
                    required
                    value={newTour.title}
                    onChange={(e) => setNewTour({ ...newTour, title: e.target.value })}
                    placeholder="Qadimiy Buxoro va Samarqand sayohati"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tur kompaniyasi *</label>
                  <input
                    type="text"
                    required
                    value={newTour.companyName}
                    onChange={(e) => setNewTour({ ...newTour, companyName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Marshrut *</label>
                  <input
                    type="text"
                    required
                    value={newTour.route}
                    onChange={(e) => setNewTour({ ...newTour, route: e.target.value })}
                    placeholder="Toshkent — Samarqand — Buxoro"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Davomiyligi (kun) *</label>
                  <input
                    type="text"
                    value={newTour.duration}
                    onChange={(e) => setNewTour({ ...newTour, duration: e.target.value })}
                    placeholder="3 kun / 2 kecha"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Narxi (so'mda) *</label>
                  <input
                    type="text"
                    value={newTour.price}
                    onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                    placeholder="1 800 000 so'm"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Bo'sh o'rinlar soni *</label>
                  <input
                    type="number"
                    min={1}
                    value={newTour.availableSeats}
                    onChange={(e) => setNewTour({ ...newTour, availableSeats: Number(e.target.value) })}
                    placeholder="15"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Paketga kiritilgan xizmatlar (vergul bilan)</label>
                  <input
                    type="text"
                    value={newTour.included}
                    onChange={(e) => setNewTour({ ...newTour, included: e.target.value })}
                    placeholder="Poyezd, Mehmonxona, Nonushta, Gid"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Batafsil tavsif *</label>
                  <textarea
                    rows={3}
                    required
                    value={newTour.description}
                    onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                    placeholder="Tur dasturi, diqqatga sazovor joylar, marshrut bosqichlari haqida batafsil ma'lumot..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-gray-700 block mb-1">Bir nechta fotosuratlar yuklash</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleTourPhotosChange}
                    className="w-full text-xs"
                  />
                  {tourPhotoPreviews.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mt-2 pt-1 pb-1">
                      {tourPhotoPreviews.map((src, i) => (
                        <img key={i} src={src} alt="Tour preview" className="w-16 h-16 rounded-xl object-cover border border-emerald-400" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow hover:bg-emerald-700"
                >
                  Saqlash va Joylash
                </button>
              </div>
            </form>
          )}

          {/* Comparison Bar if selected */}
          {compareIds.length > 0 && (
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">
                Solishtirish uchun {compareIds.length} ta tur tanlandi (maksimal 3 ta)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsComparing(!isComparing)}
                  className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                >
                  {isComparing ? "Ro'yxatga qaytish" : "Solishtirishni ko'rish"}
                </button>
                <button
                  onClick={() => setCompareIds([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Tozalash
                </button>
              </div>
            </div>
          )}

          {/* Solishtirish jadvali (Comparison Table) */}
          {isComparing && comparedTours.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="p-3 font-bold text-gray-500">Xususiyat</th>
                    {comparedTours.map((t) => (
                      <th key={t.id} className="p-3 font-bold text-gray-900 min-w-[200px]">
                        {t.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Kompaniya</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3 font-bold text-emerald-700">{t.companyName}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Narxi</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3 font-extrabold text-base text-gray-900">{t.price}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Davomiyligi</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3">{t.duration}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Marshrut</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3 text-gray-600">{t.route}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Kiritilgan xizmatlar</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3 space-y-1">
                        {t.included?.map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[11px] text-gray-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-gray-500">Amal</td>
                    {comparedTours.map((t) => (
                      <td key={t.id} className="p-3">
                        <button
                          onClick={() => {
                            onBookTour(t);
                            onClose();
                          }}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Sotib olish
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : isLoadingTours ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500">Turlar yuklanmoqda...</p>
            </div>
          ) : toursList.length === 0 ? (
            <div className="py-16 text-center space-y-3 glass-card rounded-3xl p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Hozircha faol tur paketlari mavjud emas</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Rasmiy tur kompaniyalari hali yangi tur paketlari joylashtirishmagan. Tasdiqlangan yangi sayohatlar tez orada shu yerda paydo bo'ladi.
              </p>
              {canPublishTours && (
                <button
                  type="button"
                  onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition"
                >
                  + Birinchi Turni Joylash
                </button>
              )}
            </div>
          ) : (
            /* Tours Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toursList.map((tour) => {
                const inCompare = compareIds.includes(tour.id);
                return (
                  <div
                    key={tour.id}
                    className="glass-card rounded-3xl overflow-hidden border border-white/80 shadow-md flex flex-col justify-between group hover:shadow-xl transition"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-0.5 rounded-xl text-xs font-bold shadow">
                        {tour.duration}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleCompare(tour.id)}
                        className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-xl font-bold backdrop-blur-md transition shadow ${
                          inCompare
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/85 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {inCompare ? '✓ Tanlandi' : '+ Solishtirish'}
                      </button>
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{tour.companyName}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-700 transition">
                          {tour.title}
                        </h4>
                        <span className="text-xs text-gray-500 block mt-1">
                          Marshrut: <strong>{tour.route}</strong>
                        </span>
                      </div>

                      {/* Included services */}
                      <div className="space-y-1 pt-2 border-t border-gray-100">
                        {tour.included?.slice(0, 3).map((inc, idx) => (
                          <div key={idx} className="flex items-center gap-1 text-[11px] text-gray-600">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                          <span className="text-[10px] text-gray-400 block">Kishi boshiga:</span>
                          <span className="text-sm sm:text-base font-black text-gray-900">
                            {tour.price}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onBookTour(tour);
                            onClose();
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm active:scale-95"
                        >
                          Sotib olish
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
