import React from 'react';
import { X, Construction } from 'lucide-react';

export default function ComingSoonModal({ isOpen, onClose, title = 'Reels', message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#2d6a4f]/20 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center">
            <Construction className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {message || 'Bu bo\'lim hozircha ishlab chiqilmoqda. Tez orada qo\'shiladi!'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-bold text-sm"
          >
            Tushunarli
          </button>
        </div>
      </div>
    </div>
  );
}
