import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, X, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function DocumentUpload({
  galleryImages = [],
  setGalleryImages,
  passportFront,
  setPassportFront,
  passportBack,
  setPassportBack,
  maxGalleryCount = 6,
  requiredDocs = true
}) {
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Gallery multi-image upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (galleryImages.length < maxGalleryCount) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setGalleryImages((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);

        // Upload to backend
        api.uploadFile(file).then((res) => {
          if (res?.url) {
            setGalleryImages((prev) => prev.map((img, i) => (i === prev.length - 1 ? res.url : img)));
          }
        }).catch(() => {});
      }
    });
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Passport single file upload
  const handlePassportUpload = (side, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === 'front') {
        setPassportFront(event.target.result);
      } else {
        setPassportBack(event.target.result);
      }
    };
    reader.readAsDataURL(file);

    api.uploadFile(file).then((res) => {
      if (res?.url) {
        if (side === 'front') setPassportFront(res.url);
        else setPassportBack(res.url);
      }
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* 1. Xizmat / Ob'ekt fotosuratlari (Galereya) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#38B0DC]" />
            Xizmat va ob'ekt fotosuratlari
          </label>
          <span className="text-xs text-gray-500 font-medium">
            {galleryImages.length}/{maxGalleryCount} ta rasm
          </span>
        </div>

        {/* Drag & Drop Area */}
        <label
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files) {
              handleGalleryUpload({ target: { files: e.dataTransfer.files } });
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all ${
            dragActive
              ? 'border-[#38B0DC] bg-[#38B0DC]/10 scale-[1.01]'
              : 'border-gray-300 hover:border-[#38B0DC] bg-white/70 hover:bg-white/90'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#38B0DC]/15 flex items-center justify-center text-[#38B0DC] mb-2 shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Rasmlarni bu yerga tashlang yoki tanlang</span>
          <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP (Maksimal 10MB)</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleGalleryUpload}
          />
        </label>

        {/* Gallery Previews Grid */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-video bg-gray-100 border border-gray-200 shadow-sm">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewModalImg(img)}
                    className="p-1.5 bg-white/80 hover:bg-white text-gray-800 rounded-lg shadow transition"
                    title="Kattalashtirish"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow transition"
                    title="O'chirish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Shaxsni tasdiqlovchi hujjat (Pasport / ID Karta) */}
      {requiredDocs && (
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#38B0DC]" />
              Shaxsni tasdiqlovchi hujjat (Pasport / ID karta / Guvohnoma)
            </label>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
              Xavfsiz tekshiruv uchun
            </span>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed">
            Platforma sifatini ta'minlash uchun hujjatning old va orqa tomoni nusxasini yuklang. Ushbu ma'lumotlar faqat ma'muriyat tomonidan tekshiriladi va ommaga ko'rsatilmaydi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Old tomoni */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-700">1. Old tomoni (Fotosurat va F.I.Sh.)</span>
              {passportFront ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-emerald-50/50 p-2 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={passportFront}
                      alt="Passport Oldi"
                      className="w-14 h-12 rounded-lg object-cover border border-emerald-300 cursor-pointer"
                      onClick={() => setPreviewModalImg(passportFront)}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Old tomoni yuklandi
                      </div>
                      <span className="text-[11px] text-gray-500">Rasmni ko'rish uchun bosing</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewModalImg(passportFront)}
                      className="p-1.5 text-gray-600 hover:text-[#38B0DC] hover:bg-white rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassportFront(null)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 hover:border-[#38B0DC] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/60 hover:bg-white transition text-center group">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#38B0DC] mb-1 transition" />
                  <span className="text-xs font-semibold text-gray-700">Pasport old tomoni</span>
                  <span className="text-[10px] text-gray-400">Rasm yoki skaner fayli</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePassportUpload('front', e.target.files[0])}
                  />
                </label>
              )}
            </div>

            {/* Orqa tomoni */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-gray-700">2. Orqa tomoni (Propiska / Manzil)</span>
              {passportBack ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-emerald-50/50 p-2 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <img
                      src={passportBack}
                      alt="Passport Orqasi"
                      className="w-14 h-12 rounded-lg object-cover border border-emerald-300 cursor-pointer"
                      onClick={() => setPreviewModalImg(passportBack)}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Orqa tomoni yuklandi
                      </div>
                      <span className="text-[11px] text-gray-500">Rasmni ko'rish uchun bosing</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewModalImg(passportBack)}
                      className="p-1.5 text-gray-600 hover:text-[#38B0DC] hover:bg-white rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPassportBack(null)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 hover:border-[#38B0DC] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-white/60 hover:bg-white transition text-center group">
                  <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[#38B0DC] mb-1 transition" />
                  <span className="text-xs font-semibold text-gray-700">Pasport orqa tomoni</span>
                  <span className="text-[10px] text-gray-400">Rasm yoki skaner fayli</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handlePassportUpload('back', e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-black/60 hover:bg-black text-white rounded-full flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImg}
              alt="Kattalashtirilgan rasm"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
