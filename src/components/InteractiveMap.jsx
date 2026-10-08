import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  Navigation, MapPin, Locate, ExternalLink, Clock, Car, Compass,
  UtensilsCrossed, Hotel, Sparkles, X, ChevronRight, Fuel,
  Train, Bus, Plane, Footprints, ArrowRightLeft, Layers, Info
} from 'lucide-react';
import { api } from '../services/api';

// O'zbekistonning barcha viloyatlari va asosiy turistik shaharlari
export const UZBEKISTAN_DESTINATIONS = [
  { id: 'tashkent-city', name: 'Toshkent shahri (Markaz)', lat: 41.311081, lng: 69.240562, region: 'Toshkent shahri', isAirport: true, isTrain: true },
  { id: 'tashkent-region', name: 'Toshkent viloyati (Chorvoq / Chimyon / Amirsoy)', lat: 41.5360, lng: 70.0150, region: 'Toshkent viloyati', isAirport: false, isTrain: false },
  { id: 'samarkand', name: 'Samarqand shahri (Registon / Shohi Zinda)', lat: 39.6542, lng: 66.9597, region: 'Samarqand', isAirport: true, isTrain: true },
  { id: 'bukhara', name: 'Buxoro shahri (Ark / Labi Hovuz / Kalon)', lat: 39.7747, lng: 64.4286, region: 'Buxoro', isAirport: true, isTrain: true },
  { id: 'khiva', name: 'Xiva shahri (Ichan Qal\'a)', lat: 41.3783, lng: 60.3639, region: 'Xorazm', isAirport: false, isTrain: true },
  { id: 'urganch', name: 'Urganch shahri (Aeroport / Vokzal)', lat: 41.5562, lng: 60.6314, region: 'Xorazm', isAirport: true, isTrain: true },
  { id: 'zomin', name: 'Jizzax — Zomin Milliy Bog\'i (Archazor)', lat: 39.9606, lng: 68.4950, region: 'Jizzax', isAirport: false, isTrain: false },
  { id: 'jizzakh-city', name: 'Jizzax shahri', lat: 40.1250, lng: 67.8808, region: 'Jizzax', isAirport: false, isTrain: true },
  { id: 'moynaq', name: 'Mo\'ynoq (Orol Dengizi / Kemalar Qabristoni)', lat: 43.7683, lng: 59.0214, region: 'Qoraqalpog\'iston', isAirport: false, isTrain: false },
  { id: 'nukus', name: 'Nukus shahri (Savitskiy Muzeyi)', lat: 42.4602, lng: 59.6053, region: 'Qoraqalpog\'iston', isAirport: true, isTrain: true },
  { id: 'shahrisabz', name: 'Shahrisabz shahri (Oqsaroy)', lat: 39.0560, lng: 66.8335, region: 'Qashqadaryo', isAirport: false, isTrain: true },
  { id: 'qarshi', name: 'Qarshi shahri', lat: 38.8606, lng: 65.7891, region: 'Qashqadaryo', isAirport: true, isTrain: true },
  { id: 'termiz', name: 'Termiz shahri (Hakim at-Termiziy)', lat: 37.2242, lng: 67.2783, region: 'Surxondaryo', isAirport: true, isTrain: true },
  { id: 'boysun', name: 'Boysun & Omonxona Shifobaxsh Maskani', lat: 38.2045, lng: 67.2012, region: 'Surxondaryo', isAirport: false, isTrain: false },
  { id: 'fergana', name: 'Farg\'ona shahri', lat: 40.3842, lng: 71.7843, region: 'Farg\'ona', isAirport: true, isTrain: true },
  { id: 'margilan', name: 'Marg\'ilon (Yodgorlik Ipakchilik)', lat: 40.4725, lng: 71.7186, region: 'Farg\'ona', isAirport: false, isTrain: true },
  { id: 'kokand', name: 'Qo\'qon shahri (Xudoyorxon O\'rdasi)', lat: 40.5286, lng: 70.9425, region: 'Farg\'ona', isAirport: false, isTrain: true },
  { id: 'andijan', name: 'Andijon shahri (Bobur Xiyoboni)', lat: 40.7821, lng: 72.3442, region: 'Andijon', isAirport: true, isTrain: true },
  { id: 'namangan', name: 'Namangan shahri (Afsonalar Vodiysi / Chortoq)', lat: 40.9983, lng: 71.6726, region: 'Namangan', isAirport: true, isTrain: true },
  { id: 'navoiy', name: 'Navoiy shahri & Nurota Chashma', lat: 40.0844, lng: 65.3792, region: 'Navoiy', isAirport: true, isTrain: true },
  { id: 'guliston', name: 'Sirdaryo (Guliston shahri)', lat: 40.4983, lng: 68.7833, region: 'Sirdaryo', isAirport: false, isTrain: true },
];

