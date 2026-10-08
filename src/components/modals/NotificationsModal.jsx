import React from 'react';
import { X, Bell, CheckCircle2, Ticket, MessageSquare, ShieldCheck, Clock } from 'lucide-react';

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications = [],
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div
        className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#38B0DC]/15 text-[#38B0DC] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Bildirishnomalar</h3>
              <span className="text-xs text-gray-500">Eng so'nggi yangilik va xabarlar</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              Yangi bildirishnomalar yo'q
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-start gap-3 hover:border-[#38B0DC]/30 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <strong className="text-gray-900 block font-bold">{notif.title}</strong>
                  <span className="text-gray-600 leading-relaxed block mt-0.5">{notif.message}</span>
                  <span className="text-[10px] text-gray-400 block mt-1">{notif.time}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-white/80 flex justify-end">
            <button
              onClick={onClearAll}
              className="text-xs text-[#38B0DC] hover:text-[#2695BF] font-bold"
            >
              Barchasini o'qilgan deb belgilash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
