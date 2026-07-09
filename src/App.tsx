import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Trophy, Compass, Check, Send, User, Mail, MessageSquare, Cpu, ArrowDown, Menu, X } from 'lucide-react';
import CyberButton from './components/CyberButton';
import { SectionType } from './types';
import Hls from 'hls.js';

interface HlsVideoProps {
  src: string;
  className?: string;
}

function HlsVideo({ src, className }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch((err) => console.log('HLS play error:', err));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch((err) => console.log('Native HLS play error:', err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      loop
      muted
      playsInline
      autoPlay
    />
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionType>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flickerKey, setFlickerKey] = useState(0);

  // Contact state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const isEngineeringProfileActive = ['about', 'projects', 'contact'].includes(activeSection);

  // Hero video playlist states
  const heroVideos = [
    "https://dl.dropboxusercontent.com/scl/fi/byfkjs59zggrxvn9u9p0n/CAPCUT-PRVI-VIDEO-v2-16-9.mp4?rlkey=kfy78t3ttghmhcnmkbmgairh3&st=0jh7faq0&dl=1",
    "https://dl.dropboxusercontent.com/scl/fi/r0o4i91ugkuaox2am1w1i/CAPCUT-DRUGI-VIDEO-v2-16-9.mp4?rlkey=756huq0dy5z5wj7ko4v3f1p68&st=zntzp78y&dl=1"
  ];
  const [currentHeroVideoIdx, setCurrentHeroVideoIdx] = useState(0);
  const [video1Opacity, setVideo1Opacity] = useState('opacity-70 md:opacity-80');
  const [video2Opacity, setVideo2Opacity] = useState('opacity-0');
  const [video1Z, setVideo1Z] = useState('z-10');
  const [video2Z, setVideo2Z] = useState('z-0');

  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transitioningRef = useRef(false);

  const triggerTransitionToVideo2 = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (videoRef2.current) {
      videoRef2.current.currentTime = 0;
      videoRef2.current.play().catch(e => console.log("videoRef2 play error:", e));
    }

    // Put Video 2 on top, keep Video 1 underneath but fully visible
    setVideo2Z('z-10');
    setVideo1Z('z-0');
    setVideo1Opacity('opacity-70 md:opacity-80');

    // Fade Video 2 in
    setVideo2Opacity('opacity-70 md:opacity-80');

    // After 200ms transition completes, hide and pause Video 1
    timeoutRef.current = setTimeout(() => {
      if (videoRef1.current) {
        videoRef1.current.pause();
      }
      setVideo1Opacity('opacity-0');
      setCurrentHeroVideoIdx(1);
      transitioningRef.current = false;
    }, 200);
  };

  const triggerTransitionToVideo1 = () => {
    if (transitioningRef.current) return;
    transitioningRef.current = true;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (videoRef1.current) {
      videoRef1.current.currentTime = 0;
      videoRef1.current.play().catch(e => console.log("videoRef1 play error:", e));
    }

    // Put Video 1 on top, keep Video 2 underneath but fully visible
    setVideo1Z('z-10');
    setVideo2Z('z-0');
    setVideo2Opacity('opacity-70 md:opacity-80');

    // Fade Video 1 in
    setVideo1Opacity('opacity-70 md:opacity-80');

    // After 200ms transition completes, hide and pause Video 2
    timeoutRef.current = setTimeout(() => {
      if (videoRef2.current) {
        videoRef2.current.pause();
      }
      setVideo2Opacity('opacity-0');
      setCurrentHeroVideoIdx(0);
      transitioningRef.current = false;
    }, 200);
  };

  const handleHero1Ended = () => {
    triggerTransitionToVideo2();
  };

  const handleHero2Ended = () => {
    triggerTransitionToVideo1();
  };

  // Playback control depending on state
  useEffect(() => {
    if (isEngineeringProfileActive) {
      if (videoRef1.current) videoRef1.current.pause();
      if (videoRef2.current) videoRef2.current.pause();
    } else {
      if (currentHeroVideoIdx === 0 && videoRef1.current) {
        videoRef1.current.play().catch(e => {});
      } else if (currentHeroVideoIdx === 1 && videoRef2.current) {
        videoRef2.current.play().catch(e => {});
      }
    }
  }, [isEngineeringProfileActive, currentHeroVideoIdx]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Periodic visual accent flicker
  useEffect(() => {
    const interval = setInterval(() => {
      setFlickerKey(prev => prev + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections: SectionType[] = ['home', 'services', 'about', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 160; // trigger shortly before the section hits top

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sec: SectionType) => {
    setActiveSection(sec);
    const element = document.getElementById(sec);
    if (element) {
      const headerOffset = 90; // sticky header height offset
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      scrollToSection('home');
    }, 2500);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden selection:bg-red-500 selection:text-white pb-16 md:pb-0">
      
      {/* 1. DYNAMIC SLIDING BACKGROUND VIDEOS */}
      <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden">
        {/* Layer A (Default Video with Crossfade Playlist) */}
        <motion.div
          animate={{ 
            y: isEngineeringProfileActive ? '-100%' : '0%',
            opacity: isEngineeringProfileActive ? 0 : 1
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Video 1 (Forward) */}
          <video
            ref={videoRef1}
            autoPlay
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out ${video1Z} ${video1Opacity}`}
            src={heroVideos[0]}
            onEnded={handleHero1Ended}
            referrerPolicy="no-referrer"
          />
          {/* Video 2 (Reverse) */}
          <video
            ref={videoRef2}
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out ${video2Z} ${video2Opacity}`}
            src={heroVideos[1]}
            onEnded={handleHero2Ended}
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Layer B (HLS Mux Video - Engineering Profile) */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ 
            y: isEngineeringProfileActive ? '0%' : '100%',
            opacity: isEngineeringProfileActive ? 1 : 0
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          className="absolute inset-0 w-full h-full bg-black"
        >
          {isEngineeringProfileActive && (
            <HlsVideo 
              src="https://stream.mux.com/4IMYGcL01xjs7ek5ANO17JC4VQVUTsojZlnw4fXzwSxc.m3u8"
              className="w-full h-full object-cover opacity-70 md:opacity-80"
            />
          )}
        </motion.div>
      </div>

      {/* Ambient glowing red light in background */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-950/15 blur-[140px] mix-blend-screen pointer-events-none z-0" />

      {/* 2. STICKY HEADER NAVIGATION */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        activeSection === 'home' 
          ? 'bg-transparent py-5' 
          : 'bg-black/80 backdrop-blur-md py-4'
      } px-4 md:px-8 flex items-center justify-between select-none`}>
        {/* Top Left: Logo */}
        <div onClick={() => { scrollToSection('home'); setMobileMenuOpen(false); }} className="hover:opacity-90 transition-opacity cursor-pointer flex flex-col">
          <span className="font-tech text-base md:text-lg tracking-[0.25em] text-white font-extrabold leading-none">
            PARELINA
          </span>
          <span className="font-sans text-[8px] md:text-[9px] tracking-[0.18em] text-red-500 font-bold uppercase mt-1">
            VENTILATION DESIGN
          </span>
        </div>

        {/* Top Center: Links (Desktop) */}
        <nav className="hidden md:flex items-center justify-center gap-10">
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services' },
            { id: 'about', label: 'About' },
            { id: 'projects', label: 'Projects' }
          ].map((item) => {
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id as SectionType)}
                className="relative py-1.5 font-sans text-xs tracking-widest text-white hover:text-white uppercase font-medium transition-colors duration-200 group cursor-pointer"
              >
                {item.label}
                {/* Underline indicator */}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-red-500 transition-all duration-300 shadow-[0_0_8px_#ef4444] ${
                  isSelected ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            );
          })}
        </nav>

        {/* Top Right: Contact Action & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <CyberButton 
              onClick={() => { scrollToSection('contact'); setMobileMenuOpen(false); }} 
              text="CONTACT US" 
            />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-red-500 transition-colors focus:outline-none"
            aria-label="Toggle Menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE NAV DROPDOWN PANEL */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed top-[73px] left-0 right-0 z-40 bg-black/95 backdrop-blur-lg px-6 py-6 flex flex-col gap-4 select-none"
          id="mobile-nav-panel"
        >
          {[
            { id: 'home', label: 'Home' },
            { id: 'services', label: 'Services' },
            { id: 'about', label: 'About' },
            { id: 'projects', label: 'Projects' }
          ].map((item) => {
            const isSelected = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id as SectionType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left py-2.5 px-3 font-sans text-xs tracking-widest uppercase font-semibold border-l-2 transition-all ${
                  isSelected 
                    ? 'text-white border-red-500 bg-red-950/20' 
                    : 'text-neutral-400 border-transparent hover:text-white hover:border-neutral-700'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button 
              onClick={() => {
                scrollToSection('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 bg-red-600 hover:bg-red-500 text-white font-tech text-xs uppercase font-extrabold tracking-widest rounded transition-all duration-200 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
            >
              CONTACT US
            </button>
          </div>
        </motion.div>
      )}

      {/* 3. SCROLLING FOREGROUND WRAPPER */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-24 md:gap-36">
        
        {/* ================= HERO SECTION ================= */}
        <section id="home" className="min-h-[60vh] md:min-h-[65vh] flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <motion.span 
              key={flickerKey}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: [0.8, 1, 0.85, 1, 0.75, 1] }}
              transition={{ duration: 1 }}
              className="font-tech text-[9px] sm:text-xs tracking-[0.18em] text-red-500 font-extrabold uppercase block mb-6 neon-glow-red-subtle text-center px-4"
            >
              Ventilation design - precision in every breath.
            </motion.span>
            
            <h1 className="font-tech font-black text-[10vw] sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.12em] sm:tracking-[0.25em] pl-[0.12em] sm:pl-[0.25em] text-white uppercase leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Parelina
            </h1>
            
            <p className="font-sans text-xs sm:text-sm font-light text-white tracking-[0.12em] max-w-2xl mx-auto mt-8 leading-relaxed px-4 sm:px-0">
              Parelina delivers expert remote ventilation design services, engineered to the highest European standards. Based in Sarajevo, Bosnia and Herzegovina, we serve architects, developers and project managers across Europe.
            </p>

            <motion.button
              onClick={() => scrollToSection('services')}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mt-16 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <span className="font-tech text-[9px] tracking-widest text-white group-hover:text-neutral-200 uppercase transition-colors">
                Scroll to Explore
              </span>
              <ArrowDown className="w-4 h-4 text-red-500 group-hover:text-rose-400 transition-colors" />
            </motion.button>
          </motion.div>
        </section>


        {/* ================= SERVICES OFFERED SECTION ================= */}
        <section id="services" className="space-y-12 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            className="flex items-center justify-between pb-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444] animate-pulse" />
              <h2 className="font-tech text-sm md:text-base font-bold uppercase tracking-[0.2em] text-neutral-100">
                01 // SERVICES WE OFFER
              </h2>
            </div>
            <span className="font-mono text-[10px] text-neutral-500 tracking-wider">SYSTEMS CATALOG</span>
          </motion.div>

          {/* MAIN THREE SERVICES WITH MEDIA WORKSPACE PLACEHOLDERS */}
          <div className="space-y-16">
            
            {/* 1. MVHR */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-12 items-center"
            >
              <div className="md:col-span-7 space-y-4">
                <span className="font-tech text-[10px] text-red-500 font-bold uppercase tracking-widest">
                  System Type 01
                </span>
                <h3 className="font-tech text-lg md:text-xl font-bold tracking-wider text-neutral-100 uppercase">
                  MVHR — Mechanical Ventilation with Heat Recovery
                </h3>
                <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                  Fresh air in, stale air out — without throwing away the energy you've already paid for. Our MVHR designs continuously extract damp, used indoor air and replace it with filtered outdoor air, while the recovery core quietly pre-warms or pre-cools whatever's coming in. The result is genuinely fresh air and a heating bill that doesn't hurt.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Heat Recovery</span>
                    <span className="text-xs font-mono text-red-400 font-bold">Up to 95% Recuperation</span>
                  </div>
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Acoustics</span>
                    <span className="text-xs font-mono text-neutral-200 font-bold">&lt; 25 dB(A) Target</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                {/* Visual Image Showcase */}
                <div className="relative aspect-video rounded-lg border border-red-950/40 bg-neutral-950/90 overflow-hidden group hover:border-red-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <img 
                    src="https://i.imgur.com/ZCC0u5Z.jpeg" 
                    alt="MVHR — Mechanical Ventilation with Heat Recovery"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100 brightness-115 transition-all duration-500"
                  />
                  {/* Cyber grid overlays */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Technical Crosshairs */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-red-500/40" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-red-500/40" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-red-500/40" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-red-500/40" />
                </div>
              </div>
            </motion.div>

            {/* 2. AHU */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-12 items-center"
            >
              <div className="md:col-span-7 md:order-2 space-y-4">
                <span className="font-tech text-[10px] text-red-500 font-bold uppercase tracking-widest">
                  System Type 02
                </span>
                <h3 className="font-tech text-lg md:text-xl font-bold tracking-wider text-neutral-100 uppercase">
                  AHU — Air Handling Unit
                </h3>
                <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                  When a building is too large or too complex for a simple solution, a properly designed AHU is what makes everything else work. We spec and lay out modular air handling systems for commercial, administrative, and clinical environments — covering airflow, filtration, heating, cooling, and humidity in a single coordinated design package.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Flow Capacity</span>
                    <span className="text-xs font-mono text-neutral-200 font-bold">1,000 - 120,000 m³/h</span>
                  </div>
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Filtration</span>
                    <span className="text-xs font-mono text-red-400 font-bold">ISO ePM1 (HEPA H14)</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5 md:order-1">
                {/* Visual Image Showcase */}
                <div className="relative aspect-video rounded-lg border border-red-950/40 bg-neutral-950/90 overflow-hidden group hover:border-red-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <img 
                    src="https://i.imgur.com/h7dHxr4.jpeg" 
                    alt="AHU — Air Handling Unit"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Cyber grid overlays */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-950/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Technical Crosshairs */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-red-500/40" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-red-500/40" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-red-500/40" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-red-500/40" />
                </div>
              </div>
            </motion.div>

            {/* 3. EXHAUST Ventilation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.5 }}
              className="grid gap-8 md:grid-cols-12 items-center"
            >
              <div className="md:col-span-7 space-y-4">
                <span className="font-tech text-[10px] text-red-500 font-bold uppercase tracking-widest">
                  System Type 03
                </span>
                <h3 className="font-tech text-lg md:text-xl font-bold tracking-wider text-neutral-100 uppercase">
                  Exhaust Ventilation
                </h3>
                <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                  Some environments don't just need ventilation — they need guaranteed extraction. Professional kitchens, laboratories, and manufacturing zones where fumes, heat, or explosive atmospheres are a real concern require a different level of engineering. We design exhaust systems built around containment, pressure control, and safety compliance from the ground up.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Static Pressure</span>
                    <span className="text-xs font-mono text-neutral-200 font-bold">Up to 3,500 Pa</span>
                  </div>
                  <div className="p-3 bg-neutral-950/80 border border-neutral-900 rounded">
                    <span className="text-[10px] font-tech text-neutral-500 uppercase block">Safety Core</span>
                    <span className="text-xs font-mono text-red-400 font-bold">ATEX Spark-Proof Spec</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-5">
                {/* Visual Image Showcase */}
                <div className="relative aspect-video rounded-lg border border-red-950/40 bg-neutral-950/90 overflow-hidden group hover:border-red-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.8)]">
                  <img 
                    src="https://i.imgur.com/CealiuB.jpeg" 
                    alt="Exhaust Ventilation"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  {/* Cyber grid overlays */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-950/10 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Technical Crosshairs */}
                  <span className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-red-500/40" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-red-500/40" />
                  <span className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-red-500/40" />
                  <span className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-red-500/40" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* SECONDARY AUXILIARY CLIMATE SYSTEMS (NUMBERED ONLY, NO PLACEHOLDERS) */}
          <div className="pt-8 space-y-6">
            <div>
              <span className="font-tech text-xs text-red-500 font-extrabold uppercase tracking-[0.2em] block mb-1">
                SYSTEM CATEGORY 02
              </span>
              <h3 className="font-tech text-base md:text-lg font-extrabold uppercase tracking-wider text-white">
                AUXILIARY CLIMATE ARCHITECTURE
              </h3>
              <p className="font-sans text-xs text-white font-light mt-1 max-w-xl">
                Unified thermodynamic cooling and refrigeration cycles engineered as modular custom configurations.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* VRF/VRV */}
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 hover:border-red-950/30 transition-all duration-300">
                <span className="font-tech text-xs font-extrabold text-red-500 block mb-1">04.</span>
                <h4 className="font-tech text-xs font-bold uppercase text-neutral-200 tracking-wide">
                  VRF / VRV Systems
                </h4>
                <p className="text-[11px] text-white font-light mt-2 leading-relaxed">
                  Variable Refrigerant Flow cooling and heating configurations providing surgically zone-specific climate matching for hospitality and administrative structures.
                </p>
              </div>

              {/* Multi-Split / Single Split */}
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 hover:border-red-950/30 transition-all duration-300">
                <span className="font-tech text-xs font-extrabold text-red-500 block mb-1">05.</span>
                <h4 className="font-tech text-xs font-bold uppercase text-neutral-200 tracking-wide">
                  Multi-split / Single split
                </h4>
                <p className="text-[11px] text-white font-light mt-2 leading-relaxed">
                  Direct expansion heat pump split layouts optimized for compartmentalized office modules and smaller commercial units requiring high efficiency.
                </p>
              </div>

              {/* AHU with DX Coil */}
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 hover:border-red-950/30 transition-all duration-300">
                <span className="font-tech text-xs font-extrabold text-red-500 block mb-1">06.</span>
                <h4 className="font-tech text-xs font-bold uppercase text-neutral-200 tracking-wide">
                  AHU with DX Coil
                </h4>
                <p className="text-[11px] text-white font-light mt-2 leading-relaxed">
                  Heavy-duty air handling assemblies integrating custom direct expansion cooling or heating coils for absolute single-point fresh air conditioning.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ================= ABOUT SECTION ================= */}
        <section id="about" className="space-y-8 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between pb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="font-tech text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-100">
                ENGINEERING PROFILE
              </h2>
            </div>
            <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">About Parelina</span>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-tech text-sm md:text-base font-extrabold uppercase tracking-wider text-white">
                Surgically Precise Remote Ventilation Design
              </h3>
              <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                Parelina brings together advanced HVAC expertise and high-performance digital workflows. Based in Sarajevo, Bosnia and Herzegovina, we operate as a fully remote engineering partner serving architects, developers, and project managers across the European Union.
              </p>
              <p className="text-white text-xs md:text-sm leading-relaxed font-light">
                By focusing exclusively on clean air distribution, thermodynamic recovery, and strict acoustic calculations, we ensure that every design package conforms to local building guidelines while minimizing energy demands.
              </p>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 text-center flex flex-col justify-center items-center min-h-[96px]">
                <span className="font-tech text-base font-black text-red-500 block">100%</span>
                <span className="text-[10px] font-sans text-neutral-300 uppercase tracking-wider mt-1 font-semibold leading-tight">Remote Coordination</span>
              </div>
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 text-center flex flex-col justify-center items-center min-h-[96px]">
                <span className="font-tech text-base font-black text-red-500 block">EU Compliant</span>
                <span className="text-[10px] font-sans text-neutral-300 uppercase tracking-wider mt-1 font-semibold leading-tight">Specs</span>
              </div>
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 text-center flex flex-col justify-center items-center min-h-[96px]">
                <span className="font-tech text-base font-black text-red-500 block">BiH</span>
                <span className="text-[10px] font-sans text-neutral-300 uppercase tracking-wider mt-1 font-semibold leading-tight">Sarajevo Base</span>
              </div>
              <div className="p-4 rounded border border-neutral-900 bg-neutral-950/70 text-center flex flex-col justify-center items-center min-h-[96px]">
                <span className="font-tech text-base font-black text-red-500 block">SIA/DIN/EN</span>
                <span className="text-[10px] font-sans text-neutral-300 uppercase tracking-wider mt-1 font-semibold leading-tight">Standards</span>
              </div>
            </div>
          </div>
        </section>


        {/* ================= PROJECTS SECTION ================= */}
        <section id="projects" className="space-y-8 scroll-mt-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between pb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="font-tech text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-100">
                ENGINEERING REPOSITORY
              </h2>
            </div>
            <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">Featured Projects</span>
          </motion.div>

          <div className="p-8 rounded border border-neutral-900 bg-neutral-950/40 max-w-2xl mx-auto text-center space-y-4">
            <p className="text-white text-xs md:text-sm font-light leading-relaxed">
              Parelina is a newly established studio. Our first documented case studies are currently in preparation.
            </p>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed font-light">
              Contact us directly to discuss your project requirements and we will provide a detailed technical proposal tailored to your building type.
            </p>
            <div className="pt-2">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-tech text-[10px] uppercase tracking-widest rounded transition-all duration-200 cursor-pointer shadow-[0_0_10px_rgba(220,38,38,0.2)]"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </section>


        {/* ================= CONTACT SECTION ================= */}
        <section id="contact" className="space-y-8 scroll-mt-24 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex items-center justify-between pb-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="font-tech text-xs md:text-sm font-bold uppercase tracking-widest text-neutral-100">
                GET IN TOUCH
              </h2>
            </div>
            <span className="font-mono text-[9px] text-neutral-500 tracking-widest uppercase">Sarajevo office</span>
          </motion.div>

          <p className="text-neutral-300 text-xs md:text-sm leading-relaxed font-light">
            Have a project in mind? Describe your building type and ventilation requirements and one of our engineers will respond directly.
          </p>

          {contactSuccess ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-5 bg-emerald-950/40 border border-emerald-800 rounded-md flex flex-col items-center text-center gap-3"
            >
              <Check className="w-10 h-10 text-emerald-400" />
              <h3 className="font-tech text-xs font-bold uppercase text-emerald-200 tracking-widest">Inquiry Received</h3>
              <p className="text-xs text-emerald-300 max-w-sm font-light">
                Your inquiry was successfully processed. An engineer from our Sarajevo office will reach out within 24 hours.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-tech text-neutral-400 uppercase tracking-wider mb-1">Your Name</label>
                  <div className="relative">
                     <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
                    <input 
                      type="text" 
                      required
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-red-500"
                      placeholder="Pare Lina"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-tech text-neutral-400 uppercase tracking-wider mb-1">Your Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
                    <input 
                      type="email" 
                      required
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-red-500"
                      placeholder="parelina@mail.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-tech text-neutral-400 uppercase tracking-wider mb-1">Project Details & Requirements</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-2.5 w-4 h-4 text-neutral-600" />
                  <textarea 
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                    placeholder="Tell us about your project, target flow rate, or ventilation system requirements..."
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded font-tech text-xs uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <Send className="w-3.5 h-3.5" />
                Send Enquiry
              </button>
            </form>
          )}
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-8 mt-8 flex justify-center items-center select-none relative z-10 border-t border-neutral-950">
        <div className="text-[9px] md:text-[10px] font-mono text-neutral-500 tracking-widest uppercase text-center">
          PARELINA ENGINEERING // EST. 2026 // SARAJEVO, BIH
        </div>
      </footer>

      {/* 4. MOBILE-ONLY FLOATING STICKY MENU HELPER (THE STICKY 3 BUTTONS) */}
      <div className="md:hidden flex justify-center gap-8 py-3.5 bg-black/85 backdrop-blur-md fixed bottom-0 left-0 right-0 z-50 select-none shadow-[0_-5px_15px_rgba(0,0,0,0.8)]">
        {[
          { id: 'home', label: 'Home' },
          { id: 'services', label: 'Services' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id as SectionType)}
            className={`text-[10px] uppercase font-bold tracking-[0.18em] px-3 py-1 transition-colors relative ${
              activeSection === item.id ? 'text-red-500 font-extrabold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-red-500 shadow-[0_0_4px_#ef4444]" />
            )}
          </button>
        ))}
      </div>

    </div>
  );
}
