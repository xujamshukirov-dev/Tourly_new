import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { api, setStoredToken } from '../../services/api';
import { setCurrentUser } from '../../utils/authStorage';

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '+998 ',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let userData;
      if (mode === 'login') {
        const tokenRes = await api.login(form.email.trim(), form.password);
        if (tokenRes.access_token) {
          setStoredToken(tokenRes.access_token);
        }
        userData = await api.getMe();
      } else {
        if (!form.firstName.trim() || !form.lastName.trim()) {
          throw new Error('Ism va familiyani kiriting');
        }
        const usernameBase = (form.email.split('@')[0] || form.firstName.toLowerCase()).replace(/[^a-zA-Z0-9_]/g, '');
        const username = `${usernameBase}_${Math.floor(100 + Math.random() * 900)}`;
        const regRes = await api.register(username, form.email.trim(), form.password);
        if (regRes.access_token) {
          setStoredToken(regRes.access_token);
        }
        try {
          await api.completeProfile({
            username,
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone: form.phone.trim(),
            bio: "Tourly sayyohi",
          });
        } catch {
          // ignore if complete-profile optional
        }
        userData = await api.getMe();
      }

      const activeUser = {
        ...userData,
        firstName: userData.first_name || form.firstName,
        lastName: userData.last_name || form.lastName,
        name: `${userData.first_name || form.firstName} ${userData.last_name || form.lastName}`.trim(),
      };

      setCurrentUser(activeUser);
      onSuccess?.(activeUser);
      onClose();
    } catch (err) {
      console.error('Auth request failed:', err);
      setError(err.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="w-full max-w-md glass-modal rounded-3xl shadow-2xl border border-white/80 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/60 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900">
              {mode === 'login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
            </h2>
            <p className="text-xs text-gray-500">Tourly — sayyohlik platformasi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100/80 hover:bg-gray-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-gray-700">Ism *</label>
                <div className="relative mt-1">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-sm focus:border-[#38B0DC] focus:outline-none"
                    placeholder="Ism"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Familiya *</label>
                <input
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-sm focus:border-[#38B0DC] focus:outline-none"
                  placeholder="Familiya"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700">Email *</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-sm focus:border-[#38B0DC] focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Parol *</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-sm focus:border-[#38B0DC] focus:outline-none"
                placeholder="Kamida 6 belgi"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-gray-700">Telefon *</label>
              <div className="relative mt-1">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/90 border border-gray-200 text-sm focus:border-[#38B0DC] focus:outline-none"
                  placeholder="+998 90 123 45 67"
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#38B0DC] hover:bg-[#2695BF] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            {loading ? 'Kutilmoqda...' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
          </button>

          <p className="text-center text-xs text-gray-500 pt-1">
            {mode === 'login' ? (
              <>
                Hisobingiz yo&apos;qmi?{' '}
                <button type="button" className="text-[#38B0DC] font-bold" onClick={() => setMode('register')}>
                  Ro&apos;yxatdan o&apos;ting
                </button>
              </>
            ) : (
              <>
                Allaqachon a&apos;zomisiz?{' '}
                <button type="button" className="text-[#38B0DC] font-bold" onClick={() => setMode('login')}>
                  Kirish
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
