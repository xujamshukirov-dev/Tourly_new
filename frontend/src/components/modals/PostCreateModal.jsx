import React, { useState } from 'react';
import { X, ImagePlus, Video, Send, MapPin, Sparkles, Film } from 'lucide-react';

import { api } from '../../services/api';

export default function PostCreateModal({ isOpen, onClose, currentUser, onSubmit }) {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'
  const [mediaPreview, setMediaPreview] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleMediaFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');

    const reader = new FileReader();
    reader.onload = () => {
      setMediaPreview(reader.result);
      if (isVideo) {
        setVideoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!caption.trim()) {
      setErrorMessage('Post haqida ma\'lumot yozing');
      return;
    }

    const hasMedia = selectedFile || videoUrl || mediaPreview;
    if (!hasMedia) {
      setErrorMessage('Iltimos, rasm yoki video yuklang');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalMedia = videoUrl || mediaPreview || '';

      // Upload file via multipart/form-data if a local file was chosen
      if (selectedFile) {
        try {
          const uploadRes = await api.uploadFile(selectedFile);
          if (uploadRes && uploadRes.url) {
            finalMedia = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn('Multipart upload failed, falling back to base64 preview:', uploadErr.message);
          if (!finalMedia && mediaPreview) {
            finalMedia = mediaPreview;
          }
        }
      }

      const payload = {
        media: finalMedia,
        media_type: mediaType,
        caption: caption.trim(),
        location_name: location.trim() || "O'zbekiston",
        latitude: null,
        longitude: null,
      };

      const response = await api.createPost(payload);

      const formattedPost = {
        id: response.id || Date.now(),
        author: response.user?.username || currentUser?.firstName || 'Sayyoh',
        authorRole: "Sayyoh & Muallif",
        authorAvatar: response.user?.avatar || currentUser?.avatar || null,
        location: response.location_name || location.trim() || "O'zbekiston",
        caption: response.caption || caption.trim(),
        image: response.media_type === 'image' ? response.media : null,
        videoUrl: response.media_type === 'video' ? response.media : null,
        likes: response.likes_count || 0,
        commentsCount: response.comments_count || 0,
        timeAgo: 'Hozirgina',
        createdAt: response.created_at || new Date().toISOString(),
      };

      onSubmit(formattedPost);
      setCaption('');
      setLocation('');
      setMediaPreview(null);
      setVideoUrl('');
      onClose();
    } catch (err) {
      console.error('Post creation failed:', err);
      let msg = err.message || 'Postni yuklashda xatolik yuz berdi';
      if (err.status === 401 || msg.includes('401') || msg.toLowerCase().includes('authenticated')) {
        msg = "Post yuklash uchun avval tizimga kiring (Login qiling)!";
      }
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#2E5A27]/10 text-[#2E5A27] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 leading-tight">
                Yangi Post Yuklash
              </h3>
              <p className="text-[11px] text-gray-500">Rasm yoki video (MP4) orqali taassurotlaringizni ulashing</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          
          {/* Caption Textarea */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Post Tavsifi (Caption)
            </label>
            <textarea
              required
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="O'zbekistonning qaysi go'shalari sizni hayratda qoldirdi? Taassurotlaringizni yozing..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-gray-50 focus:bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2E5A27] transition"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Joylashuv (Viloyat / Shahar)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Masalan: Registon, Samarqand yoki Amirsoy, Chimyon"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-gray-50 focus:bg-white border border-gray-200 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#2E5A27] transition"
              />
            </div>
          </div>

          {/* Media Upload Area (Image or Video) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Fayl Tanlash (Rasm yoki MP4 Video)
            </label>

            <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#2E5A27] hover:bg-emerald-50/20 cursor-pointer transition group">
              <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#2E5A27]">
                <ImagePlus className="w-6 h-6" />
                <span className="text-gray-300">yoki</span>
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-[#2E5A27]">
                Rasm (JPG, PNG) yoki Video (MP4) yuklash
              </span>
              <span className="text-[10px] text-gray-400">
                Instagram uslubidagi vertikal tasma uchun tavsiya etiladi
              </span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                onChange={handleMediaFileChange}
              />
            </label>
          </div>

          {/* Video URL Alternative */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Yoki to'g'ridan-to'g'ri MP4 video URL (ixtiyoriy):
            </label>
            <input
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                if (e.target.value) setMediaType('video');
              }}
              placeholder="https://.../video.mp4"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#2E5A27]"
            />
          </div>

          {/* Media Preview Box */}
          {mediaPreview && (
            <div className="relative rounded-2xl overflow-hidden bg-black max-h-56 flex items-center justify-center border border-gray-200">
              {mediaType === 'video' ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full max-h-56 object-contain"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Post preview"
                  className="w-full max-h-56 object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => {
                  setMediaPreview(null);
                  setVideoUrl('');
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#2E5A27] hover:bg-[#1E3F19] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#2E5A27]/25 transition active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSubmitting ? "Joylanmoqda..." : "Postni Chop Etish"}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