// Yo'l ustidagi POI lar: Oshxonalar, Mehmonxonalar, Yoqilg'i quyish shoxobchalari
export const ROUTE_POIS = [
  // Yoqilg'i quyish (Fuel)
  { id: 'poi_f1', name: "UNG Petro AI-95/92 Zapravka", type: 'fuel', subtype: 'benzin', lat: 40.8500, lng: 68.6200, info: "Benzin, Dizel, Do'kon va Kafe", region: "Sirdaryo" },
  { id: 'poi_f2', name: "M-39 Mustaqillik Metan Gaz (CNG)", type: 'fuel', subtype: 'metan', lat: 40.2500, lng: 67.8500, info: "24/7 Metan Gaz, 220 bar, Avtoyuvish", region: "Jizzax" },
  { id: 'poi_f3', name: "TokBor EV Tezkor Zaryadlash Stansiyasi", type: 'fuel', subtype: 'ev', lat: 39.8500, lng: 67.2500, info: "Elektromobillar uchun 120kW tezkor zaryad", region: "Samarqand" },
  { id: 'poi_f4', name: "Lukoil Qiziltepa Zapravkasi", type: 'fuel', subtype: 'benzin', lat: 40.0300, lng: 64.8500, info: "Evro-5 benzin va dam olish maydoni", region: "Navoiy" },
  { id: 'poi_f5', name: "Buxoro-Urganch Trassa Metan Gaz", type: 'fuel', subtype: 'metan', lat: 40.6500, lng: 62.4500, info: "A-380 trassa bo'yidagi yirik metan stansiya", region: "Buxoro" },
  { id: 'poi_f6', name: "Qamchiq Dovoni UNG Petro", type: 'fuel', subtype: 'benzin', lat: 41.1500, lng: 70.5500, info: "Dovon boshida yuqori sifatli yoqilg'i", region: "Toshkent vil." },

  // Oshxonalar (Food)
  { id: 'poi_food1', name: "Jizzax Mashhur Qarsildoq Somsaxonasi", type: 'food', lat: 40.1100, lng: 67.8400, info: "Tandirdan uzilgan go'shtli Jizzax somsasi", region: "Jizzax" },
  { id: 'poi_food2', name: "Sirdaryo Daryobo'yi Baliqxonasi", type: 'food', lat: 40.5200, lng: 68.7500, info: "Tandir va qovurilgan yangi daryo baliqlari", region: "Sirdaryo" },
  { id: 'poi_food3', name: "Samarqand Zarafshon Palov Markazi", type: 'food', lat: 39.6600, lng: 66.9400, info: "Zig'ir moyli afsonaviy Samarqand to'y oshi", region: "Samarqand" },
  { id: 'poi_food4', name: "G'ijduvon Shavkat Shashlik Markazi", type: 'food', lat: 40.1000, lng: 64.6700, info: "Mashhur qiyma va bo'lakli G'ijduvon kabobi", region: "Buxoro" },
  { id: 'poi_food5', name: "Chinorlar Yo'l Bo'yi Choyxonasi", type: 'food', lat: 40.4000, lng: 69.2000, info: "Soyabo'yi so'rilari, ko'k choy va sho'rva", region: "Toshkent vil." },
  { id: 'poi_food6', name: "Qashqadaryo Qamashi Tandir Go'shti", type: 'food', lat: 38.8200, lng: 66.4500, info: "Archa novdasi bilan dimlangan tandir tansig'i", region: "Qashqadaryo" },

  // Mehmonxonalar / Motellar (Hotel)
  { id: 'poi_h1', name: "M-39 Silk Road Trassa Moteli", type: 'hotel', lat: 40.1800, lng: 67.7500, info: "Dush, konditsioner, xavfsiz avtoturargoh", region: "Jizzax" },
  { id: 'poi_h2', name: "Karvonsaroy Roadside Oasis", type: 'hotel', lat: 39.8000, lng: 65.5000, info: "Sayyohlar uchun shinam xonalar va nonushta", region: "Navoiy" },
  { id: 'poi_h3', name: "Qamchiq Alpine Rest & Hotel", type: 'hotel', lat: 41.2200, lng: 70.7200, info: "Tog' manzarasi, issiq sauna va hordiq", region: "Toshkent vil." },
  { id: 'poi_h4', name: "A-380 Qizilqum Karvonboshi Oromgohi", type: 'hotel', lat: 41.0500, lng: 61.8000, info: "Sahro o'rtasidagi zamonaviy voha moteli", region: "Xorazm yo'li" },
];

