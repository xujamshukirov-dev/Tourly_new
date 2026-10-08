import React from 'react';

export const ALL_REGIONS_PILLS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'tashkent-city', label: 'Toshkent' },
  { id: 'samarkand', label: 'Samarqand' },
  { id: 'bukhara', label: 'Buxoro' },
  { id: 'khorezm', label: 'Xiva' },
  { id: 'qashqadaryo', label: 'Qashqadaryo' },
  { id: 'surxondaryo', label: 'Surxondaryo' },
  { id: 'andijan', label: 'Andijon' },
  { id: 'fergana', label: "Farg'ona" },
  { id: 'namangan', label: 'Namangan' },
  { id: 'jizzakh', label: 'Jizzax' },
  { id: 'sirdaryo', label: 'Sirdaryo' },
  { id: 'navoiy', label: 'Navoiy' },
  { id: 'karakalpakstan', label: "Qoraqalpog'iston" },
  { id: 'tashkent-region', label: 'Toshkent vil.' },
];

export default function RegionSlider({ selectedRegion = 'all', onSelectRegion }) {
  return (
    <div className="w-full py-2">
      {/* Viloyatlar paneli: faqat toza matnli chip'lar (rasmsiz) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {ALL_REGIONS_PILLS.map((r) => {
            const isActive = selectedRegion === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRegion(r.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 select-none ${
                  isActive
                    ? 'bg-[#2E5A27] text-white shadow-md shadow-[#2E5A27]/25 scale-[1.02] border border-[#2E5A27]'
                    : 'bg-white/90 backdrop-blur-md text-gray-700 hover:text-[#2E5A27] hover:bg-white border border-gray-200/80 shadow-2xs'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
