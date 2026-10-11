import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X, Heart, MessageSquare, Share2, Bookmark, Send,
  MapPin, Volume2, VolumeX, Check, ChevronUp, ChevronDown
} from 'lucide-react';
import InitialsAvatar from '../ui/InitialsAvatar';
import { api } from '../../services/api';

export default function PostsFeedModal({
  isOpen,
  onClose,
  initialPostId = null,
  posts = [],
  currentUser = null,
  onRequestLogin,
  onOpenProfile,
  onOpenChat,
}) {
  const containerRef = useRef(null);
  const videoRefs = useRef({});
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

  const [likesState, setLikesState] = useState(() => {
    const saved = localStorage.getItem('tourly_post_likes');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {};
  });

  const [commentsState, setCommentsState] = useState(() => {
    const saved = localStorage.getItem('tourly_post_comments');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      301: [
        { id: 101, author: "Farrux Zokirov", text: "Toshkent oqshomi rostdan ham betakror! Mehmonxona hovlisi ajoyib ekan.", time: "1 soat oldin" },
        { id: 102, author: "Nilufar Usmonova", text: "Havo juda toza, dam olish uchun eng yaxshi joy.", time: "30 daqiqa oldin" }
      ],
      302: [
        { id: 201, author: "Bobur Mirzo", text: "Tandir somsa haqiqatdan ham Samarqandning tashrif qog'ozi! 👏", time: "2 soat oldin" },
        { id: 202, author: "Ziyoda Karimova", text: "Go'shti juda yumshoq va xushbo'y ekan, borib ko'rishni tavsiya qilaman.", time: "15 daqiqa oldin" }
      ],
      303: [
        { id: 301, author: "Jamshid Rustamov", text: "Registon maydoniga har borganimda yangi ilhom olaman!", time: "45 daqiqa oldin" }
      ],
      304: [
        { id: 401, author: "Madina Aliyeva", text: "Boysun tog'lari va Omonxona manzaralari daxshat go'zal!", time: "2 soat oldin" }
      ]
    };
  });

  const [isMuted, setIsMuted] = useState(true);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentInputText, setCommentInputText] = useState('');
  const [heartAnimPostId, setHeartAnimPostId] = useState(null);

  // Share to user modal state
  const [sharePost, setSharePost] = useState(null);
  const [sentUserIds, setSentUserIds] = useState({});
  const [copiedToast, setCopiedToast] = useState(false);

  const scrollToIndex = useCallback((index) => {
    if (!containerRef.current) return;
    const postElements = containerRef.current.querySelectorAll('.instagram-post-card');
    if (postElements[index]) {
      postElements[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Potential share recipients
  const shareRecipients = [
    { id: 'usr_1', name: "Asilbek Dinarov", role: "Mehmonxona Muassisi" },
    { id: 'usr_2', name: "Komiljon Rahimov", role: "Taksi haydovchisi" },
    { id: 'usr_3', name: "Aziza Xolmurodova", role: "Professional Gid" },
    { id: 'usr_4', name: "Javohir Samadov", role: "Sayyoh & Blogger" },
    { id: 'usr_5', name: "Botirbek Aliyev", role: "Zomin Kottej Egasi" },
  ];

  useEffect(() => {
    localStorage.setItem('tourly_post_likes', JSON.stringify(likesState));
  }, [likesState]);

  useEffect(() => {
    localStorage.setItem('tourly_post_comments', JSON.stringify(commentsState));
  }, [commentsState]);

  // Initial scroll to post if specific ID requested
  useEffect(() => {
    if (isOpen && initialPostId && containerRef.current) {
      const idx = posts.findIndex((p) => p.id === initialPostId);
      if (idx !== -1) {
        setTimeout(() => {
          scrollToIndex(idx);
        }, 150);
      }
    }
  }, [isOpen, initialPostId, posts]);

  // IntersectionObserver to handle Autoplay & Pause on scroll
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const options = {
      root: containerRef.current,
      threshold: 0.65,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const postId = Number(entry.target.getAttribute('data-post-id'));
        const videoEl = videoRefs.current[postId];

        if (entry.isIntersecting) {
          const idx = posts.findIndex((p) => p.id === postId);
          if (idx !== -1) setCurrentVisibleIndex(idx);

          if (videoEl) {
            videoEl.play().catch(() => {});
          }
        } else {
          if (videoEl) {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, options);
    const postElements = containerRef.current.querySelectorAll('.instagram-post-card');
    postElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [isOpen, posts]);

  // Keyboard navigation (ArrowUp, ArrowDown, Escape)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeCommentsPostId) {
          setActiveCommentsPostId(null);
        } else if (sharePost) {
          setSharePost(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollToIndex(Math.min(posts.length - 1, currentVisibleIndex + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollToIndex(Math.max(0, currentVisibleIndex - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentVisibleIndex, posts.length, activeCommentsPostId, sharePost]);

  if (!isOpen) return null;



  const handleToggleLike = async (postId, e) => {
    e?.stopPropagation();
    if (!currentUser) {
      onRequestLogin?.();
      return;
    }

    const currentLiked = !!likesState[postId]?.liked;
    const postItem = posts.find((p) => p.id === postId);
    const defaultLikes = postItem?.likes || 45;
    const currentCount = likesState[postId]?.count !== undefined
      ? likesState[postId].count
      : defaultLikes;

    const nextLiked = !currentLiked;
    const nextCount = nextLiked ? currentCount + 1 : Math.max(0, currentCount - 1);

    setLikesState((prev) => ({
      ...prev,
      [postId]: {
        liked: nextLiked,
        count: nextCount,
      },
    }));

    if (nextLiked) {
      triggerHeartAnimation(postId);
    }

    try {
      await api.toggleLikePost(postId);
    } catch (err) {
      console.warn('Backend like request failed:', err.message);
    }
  };

  const triggerHeartAnimation = (postId) => {
    setHeartAnimPostId(postId);
    setTimeout(() => {
      setHeartAnimPostId(null);
    }, 850);
  };

  const handleDoubleTap = (postId) => {
    if (!currentUser) {
      onRequestLogin?.();
      return;
    }
    const currentLiked = !!likesState[postId]?.liked;
    if (!currentLiked) {
      handleToggleLike(postId);
    } else {
      triggerHeartAnimation(postId);
    }
  };

  const handleAddComment = async (postId, e) => {
    e?.preventDefault();
    const text = commentInputText.trim();
    if (!text) return;

    if (!currentUser) {
      onRequestLogin?.();
      return;
    }

    const authorName = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.email || 'Sayyoh';
    const tempId = Date.now();
    const newComment = {
      id: tempId,
      author: authorName,
      text,
      time: 'Hozirgina',
    };

    setCommentsState((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setCommentInputText('');

    try {
      const res = await api.addPostComment(postId, text);
      if (res?.id) {
        setCommentsState((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).map((c) => (c.id === tempId ? { ...c, id: res.id } : c)),
        }));
      }
    } catch (err) {
      console.warn('Backend comment request failed:', err.message);
    }
  };

  const handleSendToUser = (recipient) => {
    setSentUserIds((prev) => ({ ...prev, [recipient.id]: true }));
    if (onOpenChat) {
      // Optional direct message notification
    }
    setTimeout(() => {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }, 200);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center overflow-hidden animate-in fade-in duration-200">
      
      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-2xl border border-gray-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Muvaffaqiyatli jo'natildi!</span>
        </div>
      )}

      {/* Top Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="text-white text-xs font-bold tracking-wide">Tourly Feed</span>
          <span className="text-white/60 text-[11px] font-medium ml-1">
            {currentVisibleIndex + 1} / {posts.length}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition active:scale-95 shadow-lg"
            title={isMuted ? "Ovozni yoqish" : "Ovozni o'chirish"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition active:scale-95 shadow-lg"
            title="Yopish (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Desktop Quick Nav Arrows */}
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        <button
          onClick={() => scrollToIndex(Math.max(0, currentVisibleIndex - 1))}
          disabled={currentVisibleIndex === 0}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none text-white backdrop-blur-md flex items-center justify-center transition active:scale-90"
          title="Oldingi post"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => scrollToIndex(Math.min(posts.length - 1, currentVisibleIndex + 1))}
          disabled={currentVisibleIndex === posts.length - 1}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 disabled:opacity-30 disabled:pointer-events-none text-white backdrop-blur-md flex items-center justify-center transition active:scale-90"
          title="Keyingi post"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* INSTAGRAM FULL-SCROLL FEED CONTAINER (scroll-snap-type: y mandatory) */}
      <div
        ref={containerRef}
        className="w-full h-screen overflow-y-scroll no-scrollbar scroll-smooth"
        style={{
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
      >
        {posts.map((post, idx) => {
          const isLiked = !!likesState[post.id]?.liked;
          const defaultLikes = post.likes || 45;
          const likesCount = likesState[post.id]?.count !== undefined
            ? likesState[post.id].count
            : defaultLikes;
          const postComments = commentsState[post.id] || [];
          const isVideo = Boolean(post.videoUrl || (typeof post.image === 'string' && post.image.endsWith('.mp4')));

          return (
            <div
              key={post.id}
              data-post-id={post.id}
              className="instagram-post-card w-full h-screen flex items-center justify-center relative p-0 sm:py-6"
              style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
            >
              {/* Central Phone/Feed Frame */}
              <div className="relative w-full h-full sm:max-w-md sm:h-[92vh] sm:rounded-3xl overflow-hidden bg-gray-950 border sm:border-white/15 shadow-2xl flex flex-col justify-end">
                
                {/* Media Layer (Image or Video) */}
                <div
                  className="absolute inset-0 z-0 bg-black flex items-center justify-center cursor-pointer select-none"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  {isVideo ? (
                    <video
                      ref={(el) => (videoRefs.current[post.id] = el)}
                      src={post.videoUrl || post.image}
                      playsInline
                      loop
                      muted={isMuted}
                      className="w-full h-full object-cover"
                      poster={post.image?.endsWith('.mp4') ? undefined : post.image}
                    />
                  ) : (
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                      loading={idx < 2 ? 'eager' : 'lazy'}
                    />
                  )}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />

                  {/* Big Heart Animation on Double Tap */}
                  {heartAnimPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                      <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-2xl animate-ping duration-700" />
                    </div>
                  )}
                </div>

                {/* Right Side Action Bar (Instagram / Reels Style) */}
                <div className="absolute right-3 bottom-24 sm:bottom-20 z-20 flex flex-col items-center gap-5 text-white">
                  
                  {/* Like Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(post.id, e)}
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition active:scale-125 border border-white/10 shadow-lg"
                      title={isLiked ? "Laykni bekor qilish" : "Layk bosish"}
                    >
                      <Heart
                        className={`w-6 h-6 transition-transform duration-200 ${
                          isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-white'
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-bold mt-1 text-white/90 drop-shadow">
                      {likesCount}
                    </span>
                  </div>

                  {/* Comments Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setActiveCommentsPostId(post.id)}
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition active:scale-110 border border-white/10 shadow-lg"
                      title="Izohlar"
                    >
                      <MessageSquare className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-[11px] font-bold mt-1 text-white/90 drop-shadow">
                      {postComments.length}
                    </span>
                  </div>

                  {/* Share to User Button */}
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setSharePost(post)}
                      className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition active:scale-110 border border-white/10 shadow-lg"
                      title="Boshqa foydalanuvchiga jo'natish"
                    >
                      <Share2 className="w-6 h-6 text-white" />
                    </button>
                    <span className="text-[11px] font-bold mt-1 text-white/90 drop-shadow">
                      Ulashish
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Post saqlanganlar ro'yxatiga qo'shildi!");
                    }}
                    className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center transition active:scale-110 border border-white/10 shadow-lg"
                    title="Saqlash"
                  >
                    <Bookmark className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Bottom Author & Caption Info */}
                <div className="relative z-10 p-4 sm:p-5 pr-16 text-white space-y-2 pointer-events-auto">
                  
                  {/* Author profile tag */}
                  <div
                    className="flex items-center gap-2.5 cursor-pointer group w-fit"
                    onClick={() => {
                      onClose();
                      onOpenProfile?.({
                        id: post.id,
                        name: post.author,
                        role: post.authorRole || "Sayyoh & Muallif",
                        location: post.location,
                        avatar: post.image,
                      });
                    }}
                  >
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <div className="bg-black p-0.5 rounded-full">
                        <InitialsAvatar name={post.author || 'Sayyoh'} size="sm" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-white group-hover:text-rose-400 transition drop-shadow leading-tight">
                          {post.author}
                        </span>
                        {post.authorRole && (
                          <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                            {post.authorRole}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-white/80 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>{post.location || "O'zbekiston"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed drop-shadow line-clamp-3 font-normal">
                    {post.caption}
                  </p>

                  {/* Recent comment preview */}
                  {postComments.length > 0 && (
                    <div
                      onClick={() => setActiveCommentsPostId(post.id)}
                      className="cursor-pointer text-[11px] text-white/75 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 hover:bg-black/50 transition flex items-center justify-between"
                    >
                      <span className="truncate">
                        <strong>{postComments[postComments.length - 1].author}:</strong> {postComments[postComments.length - 1].text}
                      </span>
                      <span className="text-white/50 text-[10px] ml-2 flex-shrink-0">barchasi ({postComments.length})</span>
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* COMMENTS DRAWER MODAL */}
      {activeCommentsPostId && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setActiveCommentsPostId(null)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl flex flex-col h-[70vh] sm:h-[550px] animate-in slide-in-from-bottom-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-sm text-gray-900">
                  Izohlar ({commentsState[activeCommentsPostId]?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => setActiveCommentsPostId(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(commentsState[activeCommentsPostId] || []).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                  <MessageSquare className="w-8 h-8 stroke-1 text-gray-300 mb-2" />
                  <span>Hozircha izohlar yo'q. Birinchi bo'lib fikringizni bildiring!</span>
                </div>
              ) : (
                (commentsState[activeCommentsPostId] || []).map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5">
                    <InitialsAvatar name={c.author} size="xs" />
                    <div className="flex-1 bg-gray-50 rounded-2xl p-2.5 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{c.author}</span>
                        <span className="text-[10px] text-gray-400">{c.time || 'Hozirgina'}</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add comment input */}
            <form
              onSubmit={(e) => handleAddComment(activeCommentsPostId, e)}
              className="pt-2 border-t border-gray-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={commentInputText}
                onChange={(e) => setCommentInputText(e.target.value)}
                placeholder="Fikringizni yozing..."
                className="flex-1 py-2 px-3.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!commentInputText.trim()}
                className="w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition active:scale-95 shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE TO USER MODAL */}
      {sharePost && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSharePost(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#2E5A27]" />
                <h3 className="font-bold text-sm text-gray-900">Postni jo'natish</h3>
              </div>
              <button
                onClick={() => setSharePost(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Ushbu postni platformadagi foydalanuvchiga yoki do'stlaringizga yuboring:
            </p>

            {/* User List */}
            <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
              {shareRecipients.map((user) => {
                const isSent = !!sentUserIds[user.id];
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <InitialsAvatar name={user.name} size="xs" />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900">{user.name}</h4>
                        <span className="text-[10px] text-gray-500">{user.role}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendToUser(user)}
                      disabled={isSent}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        isSent
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-[#2E5A27] text-white hover:bg-[#1E3F19] active:scale-95'
                      }`}
                    >
                      {isSent ? 'Yuborildi ✓' : 'Yuborish'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Havolani nusxalash</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