export default function InteractiveMap({
  userLocation = { lat: 41.311081, lng: 69.240562 },
  setUserLocation,
  onClose,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const poiLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  // ROUTE CALCULATOR STATE (A -> B)
  // 1-tanlov (Qayerdan): 'my-location' | destinationId
  const [startPointId, setStartPointId] = useState('my-location');
  // 2-tanlov (Qayerga): destinationId (default Samarqand)
  const [endPointId, setEndPointId] = useState('samarkand');

  // Transport turlari (5 ta tur)
  // 'taxi' | 'train' | 'bus' | 'flight' | 'walk'
  const [selectedTransport, setSelectedTransport] = useState('taxi');

  // Active calculate result
  const [calculatedRoute, setCalculatedRoute] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showPoisOnMap, setShowPoisOnMap] = useState(true);
  const [selectedPoiInfo, setSelectedPoiInfo] = useState(null);
  const [backendRouteData, setBackendRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Fetch real route plan from FastAPI backend (/route/plan)
  useEffect(() => {
    if (!startCoords?.lat || !endCoords?.lat) return;
    let isCancelled = false;
    setIsLoadingRoute(true);

    api.planRoute(startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng)
      .then((data) => {
        if (!isCancelled && data) {
          setBackendRouteData(data);
        }
      })
      .catch((err) => {
        console.warn('[InteractiveMap] planRoute backend call failed:', err.message);
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingRoute(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [startCoords.lat, startCoords.lng, endCoords.lat, endCoords.lng]);

  // Haversine masofa formulasi (km)
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

  // Get resolved coordinates for Start and End
  const startCoords = useMemo(() => {
    if (startPointId === 'my-location') {
      return {
        lat: userLocation?.lat || 41.311081,
        lng: userLocation?.lng || 69.240562,
        name: "Mening joylashuvim",
      };
    }
    const found = UZBEKISTAN_DESTINATIONS.find((d) => d.id === startPointId);
    return found ? { lat: found.lat, lng: found.lng, name: found.name } : { lat: 41.311081, lng: 69.240562, name: "Toshkent" };
  }, [startPointId, userLocation]);

  const endCoords = useMemo(() => {
    const found = UZBEKISTAN_DESTINATIONS.find((d) => d.id === endPointId);
    return found ? { lat: found.lat, lng: found.lng, name: found.name } : { lat: 39.6542, lng: 66.9597, name: "Samarqand" };
  }, [endPointId]);

  // Dynamic Transport Calculation Logic
  const routeStats = useMemo(() => {
    const straightDist = calculateHaversineKm(
      startCoords.lat,
      startCoords.lng,
      endCoords.lat,
      endCoords.lng
    );

    // Trassa masofasi: agar backenddan kelgan bo'lsa, haqiqiy OSRM masofasini olamiz
    const roadKm = backendRouteData?.distance_km
      ? Math.round(backendRouteData.distance_km)
      : Math.round(straightDist * 1.22);

    let durationHours = 0;
    let costMin = 0;
    let costMax = 0;
    let transportTitle = "";
    let note = "";

    switch (selectedTransport) {
      case 'taxi':
        // Agar backenddan OSRM vaqti kelgan bo'lsa
        durationHours = backendRouteData?.duration_min
          ? backendRouteData.duration_min / 60
          : roadKm / 75;
        costMin = Math.max(70000, Math.round((roadKm * 450) / 1000) * 1000);
        costMax = Math.max(120000, Math.round((roadKm * 650) / 1000) * 1000);
        transportTitle = "Taksi / Mashina (Cobalt, Gentra, BYD)";
        note = "Konditsionerli qulay avtomobil, manzilgacha eshikdan-eshikka yetkazish";
        break;

      case 'train':
        // Afrosiyob tezyurar poyezdi ~160 km/h
        durationHours = roadKm / 145;
        costMin = 140000;
        costMax = 280000;
        transportTitle = "Poyezd (Afrosiyob / Sharq)";
        note = "Tezyurar, xavfsiz va konfortli temir yo'l qatnovi";
        break;

      case 'bus':
        // Express avtobus ~62 km/h
        durationHours = roadKm / 62;
        costMin = 65000;
        costMax = 125000;
        transportTitle = "Express Avtobus";
        note = "Viloyatlararo zamonaviy katta sayohat avtobuslari";
        break;

      case 'flight':
        // Samolyot parvozi ~50 daqiqa (0.85 soat)
        durationHours = 0.85 + (roadKm > 600 ? 0.35 : 0);
        costMin = 420000;
        costMax = 780000;
        transportTitle = "Samolyot (Uzbekistan Airways / Silk Avia)";
        note = "Eng tezkor havo qatnovi, bortda ichimliklar taqdim etiladi";
        break;

      case 'walk':
      default:
        // Piyoda ~4.8 km/soat
        durationHours = roadKm / 4.8;
        costMin = 0;
        costMax = 0;
        transportTitle = "Piyoda (Sarguzashtli trekking)";
        note = "Sog'lom hayot, sayohat va tog' trekkingi (Mutlaqo bepul)";
        break;
    }

    const totalMinutes = Math.round(durationHours * 60);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
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
  }, [startCoords, endCoords, selectedTransport, backendRouteData]);

  // Initialize Leaflet Map (Faqat O'zbekiston hududi)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // O'zbekiston markazi
    const uzbekistanBounds = L.latLngBounds(
      L.latLng(36.8, 55.8), // Janubiy-G'arbiy burchak
      L.latLng(45.8, 73.5)  // Shimoliy-Sharqiy burchak
    );

    const map = L.map(mapContainerRef.current, {
      center: [40.8, 66.5],
      zoom: 7,
      minZoom: 6,
      maxZoom: 18,
      maxBounds: uzbekistanBounds,
      maxBoundsViscosity: 0.8,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // OpenStreetMap Clean Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors • Tourly Uzbekistan',
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

  // Update Route and Markers on Selection Change
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    const markersLayer = markersLayerRef.current;

    routeLayer.clearLayers();
    markersLayer.clearLayers();

    // 1. Marker A (Start)
    const iconAHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center border-2 border-white shadow-xl text-xs">
          A
        </div>
      </div>
    `;
    const markerA = L.marker([startCoords.lat, startCoords.lng], {
      icon: L.divIcon({ html: iconAHtml, className: 'marker-point-a', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(markersLayer);
    markerA.bindPopup(`<strong>Qayerdan:</strong> ${startCoords.name}`);

    // 2. Marker B (End)
    const iconBHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center border-2 border-white shadow-xl text-xs">
          B
        </div>
      </div>
    `;
    const markerB = L.marker([endCoords.lat, endCoords.lng], {
      icon: L.divIcon({ html: iconBHtml, className: 'marker-point-b', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(markersLayer);
    markerB.bindPopup(`<strong>Qayerga:</strong> ${endCoords.name}`);

    // 3. Draw Route Path (Real geometry from FastAPI OSRM service if available)
    let polylineCoords;
    if (backendRouteData?.geometry && backendRouteData.geometry.length > 0) {
      polylineCoords = backendRouteData.geometry.map((pt) => [pt.lat, pt.lng]);
    } else {
      const midLat = (startCoords.lat + endCoords.lat) / 2;
      const midLng = (startCoords.lng + endCoords.lng) / 2;
      const offset = (startCoords.lng - endCoords.lng) * 0.05;
      const intermediatePoint = [midLat + offset, midLng - offset];
      polylineCoords = [
        [startCoords.lat, startCoords.lng],
        intermediatePoint,
        [endCoords.lat, endCoords.lng],
      ];
    }

    const transportColors = {
      taxi: '#2E5A27',
      train: '#0284C7',
      bus: '#D97706',
      flight: '#7C3AED',
      walk: '#059669',
    };

    const polyline = L.polyline(polylineCoords, {
      color: transportColors[selectedTransport] || '#2E5A27',
      weight: 5,
      opacity: 0.85,
      dashArray: selectedTransport === 'flight' ? '8, 12' : selectedTransport === 'walk' ? '4, 8' : undefined,
    }).addTo(routeLayer);

    map.fitBounds(polyline.getBounds(), { padding: [60, 60], maxZoom: 12 });
  }, [startCoords, endCoords, selectedTransport, backendRouteData]);

  // Render Route POIs (Haqiqiy FastAPI Overpass fuel_stops & food_stops)
  useEffect(() => {
    if (!mapInstanceRef.current || !poiLayerRef.current) return;
    const poiLayer = poiLayerRef.current;
    poiLayer.clearLayers();

    if (!showPoisOnMap) return;

    // Collect real backend POIs or fallback to pre-defined POIs
    const poisToDisplay = [];
    if (backendRouteData?.fuel_stops?.length > 0 || backendRouteData?.food_stops?.length > 0) {
      if (backendRouteData.fuel_stops) {
        backendRouteData.fuel_stops.forEach((p, idx) => {
          poisToDisplay.push({
            id: `fuel_${idx}`,
            name: p.name || "Yoqilg'i quyish shaxobchasi",
            type: 'fuel',
            lat: p.lat,
            lng: p.lng,
            info: "Yo'l bo'yidagi OSRM / Overpass yoqilg'i shoxobchasi",
            region: "Magistral trassa",
          });
        });
      }
      if (backendRouteData.food_stops) {
        backendRouteData.food_stops.forEach((p, idx) => {
          poisToDisplay.push({
            id: `food_${idx}`,
            name: p.name || "Yo'l bo'yi oshxonasi",
            type: 'food',
            lat: p.lat,
            lng: p.lng,
            info: "Yo'l bo'yidagi OSRM / Overpass oshxona va kafelari",
            region: "Magistral trassa",
          });
        });
      }
    } else {
      poisToDisplay.push(...ROUTE_POIS);
    }

    poisToDisplay.forEach((poi) => {
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
        <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-xs cursor-pointer transition hover:scale-125" style="background-color: ${iconColor}; color: white;">
          ${iconSvg}
        </div>
      `;

      const marker = L.marker([poi.lat, poi.lng], {
        icon: L.divIcon({ html: poiHtml, className: 'poi-custom-marker', iconSize: [28, 28], iconAnchor: [14, 14] })
      }).addTo(poiLayer);

      marker.on('click', () => {
        setSelectedPoiInfo(poi);
      });
    });
  }, [showPoisOnMap, backendRouteData]);

  // "Mening joylashuvim" geolocation handler
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
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 12);
        }
      },
      (err) => {
        setIsLocating(false);
        alert("Joylashuv ruxsati berilmadi. Toshkent shahri tanlandi.");
        setStartPointId('tashkent-city');
      },
      { timeout: 8000 }
    );
  };

  // Swap Points A <-> B
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

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[600px] max-w-7xl mx-auto px-2 sm:px-6 py-2">
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card border border-white/80 shadow-2xl flex flex-col md:flex-row">
        
        {/* LEFT CONTROL PANEL: ROUTE CALCULATOR (A -> B) */}
        <div className="w-full md:w-96 bg-white/95 backdrop-blur-xl border-r border-gray-200 z-30 flex flex-col justify-between p-4 sm:p-5 overflow-y-auto max-h-[50vh] md:max-h-full shadow-lg md:shadow-none">
          
          <div className="space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#2E5A27]/10 text-[#2E5A27] flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-gray-900 leading-tight">
                    O'zbekiston Marshrut Kalkulyatori
                  </h2>
                  <p className="text-[10px] text-gray-500">A nuqtadan B nuqtaga yo'l va xarajat</p>
                </div>
              </div>
            </div>

            {/* A -> B Selector Fields */}
            <div className="space-y-2.5 relative">
              
              {/* 1. Point A (Qayerdan) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>🟢 Qayerdan (A nuqta):</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isLocating}
                    className="text-[10px] text-[#2E5A27] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Locate className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>Mening joylashuvim</span>
                  </button>
                </label>
                <select
                  value={startPointId}
                  onChange={(e) => setStartPointId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2E5A27]"
                >
                  <option value="my-location">📍 Mening hozirgi joylashuvim (GPS)</option>
                  <optgroup label="O'zbekiston Viloyatlari & Shaharlari">
                    {UZBEKISTAN_DESTINATIONS.map((dest) => (
                      <option key={`start_${dest.id}`} value={dest.id}>
                        {dest.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Swap Button */}
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

              {/* 2. Point B (Qayerga) */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  🔴 Qayerga (B nuqta):
                </label>
                <select
                  value={endPointId}
                  onChange={(e) => setEndPointId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-900 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2E5A27]"
                >
                  {UZBEKISTAN_DESTINATIONS.map((dest) => (
                    <option key={`end_${dest.id}`} value={dest.id}>
                      {dest.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* 3. Transport Type Selector (5 Types) */}
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

            {/* 4. Calculated Stats Card (Dinamik natija) */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 rounded-2xl p-3.5 border border-emerald-200/80 space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200/60">
                <span className="text-xs font-bold text-emerald-950">
                  {routeStats.transportTitle}
                </span>
                <span className="text-xs font-extrabold text-[#2E5A27] bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                  {routeStats.distanceKm} km
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">Ketadigan vaqt:</span>
                  <span className="font-extrabold text-gray-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    {routeStats.timeFormatted}
                  </span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-gray-500 block">O'rtacha xarajat:</span>
                  <span className="font-extrabold text-[#2E5A27] block mt-0.5 text-[11px] truncate">
                    {routeStats.costFormatted}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-emerald-800 leading-tight">
                💡 {routeStats.note}
              </p>
            </div>

            {/* POI Filter Toggles (Yoqilg'i, Oshxona, Mehmonxona) */}
            <div className="pt-1 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-[#2E5A27]" />
                Yo'l ustidagi xizmatlar:
              </span>
              <button
                type="button"
                onClick={() => setShowPoisOnMap(!showPoisOnMap)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition ${
                  showPoisOnMap
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {showPoisOnMap ? "Ko'rinmoqda ✓" : "Yashirilgan"}
              </button>
            </div>

            {/* POI Legend */}
            {showPoisOnMap && (
              <div className="flex items-center gap-3 text-[10px] text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> ⛽ Yoqilg'i
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-600" /> 🍲 Oshxona
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-600" /> 🏨 Mehmonxona
                </span>
              </div>
            )}

          </div>

          {/* External Navigation Link */}
          <div className="pt-3 border-t border-gray-100">
            <a
              href={`https://yandex.com/maps/?rtext=${startCoords.lat},${startCoords.lng}~${endCoords.lat},${endCoords.lng}&rtt=auto`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Yandex Navigator orqali ochish</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>

        </div>

        {/* RIGHT MAP DISPLAY AREA */}
        <div className="relative flex-1 h-full min-h-[350px]">
          {/* Leaflet container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Selected POI Popup Banner */}
          {selectedPoiInfo && (
            <div className="absolute top-4 right-4 z-20 max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start justify-between pb-1 border-b border-gray-100">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                  {selectedPoiInfo.type === 'fuel' ? '⛽ Yoqilg\'i shoxobchasi' : selectedPoiInfo.type === 'food' ? '🍲 Milliy Oshxona' : '🏨 Mehmonxona'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPoiInfo(null)}
                  className="w-5 h-5 rounded-full text-gray-400 hover:text-gray-700 flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="font-bold text-xs text-gray-900 mt-1.5">
                {selectedPoiInfo.name}
              </h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{selectedPoiInfo.info}</p>
              <p className="text-[10px] text-[#2E5A27] font-semibold mt-1">📍 {selectedPoiInfo.region}</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
