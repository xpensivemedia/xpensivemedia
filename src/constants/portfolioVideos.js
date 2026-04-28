// Single source of truth for the video carousel used in:
// - `src/Pages/Portofolio.jsx`
//
// How to add a new video:
// 1) Upload `your-video.mp4` to Supabase Storage bucket `portfolio-videos` (public),
//    then set `path: 'your-video.mp4'` below.
// 2) OR put the file in `public/videos/` and set `path: '/videos/your-video.mp4'`.
// 3) Pick a `category` key that exists in `videoCategories`.

export const videoCategories = [
  { key: 'all', label: 'All', icon: 'grid' },
  { key: 'events-weddings', label: 'Events & Weddings', icon: 'heart' },
  { key: 'car-delivery', label: 'Cars-Delively', icon: 'car' },
  { key: 'logo-reveal', label: 'Logo Reveal', icon: 'camera' },
  { key: 'podcasts', label: 'Podcasts', icon: 'handshake' },
  { key: 'real-estate', label: 'Real Estate', icon: 'home' },
  { key: 'commercial', label: 'Commercial', icon: 'briefcase' },
  { key: 'school-works', label: 'School Works', icon: 'book-open' },
  { key: 'concert', label: 'Concert', icon: 'briefcase' },
];

// Carousel videos (Supabase paths or direct URLs).
export const videoSlides = [
  {
    id: 0,
    cards: [
      { title: 'Car Delivery', category: 'car-delivery', path: 'car-delivery-1.mp4' },
      { title: 'Concert', category: 'concert', path: 'danika-hod-club.mp4' },
      { title: 'Concert', category: 'concert', path: 'rahul-dit-o-concert.mp4' },
      { title: 'Events & Weddings', category: 'events-weddings', path: 'wedding-1.mp4' },
      { title: 'Events & Weddings', category: 'events-weddings', path: 'tanisha-nikhil.mp4' },
      { title: 'Events & Weddings', category: 'events-weddings', path: 'wedding-invitation-1.mp4' },
      { title: 'Real Estate', category: 'real-estate', path: 'krishna-real-estate.mp4' },
      { title: 'Real Estate', category: 'real-estate', path: 'krishna-real-estate-2.mp4' },
      { title: 'Real Estate', category: 'real-estate', path: 'vanya-resort.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'Abhi.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'cocktail-timeline.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'cocktail-valentain-v3.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'delta-fitness.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'nido-cocktail.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'nido-valnatine.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'finance-r15.mp4' },
      { title: 'Commercial', category: 'commercial', path: '2nd-bag.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'bracelet.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'nido-cricket-poster.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'pink-bag.mp4' },
      { title: 'Commercial', category: 'commercial', path: 'one-type-rakshi-tech.mp4' },
      { title: 'School Works', category: 'school-works', path: 'euro-kids-pink-day.mp4' },
      { title: 'School Works', category: 'school-works', path: 'euro-kids-holi.mp4' },
      { title: 'School Works', category: 'school-works', path: 'euro-kids-annual-day.mp4' },
      { title: 'Logo Reveal', category: 'logo-reveal', path: 'logo-reveal-1.mp4' },
      { title: 'Podcasts', category: 'podcasts', path: 'mundhe-banni.mp4' },
    ],
  },
];
