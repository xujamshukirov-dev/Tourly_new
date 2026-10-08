import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegionSlider from './components/RegionSlider';
import FeedSection from './components/FeedSection';
import InteractiveMap from './components/InteractiveMap';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import UserProfile from './components/UserProfile';

// Modals
import ServiceRegistrationModal from './components/modals/ServiceRegistrationModal';
import BookingModal from './components/modals/BookingModal';
import FoodOrderModal from './components/modals/FoodOrderModal';
import TransportModal from './components/modals/TransportModal';
import TourPackagesModal from './components/modals/TourPackagesModal';
import AiAdvisorModal from './components/modals/AiAdvisorModal';
import NotificationsModal from './components/modals/NotificationsModal';
import AuthModal from './components/modals/AuthModal';
import ComingSoonModal from './components/modals/ComingSoonModal';
import PostCreateModal from './components/modals/PostCreateModal';
import PostsFeedModal from './components/modals/PostsFeedModal';
import AppFooter from './components/AppFooter';
import ChatModal from './components/modals/ChatModal';

// Data & API
import {
  REGIONS_DATA, POSTS_DATA, INITIAL_VERIFICATIONS
} from './data/mockData';
import { api } from './services/api';
import {
  getCurrentUser,
  getRegisteredUsers,
  logoutUser,
  canUserPublishTours,
  addUserNotification,
} from './utils/authStorage';
import {
  initListingsStore,
} from './utils/listingsStorage';

function getInitialListingsStore() {
  return {
    cottages: [],
    restaurants: [],
    hotels: [],
    taxis: [],
    guides: [],
  };
}

