import React from 'react';

export default function AppFooter() {
  return (
    <footer className="pb-28 pt-4 text-center">
      <p className="text-xs text-gray-500/90 font-medium">
        © {new Date().getFullYear()} Tourly — Sayyohlik platformasi
      </p>
      <p className="text-[11px] text-gray-400 mt-0.5">
        Barcha huquqlar himoyalangan
      </p>
    </footer>
  );
}
