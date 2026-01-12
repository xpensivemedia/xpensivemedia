import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { supabase } from '../supabase';

// Converted from provided HTML -> JSX with React behavior for carousel + modal
export default function Showcase() {
  const carouselRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // categories as in original HTML
  const categories = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'events-weddings', label: 'Events & Weddings', icon: 'heart' },
    { key: 'car-delivery', label: 'Cars-Delively', icon: 'car' },
    { key: 'logo-reveal', label: 'Logo Reveal', icon: 'camera' },
    { key: 'podcasts', label: 'Podcasts', icon: 'handshake' },
    { key: 'real-estate', label: 'Real Estate', icon: 'home' },
    { key: 'commercial', label: 'Commercial', icon: 'briefcase' },
    { key: 'school-works', label: 'School Works', icon: 'book-open' },
  ];

  // Slide markup converted from your HTML. Using public sample videos so the showcase works without local assets.
  const slides = [
    {
      id: 0,
      cards: [
        { title: 'Car Delivery', category: 'car-delivery', path: 'car-delivery-1.mp4' },
        { title: 'Mundhe Banni', category: 'podcasts', path: 'mundhe-banni.mp4' },
        { title: 'Events & Weddings', category: 'events-weddings', path: 'wedding-invitation-1.mp4' },
        { title: 'Events & Weddings', category: 'events-weddings', path: 'tanisha-nikhil.mp4' },
        { title: 'Logo Reveal', category: 'logo-reveal', path: 'logo-reveal-1.mp4' },
        { title: 'Real Estate', category: 'real-estate', path: 'vanya-resort.mp4' },
        { title: 'Real Estate', category: 'real-estate', path: 'krishna-real-estate.mp4' },
        { title: 'Real Estate', category: 'real-estate', path: 'krishna-real-estate-2.mp4' },
        { title: 'Commercial', category: 'commercial', path: 'nido-cocktail.mp4' },
        { title: 'Commercial', category: 'commercial', path: 'nido-valentine.mp4' },
        { title: 'Commercial', category: 'commercial', path: 'pink-bag.mp4' },
        { title: 'Commercial', category: 'commercial', path: 'nido-cricket-poster.mp4' },
        { title: 'Commercial', category: 'commercial', path: 'bracelet.mp4' },
        { title: 'School Works', category: 'school-works', path: 'euro-kids-pink-day.mp4' },
        { title: 'School Works', category: 'school-works', path: 'euro-kids-holi.mp4' },
        { title: 'School Works', category: 'school-works', path: 'euro-kids-annual-day.mp4' },
      ],
    },
  ];

  const showcaseItems = [
    { id: 1, path: 'showcase-video-1.mp4', title: 'Video 1', category: 'events-weddings' },
    { id: 2, path: 'showcase-video-2.mp4', title: 'Video 2', category: 'car-delivery' },
    { id: 3, path: 'showcase-video-3.mp4', title: 'Video 3', category: 'logo-reveal' },
    { id: 4, path: 'showcase-video-4.mp4', title: 'Video 4', category: 'podcasts' },
    { id: 5, path: 'showcase-video-5.mp4', title: 'Video 5', category: 'events-weddings' },
    { id: 6, path: 'showcase-video-6.mp4', title: 'Video 6', category: 'car-delivery' },
    // Add more videos with correct categories
  ];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') {
      return showcaseItems;
    }
    return showcaseItems.filter(item => item.category === activeCategory);
  }, [activeCategory, showcaseItems]);

  // filter slides based on activeCategory; returns indices of slides that have at least one card matching category
  const visibleSlideIndices = slides
    .map((s, idx) => ({ idx, has: s.cards.some(c => activeCategory === 'all' ? true : c.category === activeCategory) }))
    .filter(x => x.has)
    .map(x => x.idx);

  // flattened list of cards matching the active category (useful for mobile swipe mode)
  const filteredCards = slides.flatMap(s => s.cards).filter(c => activeCategory === 'all' ? true : c.category === activeCategory);

  // Helper: resolve a storage path to a download URL and assign to <video>
  async function safeAssignVideoSrc(videoEl, path) {
    try {
      const { data } = supabase.storage.from('portfolio-videos').getPublicUrl(path);
      if (data && data.publicUrl) {
        videoEl.src = data.publicUrl;
        return true;
      }
      return false;
    } catch (e) {
      try { console.error('[showcase] assign video src failed', path, e); } catch(_) {}
      return false;
    }
  }

  useEffect(() => {
    // adjust activeIndex when activeCategory changes (go to first visible slide)
    if (!visibleSlideIndices.includes(activeIndex)) {
      setActiveIndex(visibleSlideIndices[0] ?? 0);
    }
  }, [activeCategory, visibleSlideIndices, activeIndex]);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    if (isMobile) return;

    const slidesEls = Array.from(container.querySelectorAll('.carousel-item'));
        // Preload current and adjacent slides for smoother autoplay
        const preloadIndices = new Set([activeIndex, activeIndex - 1, activeIndex + 1]);
        slidesEls.forEach((slideEl, i) => {
          const isPreloadCandidate = preloadIndices.has(i);
          if (i === activeIndex) {
            slideEl.classList.add('active');
            slideEl.querySelectorAll('.showcase-video').forEach(v => {
              try {
                if (!v.src) {
                  const ds = v.getAttribute('data-src');
                  if (ds) {
                    // validate URL before assigning to avoid NotSupportedError (HTML/403 responses etc.)
                    (async () => {
                      const ok = await safeAssignVideoSrc(v, ds);
                      const overlay = v.parentElement?.querySelector('.video-overlay');
                      if (ok) {
                        try { console.log('[showcase] set src', ds); } catch(_) {}
                        if (overlay) { overlay.textContent = ''; overlay.classList.remove('unavailable'); overlay.onclick = null; }
                        v.dataset.unavailable = '0';
                      } else {
                        try { console.error('[showcase] invalid video source, skipping', ds); } catch(_) {}
                        if (overlay) {
                          overlay.textContent = 'Unavailable — Retry';
                          overlay.classList.add('unavailable');
                          overlay.onclick = async (e) => {
                            e.stopPropagation();
                            overlay.textContent = 'Retrying...';
                            const ok2 = await safeAssignVideoSrc(v, ds);
                            if (ok2) {
                              overlay.textContent = '';
                              overlay.classList.remove('unavailable');
                              overlay.onclick = null;
                              try { v.load(); const p = v.play(); if (p && typeof p.then === 'function') p.catch(() => {}); } catch(_) {}
                              v.dataset.unavailable = '0';
                            } else { overlay.textContent = 'Unavailable — Retry'; v.dataset.unavailable = '1'; }
                          };
                        }
                        v.dataset.unavailable = '1';
                      }
                    })();
                  }
                }

                // Ensure attributes that allow muted autoplay and eager loading
                v.preload = 'auto';
                try { v.loading = 'eager'; } catch(_) { /* ignore */ }
                v.muted = true;
                v.setAttribute('muted', '');
                v.playsInline = true;
                v.setAttribute('playsinline', '');
                v.autoplay = true;
                v.setAttribute('autoplay', '');
                v.loop = true;
                v.setAttribute('loop', '');

                v.load();

                const tryPlay = () => {
                  try {
                    try { console.log('[showcase] tryPlay', v.src); } catch(_) {}
                    const p = v.play();
                    if (p && typeof p.then === 'function') {
                      p.then(() => { try { console.log('[showcase] played', v.src); } catch(_) {} }).catch((err) => { try { console.error('[showcase] play failed', v.src, err); } catch(_) {} });
                    }
                  } catch (e) { try { console.error('[showcase] play exception', v.src, e); } catch(_) {} }
                };

                if (v.readyState >= 2) {
                  tryPlay();
                } else {
                  const onCan = () => tryPlay();
                  v.addEventListener('loadeddata', onCan, { once: true });
                  v.addEventListener('loadedmetadata', onCan, { once: true });
                  v.addEventListener('canplay', onCan, { once: true });
                  // fallback: try again shortly in case events don't fire
                  setTimeout(() => tryPlay(), 700);
                }
              } catch (e) { void e; }
            });
          } else {
            slideEl.classList.remove('active');
            slideEl.querySelectorAll('.showcase-video').forEach(v => { try { v.preload = 'none'; v.pause(); v.currentTime = 0; } catch(e) { void e; } });

            // Preload neighbor slides (but don't auto-play them)
            if (isPreloadCandidate) {
              slideEl.querySelectorAll('.showcase-video').forEach(v => {
                try {
                  if (!v.src) {
                    const ds = v.getAttribute('data-src');
                    if (ds) {
                      (async () => {
                        const ok = await safeAssignVideoSrc(v, ds);
                        const overlay = v.parentElement?.querySelector('.video-overlay');
                        if (ok) {
                          try { console.log('[showcase] preload assigned', ds); } catch(_) {}
                          if (overlay) { overlay.textContent = ''; overlay.classList.remove('unavailable'); overlay.onclick = null; }
                          v.dataset.unavailable = '0';
                        } else {
                          try { console.error('[showcase] preload assign failed', ds); } catch(_) {}
                          if (overlay) {
                            overlay.textContent = 'Unavailable — Retry';
                            overlay.classList.add('unavailable');
                            overlay.onclick = async (e) => {
                              e.stopPropagation(); overlay.textContent = 'Retrying...';
                              const ok2 = await safeAssignVideoSrc(v, ds);
                              if (ok2) { overlay.textContent = ''; overlay.classList.remove('unavailable'); overlay.onclick = null; try { v.load(); const p = v.play(); if (p && typeof p.then === 'function') p.catch(() => {}); } catch(_) {} v.dataset.unavailable = '0'; }
                              else { overlay.textContent = 'Unavailable — Retry'; v.dataset.unavailable = '1'; }
                            };
                          }
                          v.dataset.unavailable = '1';
                        }
                      })();
                    }
                  }
                  v.preload = 'auto';
                  try { v.loading = 'eager'; } catch(_) { }
                  v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true; v.setAttribute('autoplay', '');
                  v.load();
                } catch (e) { void e; }
              });
            }
          }
        });
  }, [activeIndex, isMobile]);

  // Preload a small set of initial videos on mount / when cards change to improve autoplay reliability
  useEffect(() => {
    const el = carouselRef.current; if (!el) return;
    try {
      const vids = Array.from(el.querySelectorAll('video.showcase-video'));
      vids.slice(0, 3).forEach((v) => {
        try {
          if (!v.src) {
            const ds = v.getAttribute('data-src');
            if (ds) { (async () => { const ok = await safeAssignVideoSrc(v, ds); if (ok) try { console.log('[showcase] initial preload assigned', ds); } catch(_) {} else try { console.error('[showcase] initial preload failed', ds); } catch(_) {} })(); }
          }
          v.preload = 'auto';
          try { v.loading = 'eager'; } catch(_) {}
          v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true; v.setAttribute('autoplay', ''); v.loop = true; v.setAttribute('loop','');
          v.load();
          // small deferred attempt to play if allowed
          setTimeout(() => {
            try { const p = v.play(); if (p && typeof p.then === 'function') p.catch(() => {}); } catch (e) { void e; }
          }, 300);
        } catch (e) { void e; }
      });
    } catch (e) { void e; }
  }, [filteredCards]);

  useEffect(() => {
    if (!isMobile) return;
    const scrollEl = mobileScrollRef.current;
    if (!scrollEl) return;
    const vids = Array.from(scrollEl.querySelectorAll('video.showcase-video'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          try {
            if (!v.src) {
              const ds = v.getAttribute('data-src');
              if (ds) {
                (async () => {
                  const ok = await safeAssignVideoSrc(v, ds);
                  if (ok) {
                    try { console.log('[showcase] set src (observer)', ds); } catch(_) {}
                    
                    v.preload = 'metadata';
                    try { v.loading = 'eager'; } catch(_) { }
                    v.muted = true;
                    v.setAttribute('muted', '');
                    v.playsInline = true;
                    v.setAttribute('playsinline', '');
                    v.autoplay = true;
                    v.setAttribute('autoplay', '');
                    
                    v.load();

                    const onReady = () => {
                      try {
                        try { console.log('[showcase] observer tryPlay', v.src); } catch(_) {}
                        const p = v.play();
                        if (p && typeof p.then === 'function') {
                          p.then(() => { try { console.log('[showcase] observer played', v.src); } catch(_) {} }).catch((err) => { try { console.error('[showcase] observer play failed', v.src, err); } catch(_) {} });
                        }
                      } catch (e) { try { console.error('[showcase] observer play exception', v.src, e); } catch(_) {} }
                    };

                    if (v.readyState >= 2) {
                      onReady();
                    } else {
                      v.addEventListener('loadeddata', onReady, { once: true });
                      v.addEventListener('loadedmetadata', onReady, { once: true });
                      v.addEventListener('canplay', onReady, { once: true });
                      setTimeout(onReady, 700);
                    }
                  } else {
                    try { console.error('[showcase] invalid video source (observer), skipping', ds); } catch(_) {}
                  }
                })();
              }
            } else {
              // already has src, just play if paused
              if (v.paused) {
                 v.play().catch(() => {});
              }
            }
          } catch (e) { /* ignore */ }
        } else {
          try { v.pause(); v.currentTime = 0; } catch (e) { void e; }
        }
      });
    }, { root: scrollEl, threshold: 0.3 });
    vids.forEach(v => observer.observe(v));
    return () => {
      vids.forEach(v => observer.unobserve(v));
      observer.disconnect();
    };
  }, [isMobile, filteredCards]);

  const goNext = useCallback(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (!el) return;
      const step = Math.round(el.clientWidth * 0.85);
      el.scrollBy({ left: step, behavior: 'smooth' });
      return;
    }

    const visible = visibleSlideIndices;
    if (visible.length <= 1) {
      const container = carouselRef.current;
      const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
      if (!wrapper) return;
      const step = Math.round(wrapper.clientWidth * 0.85);
      wrapper.scrollBy({ left: step, behavior: 'smooth' });
      return;
    }
    const curPos = visible.indexOf(activeIndex);
    const nextPos = (curPos + 1) % visible.length;
    setActiveIndex(visible[nextPos]);
  }, [isMobile, visibleSlideIndices, activeIndex]);

  const goPrev = useCallback(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (!el) return;
      const step = Math.round(el.clientWidth * 0.85);
      el.scrollBy({ left: -step, behavior: 'smooth' });
      return;
    }

    const visible = visibleSlideIndices;
    if (visible.length <= 1) {
      const container = carouselRef.current;
      const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
      if (!wrapper) return;
      const step = Math.round(wrapper.clientWidth * 0.85);
      wrapper.scrollBy({ left: -step, behavior: 'smooth' });
      return;
    }
    const curPos = visible.indexOf(activeIndex);
    const prevPos = (curPos - 1 + visible.length) % visible.length;
    setActiveIndex(visible[prevPos]);
  }, [isMobile, visibleSlideIndices, activeIndex]);

  useEffect(() => {
    // keyboard navigation
    const onKey = (e) => {
      if (modalOpen && e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen, goNext, goPrev]);

  // detect mobile/responsive mode
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Add this useEffect to re-render filtered items on mobile
  useEffect(() => {
    if (isMobile) {
      // Force re-render of mobile scroll view when category changes
      const mobileScroll = mobileScrollRef.current;
      if (mobileScroll) {
        mobileScroll.scrollLeft = 0;
      }
    }
  }, [activeCategory, isMobile, filteredItems]);

  // Auto-play modal video when opened and pause/cleanup when closed
  useEffect(() => {
    const v = modalVideoRef.current;
    if (modalOpen && v) {
      // ensure we start from beginning
      v.currentTime = 0;
      // mute modal before playback so autoplay will be allowed by browsers
      v.muted = true;
      try { console.log('[showcase] modal open, attempting play', modalSrc); } catch(_) {}
      const tryPlay = () => {
        try {
          try { console.log('[showcase] modal tryPlay', modalSrc); } catch(_) {}
          const p = v.play();
          if (p && typeof p.then === 'function') {
            p.then(() => { try { console.log('[showcase] modal played', modalSrc); } catch(_) {} }).catch((err) => { try { console.error('[showcase] modal play failed', modalSrc, err); } catch(_) {} });
          }
        } catch (e) { try { console.error('[showcase] modal play exception', modalSrc, e); } catch(_) {} }
      };

      if (v.readyState >= 2) {
        tryPlay();
      } else {
        const onLoaded = () => tryPlay();
        v.addEventListener('loadedmetadata', onLoaded, { once: true });
      }
    }

    if (!modalOpen && v) {
      try { v.pause(); v.currentTime = 0; } catch (e) { void e; }
    }
  }, [modalOpen, modalSrc]);

  const openModal = async (path, title) => {
    setModalTitle(title);
    setModalOpen(true);
    
    try {
      // Get the public URL from Supabase
      const { data } = supabase.storage.from('portfolio-videos').getPublicUrl(path);
      if (data && data.publicUrl) {
        setModalSrc(data.publicUrl);
      } else {
        console.error('[showcase] failed to get public URL', path);
      }
    } catch (e) {
      console.error('[showcase] modal URL fetch error', e);
    }

    // Play video after DOM updates
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.load();
        try {
          const playPromise = modalVideoRef.current.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
              console.error('[showcase] modal video play failed', err);
            });
          }
        } catch (e) {
          console.error('[showcase] modal play error', e);
        }
      }
    }, 150);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalSrc('');
    setModalTitle('');
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  };

  // Update modal video element
  return (
    <div className="min-h-screen bg-[#030014] overflow-hidden" id="Showcase">
      <style>{`/* Converted showcase styles (trimmed to essentials) */
      :root{--primary-color:#2196F3;--bg-dark:#00033D;--text-muted:rgba(255,255,255,0.7)}
      .showcase-page{min-height:100vh;background:var(--bg-dark);padding:120px 0 2rem;color:#fff}
      .showcase-container{max-width:1400px;margin:0 auto;padding:0 2rem}
      .showcase-header{text-align:center;padding:2rem 0 4rem;margin-bottom:2rem}
      .showcase-title{font-size:3.5rem;font-weight:700;margin-bottom:1.5rem;background:linear-gradient(45deg,#fff,#f3f3f3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
      .showcase-description{color:var(--text-muted);font-size:1.2rem;max-width:600px;margin:0 auto;line-height:1.8}
      .category-list{display:flex;gap:.75rem;overflow-x:auto;padding:.5rem;justify-content:center;align-items:center}
      .category-item{padding:.6rem 1.2rem;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.06);border-radius:50px;color:#fff;cursor:pointer;white-space:nowrap}
      .category-item.active{background:var(--primary-color);border-color:var(--primary-color)}
      .slider-section{padding:1rem 0;min-height:50vh;display:flex;align-items:center;justify-content:center;background:transparent}
      .slider-container{width:100%;max-width:900px;margin:0 auto;position:relative;background:transparent}
      .slider-wrapper{display:flex;gap:1rem;align-items:flex-start}
      .slider-wrapper{overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
      .slider-card{flex:0 0 calc((100% - 2rem)/3);border-radius:12px;overflow:hidden;aspect-ratio:9/16;max-width:280px;background:transparent;cursor:pointer}
      .slider-card{scroll-snap-align:center}
      .video-thumbnail{width:100%;height:100%;object-fit:cover}
      .video-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.18);opacity:0;transition:opacity .25s}
      .slider-card:hover .video-overlay{opacity:1}
      .video-play-btn{width:56px;height:56px;border-radius:999px;background:var(--primary-color);display:flex;align-items:center;justify-content:center;color:#fff}
      .video-info{position:absolute;left:0;right:0;bottom:0;padding:.5rem .75rem;background:transparent;pointer-events:none;border-bottom-left-radius:12px;border-bottom-right-radius:12px}
      .video-title{font-size:1rem;font-weight:600;color:#fff;text-shadow:0 6px 20px rgba(0,0,0,0.6)}
      .nav-button{position:absolute;top:50%;transform:translateY(-50%);width:45px;height:45px;border-radius:12px;background:var(--bg-dark);border:2px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;z-index:10}
      .nav-button.prev{left:10px}.nav-button.next{right:10px}
      .dot{width:12px;height:12px;border-radius:6px;background:var(--bg-dark);border:2px solid rgba(255,255,255,0.08);cursor:pointer}
      .dot.active{background:var(--primary-color);width:24px}
      .carousel-item{display:none}
      .carousel-item.active{display:block}
      /* modal */
      .video-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:50;opacity:0;pointer-events:none;transition:opacity .2s}
      .video-modal.active{opacity:1;pointer-events:auto}
      .video-modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,.8)}
      .video-modal-content{position:relative;z-index:2;max-width:1200px;width:95%;background:#000;padding:1rem;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;max-height:90vh}
      .video-modal-content video{width:100%;max-height:80vh;object-fit:contain;display:block;background:#000;border-radius:8px}
      .video-modal-close{position:absolute;top:8px;right:8px;z-index:5}

      /* Responsive tweaks */
      @media (max-width: 1024px) {
        .showcase-title{font-size:2.8rem}
        .showcase-description{font-size:1.05rem}
        .slider-card{flex:0 0 calc((100% - 1rem)/2);max-width:48%}
        .slider-wrapper{gap:.75rem}
      }

      @media (max-width: 768px) {
        .showcase-title{font-size:2.2rem;margin-bottom:1rem}
        .showcase-description{font-size:1rem;max-width:92%}
        .category-list{gap:.5rem;padding:.4rem}
        .category-item{padding:.5rem .9rem;font-size:.95rem}
        .slider-card{flex:0 0 80%;max-width:80%}
        .nav-button{width:40px;height:40px}
        .video-play-btn{width:48px;height:48px}
        .video-modal-content{max-height:95vh;padding:.75rem;border-radius:8px}
        .video-modal-content video{max-height:70vh}
        .showcase-page{padding:90px 0 1.5rem}
      }

      @media (max-width: 480px) {
        .showcase-title{font-size:1.8rem}
        .showcase-description{font-size:.95rem}
        .category-list{justify-content:flex-start;padding-left:12px;padding-right:12px}
        .category-item{padding:.45rem .8rem;font-size:.9rem}
        .slider-card{flex:0 0 92%;max-width:92%;aspect-ratio:9/14}
        .slider-container{padding-left:8px;padding-right:8px}
        .slider-section{padding:0.5rem 0}
        .dot{width:10px;height:10px}
        .dot.active{width:18px}
        .video-modal-content video{max-height:60vh}

        /* mobile swipe container */
        .flat-slider{overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:1rem;padding-bottom:8px}
        .flat-slider .slider-card{scroll-snap-align:center;flex:0 0 92%;max-width:92%}
        .nav-button{display:none}
      }
      `}</style>

      <Navbar />

      <main className="showcase-page">
        <div className="showcase-container">
          <header className="showcase-header">
            <h1 className="showcase-title">Inspire Capture <span style={{color: 'var(--primary-color)'}}>Vibe</span></h1>
            <p className="showcase-description">Experience our collection of stunning videos and reels. Professional quality delivered in 10 minutes.</p>
          </header>

          <nav className="category-nav">
            <div className="category-container">
              <div className="category-wrapper">
                <div className="category-list">
                  {categories.map(cat => (
                    <button
                      key={cat.key}
                      className={`category-item ${activeCategory === cat.key ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.key)}
                      type="button"
                    >
                      {/* icon omitted for simplicity */}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <section>
            <div className="slider-section">
              <div className="slider-container" ref={carouselRef}>
                <div className="carousel-inner">
                  {isMobile ? (
                    <div className={`carousel-item active`}>
                      <div className="slider-wrapper flat-slider" ref={mobileScrollRef}>
                        {filteredCards.map((card, idx) => (
                          <div
                            key={idx}
                            className="slider-card video-card"
                            data-category={card.category}
                            onClick={() => openModal(card.path, card.title)}
                          >
                            <div className="video-thumbnail-wrapper" style={{position: 'relative', height: '100%'}}>
                                  <video
                                    className="video-thumbnail showcase-video"
                                    data-src={card.path}
                                    muted
                                    autoPlay
                                    loop
                                    preload={isMobile ? "metadata" : "none"}
                                    playsInline
                                    crossOrigin="anonymous"
                                    poster="/Conquer_Media.jpg"
                                    onError={(e) => { try { e.currentTarget.pause(); } catch(_) { void 0; } }}
                                    loading="lazy"
                                  />
                              <div className="video-overlay">
                                <div className="video-play-btn"><Play size={20} /></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    slides.map((slide, sIdx) => {
                      // hide slide if it has no cards for active category
                      const visible = slide.cards.some(c => activeCategory === 'all' ? true : c.category === activeCategory);
                      return (
                        <div key={slide.id} className={`carousel-item ${sIdx === activeIndex && visible ? 'active' : ''}`}>
                          <div className="slider-wrapper">
                            {slide.cards.map((card, cIdx) => (
                              (activeCategory === 'all' || card.category === activeCategory) && (
                                <div
                                  key={cIdx}
                                  className="slider-card video-card"
                                  data-category={card.category}
                                  onClick={() => openModal(card.path, card.title)}
                                >
                                  <div className="video-thumbnail-wrapper" style={{position: 'relative', height: '100%'}}>
                                    <video
                                      className="video-thumbnail showcase-video"
                                      data-src={card.path}
                                      muted
                                      autoPlay
                                      loop
                                      preload={isMobile ? "metadata" : "auto"}
                                      playsInline
                                      crossOrigin="anonymous"
                                      poster="/Conquer_Media.jpg"
                                      onError={(e) => { try { e.currentTarget.pause(); } catch(_) { void 0; } }}
                                      loading="eager"
                                    />
                                    <div className="video-overlay">
                                      <div className="video-play-btn"><Play size={20} /></div>
                                    </div>
                                  </div>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Navigation Buttons */}
                  <button type="button" aria-label="Previous" className="nav-button prev" onClick={goPrev}><ChevronLeft /></button>
                  <button type="button" aria-label="Next" className="nav-button next" onClick={goNext}><ChevronRight /></button>
                </div>

                {/* Dots */}
                <div className="slider-dots" style={{display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16}}>
                  {slides.map((_, i) => {
                    const visible = visibleSlideIndices.includes(i);
                    if (!visible) return null;
                    const idx = i;
                    return (
                      <button
                        key={i}
                        className={`dot ${idx === activeIndex ? 'active' : ''}`}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${i+1}`}
                        type="button"
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

         {/* Footer (simplified) */}
         <footer>
        <center>
          <hr className="my-3 border-gray-400 opacity-15 sm:mx-auto lg:my-6 text-center" />
          <span className="block text-sm pb-4 text-gray-500 text-center dark:text-gray-400">
            © 2025{" "}
            <a href="#" className="hover:underline">
              Xpensive Media™
            </a>
            . All Rights Reserved.
          </span>
        </center>
      </footer>

          {/* Modal */}
          {modalOpen && (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden">
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 text-white bg-black/50 rounded-full p-2 hover:bg-black/80"
          >
            ✕
          </button>
          
          <video
            ref={modalVideoRef}
            key={modalSrc}
            controls
            autoPlay
            muted
             className="w-full h-auto max-h-[80vh]"
             onLoadedData={() => {
               try {
                modalVideoRef.current.muted = false;
                 modalVideoRef.current?.play();
               } catch (e) {
                 console.error('[showcase] modal video loadeddata error', e);
               }
             }}
             onCanPlay={() => {
               try {
                modalVideoRef.current.muted = false;
                 modalVideoRef.current?.play();
               } catch (e) {
                 console.error('[showcase] modal video canplay error', e);
               }
             }}
           >
            {modalSrc && (
              <source 
                src={modalSrc} 
                type="video/mp4" 
                onError={(e) => {
                  console.error('[showcase] modal video source error', e);
                }}
              />
            )}
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    )}
        </div>
      </main>

      {/* Social float */}
      <div className="social-float" style={{position: 'fixed', right: 16, bottom: 24, display: 'flex', flexDirection: 'column', gap: 12}}>
        <a
          href="https://wa.me/916363770057?text=Hello%20Conquer Media%2C%20I%20would%20like%20to%20make%20an%20inquiry."
          target="_blank"
          rel="noreferrer"
          className="float-btn whatsapp-btn inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-700 w-11 h-11 rounded-full shadow-lg"
          title="Chat on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp size={18} />
        </a>

        <a
          href="https://instagram.com/xpensivemedia.co"
          target="_blank"
          rel="noreferrer"
          className="float-btn instagram-btn inline-flex items-center justify-center text-white bg-pink-600 hover:bg-pink-700 w-11 h-11 rounded-full shadow-lg"
          title="Follow on Instagram"
          aria-label="Follow on Instagram"
        >
          <FaInstagram size={18} />
        </a>
      </div>
    </div>
  );
}
