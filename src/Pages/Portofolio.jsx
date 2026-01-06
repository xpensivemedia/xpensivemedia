import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Play, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../supabase';

export default function FullWidthTabs() {
  const carouselRef = useRef(null);
  const mobileScrollRef = useRef(null);
  const modalVideoRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSrc, setModalSrc] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'events-weddings', label: 'Events & Weddings', icon: 'heart' },
    { key: 'car-delivery', label: 'Cars-Delively', icon: 'car' },
    { key: 'logo-reveal', label: 'Logo Reveal', icon: 'camera' },
    { key: 'podcasts', label: 'Podcasts', icon: 'handshake' },
  ];

  // Update video paths to match Supabase bucket structure
  const slides = [
    {
      id: 0,
      cards: [
        { title: 'Car Delivery', category: 'car-delivery', path: 'car-delivery-1.mp4' },
        { title: 'Podcast', category: 'podcasts', path: 'podcast-1.mp4' },
        { title: 'Events & Weddings', category: 'events-weddings', path: 'wedding-invitation-1.mp4' },
        { title: 'Logo Reveal', category: 'logo-reveal', path: 'logo-reveal-1.mp4' }
      ],
    },
    // Add more slides with categorized videos
  ];

  const filteredCards = useMemo(() => {
    if (activeCategory === 'all') {
      return slides.flatMap(slide => slide.cards);
    }
    return slides.flatMap(slide => 
      slide.cards.filter(card => card.category === activeCategory)
    );
  }, [activeCategory, slides]);

  // Add this effect to handle category changes on mobile
  useEffect(() => {
    if (isMobile && mobileScrollRef.current) {
      mobileScrollRef.current.scrollLeft = 0;
    }
  }, [activeCategory, isMobile]);

  // filter slides based on activeCategory; returns indices of slides that have at least one card matching category
  const visibleSlideIndices = slides
    .map((s, idx) => ({ idx, has: s.cards.some(c => activeCategory === 'all' ? true : c.category === activeCategory) }))
    .filter(x => x.has)
    .map(x => x.idx);

  // flattened list of cards matching the active category (useful for mobile swipe mode)
  // const filteredCards = slides.flatMap(s => s.cards).filter(c => activeCategory === 'all' ? true : c.category === activeCategory);

  // Helper: resolve a storage path to a download URL and assign to <video>
  async function safeAssignVideoSrc(el, path) {
    if (!el || !path) return false;
    try {
      const { data } = supabase.storage.from('portfolio-videos').getPublicUrl(path);
      if (data && data.publicUrl) {
        el.src = data.publicUrl;
        return true;
      }
      return false;
    } catch (e) {
      try { console.error('[portfolio] assign video src failed', path, e); } catch(_) {}
      return false;
    }
  }

  // Preload video URL on component mount to ensure it's ready
  async function preloadVideoUrl(path) {
    try {
      const storage = getStorage();
      const url = await getDownloadURL(ref(storage, path));
      return url;
    } catch (e) {
      try { console.error('[portfolio] preload video url failed', path, e); } catch(_) {}
      return null;
    }
  }

  useEffect(() => {
    const targetIndex = visibleSlideIndices[0] ?? 0;
    setActiveIndex(targetIndex);
    const container = carouselRef.current;
    const wrapper = container?.querySelector('.carousel-item.active .slider-wrapper');
    if (wrapper) {
      try { wrapper.scrollTo({ left: 0, behavior: 'instant' }); } catch (_) {}
    }
  }, [activeCategory, visibleSlideIndices]);
  useEffect(() => {
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (el) el.scrollTo({ left: 0, behavior: 'instant' });
    }
  }, [activeCategory, isMobile]);

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
    const container = carouselRef.current;
    if (!container) return;
    if (isMobile) return;

    const slidesEls = Array.from(container.querySelectorAll('.carousel-item'));
    // Preload current and adjacent slides for smoother autoplay
    const preloadIndices = new Set([activeIndex, activeIndex - 1, activeIndex + 1]);
    slidesEls.forEach((slideEl, i) => {
      const videos = slideEl.querySelectorAll('.showcase-video');
      const isPreloadCandidate = preloadIndices.has(i);
      if (i === activeIndex) {
        slideEl.classList.add('active');
        videos.forEach(v => {
          try {
            if (!v.src) {
              const ds = v.getAttribute('data-src');
              if (ds) {
                (async () => {
                  const ok = await safeAssignVideoSrc(v, ds);
                  if (ok) try { console.log('[portfolio] set src', ds); } catch(_) {}
                  else try { console.error('[portfolio] invalid video source, skipping', ds); } catch(_) {}
                })();
              }
            }
            // Ensure attributes that allow muted autoplay and eager loading
            v.preload = 'auto';
            try { v.loading = 'eager'; } catch(_) { }
            v.muted = true;
            v.setAttribute('muted', '');
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.autoplay = true;
            v.setAttribute('autoplay', '');
            v.loop = true; v.setAttribute('loop','');

            v.load();

            const tryPlay = () => {
              try {
                try { console.log('[portfolio] tryPlay', v.src); } catch(_) {}
                const p = v.play();
                if (p && typeof p.then === 'function') {
                  p.then(() => { try { console.log('[portfolio] played', v.src); } catch(_) {} }).catch((err) => { try { console.error('[portfolio] play failed', v.src, err); } catch(_) {} });
                }
              } catch (e) { try { console.error('[portfolio] play exception', v.src, e); } catch(_) {} }
            };

            if (v.readyState >= 2) {
              tryPlay();
            } else {
              const onCan = () => tryPlay();
              v.addEventListener('loadeddata', onCan, { once: true });
              v.addEventListener('loadedmetadata', onCan, { once: true });
              v.addEventListener('canplay', onCan, { once: true });
              setTimeout(() => tryPlay(), 700);
            }
          } catch (e) { void e; }
        });
      } else {
        slideEl.classList.remove('active');
        videos.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (e) { void e; } });

        if (isPreloadCandidate) {
          videos.forEach(v => {
            try {
              if (!v.src) {
                const ds = v.getAttribute('data-src');
                if (ds) { (async () => { const ok = await safeAssignVideoSrc(v, ds); if (ok) try { console.log('[portfolio] preload assigned', ds); } catch(_) {} else try { console.error('[portfolio] preload assign failed', ds); } catch(_) {} })(); }
              }
              v.preload = 'auto';
              try { v.loading = 'eager'; } catch(_) {}
              v.muted = true; v.setAttribute('muted',''); v.playsInline = true; v.setAttribute('playsinline',''); v.autoplay = true; v.setAttribute('autoplay','');
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
      vids.slice(0, 4).forEach((v) => {
        try {
          if (!v.src) {
            const ds = v.getAttribute('data-src');
            if (ds) { 
              (async () => { 
                const ok = await safeAssignVideoSrc(v, ds); 
                if (ok) {
                  try { console.log('[portfolio] initial preload assigned', ds); } catch(_) {}
                  v.load();
                  setTimeout(() => {
                    try {
                      const playPromise = modalVideoRef.current.play();
                      if (playPromise && typeof playPromise.then === 'function') {
                        playPromise.catch(err => {
                          console.error('[portfolio] modal video play failed', err);
                        });
                      }
                    } catch (e) {
                      console.error('[portfolio] modal play error', e);
                    }
                  }, 100);
                } else {
                  try { console.error('[portfolio] initial preload failed', ds); } catch(_) {}
                }
              })(); 
            }
          }
          v.preload = 'auto';
          try { v.loading = 'eager'; } catch(_) {}
          v.muted = true; v.setAttribute('muted', ''); v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true; v.setAttribute('autoplay', ''); v.loop = true; v.setAttribute('loop','');
          v.load();
          setTimeout(() => { try { const p = v.play(); if (p && typeof p.then === 'function') p.catch(() => {}); } catch (e) { void e; } }, 500);
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
                    try { console.log('[portfolio] set src (observer)', ds); } catch(_) {}
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
                        const p = v.play();
                        if (p && typeof p.then === 'function') p.catch(() => {});
                      } catch (e) { void e; }
                    };

                    if (v.readyState >= 2) {
                      onReady();
                    } else {
                      v.addEventListener('loadeddata', onReady, { once: true });
                      v.addEventListener('loadedmetadata', onReady, { once: true });
                      v.addEventListener('canplay', onReady, { once: true });
                      setTimeout(onReady, 700);
                    }
                  }
                })();
              }
            } else {
               if (v.paused) v.play().catch(() => {});
            }
          } catch (e) { void e; }
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

  // Auto-play modal video when opened and pause/cleanup when closed
  useEffect(() => {
    const v = modalVideoRef.current;
    if (modalOpen && v) {
      // ensure we start from beginning
      v.currentTime = 0;
      // mute modal before playback so autoplay will be allowed by browsers
      v.muted = true;
      try { console.log('[portfolio] modal open, attempting play', modalSrc); } catch(_) {}
      const tryPlay = () => {
        try {
          try { console.log('[portfolio] modal tryPlay', modalSrc); } catch(_) {}
          const p = v.play();
          if (p && typeof p.then === 'function') {
            p.then(() => { try { console.log('[portfolio] modal played', modalSrc); } catch(_) {} }).catch((err) => { try { console.error('[portfolio] modal play failed', modalSrc, err); } catch(_) {} });
          }
        } catch (e) { try { console.error('[portfolio] modal play exception', modalSrc, e); } catch(_) {} }
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
        console.error('[portfolio] failed to get public URL', path);
      }
    } catch (e) {
      console.error('[portfolio] modal URL fetch error', e);
    }

    // Play video after DOM updates
    setTimeout(() => {
      if (modalVideoRef.current) {
        modalVideoRef.current.load();
        try {
          const playPromise = modalVideoRef.current.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
              console.error('[portfolio] modal video play failed', err);
            });
          }
        } catch (e) {
          console.error('[portfolio] modal play error', e);
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
    <div id="Portofolio" className="portfolio-section">
      <style>{`
      :root{--primary-color:#6366f1;--bg-dark:#030014;--text-muted:rgba(255,255,255,0.7)}
      /* Scoped to portfolio-section to avoid global leaks if possible, but these are mostly unique names */
      .portfolio-section { background: var(--bg-dark); padding: 1rem 0 5rem 0; color: #fff; overflow: hidden; }
      .showcase-container{max-width:1400px;margin:0 auto;padding:0 2rem}
      .showcase-header{text-align:center;padding:2rem 0 2rem;margin-bottom:2rem}
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
      .nav-button{position:absolute;top:50%;transform:translateY(-50%);width:45px;height:45px;border-radius:12px;background:var(--bg-dark);border:2px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;z-index:10}
      .nav-button.prev{left:10px}.nav-button.next{right:10px}
      .dot{width:12px;height:12px;border-radius:6px;background:var(--bg-dark);border:2px solid rgba(255,255,255,0.08);cursor:pointer}
      .dot.active{background:var(--primary-color);width:24px}
      .carousel-item{display:none}
      .carousel-item.active{display:block}
      /* modal */
      .video-modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;pointer-events:none;transition:opacity .2s}
      .video-modal.active{opacity:1;pointer-events:auto}
      .video-modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,.8)}
      .video-modal-content{position:relative;z-index:2;max-width:1200px;width:95%;background:#000;padding:1rem;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;max-height:90vh}
      .video-modal-content video{width:100%;max-height:80vh;object-fit:contain;display:block;background:#000;border-radius:8px}
      .video-modal-close{position:absolute;top:8px;right:8px;z-index:5;color:white;background:rgba(0,0,0,0.5);border-radius:50%;padding:4px}
      
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
        .portfolio-section{padding:3rem 0 1.5rem}
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
        .flat-slider{overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:1rem;padding-bottom:8px}
        .flat-slider .slider-card{scroll-snap-align:center;flex:0 0 92%;max-width:92%}
        .nav-button{display:none}
      }
      `}</style>

      <div className="showcase-container">
        <div className="text-center pb-10">
          <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
            <span style={{
              color: '#6366f1',
              backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Portfolio Showcase
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
            Explore my journey through projects, and technical expertise. 
            Each section represents a milestone in my continuous learning path.
          </p>
        </div>

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
                      ))}
                    </div>
                  </div>
                ) : (
                  slides.map((slide, sIdx) => {
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
                {!isMobile && (
                  <>
                    <button type="button" aria-label="Previous" className="nav-button prev" onClick={goPrev}><ChevronLeft /></button>
                    <button type="button" aria-label="Next" className="nav-button next" onClick={goNext}><ChevronRight /></button>
                  </>
                )}
              </div>

              {/* Dots */}
              {!isMobile && (
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
              )}
            </div>
          </div>
        </section>

        <div className="flex justify-center mt-8">
          <a href="/showcase">
            <button className="group relative w-[200px]">
              <div className="absolute -inset-0.5 bg-[#0072fe] rounded-xl opacity-40 blur-md group-hover:opacity-80 transition-all duration-700"></div>
              <div className="relative h-12 bg-[#0072fe] rounded-lg border border-[#0072fe] leading-none overflow-hidden">
                <div className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 bg-white/10"></div>
                <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm tracking-wide">
                  <span className="text-white font-medium z-10">VIEW ALL VIDEOS</span>
                  <ChevronRight className="w-4 h-4 text-white transform transition-all duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          </a>
        </div>

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
                    console.error('[portfolio] modal video loadeddata error', e);
                  }
                }}
                onCanPlay={() => {
                  try {
                    modalVideoRef.current.muted = false;
                    modalVideoRef.current?.play();
                  } catch (e) {
                    console.error('[portfolio] modal video canplay error', e);
                  }
                }}
              >
                {modalSrc && (
                  <source 
                    src={modalSrc} 
                    type="video/mp4" 
                    onError={(e) => {
                      console.error('[portfolio] modal video source error', e);
                    }}
                  />
                )}
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
