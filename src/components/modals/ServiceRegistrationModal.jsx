import React, { useState, useMemo } from 'react';
import {
  X, CheckCircle2, UserCheck, Car, Home, Hotel, UtensilsCrossed,
  Building2, Sparkles, Send, MapPin, Phone, Mail, FileText, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import DocumentUpload from '../DocumentUpload';
import { REGIONS_AND_DISTRICTS, VILOYATLAR_LIST } from '../../data/regionsAndDistricts';
import { api } from '../../services/api';

export default function ServiceRegistrationModal({
  serviceType: initialServiceType = 'guide',
  type,
  isOpen,
  onClose,
  onSubmitSuccess,
  onSubmit,
  user,
  currentUser,
}) {
  if (!isOpen) return null;

  const serviceType = type || initialServiceType || 'guide';
  const activeUser = user || currentUser;

  // Form States
  const LANGUAGE_OPTIONS = ["O'zbek", 'Rus', 'Ingliz', 'Turk', 'Koreys', 'Xitoy', 'Arab'];
  const CUISINE_OPTIONS = ['Milliy', 'Yevropa', 'Fast-food', 'Osiyo', 'Vegetarian', 'Grill & BBQ'];

  const [formData, setFormData] = useState({
    firstName: activeUser?.firstName || activeUser?.first_name || '',
    lastName: activeUser?.lastName || activeUser?.last_name || '',
    companyName: '',
    phone: activeUser?.phone || '+998 ',
    email: activeUser?.email || '',
    passportSeries: '',
    viloyat: 'Toshkent shahri',
    tuman: 'Chilonzor',
    address: '',
    legalAddress: '',
    latitude: '',
    longitude: '',
    selectedLanguages: ["O'zbek", 'Rus'],
    carModel: '',
    licensePlate: '',
    roomsCount: '',
    dailyPrice: '',
    stars: '3',
    cuisineType: 'Milliy',
    licenseNumber: '',
    description: '',
  });

  const [galleryImages, setGalleryImages] = useState([]);
  const [passportFront, setPassportFront] = useState(null);
  const [passportBack, setPassportBack] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successResponse, setSuccessResponse] = useState(null);

  // Available districts based on selected region
  const availableDistricts = REGIONS_AND_DISTRICTS[formData.viloyat] || [];

  const toggleLanguage = (lang) => {
    setFormData((prev) => {
      const has = prev.selectedLanguages.includes(lang);
      return {
        ...prev,
        selectedLanguages: has
          ? prev.selectedLanguages.filter((l) => l !== lang)
          : [...prev.selectedLanguages, lang],
      };
    });
  };

  const fullName = useMemo(
    () => `${formData.firstName} ${formData.lastName}`.trim(),
    [formData.firstName, formData.lastName]
  );

  const handleViloyatChange = (viloyat) => {
    const districts = REGIONS_AND_DISTRICTS[viloyat] || [];
    setFormData((prev) => ({
      ...prev,
      viloyat,
      tuman: districts[0] || '',
    }));
  };

  const getServiceMeta = () => {
    switch (serviceType) {
      case 'guide':
        return {
          title: "Gid Yo'lboshchi Bo'lish",
          icon: UserCheck,
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          desc: "Sayyohlarga O'zbekiston shaharlarini tanishtiring va daromad oling",
        };
      case 'taxi':
        return {
          title: "Taksi / Haydovchi Bo'lish",
          icon: Car,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          desc: "Tog' va viloyatlararo yo'nalishlarda qulay transport xizmati",
        };
      case 'home_rent':
      case 'home-rent':
        return {
          title: "Uy va Dachani Ijaraga Berish",
          icon: Home,
          color: 'text-sky-600',
          bg: 'bg-sky-50',
          desc: "Chorvoq, Chimgan yoki tog'dagi dam olish maskaningizni e'lon qiling",
        };
      case 'hotel':
        return {
          title: "Mehmonxonani Ro'yxatdan O'tkazish",
          icon: Hotel,
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          desc: "Mehmonxona, sanatoriy yoki guest house xonalarini bron qilishga qo'shing",
        };
      case 'restoran':
        return {
          title: "Restoran / Oshxona Qo'shish",
          icon: UtensilsCrossed,
          color: 'text-orange-600',
          bg: 'bg-orange-50',
          desc: "Milliy taomlar, palov markazi va choyxonangizni sayyohlarga taqdim eting",
        };
      case 'tour_company':
        return {
          title: "Tour Kompaniyani Ro'yxatdan O'tkazish",
          icon: Building2,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50',
          desc: "Litsenziyalangan turoperator sifatida tayyor tur paketlar joylashtiring",
        };
      default:
        return {
          title: "Xizmatni Ro'yxatdan O'tkazish",
          icon: Sparkles,
          color: 'text-[#38B0DC]',
          bg: 'bg-cyan-50',
          desc: "Tourly platformasida rasmiy hamkor bo'ling",
        };
    }
  };

  const meta = getServiceMeta();
  const Icon = meta.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.passportSeries) {
      setErrorMessage('Email va pasport seriyasi/raqamini kiriting');
      return;
    }
    if (!passportFront) {
      setErrorMessage('Pasport nusxasi yoki shaxsiy rasmni yuklang');
      return;
    }
    if (['hotel', 'restoran', 'home_rent', 'home-rent'].includes(serviceType) && !formData.address) {
      setErrorMessage('Aniq manzilni kiriting');
      return;
    }

    setSubmitting(true);

    try {
      let result;

      if (serviceType === 'guide') {
        const payload = {
          first_name: formData.firstName || 'Gid',
          last_name: formData.lastName || "Yo'lboshchi",
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          passport_image: passportFront || null,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          language: formData.selectedLanguages.length > 0 ? formData.selectedLanguages.join(', ') : "O'zbekcha, Ruscha, Inglizcha",
          bio: formData.description || "Professional gid yo'lboshchi",
          image: profilePhoto || passportFront || null,
        };
        result = await api.registerGuide(payload);
      } else if (serviceType === 'taxi') {
        const payload = {
          first_name: formData.firstName || 'Haydovchi',
          last_name: formData.lastName || 'Taksist',
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          passport_image: passportFront || null,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          car_model: formData.carModel || 'Chevrolet Cobalt',
          car_number: formData.licensePlate || '01 A 001 AA',
          bio: formData.description || 'Qulay va xavfsiz qatnov',
          image: profilePhoto || passportFront || null,
        };
        result = await api.registerTaxi(payload);
      } else if (serviceType === 'hotel') {
        const payload = {
          first_name: formData.firstName || 'Mehmonxona',
          last_name: formData.lastName || 'Menejeri',
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          passport_image: passportFront || null,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          address: formData.address || `${formData.viloyat}, ${formData.tuman}`,
          room_count: parseInt(formData.roomsCount, 10) || 10,
          star_count: parseInt(formData.stars, 10) || 3,
          bio: formData.description || 'Zamonaviy qulay mehmonxona',
          image: profilePhoto || passportFront || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        };
        result = await api.registerHotel(payload);
      } else if (serviceType === 'restoran') {
        const payload = {
          first_name: formData.firstName || 'Restoran',
          last_name: formData.lastName || 'Egasi',
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          passport_image: passportFront || null,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          address: formData.address || `${formData.viloyat}, ${formData.tuman}`,
          cuisine: formData.cuisineType || 'Milliy taomlar',
          bio: formData.description || 'Shinam restoran va kafelar',
          image: profilePhoto || passportFront || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        };
        result = await api.registerRestoran(payload);
      } else if (serviceType === 'home_rent' || serviceType === 'home-rent') {
        const payload = {
          first_name: formData.firstName || 'Xonadon',
          last_name: formData.lastName || 'Egasi',
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          passport_image: passportFront || null,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          address: formData.address || `${formData.viloyat}, ${formData.tuman}`,
          room_count: parseInt(formData.roomsCount, 10) || 4,
          bio: formData.description || 'Shinam dacha va dam olish maskani',
          image: profilePhoto || passportFront || null,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        };
        result = await api.registerHomeRent(payload);
      } else if (serviceType === 'tour_company') {
        const payload = {
          first_name: formData.firstName || 'Tur',
          last_name: formData.lastName || 'Rahbari',
          email: formData.email,
          phone: formData.phone || '',
          company_name: formData.companyName || `${formData.firstName} Tour`,
          license_number: formData.licenseNumber || 'UZ-TOUR-2026',
          address: formData.legalAddress || `${formData.viloyat}, ${formData.tuman}`,
          logo: profilePhoto || null,
          license_image: passportFront || null,
        };
        result = await api.registerTourCompany(payload);
      } else {
        result = await api.submitVerification(serviceType, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || '',
          passport_series: formData.passportSeries,
          viloyat: formData.viloyat,
          tuman: formData.tuman,
          bio: formData.description || '',
          image: profilePhoto || passportFront || null,
        });
      }

      setSubmitting(false);
      setSuccessResponse(result);
      setSubmitted(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

      const callbackItem = {
        id: result?.id || Date.now(),
        serviceType,
        serviceTypeName: meta.title,
        status: result?.status || 'pending',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        ...formData,
      };

      if (onSubmitSuccess) {
        onSubmitSuccess(callbackItem);
      }
      if (onSubmit) {
        onSubmit(callbackItem);
      }
    } catch (err) {
      console.error('Service registration failed:', err);
      setSubmitting(false);
      let msg = err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.";
      if (err.status === 401 || msg.includes('401') || msg.toLowerCase().includes('not authenticated') || msg.toLowerCase().includes('token')) {
        msg = "Ariza topshirish uchun avval platformaga kiring (Login qiling)!";
      }
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5 overflow-y-auto">
      <div
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#2d6a4f]/15 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${meta.bg} ${meta.color} flex items-center justify-center shadow-inner`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                {meta.title}
              </h3>
              <p className="text-xs text-gray-500">{meta.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">
              {successResponse?.message || "Arizangiz Muvaffaqiyatli Qabul Qilindi!"}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Ma'lumotlaringiz backend serveriga muvaffaqiyatli yuborildi va tasdiqlandi. Gid profil sahifangiz saytda faollashtirildi!
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-[#2E5A27] hover:bg-[#254920] text-white font-bold text-sm shadow transition"
              >
                Tushunarli, rahmat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
            {/* Error banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Ism *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="tourly-input text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Familiya *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="tourly-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="tourly-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Telefon raqami *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+998 90 123 45 67"
                  className="tourly-input text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Pasport seriyasi va raqami *
                </label>
                <input
                  type="text"
                  required
                  value={formData.passportSeries}
                  onChange={(e) => setFormData({ ...formData, passportSeries: e.target.value })}
                  placeholder="AA 1234567"
                  className="tourly-input text-sm"
                />
              </div>

              {/* Company / Object Name */}
              {(serviceType === 'tour_company' || serviceType === 'hotel' || serviceType === 'restoran' || serviceType === 'home_rent') && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    {serviceType === 'tour_company' ? 'Kompaniya nomi (MCHJ/Firma) *' : 'Muassasa / Dacha nomi *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder={serviceType === 'tour_company' ? 'Silk Road Voyages LLC' : 'Chorvoq Panorama Villa'}
                    className="tourly-input text-sm"
                  />
                </div>
              )}

              {/* Viloyat & Tuman (backend tekshir() bilan mos) */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Viloyat / Hudud *
                </label>
                <select
                  value={formData.viloyat}
                  onChange={(e) => handleViloyatChange(e.target.value)}
                  className="tourly-input text-sm"
                >
                  {VILOYATLAR_LIST.map((vil) => (
                    <option key={vil} value={vil}>
                      {vil}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Tuman / Shahar *
                </label>
                <select
                  value={formData.tuman}
                  onChange={(e) => setFormData({ ...formData, tuman: e.target.value })}
                  className="tourly-input text-sm"
                >
                  {availableDistricts.map((tum) => (
                    <option key={tum} value={tum}>
                      {tum}
                    </option>
                  ))}
                </select>
              </div>

              {(serviceType === 'hotel' || serviceType === 'restoran' || serviceType === 'home_rent') && (
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Aniq manzil *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="tourly-input tourly-select text-sm"
                  />
                </div>
              )}

              {(serviceType === 'hotel' || serviceType === 'restoran' || serviceType === 'home_rent') && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Latitude</label>
                    <input
                      type="text"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="41.311081"
                      className="tourly-input text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Longitude</label>
                    <input
                      type="text"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="69.240562"
                      className="tourly-input text-sm"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Category Specific Inputs */}
            {serviceType === 'guide' && (
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">Biladigan tillar *</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => {
                    const active = formData.selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          active ? 'bg-[#38B0DC] text-white border-[#38B0DC]' : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {serviceType === 'taxi' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Avtomobil modeli va yili
                  </label>
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                    placeholder="Chevrolet Traverse (2023)"
                    className="tourly-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Davlat raqam belgisi
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    placeholder="01 A 777 AA"
                    className="tourly-input text-sm"
                  />
                </div>
              </div>
            )}

            {(serviceType === 'hotel' || serviceType === 'home_rent') && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Xonalar soni</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.roomsCount}
                    onChange={(e) => setFormData({ ...formData, roomsCount: e.target.value })}
                    className="tourly-input text-sm"
                  />
                </div>
                {serviceType === 'hotel' && (
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Yulduzlar (1-5)</label>
                    <select
                      value={formData.stars}
                      onChange={(e) => setFormData({ ...formData, stars: e.target.value })}
                      className="tourly-input text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((s) => (
                        <option key={s} value={String(s)}>{s} yulduz</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {serviceType === 'restoran' && (
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-700 block mb-1">Oshxona turi</label>
                <select
                  value={formData.cuisineType}
                  onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })}
                  className="tourly-input text-sm"
                >
                  {CUISINE_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}

            {serviceType === 'tour_company' && (
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Turizm litsenziyasi raqami *</label>
                  <input
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="tourly-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Yuridik manzil *</label>
                  <input
                    type="text"
                    required
                    value={formData.legalAddress}
                    onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                    className="tourly-input text-sm"
                  />
                </div>
              </div>
            )}

            {/* Document and Image Upload Section */}
            <DocumentUpload
              galleryImages={galleryImages}
              setGalleryImages={setGalleryImages}
              passportFront={passportFront}
              setPassportFront={setPassportFront}
              passportBack={passportBack}
              setPassportBack={setPassportBack}
              requiredDocs={true}
            />

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {serviceType === 'tour_company' ? 'Kompaniya logotipi (ixtiyoriy)' : 'Shaxsiy rasm (ixtiyoriy)'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setProfilePhoto(reader.result);
                  reader.readAsDataURL(file);
                }}
                className="text-xs w-full"
              />
              {profilePhoto && (
                <img src={profilePhoto} alt="Preview" className="mt-2 w-20 h-20 rounded-xl object-cover border border-gray-200" />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {serviceType === 'guide' || serviceType === 'taxi' ? "O'zi haqida (bio)" : 'Tavsif'}
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Xizmatingiz, qulayliklar yoki taklifingiz haqida qisqacha yozing..."
                className="tourly-input text-sm"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#38B0DC] hover:bg-[#2695BF] text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Yuborilmoqda...' : 'Arizani yuborish'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