export default function App() {
  // Navigation & View State: 'home' | 'map' | 'profile' (No separated Reels!)
  const [activeNav, setActiveNav] = useState('home');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // User Profile View State (Viewing own profile vs another user/driver/host)
  const [viewingUser, setViewingUser] = useState(null);

  // User & Geolocation
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 41.311081, lng: 69.240562 });

  // Data Collections (Single source of truth)
  const [listingsStore, setListingsStore] = useState(getInitialListingsStore);

  const taxis = listingsStore.taxis || [];
  const cottages = listingsStore.cottages || [];
  const restaurants = listingsStore.restaurants || [];
  const hotels = listingsStore.hotels || [];
  const guides = listingsStore.guides || [];

  // Single unified Posts state (Images & Videos)
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('tourly_posts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return POSTS_DATA;
  });
  const [tours, setTours] = useState([]);
  const [operators, setOperators] = useState([]);
  const [isLoadingBackendData, setIsLoadingBackendData] = useState(false);

  // Telegram Chat Modal State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const handleOpenChat = (partnerItem) => {
    if (!partnerItem) return;
    setChatPartner({
      id: partnerItem.id || 'provider',
      name: partnerItem.name || partnerItem.driverName || partnerItem.hostName || partnerItem.contactPerson || partnerItem.title || 'Xizmat ko\'rsatuvchi',
      phone: partnerItem.phone || partnerItem.hostPhone || '+998 90 123 45 67',
      role: partnerItem.carModel ? 'Taksi haydovchisi' : (partnerItem.serviceTypeName || partnerItem.role || partnerItem.type || 'Xizmat ko\'rsatuvchi'),
      carModel: partnerItem.carModel,
      licensePlate: partnerItem.licensePlate,
      viloyat: partnerItem.viloyat || partnerItem.regionName,
      tuman: partnerItem.tuman,
    });
    setUnreadMessagesCount(0);
    setIsChatOpen(true);
  };

  // Instagram Full Scroll Posts Feed Modal State
  const [isPostsFeedOpen, setIsPostsFeedOpen] = useState(false);
  const [selectedPostIdForFeed, setSelectedPostIdForFeed] = useState(null);

  const handleOpenPostFeed = (postId = null) => {
    setSelectedPostIdForFeed(postId);
    setIsPostsFeedOpen(true);
  };

  // Open external user/driver profile
  const handleOpenUserProfile = (userData) => {
    setViewingUser(userData);
    setActiveNav('profile');
  };

  // Post creation state
  const [isPostCreateOpen, setIsPostCreateOpen] = useState(false);

  // Storage persisted: Bookings, Verifications, Favorites
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('tourly_bookings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 1001,
        service_type: 'train',
        service_title: 'Afrosiyob Tezyurar Poyezdi (Toshkent — Samarqand)',
        date: '2026-10-05',
        guests: 2,
        total_price: "350 000 so'm",
        status: 'Tasdiqlangan',
        ticketCode: 'TK-762-AFR',
      },
    ];
  });

  const [verifications, setVerifications] = useState(() => {
    const saved = localStorage.getItem('tourly_verifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_VERIFICATIONS;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('tourly_favorites');
    return saved ? JSON.parse(saved) : [1, 201];
  });

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Modals Visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registrationModalType, setRegistrationModalType] = useState(null);
  const [selectedBookingItem, setSelectedBookingItem] = useState(null);
  const [isFoodOrderOpen, setIsFoodOrderOpen] = useState(false);
  const [transportModalType, setTransportModalType] = useState(null);
  const [isTourPackagesOpen, setIsTourPackagesOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [comingSoon, setComingSoon] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tourly_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('tourly_verifications', JSON.stringify(verifications));
  }, [verifications]);

  useEffect(() => {
    try {
      localStorage.setItem('tourly_all_listings', JSON.stringify(listingsStore));
    } catch (error) {
      console.error('Error saving listings from App:', error);
    }
  }, [listingsStore]);

  useEffect(() => {
    localStorage.setItem('tourly_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('tourly_posts', JSON.stringify(posts));
  }, [posts]);

  // Initial font theme setup
  useEffect(() => {
    const savedFont = localStorage.getItem('tourly_font_style') || 'sans';
    document.body.classList.remove('font-theme-sans', 'font-theme-serif', 'font-theme-mono');
    document.body.classList.add(`font-theme-${savedFont}`);
  }, []);

  // Initial load user & detect location
  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
    } else {
      api.getMe().then((u) => {
        if (u) setUser(u);
      }).catch(() => {});
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: 41.311081, lng: 69.240562 });
        }
      );
    }
  }, []);

  // Fetch Real Data from Backend API Endpoints (/asosiy/home, /menu/..., /posts/feed, /bookings/)
  const loadBackendData = async (region = selectedRegion) => {
    setIsLoadingBackendData(true);
    try {
      // 1. Asosiy Home Feed (/asosiy/home)
      const homeRes = await api.getHomeFeed().catch((err) => {
        console.warn('[Tourly API] /asosiy/home yuklanmadi:', err.message);
        return null;
      });

      // 2. Turlar (/menu/tour/) va Operatorlar (/menu/tour/kompaniya)
      const [toursRes, opsRes, feedRes] = await Promise.all([
        api.getTours().catch(() => []),
        api.getOperators().catch(() => []),
        api.getFeed().catch(() => null),
      ]);

      if (Array.isArray(toursRes)) {
        setTours(toursRes.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          route: t.route,
          price: typeof t.price === 'number' || !isNaN(Number(t.price)) ? `${Number(t.price).toLocaleString()} so'm` : t.price,
          duration: `${t.duration_days} kun`,
          availableSeats: t.available_seats,
          companyName: t.kompaniya?.company_name || 'Tour Operator',
          image: t.rasmlar?.[0]?.image || t.image || 'https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80',
          included: ['Mehmonxona', 'Transport', 'Gid'],
        })));
      } else {
        setTours([]);
      }

      if (Array.isArray(opsRes)) {
        setOperators(opsRes);
      } else {
        setOperators([]);
      }

      if (Array.isArray(feedRes) && feedRes.length > 0) {
        setPosts(feedRes.map((p) => ({
          id: p.id,
          author: p.user?.username || 'Sayyoh',
          authorRole: "Sayyoh & Muallif",
          authorAvatar: p.user?.avatar || null,
          location: p.location_name || "O'zbekiston",
          caption: p.caption,
          image: p.media_type === 'image' ? p.media : null,
          videoUrl: p.media_type === 'video' ? p.media : null,
          likes: p.likes_count || 0,
          commentsCount: p.comments_count || 0,
          is_liked: p.is_liked || false,
          is_saved: p.is_saved || false,
          timeAgo: 'Hozirgina',
          createdAt: p.created_at,
        })));
      } else if (homeRes?.latest_posts?.length > 0) {
        setPosts(homeRes.latest_posts.map((p) => ({
          id: p.id,
          author: p.user?.username || 'Sayyoh',
          authorRole: "Sayyoh & Muallif",
          authorAvatar: p.user?.avatar || null,
          location: p.location_name || "O'zbekiston",
          caption: p.caption,
          image: p.media_type === 'image' ? p.media : null,
          videoUrl: p.media_type === 'video' ? p.media : null,
          likes: p.likes_count || 0,
          commentsCount: p.comments_count || 0,
          is_liked: p.is_liked || false,
          is_saved: p.is_saved || false,
          timeAgo: 'Hozirgina',
          createdAt: p.created_at,
        })));
      }

      // 3. Taksilar, Gidlar, Uylar, Restoranlar, Mehmonxonalar (/menu/{category})
      const [taxisRes, guidesRes, cottagesRes, restsRes, hotelsRes] = await Promise.all([
        api.getTaxis().catch(() => []),
        api.getGuides().catch(() => []),
        api.getCottages().catch(() => []),
        api.getRestaurants().catch(() => []),
        api.getHotels().catch(() => []),
      ]);

      const rawTaxis = Array.isArray(taxisRes) ? taxisRes : (Array.isArray(homeRes?.taxis) ? homeRes.taxis : []);
      const rawGuides = Array.isArray(guidesRes) ? guidesRes : (Array.isArray(homeRes?.guides) ? homeRes.guides : []);
      const rawCottages = Array.isArray(cottagesRes) ? cottagesRes : (Array.isArray(homeRes?.homes) ? homeRes.homes : []);
      const rawRestaurants = Array.isArray(restsRes) ? restsRes : (Array.isArray(homeRes?.restorans) ? homeRes.restorans : []);
      const rawHotels = Array.isArray(hotelsRes) ? hotelsRes : (Array.isArray(homeRes?.hotels) ? homeRes.hotels : []);

      setListingsStore({
        taxis: rawTaxis.map((t) => ({
          id: t.id,
          driverName: t.driverName || `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Haydovchi',
          carModel: t.car_model || t.carModel || 'Chevrolet Cobalt',
          licensePlate: t.car_number || t.licensePlate || '',
          regionName: t.regionName || (t.viloyat ? `${t.viloyat}, ${t.tuman}` : "O'zbekiston"),
          viloyat: t.viloyat,
          tuman: t.tuman,
          description: t.bio || t.description || '',
          price: t.price || "Kelishilgan narx",
          image: t.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
          phone: t.phone || '',
        })),

        guides: rawGuides.map((g) => ({
          id: g.id,
          name: g.name || `${g.first_name || ''} ${g.last_name || ''}`.trim() || 'Gid',
          title: `${g.first_name || ''} ${g.last_name || ''}`.trim() + " — Gid Yo'lboshchi",
          language: g.language || "O'zbekcha, Ruscha",
          languages: g.language ? g.language.split(', ') : ["O'zbekcha"],
          regionName: g.regionName || (g.viloyat ? `${g.viloyat}, ${g.tuman}` : "O'zbekiston"),
          viloyat: g.viloyat,
          tuman: g.tuman,
          bio: g.bio || "Professional gid",
          price: g.price || "250 000 so'm / kun",
          image: g.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          phone: g.phone || '',
        })),

        cottages: rawCottages.map((c) => ({
          id: c.id,
          title: c.title || c.address || "Shinam Dacha / Xonadon",
          address: c.address || `${c.viloyat}, ${c.tuman}`,
          regionName: c.regionName || (c.viloyat ? `${c.viloyat}, ${c.tuman}` : "O'zbekiston"),
          viloyat: c.viloyat,
          tuman: c.tuman,
          rooms: c.room_count || c.rooms || 4,
          description: c.bio || c.description || '',
          price: c.price || "1 200 000 so'm / kun",
          image: c.image || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
          phone: c.phone || '',
        })),

        restaurants: rawRestaurants.map((r) => ({
          id: r.id,
          name: r.name || r.address || "Milliy Taomlar Restorani",
          title: r.name || r.address || "Milliy Taomlar Restorani",
          cuisine: r.cuisine || "Milliy taomlar",
          regionName: r.regionName || (r.viloyat ? `${r.viloyat}, ${r.tuman}` : "O'zbekiston"),
          viloyat: r.viloyat,
          tuman: r.tuman,
          description: r.bio || r.description || '',
          price: r.price || "70 000 so'm / kishi",
          image: r.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          phone: r.phone || '',
        })),

        hotels: rawHotels.map((h) => ({
          id: h.id,
          name: h.name || h.address || "Shinam Mehmonxona",
          title: h.name || h.address || "Shinam Mehmonxona",
          stars: h.star_count || h.stars || 3,
          rooms: h.room_count || h.rooms || 10,
          regionName: h.regionName || (h.viloyat ? `${h.viloyat}, ${h.tuman}` : "O'zbekiston"),
          viloyat: h.viloyat,
          tuman: h.tuman,
          description: h.bio || h.description || '',
          price: h.price || "450 000 so'm / tun",
          image: h.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          phone: h.phone || '',
        })),
      });

      // 4. Foydalanuvchining haqiqiy bronlarini yuklash (/bookings/)
      api.getMyBookings().then((bList) => {
        if (Array.isArray(bList) && bList.length > 0) {
          setBookings(bList.map((b) => ({
            id: b.id,
            service_type: b.service_type,
            service_title: `Bron #${b.id} (${b.service_type})`,
            date: b.check_in,
            guests: 1,
            total_price: `${Number(b.total).toLocaleString()} so'm`,
            status: b.status === 'confirmed' ? 'Tasdiqlangan' : (b.status === 'pending' ? 'Kutilmoqda' : b.status),
            ticketCode: `TRL-${b.id}`,
          })));
        }
      }).catch(() => {});
    } catch (err) {
      console.warn('[Tourly] Backend API dan yuklashda xatolik:', err);
    } finally {
      setIsLoadingBackendData(false);
    }
  };

  useEffect(() => {
    loadBackendData(selectedRegion);
  }, [selectedRegion]);

  // Filter items by region & search query
  const filteredTaxis = taxis.filter((t) => {
    if (selectedRegion !== 'all' && t.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (t.title || '').toLowerCase().includes(q) ||
        (t.carModel || '').toLowerCase().includes(q) ||
        (t.driverName || '').toLowerCase().includes(q) ||
        (t.regionName || '').toLowerCase().includes(q) ||
        (t.viloyat || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredCottages = cottages.filter((c) => {
    if (selectedRegion !== 'all' && c.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (c.title || '').toLowerCase().includes(q) ||
        (c.hostName || '').toLowerCase().includes(q) ||
        (c.regionName || '').toLowerCase().includes(q) ||
        (c.viloyat || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredRestaurants = restaurants.filter((r) => {
    if (selectedRegion !== 'all' && r.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (r.title || '').toLowerCase().includes(q) ||
        (r.cuisine || '').toLowerCase().includes(q) ||
        (r.regionName || '').toLowerCase().includes(q) ||
        (r.viloyat || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredHotels = hotels.filter((h) => {
    if (selectedRegion !== 'all' && h.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (h.title || '').toLowerCase().includes(q) ||
        (h.regionName || '').toLowerCase().includes(q) ||
        (h.viloyat || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredGuides = guides.filter((g) => {
    if (selectedRegion !== 'all' && g.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (g.name || '').toLowerCase().includes(q) ||
        (g.language || '').toLowerCase().includes(q) ||
        (g.regionName || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredTours = tours.filter((tour) => {
    if (selectedRegion !== 'all' && tour.regionId !== selectedRegion) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (tour.title || '').toLowerCase().includes(q) ||
        (tour.location || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Handlers
  const handleToggleFavorite = (itemId) => {
    setFavorites((prev) => {
      const exists = prev.includes(itemId);
      const next = exists ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      return next;
    });
  };

  const handleBookingSubmit = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'Tasdiqlangan',
      ticketCode: `TK-${Math.floor(100 + Math.random() * 900)}-TRL`,
    };
    setBookings((prev) => [newBooking, ...prev]);

    const note = {
      id: Date.now(),
      title: "Buyurtmangiz qabul qilindi!",
      message: `"${bookingData.service_title}" uchun bron qilindi. Elektron chipta profilingizda saqlandi.`,
      time: "Hozirgina",
    };
    setNotifications((prev) => [note, ...prev]);
    setUnreadNotificationsCount((c) => c + 1);
    if (user?.id) addUserNotification(user.id, note);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz?")) {
      try {
        await api.cancelBooking(bookingId);
      } catch (err) {
        console.warn('Backendda bronni bekor qilish:', err.message);
      }
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      const note = {
        id: Date.now(),
        title: "Buyurtma bekor qilindi",
        message: "Bron muvaffaqiyatli bekor qilindi.",
        time: "Hozirgina",
      };
      setNotifications((prev) => [note, ...prev]);
      setUnreadNotificationsCount((c) => c + 1);
    }
  };

  const handleServiceRegister = (formData) => {
    const newVerif = {
      id: formData?.id || Date.now(),
      submittedByUserId: user?.id,
      ...formData,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    setVerifications((prev) => [newVerif, ...prev]);

    // Backend ma'lumotlarini qayta yuklaymiz
    loadBackendData(selectedRegion);

    const note = {
      id: Date.now(),
      title: "Arizangiz muvaffaqiyatli qabul qilindi",
      message: `${newVerif.serviceTypeName || "Xizmat"} ro'yxatdan o'tish so'rovingiz server tomonidan tasdiqlandi va saytda e'lon qilindi!`,
      time: "Hozirgina",
    };
    setNotifications((prev) => [note, ...prev]);
    setUnreadNotificationsCount((c) => c + 1);
    if (user?.id) addUserNotification(user.id, note);
  };

  // Post CRUD handlers
  const handleSubmitPost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.deletePost(postId);
    } catch (err) {
      console.warn('Backendda postni o\'chirish:', err.message);
    }
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const handleUpdatePost = (postId, updatedFields) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, ...updatedFields } : p))
    );
  };

  // Trigger notification when partner sends message in chat
  const handleNewMessageNotification = ({ partnerName, text }) => {
    const note = {
      id: Date.now(),
      title: `Yangi xabar: ${partnerName}`,
      message: text,
      time: 'Hozirgina',
    };
    setNotifications((prev) => [note, ...prev]);
    setUnreadNotificationsCount((c) => c + 1);
    setUnreadMessagesCount((c) => c + 1);
  };

  const requireAuth = (action) => {
    if (!user) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }
    action();
  };

  // Hamburger Service Selection Handler
  const handleSelectService = (serviceKey) => {
    setIsMenuOpen(false);
    switch (serviceKey) {
      case 'feed':
        setActiveNav('home');
        break;
      case 'posts':
      case 'reels':
        handleOpenPostFeed();
        break;
      case 'register_guide':
        requireAuth(() => setRegistrationModalType('guide'));
        break;
      case 'register_taxi':
        requireAuth(() => setRegistrationModalType('taxi'));
        break;
      case 'register_home_rent':
        requireAuth(() => setRegistrationModalType('home_rent'));
        break;
      case 'register_hotel':
        requireAuth(() => setRegistrationModalType('hotel'));
        break;
      case 'register_restoran':
        requireAuth(() => setRegistrationModalType('restoran'));
        break;
      case 'register_tour_company':
        requireAuth(() => setRegistrationModalType('tour_company'));
        break;
      case 'ai_assistant':
        setIsAiModalOpen(true);
        break;
      case 'food_order':
        setIsFoodOrderOpen(true);
        break;
      case 'attraction_ticket':
        setTransportModalType('attraction');
        break;
      case 'train_ticket':
        setTransportModalType('train');
        break;
      case 'flight_ticket':
        setTransportModalType('flight');
        break;
      case 'bus_ticket':
        setTransportModalType('bus');
        break;
      case 'tour_packages':
        setIsTourPackagesOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-[#38B0DC] selection:text-white">

      {/* Scenic Background */}
      <div className="fixed inset-0 -z-30 bg-gradient-to-b from-[#eef6ee] to-[#e8f2e8]" />
      <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none opacity-30 sm:opacity-40">
        <img src="/images/tourly_bg_scenic.jpg" alt="" className="w-full h-full object-cover" />
      </div>

      {/* 1. TOP NAVBAR */}
      <Navbar
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenProfile={() => {
          if (!user) {
            setAuthMode('login');
            setIsAuthOpen(true);
            return;
          }
          setViewingUser(null);
          setActiveNav('profile');
        }}
        onOpenMessages={() => {
          handleOpenChat(taxis[0] || { name: 'Sayyohlik Qo\'llab-quvvatlash', phone: '+998 71 200 00 00' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        unreadCount={unreadNotificationsCount}
        messageUnread={unreadMessagesCount}
        user={user}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotificationsCount(0);
        }}
      />

      {/* 2. MAIN CONTENT VIEWS */}
      <main className="flex-1 pb-24">
        {/* VIEW A: HOME FEED */}
        {activeNav === 'home' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* 14 Uzbekistan Regions Slider */}
            <RegionSlider
              regions={REGIONS_DATA}
              selectedRegion={selectedRegion}
              onSelectRegion={setSelectedRegion}
            />

            {/* Category Feed with Compact 4-item Latest Posts */}
            <FeedSection
              taxis={filteredTaxis}
              cottages={filteredCottages}
              restaurants={filteredRestaurants}
              hotels={filteredHotels}
              guides={filteredGuides}
              posts={posts}
              tours={filteredTours}
              userLocation={userLocation}
              onBookItem={(item) => setSelectedBookingItem(item)}
              onOpenMapLocation={(lat, lng) => {
                setUserLocation({ lat, lng });
                setActiveNav('map');
              }}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onCreatePost={() => {
                requireAuth(() => setIsPostCreateOpen(true));
              }}
              onOpenChat={handleOpenChat}
              onOpenUserProfile={handleOpenUserProfile}
              onOpenPostFeed={handleOpenPostFeed}
            />
          </div>
        )}

        {/* VIEW B: INTERACTIVE MAP (O'zbekiston A->B Yo'nalish Kalkulyatori) */}
        {activeNav === 'map' && (
          <div className="pt-2 animate-in fade-in duration-200">
            <InteractiveMap
              userLocation={userLocation}
              setUserLocation={setUserLocation}
              onClose={() => setActiveNav('home')}
            />
          </div>
        )}

        {/* VIEW C: USER PROFILE (Unified Posts grid with Edit and Delete) */}
        {activeNav === 'profile' && (
          <div className="pt-2 animate-in fade-in duration-200">
            <UserProfile
              user={user}
              viewingUser={viewingUser}
              onCloseViewingUser={() => setViewingUser(null)}
              bookings={bookings}
              favorites={favorites}
              posts={posts}
              allListings={[...cottages, ...hotels, ...restaurants, ...taxis, ...guides]}
              onCancelBooking={handleCancelBooking}
              onRequestLogin={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              onOpenCreatePost={() => requireAuth(() => setIsPostCreateOpen(true))}
              onUserUpdated={(updatedUser) => setUser(updatedUser)}
              onOpenChat={handleOpenChat}
              onOpenPostFeed={handleOpenPostFeed}
              onDeletePost={handleDeletePost}
              onUpdatePost={handleUpdatePost}
            />
          </div>
        )}

        <AppFooter />
      </main>

      {/* 3. FLOATING BOTTOM NAVIGATION BAR (Home, Posts, Map, Profile — No Reels!) */}
      <BottomNav
        activeNav={activeNav}
        setActiveNav={(nav) => {
          if (nav === 'profile') {
            setViewingUser(null);
          }
          setActiveNav(nav);
        }}
        onOpenPostFeed={() => handleOpenPostFeed()}
      />

      {/* 4. MODALS */}

      {/* Instagram Full-Scroll Feed Modal */}
      <PostsFeedModal
        isOpen={isPostsFeedOpen}
        onClose={() => setIsPostsFeedOpen(false)}
        initialPostId={selectedPostIdForFeed}
        posts={posts}
        currentUser={user}
        onRequestLogin={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
        onOpenProfile={handleOpenUserProfile}
        onOpenChat={handleOpenChat}
      />

      {/* Telegram Style Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentUser={user}
        partner={chatPartner}
        onNewMessageNotification={handleNewMessageNotification}
      />

      {/* Hamburger Drawer */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenService={handleSelectService}
        onLogout={() => {
          logoutUser();
          setUser(null);
          setIsMenuOpen(false);
        }}
      />

      {/* Service Registration Modal */}
      {registrationModalType && (
        <ServiceRegistrationModal
          type={registrationModalType}
          serviceType={registrationModalType}
          isOpen={!!registrationModalType}
          onClose={() => setRegistrationModalType(null)}
          onSubmitSuccess={handleServiceRegister}
          onSubmit={handleServiceRegister}
          user={user}
          currentUser={user}
        />
      )}

      {/* Booking Modal */}
      {selectedBookingItem && (
        <BookingModal
          item={selectedBookingItem}
          isOpen={!!selectedBookingItem}
          onClose={() => setSelectedBookingItem(null)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Food Order Modal */}
      <FoodOrderModal
        isOpen={isFoodOrderOpen}
        onClose={() => setIsFoodOrderOpen(false)}
      />

      {/* Transport Modal */}
      {transportModalType && (
        <TransportModal
          type={transportModalType}
          isOpen={!!transportModalType}
          onClose={() => setTransportModalType(null)}
          onSubmit={handleBookingSubmit}
        />
      )}

      {/* Tour Packages Modal */}
      <TourPackagesModal
        isOpen={isTourPackagesOpen}
        onClose={() => setIsTourPackagesOpen(false)}
        tours={tours}
        onSelectTour={(tour) => {
          setSelectedBookingItem({
            ...tour,
            type: 'tour',
            title: tour.title,
            price: tour.price,
          });
        }}
        canPublishTours={canUserPublishTours(user?.email)}
        onPublishNewTour={(newTour) => {
          setTours((prev) => [newTour, ...prev]);
        }}
      />

      {/* AI Advisor Modal */}
      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={() => {
          setNotifications([]);
          setUnreadNotificationsCount(0);
        }}
      />

      {/* Post Create Modal (Images & MP4 Videos) */}
      <PostCreateModal
        isOpen={isPostCreateOpen}
        onClose={() => setIsPostCreateOpen(false)}
        onSubmit={handleSubmitPost}
        currentUser={user}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={(u) => {
          setUser(u);
          setIsAuthOpen(false);
        }}
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        type={comingSoon}
        isOpen={!!comingSoon}
        onClose={() => setComingSoon(null)}
      />

    </div>
  );
}
