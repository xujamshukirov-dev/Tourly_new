import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import {
  Navigation, MapPin, Locate, ExternalLink, Clock, Car, Compass,
  UtensilsCrossed, Hotel, Sparkles, X, ChevronRight, Fuel,
  Train, Bus, Plane, Footprints, ArrowRightLeft, Layers, Info,
  Home, Landmark, Search, CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

// O'zbekistonning barcha asosiy turistik hududlari, shaharlari va diqqatga sazovor obyektlari
export const TOURISM_OBJECTS = [
  // Shaharlar va Markazlar
  { id: 'tashkent-city', name: 'Toshkent shahri (Markaz)', category: 'city', lat: 41.311081, lng: 69.240562, region: 'Toshkent shahri', desc: 'Markaziy shahar maydoni va xiyobonlar' },
  { id: 'samarkand', name: 'Samarqand shahri (Registon)', category: 'monument', lat: 39.6542, lng: 66.9597, region: 'Samarqand', desc: 'Registon maydoni, Go\'ri Amir, Shohi Zinda' },
  { id: 'bukhara', name: 'Buxoro shahri (Labi Hovuz & Kalon)', category: 'monument', lat: 39.7747, lng: 64.4286, region: 'Buxoro', desc: 'Minorai Kalon, Ark qal\'asi, Labi Hovuz' },
  { id: 'khiva', name: 'Xiva shahri (Ichan Qal\'a)', category: 'monument', lat: 41.3783, lng: 60.3639, region: 'Xorazm', desc: 'Ochiq osmon ostidagi muzey shahar' },
  { id: 'shahrisabz', name: 'Shahrisabz (Oqsaroy majmuasi)', category: 'monument', lat: 39.0560, lng: 66.8335, region: 'Qashqadaryo', desc: 'Amir Temur qarorgohi Oqsaroy' },

  // Tog'li dam olish zonalari & Dachalar
  { id: 'chorvoq-lake', name: 'Chorvoq suv ombori & Dam olish maskani', category: 'cottage', lat: 41.6300, lng: 70.0400, region: 'Toshkent viloyati', desc: 'Basseynli shinam dachalar, plyaj va suv sporti' },
  { id: 'amirsoy-resort', name: 'Amirsoy tog\' kurorti & Chalet', category: 'hotel', lat: 41.5150, lng: 70.0100, region: 'Toshkent viloyati', desc: 'Alp tog\'lari andozasidagi tog\' kurorti' },
  { id: 'chimgan-mountains', name: 'Katta Chimyon tog\' etaklari', category: 'cottage', lat: 41.5360, lng: 69.9750, region: 'Toshkent viloyati', desc: 'Shinam tog\' dachalar va arxitektura' },
  { id: 'zomin-national-park', name: 'Zomin Milliy Bog\'i (Archazor & Shisha Ko\'prik)', category: 'cottage', lat: 39.9606, lng: 68.4950, region: 'Jizzax', desc: 'O\'zbekiston Shveytsariyasi, toza archazor havosi' },
  { id: 'omonxona-boysun', name: 'Omonxona shifobaxsh maskani & Kottejlar', category: 'cottage', lat: 38.3500, lng: 67.4500, region: 'Surxondaryo', desc: 'Buloq suvlari va Boysun tog\' kottejlari' },

  // Mehmonxonalar & Turistik Maskonlar
  { id: 'silk-road-samarkand', name: 'Silk Road Samarkand & Boqiy Shahar', category: 'hotel', lat: 39.6580, lng: 67.0450, region: 'Samarqand', desc: 'Boqiy Shahar etnomajmuasi va 5 yulduzli mehmonxonalar' },
  { id: 'moynaq-ships', name: 'Mo\'ynoq (Kemalar Qabristoni & Orol)', category: 'monument', lat: 43.7683, lng: 59.0214, region: 'Qoraqalpog\'iston', desc: 'Orol dengizi fojiasi yodgorligi' },
  { id: 'savitsky-museum', name: 'Savitskiy nomidagi Davlat muzeyi', category: 'monument', lat: 42.4602, lng: 59.6053, region: 'Qoraqalpog\'iston', desc: 'Sahrodagi Luvr — jahon avangard san\'ati' },
  { id: 'chortoq-sanatorium', name: 'Chortoq shifobaxsh sanatoriysi', category: 'hotel', lat: 41.0667, lng: 71.8167, region: 'Namangan', desc: 'Mineral suvli zamonaviy sanatoriy' },
  { id: 'xonobod-sanatorium', name: 'Xonobod shifobaxsh oromgohi', category: 'hotel', lat: 40.8000, lng: 73.0000, region: 'Andijon', desc: "So'lim tog' etagi va musaffo iqlim" },
  { id: 'nurota-chashma', name: 'Nurota Chashma & Qal\'a', category: 'monument', lat: 40.5630, lng: 65.6880, region: 'Navoiy', desc: 'Muqaddas chashma va qadimiy qal\'a' },
];

// Yo'l ustidagi POI lar: Yoqilg'i, Metan, EV va Oshxonalar
export const ROUTE_POIS = [
  { id: 'poi_f1', name: "UNG Petro AI-95/92 Zapravka", type: 'fuel', subtype: 'benzin', lat: 40.8500, lng: 68.6200, info: "Benzin, Dizel, Do'kon va Kafe", region: "Sirdaryo" },
  { id: 'poi_f2', name: "M-39 Mustaqillik Metan Gaz (CNG)", type: 'fuel', subtype: 'metan', lat: 40.2500, lng: 67.8500, info: "24/7 Metan Gaz, 220 bar, Avtoyuvish", region: "Jizzax" },
  { id: 'poi_f3', name: "TokBor EV Tezkor Zaryadlash Stansiyasi", type: 'fuel', subtype: 'ev', lat: 39.8500, lng: 67.2500, info: "Elektromobillar uchun 120kW tezkor zaryad", region: "Samarqand" },
  { id: 'poi_f4', name: "Lukoil Qiziltepa Zapravkasi", type: 'fuel', subtype: 'benzin', lat: 40.0300, lng: 64.8500, info: "Evro-5 benzin va dam olish maydoni", region: "Navoiy" },
  { id: 'poi_f5', name: "Buxoro-Urganch Trassa Metan Gaz", type: 'fuel', subtype: 'metan', lat: 40.6500, lng: 62.4500, info: "A-380 trassa bo'yidagi yirik metan stansiya", region: "Buxoro" },
  { id: 'poi_f6', name: "Qamchiq Dovoni UNG Petro", type: 'fuel', subtype: 'benzin', lat: 41.1500, lng: 70.5500, info: "Dovon boshida yuqori sifatli yoqilg'i", region: "Toshkent vil." },

  { id: 'poi_food1', name: "Jizzax Mashhur Qarsildoq Somsaxonasi", type: 'food', lat: 40.1100, lng: 67.8400, info: "Tandirdan uzilgan go'shtli Jizzax somsasi", region: "Jizzax" },
  { id: 'poi_food2', name: "Sirdaryo Daryobo'yi Baliqxonasi", type: 'food', lat: 40.5200, lng: 68.7500, info: "Tandir va qovurilgan yangi daryo baliqlari", region: "Sirdaryo" },
  { id: 'poi_food3', name: "Samarqand Zarafshon Palov Markazi", type: 'food', lat: 39.6600, lng: 66.9400, info: "Zig'ir moyli afsonaviy Samarqand to'y oshi", region: "Samarqand" },
  { id: 'poi_food4', name: "G'ijduvon Shavkat Shashlik Markazi", type: 'food', lat: 40.1000, lng: 64.6700, info: "Mashhur qiyma va bo'lakli G'ijduvon kabobi", region: "Buxoro" },
  { id: 'poi_food5', name: "Chinorlar Yo'l Bo'yi Choyxonasi", type: 'food', lat: 40.4000, lng: 69.2000, info: "Soyabo'yi so'rilari, ko'k choy va sho'rva", region: "Toshkent vil." },
  { id: 'poi_food6', name: "Qashqadaryo Qamashi Tandir Go'shti", type: 'food', lat: 38.8200, lng: 66.4500, info: "Archa novdasi bilan dimlangan tandir tansig'i", region: "Qashqadaryo" },
];

export default function InteractiveMap({
  userLocation = { lat: 41.311081, lng: 69.240562 },
  setUserLocation,
  listings = [],
  onClose,
  initialTarget = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const poiLayerRef = useRef(null);

  // ROUTE CALCULATOR STATE (A -> B)
  const [startPointId, setStartPointId] = useState('my-location');
  const [endPointId, setEndPointId] = useState(() => initialTarget?.id || 'samarkand');

  // Transport turlari: 'taxi' | 'train' | 'bus' | 'flight' | 'walk'
  const [selectedTransport, setSelectedTransport] = useState('taxi');

  // Haqiqiy OSRM yo'nalish ma'lumotlari
  const [routeGeometry, setRouteGeometry] = useState(null);
  const [realDistanceKm, setRealDistanceKm] = useState(null);
  const [realDurationMin, setRealDurationMin] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [showPoisOnMap, setShowPoisOnMap] = useState(true);
  const [selectedPoiInfo, setSelectedPoiInfo] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  // Barcha obyektlar: standart turizm obyektlari + haqiqiy backend e'lonlari
  const allDestinations = useMemo(() => {
    const list = [...TOURISM_OBJECTS];

    // Backend listings qo'shish (dacha, mehmonxona, restoran)
    (listings || []).forEach((item) => {
      if (item.lat && item.lng) {
        list.push({
          id: `listing_${item.id}`,
          name: item.title || item.name || item.carModel || 'Xizmat obyekti',
          category: item.serviceType || item.category || 'cottage',
          lat: Number(item.lat),
          lng: Number(item.lng),
          region: item.regionName || item.viloyat || "O'zbekiston",
          desc: item.description || item.address || '',
          price: item.price || '',
          image: item.image || item.images?.[0] || null,
        });
      }
    });

    return list;
  }, [listings]);

  // Initial target tanlangan bo'lsa
  useEffect(() => {
    if (initialTarget) {
      const match = allDestinations.find(
        (d) => d.id === initialTarget.id || (initialTarget.lat && Math.abs(d.lat - initialTarget.lat) < 0.001)
      );
      if (match) {
        setEndPointId(match.id);
      }
    }
  }, [initialTarget, allDestinations]);

  // A nuqta koordinatalari
  const startCoords = useMemo(() => {
    if (startPointId === 'my-location') {
      return {
        lat: userLocation?.lat || 41.311081,
        lng: userLocation?.lng || 69.240562,
        name: "Mening joylashuvim",
      };
    }
    const found = allDestinations.find((d) => d.id === startPointId);
    return found
      ? { lat: found.lat, lng: found.lng, name: found.name }
      : { lat: 41.311081, lng: 69.240562, name: "Toshkent shahri" };
  }, [startPointId, userLocation, allDestinations]);

  // B nuqta koordinatalari
  const endCoords = useMemo(() => {
    const found = allDestinations.find((d) => d.id === endPointId);
    return found
      ? { lat: found.lat, lng: found.lng, name: found.name, item: found }
      : { lat: 39.6542, lng: 66.9597, name: "Samarqand", item: allDestinations[1] };
  }, [endPointId, allDestinations]);

  // Haversine formulasi (fallback)
  const calculateHaversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Haqiqiy OSRM Yo'nalish so'rovi (Polyline, aniq masofa va vaqt)
  useEffect(() => {
    if (!startCoords?.lat || !endCoords?.lat) return;

    let isCancelled = false;
    setIsLoadingRoute(true);

    const fetchRoute = async () => {
      // 1-urinish: Public OSRM API (bepul, to'liq O'zbekiston trassalari)
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data.code === 'Ok' && data.routes?.[0]) {
            const route = data.routes[0];
            const latLngs = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
            const distKm = Math.round(route.distance / 1000);
            const durMin = Math.round(route.duration / 60);

            setRouteGeometry(latLngs);
            setRealDistanceKm(distKm);
            setRealDurationMin(durMin);
            setIsLoadingRoute(false);
            return;
          }
        }
      } catch (osrmErr) {
        console.warn('[InteractiveMap] OSRM fetch failed, trying backend API:', osrmErr.message);
      }

      // 2-urinish: Backend FastAPI /route/plan
      try {
        const backendData = await api.planRoute(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng);
        if (!isCancelled && backendData) {
          if (backendData.geometry?.length > 0) {
            setRouteGeometry(backendData.geometry.map((pt) => [pt.lat, pt.lng]));
          }
          if (backendData.distance_km) setRealDistanceKm(Math.round(backendData.distance_km));
          if (backendData.duration_min) setRealDurationMin(Math.round(backendData.duration_min));
          setIsLoadingRoute(false);
          return;
        }
      } catch (backErr) {
        console.warn('[InteractiveMap] Backend route failed, calculating straight road:', backErr.message);
      }

      // 3-urinish: Fallback (Haversine + magistral koeffitsienti)
      if (!isCancelled) {
        const directDist = calculateHaversineKm(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng);
        const estRoadKm = Math.round(directDist * 1.25);
        setRealDistanceKm(estRoadKm);
        setRealDurationMin(Math.round((estRoadKm / 75) * 60));

        // Oraliq nuqtali egri chiziq
        const midLat = (startCoords.lat + endCoords.lat) / 2;
        const midLng = (startCoords.lng + endCoords.lng) / 2;
        const offset = (startCoords.lng - endCoords.lng) * 0.05;
        setRouteGeometry([
          [startCoords.lat, startCoords.lng],
          [midLat + offset, midLng - offset],
          [endCoords.lat, endCoords.lng]
        ]);
        setIsLoadingRoute(false);
      }
    };

    fetchRoute();

    return () => {
      isCancelled = true;
    };
  }, [startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng]);

  // Dinamik Transport Statistikasi (Masofa, Vaqt, Xarajat)
  const routeStats = useMemo(() => {
    const roadKm = realDistanceKm || Math.round(calculateHaversineKm(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng) * 1.25);

    let durationMinutes = realDurationMin || Math.round((roadKm / 75) * 60);
    let costMin = 0;
    let costMax = 0;
    let transportTitle = "";
    let note = "";

    switch (selectedTransport) {
      case 'taxi':
        durationMinutes = realDurationMin || Math.round((roadKm / 75) * 60);
        costMin = Math.max(70000, Math.round((roadKm * 480) / 1000) * 1000);
        costMax = Math.max(120000, Math.round((roadKm * 680) / 1000) * 1000);
        transportTitle = "Taksi / Avtomobil (Cobalt, Gentra, BYD)";
        note = "Konditsionerli qulay avtomobil, to'g'ridan-to'g'ri manzilgacha eshikdan-eshikka yetkazish";
        break;

      case 'train':
        // Afrosiyob tezyurar poyezdi ~150 km/h
        durationMinutes = Math.round((roadKm / 140) * 60) + 20;
        costMin = 140000;
        costMax = 280000;
        transportTitle = "Poyezd (Afrosiyob / Sharq)";
        note = "Tezyurar, xavfsiz va konfortli temir yo'l qatnovi";
        break;

      case 'bus':
        // Express avtobus ~62 km/h
        durationMinutes = Math.round((roadKm / 60) * 60) + 30;
        costMin = 65000;
        costMax = 125000;
        transportTitle = "Express Avtobus";
        note = "Viloyatlararo zamonaviy katta sayohat avtobuslari";
        break;

      case 'flight':
        // Samolyot parvozi ~55 daqiqa
        durationMinutes = 55 + (roadKm > 600 ? 25 : 0);
        costMin = 420000;
        costMax = 780000;
        transportTitle = "Samolyot (Uzbekistan Airways / Silk Avia)";
        note = "Eng tezkor havo qatnovi, bortda ichimliklar taqdim etiladi";
        break;

      case 'walk':
      default:
        durationMinutes = Math.round((roadKm / 4.8) * 60);
        costMin = 0;
        costMax = 0;
        transportTitle = "Piyoda (Sarguzashtli trekking)";
        note = "Sog'lom turmush tarzi va tog' sayohati (Mutlaqo bepul)";
        break;
    }

    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    const timeFormatted = hours > 0 ? `${hours} soat ${mins > 0 ? `${mins} daqiqa` : ''}` : `${mins} daqiqa`;

    const costFormatted = costMin === 0
      ? "0 so'm (Bepul)"
      : `${costMin.toLocaleString()} – ${costMax.toLocaleString()} so'm`;

    return {
      distanceKm: roadKm,
      timeFormatted,
      costFormatted,
      transportTitle,
      note,
    };
  }, [startCoords, endCoords, selectedTransport, realDistanceKm, realDurationMin]);

  // Leaflet Xaritasini ishga tushirish (OpenStreetMap)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // O'zbekiston chegarasi
    const uzbekistanBounds = L.latLngBounds(
      L.latLng(36.5, 55.5),
      L.latLng(46.0, 74.0)
    );

    const map = L.map(mapContainerRef.current, {
      center: [40.5, 66.8],
      zoom: 7,
      minZoom: 6,
      maxZoom: 19,
      maxBounds: uzbekistanBounds,
      maxBoundsViscosity: 0.8,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap toza qatlamlari
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors • Tourly O\'zbekiston',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    poiLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Marshrut chizig'i (Polyline) va nuqtalarni yangilash
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    const markersLayer = markersLayerRef.current;

    routeLayer.clearLayers();
    markersLayer.clearLayers();

    // 1. A Nuqta (Boshlanish nuqtasi)
    const iconAHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center border-2 border-white shadow-xl text-xs">
          A
        </div>
      </div>
    `;
    const markerA = L.marker([startCoords.lat, startCoords.lng], {
      icon: L.divIcon({ html: iconAHtml, className: 'marker-point-a', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(markersLayer);
    markerA.bindPopup(`<strong>🟢 Qayerdan:</strong> ${startCoords.name}`);

    // 2. B Nuqta (Manzil obyekti)
    const iconBHtml = `
      <div class="relative flex items-center justify-center animate-bounce">
        <div class="w-8 h-8 rounded-full bg-rose-600 text-white font-black flex items-center justify-center border-2 border-white shadow-xl text-xs">
          B
        </div>
      </div>
    `;
    const markerB = L.marker([endCoords.lat, endCoords.lng], {
      icon: L.divIcon({ html: iconBHtml, className: 'marker-point-b', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(markersLayer);
    markerB.bindPopup(`<strong>🔴 Manzil:</strong> ${endCoords.name}`);

    // 3. Polyline chizig'i
    if (routeGeometry && routeGeometry.length > 0) {
      const transportColors = {
        taxi: '#2E5A27',
        train: '#0284C7',
        bus: '#D97706',
        flight: '#7C3AED',
        walk: '#059669',
      };

      const polyline = L.polyline(routeGeometry, {
        color: transportColors[selectedTransport] || '#2E5A27',
        weight: 6,
        opacity: 0.9,
        dashArray: selectedTransport === 'flight' ? '8, 12' : selectedTransport === 'walk' ? '4, 8' : undefined,
      }).addTo(routeLayer);

      map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 13 });
    }
  }, [startCoords, endCoords, selectedTransport, routeGeometry]);

  // Xaritada Obyektlar Markerlari (Dacha, Mehmonxona, Tarixiy maskanlar)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;

    allDestinations.forEach((item) => {
      // A va B nuqtalardan tashqari barcha obyektlarni maxsus marker bilan ko'rsatish
      if (
        (Math.abs(item.lat - startCoords.lat) < 0.001 && Math.abs(item.lng - startCoords.lng) < 0.001) ||
        (Math.abs(item.lat - endCoords.lat) < 0.001 && Math.abs(item.lng - endCoords.lng) < 0.001)
      ) {
        return;
      }

      let iconBg = '#38B0DC';
      let iconEmoji = '📍';

      if (item.category === 'cottage') {
        iconBg = '#0284C7';
        iconEmoji = '🏡';
      } else if (item.category === 'hotel') {
        iconBg = '#7C3AED';
        iconEmoji = '🏨';
      } else if (item.category === 'monument') {
        iconBg = '#D97706';
        iconEmoji = '🏛️';
      } else if (item.category === 'restaurant') {
        iconBg = '#EA580C';
        iconEmoji = '🍽️';
      }

      const markerHtml = `
        <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-xs cursor-pointer transition hover:scale-125" style="background-color: ${iconBg}; color: white;">
          ${iconEmoji}
        </div>
      `;

      const objMarker = L.marker([item.lat, item.lng], {
        icon: L.divIcon({ html: markerHtml, className: 'dest-custom-marker', iconSize: [28, 28], iconAnchor: [14, 14] })
      }).addTo(markersLayer);

      // Chiroyli Popup bilan "Ushbu manzilga marshrut" tugmasi
      const popupContent = document.createElement('div');
      popupContent.className = 'space-y-1.5 p-1 text-xs';
      popupContent.innerHTML = `
        <div class="font-bold text-gray-900 text-sm leading-tight">${item.name}</div>
        <div class="text-[11px] text-gray-500">${item.region}</div>
        ${item.price ? `<div class="text-[11px] font-extrabold text-[#2E5A27]">${item.price}</div>` : ''}
        ${item.desc ? `<div class="text-[10px] text-gray-600 line-clamp-2">${item.desc}</div>` : ''}
        <button id="btn-route-${item.id}" class="w-full mt-2 py-1.5 px-2 bg-[#2E5A27] text-white rounded-lg font-bold text-[11px] hover:bg-[#23451d] transition">
          🚗 Shu yergacha marshrut tuzish
        </button>
      `;

      objMarker.bindPopup(popupContent);

      objMarker.on('popupopen', () => {
        const btn = document.getElementById(`btn-route-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            setEndPointId(item.id);
            objMarker.closePopup();
          };
        }
      });
    });
  }, [allDestinations, startCoords, endCoords]);

  // Trassa POI markerlari (Benzin, Metan, Oshxona)
  useEffect(() => {
    if (!mapInstanceRef.current || !poiLayerRef.current) return;
    const poiLayer = poiLayerRef.current;
    poiLayer.clearLayers();

    if (!showPoisOnMap) return;

    ROUTE_POIS.forEach((poi) => {
      let iconColor = '#F59E0B';
      let iconSvg = '⛽';

      if (poi.type === 'food') {
        iconColor = '#EA580C';
        iconSvg = '🍲';
      } else if (poi.type === 'hotel') {
        iconColor = '#8B5CF6';
        iconSvg = '🏨';
      }

      const poiHtml = `
        <div class="w-6 h-6 rounded-full flex items-center justify-center shadow-md border border-white text-[10px] cursor-pointer transition hover:scale-125" style="background-color: ${iconColor}; color: white;">
          ${iconSvg}
        </div>
      `;

      const marker = L.marker([poi.lat, poi.lng], {
        icon: L.divIcon({ html: poiHtml, className: 'poi-custom-marker', iconSize: [24, 24], iconAnchor: [12, 12] })
      }).addTo(poiLayer);

      marker.on('click', () => {
        setSelectedPoiInfo(poi);
      });
    });
  }, [showPoisOnMap]);

  // Geolocation API ("Mening joylashuvim" handler)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation?.(coords);
        setStartPointId('my-location');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 13, { duration: 1.5 });
        }
      },
      (err) => {
        setIsLocating(false);
        alert("Joylashuv aniqlanmadi. Toshkent shahri markazi tanlandi.");
        setStartPointId('tashkent-city');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Nuqtalarni almashtirish (A <-> B)
  const handleSwapPoints = () => {
    const prevStart = startPointId;
    const prevEnd = endPointId;
    if (prevStart === 'my-location') {
      setStartPointId(prevEnd);
      setEndPointId('tashkent-city');
    } else {
      setStartPointId(prevEnd);
      setEndPointId(prevStart);
    }
  };

  // Qidiruv bo'yicha saralangan manzil obyektlari
  const filteredDestinations = useMemo(() => {
    if (!searchFilter.trim()) return allDestinations;
    const q = searchFilter.toLowerCase();
    return allDestinations.filter(
      (d) => d.name.toLowerCase().includes(q) || d.region.toLowerCase().includes(q) || (d.desc && d.desc.toLowerCase().includes(q))
    );
  }, [allDestinations, searchFilter]);

  return (
    <div className="relative w-full h-[calc(100vh-110px)] min-h-[580px] max-w-7xl mx-auto px-2 sm:px-6 py-2">
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card border border-white/80 shadow-2xl flex flex-col md:flex-row">
        
        {/* CHAP BOSHQARUV PANELI: MARSHRUT VA OBYEKTLAR KALKULYATORI */}
        <div className="w-full md:w-96 bg-white/95 backdrop-blur-xl border-r border-gray-200 z-30 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto max-h-[48vh] md:max-h-full shadow-lg md:shadow-none">
          
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2E5A27]/10 text-[#2E5A27] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                    Haqiqiy Marshrut & Navigatsiya
                  </h2>
                  <p className="text-[10px] text-gray-500">Dacha, mehmonxona va tur obyektlariga yo'l</p>
                </div>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition"
                  title="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* A -> B Selector Maydonlari */}
            <div className="space-y-2.5 relative">
              
              {/* 1. Nuqta A (Qayerdan) */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>🟢 Qayerdan (A nuqta):</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="text-[10px] text-[#2E5A27] hover:underline flex items-center gap-1 font-semibold transition active:scale-95"
                  >
                    <Locate className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? "Aniqlanmoqda..." : "Mening joylashuvim"}</span>
                  </button>
                </label>
                <select
                  value={startPointId}
                  onChange={(e) => setStartPointId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2E5A27]"
                >
                  <option value="my-location">📍 Mening hozirgi joylashuvim (GPS)</option>
                  <optgroup label="Turistik Hududlar va Shaharlar">
                    {allDestinations.map((dest) => (
                      <option key={`start_${dest.id}`} value={dest.id}>
                        {dest.name} ({dest.region})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Almashtirish (Swap) tugmasi */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwapPoints}
                  className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 flex items-center justify-center transition active:scale-90"
                  title="Yo'nalishni almashtirish"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
                </button>
              </div>

              {/* 2. Nuqta B (Qayerga) */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>🔴 Qayerga (B nuqta):</span>
                  <span className="text-[10px] text-gray-400 font-normal">Dacha, mehmonxona, shahar</span>
                </label>
                <select
                  value={endPointId}
                  onChange={(e) => setEndPointId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2E5A27]"
                >
                  <optgroup label="Tanlangan Dam Olish & Tur Obyektlari">
                    {allDestinations.map((dest) => (
                      <option key={`end_${dest.id}`} value={dest.id}>
                        {dest.category === 'cottage' ? '🏡 ' : dest.category === 'hotel' ? '🏨 ' : dest.category === 'monument' ? '🏛️ ' : '📍 '}
                        {dest.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

            </div>

            {/* 3. Transport Turlari (5 ta Tur) */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                Transport Turini Tanlang:
              </label>
              <div className="grid grid-cols-5 gap-1.5 bg-gray-100 p-1 rounded-2xl border border-gray-200">
                {[
                  { id: 'taxi', label: 'Taksi', icon: Car },
                  { id: 'train', label: 'Poyezd', icon: Train },
                  { id: 'bus', label: 'Avtobus', icon: Bus },
                  { id: 'flight', label: 'Samolyot', icon: Plane },
                  { id: 'walk', label: 'Piyoda', icon: Footprints },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = selectedTransport === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedTransport(item.id)}
                      className={`flex flex-col items-center justify-center py-2 rounded-xl transition ${
                        active
                          ? 'bg-[#2E5A27] text-white shadow font-bold'
                          : 'text-gray-600 hover:text-gray-900 font-medium'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] mt-0.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Dinamik Marshrut Natijalari (Masofa, Vaqt, Xarajat) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl p-3.5 border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
                <span className="text-xs font-bold text-emerald-950 truncate max-w-[200px]">
                  {routeStats.transportTitle}
                </span>
                <span className="text-xs font-extrabold text-[#2E5A27] bg-white px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                  {isLoadingRoute && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                  {routeStats.distanceKm} km
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">Yetib borish vaqti:</span>
                  <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {routeStats.timeFormatted}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">Taxminiy yo'l haqi:</span>
                  <span className="font-extrabold text-[#2E5A27] block mt-0.5 text-[11px] truncate">
                    {routeStats.costFormatted}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-emerald-900/80 bg-white/50 p-2 rounded-xl italic leading-relaxed">
                ℹ️ {routeStats.note}
              </p>
            </div>

            {/* POI filtrlari */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-semibold text-[11px]">
                <input
                  type="checkbox"
                  checked={showPoisOnMap}
                  onChange={(e) => setShowPoisOnMap(e.target.checked)}
                  className="rounded text-[#2E5A27] focus:ring-[#2E5A27]"
                />
                <span>Trassa to'xtash joylari (Benzin / Oshxona)</span>
              </label>
            </div>

          </div>

          {/* Pastki Yandex Maps bilan ochish havolasi */}
          <div className="pt-3 border-t border-gray-100 mt-2">
            <a
              href={`https://yandex.com/maps/?rtext=${startCoords.lat},${startCoords.lng}~${endCoords.lat},${endCoords.lng}&rtt=auto`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
              <span>Yandex Navigatorda ochish ↗</span>
            </a>
          </div>

        </div>

        {/* O'NG TOMON: HAQIQIY TO'LIQ EKRAIN LEAFLET XARITASI */}
        <div className="relative flex-1 w-full h-full min-h-[350px]">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* O'ng yuqori qismdagi xarita holati tegi */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 pointer-events-none">
            <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-gray-200 shadow-md text-xs font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>OpenStreetMap • O'zbekiston</span>
            </div>
          </div>

          {/* Tanlangan POI modal / tafsilot oynasi */}
          {selectedPoiInfo && (
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-xl animate-in fade-in slide-in-from-bottom-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {selectedPoiInfo.type === 'food' ? '🍲 Oshxona' : selectedPoiInfo.type === 'hotel' ? '🏨 Motel' : '⛽ Yoqilg\'i shoxobchasi'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPoiInfo(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h4 className="font-extrabold text-sm text-gray-900">{selectedPoiInfo.name}</h4>
              <p className="text-xs text-gray-600">{selectedPoiInfo.info}</p>
              <div className="text-[11px] text-gray-500">📍 {selectedPoiInfo.region}</div>
              <button
                type="button"
                onClick={() => {
                  setEndPointId(selectedPoiInfo.id);
                  setSelectedPoiInfo(null);
                }}
                className="w-full mt-2 py-1.5 bg-[#2E5A27] text-white text-xs font-bold rounded-xl hover:bg-[#23451d] transition"
              >
                Ushbu to'xtash joyiga marshrut chizish
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
