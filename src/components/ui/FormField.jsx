import React from 'react';

export function FormInput({ label, required, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={`tourly-input ${className}`}
        {...props}
      />
    </div>
  );
}

export function FormSelect({ label, required, children, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select className={`tourly-input tourly-select ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

export function FormTextarea({ label, required, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="text-xs font-bold text-gray-700 block mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea className={`tourly-input resize-none ${className}`} {...props} />
    </div>
  );
}

export function FormFileButton({ label, accept, onChange, preview, previewClass = 'w-24 h-24' }) {
  return (
    <div>
      {label && <label className="text-xs font-bold text-gray-700 block mb-1.5">{label}</label>}
      <label className="tourly-file-btn cursor-pointer inline-flex items-center gap-2">
        <span className="px-4 py-2.5 rounded-xl bg-[#2d6a4f]/10 text-[#2d6a4f] text-xs font-bold border border-[#2d6a4f]/25 hover:bg-[#2d6a4f]/15 transition">
          Fayl tanlash
        </span>
        <input type="file" accept={accept} className="hidden" onChange={onChange} />
      </label>
      {preview && (
        <img src={preview} alt="" className={`mt-2 ${previewClass} rounded-2xl object-cover border-2 border-white shadow-md`} />
      )}
    </div>
  );
}
