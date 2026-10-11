import React from 'react';

const GRADIENTS = [
  'from-emerald-500 to-teal-700',
  'from-blue-600 to-indigo-700',
  'from-cyan-500 to-blue-700',
  'from-amber-500 to-orange-600',
  'from-violet-600 to-purple-800',
  'from-rose-500 to-pink-700',
  'from-teal-600 to-emerald-800',
  'from-indigo-500 to-purple-700',
];

export default function InitialsAvatar({
  name = 'User',
  size = 'md',
  className = '',
  showOnline = false,
}) {
  const trimmed = (typeof name === 'string' ? name.trim() : '') || 'U';
  const initial = trimmed.charAt(0).toUpperCase();

  // Consistent color based on name's char code sum
  let sum = 0;
  for (let i = 0; i < trimmed.length; i++) {
    sum += trimmed.charCodeAt(i);
  }
  const gradient = GRADIENTS[sum % GRADIENTS.length];

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-12 h-12 text-base font-extrabold',
    xl: 'w-16 h-16 text-2xl font-black',
  }[size] || 'w-10 h-10 text-sm font-bold';

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      <div
        className={`${sizeStyles} rounded-full bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-sm select-none border-2 border-white/80 ring-1 ring-black/5`}
        title={trimmed}
      >
        <span>{initial}</span>
      </div>
      {showOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
}
