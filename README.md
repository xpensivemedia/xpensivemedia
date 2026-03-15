# 🚀 Xpensive Media Portfolio

A modern, interactive portfolio website for Xpensive Media, showcasing creative projects, services, and brand identity.

## 📔 Table of Contents
- [Features](#features)
- [Demo](#demo)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Firebase & Supabase Configuration](#firebase--supabase-configuration)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Services](#services)
- [Portfolio](#portfolio)
- [Stats](#stats)
- [Contribute](#contribute)
- [Acknowledgements](#acknowledgements)
- [License](#license)
- [Contact](#contact)

---

## ✨ Features
- Responsive, animated landing page
- Dynamic portfolio with categorized video and image showcases
- Services section with detailed cards
- About page with brand story and stats
- Contact form
- Smooth navigation and scroll animations
- Error boundaries for robust UX
- Integration with Firebase and Supabase for data and media
- Modern UI with Tailwind CSS, MUI, and custom gradients

## 🌐 Demo
Live demo: [https://xpensivemedia.vercel.app]

## ‼️ Folder Structure
```
Xpensive Media Portfolio/
├── public/
│   ├── CardProject_images/
│   ├── services-images/
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── Pages/
│   ├── styles/
│   ├── firebase.js
│   ├── supabase.js
│   └── ...
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## ⚙️ Tech Stack
- React 18
- Vite
- Tailwind CSS
- MUI (Material UI)
- Framer Motion, GSAP, AOS (animations)
- Firebase, Supabase (backend)
- Headless UI, Shadcn UI
- Lottie animations
- React Router
- Styled Components

## 🧰 Setup & Installation
1. Make sure Git and NodeJS are installed.
2. Clone this repository:
   ```bash
   git clone <repo-url>
   cd Xpensive Media Portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## 🔑 Firebase & Supabase Configuration
### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a web app and copy the Firebase config object.
3. Create a `.env` file or update `src/firebase.js`:
   ```js
   // src/firebase.js
   import { initializeApp } from "firebase/app";
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   const app = initializeApp(firebaseConfig);
   export default app;
   ```
4. Replace placeholders with your actual Firebase credentials.

### Supabase Setup
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Copy your `SUPABASE_URL` and `SUPABASE_KEY` from Project Settings > API.
3. Create a `.env` file or update `src/supabase.js`:
   ```js
   // src/supabase.js
   import { createClient } from '@supabase/supabase-js';
   const supabaseUrl = "YOUR_SUPABASE_URL";
   const supabaseKey = "YOUR_SUPABASE_KEY";
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```
4. Replace placeholders with your actual Supabase credentials.

> For security, use environment variables and never commit your keys to public repositories.

## 💻 Usage
- Visit the homepage for an animated introduction.
- Explore the About, Services, Portfolio, and Contact pages.
- Portfolio section displays categorized video/image projects.
- Services section highlights offerings with images and descriptions.

## 📷 Screenshots
> Some screenshots of the website

> Home Page
- ![Animated Home Page](public/screenshots/home.png)
> About Page
- ![Modern About Page](public/screenshots/about.png)
> Works Page
- ![Showcase your projects](public/screenshots/works.png)
> Contact Page
- ![Functional Contact form](public/screenshots/contact.png)

## 🛠️ Services
- Corporate Events
- Bars & Restaurants
- Real Estate
- Testimonials
- Digital Marketing
- Social Media Management
- Influencer Marketing
- Podcast Production

## 🎬 Portfolio
Sample projects include:
- Logo Reveal Animation
- Car Delivery Video Edit
- Podcast Reel Sample
See `src/constants/projects.js` for more.

## 🔧 Stats
- [PageSpeed Insights - Vercel](https://pagespeed.web.dev/analysis?url=https://xpensivemedia.vercel.app)
- [PageSpeed Insights - Netlify](https://pagespeed.web.dev/analysis?url=https://gurudeepv-portfolio.netlify.app)

## 🙌 Contribute
You might encounter some bugs while using this app. You are more than welcome to contribute. Just submit changes via pull request and I will review them before merging. Make sure you follow community guidelines.

## 💎 Acknowledgements
- [framer-motion](https://www.npmjs.com/package/framer-motion)
- [react](https://www.npmjs.com/package/react)
- [react-dom](https://www.npmjs.com/package/react-dom)
- [react-router-dom](https://www.npmjs.com/package/react-router-dom)
- [tailwindcss](https://www.npmjs.com/package/tailwindcss)
- [vite](https://www.npmjs.com/package/vite)
- [supabase](https://www.npmjs.com/package/@supabase/supabase-js)
- [firebase](https://www.npmjs.com/package/firebase)
- [mui](https://mui.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## © License
This project is licensed under the MIT License. See the LICENSE file for details.

## 📬 Contact
- Gurudeep V
- [Portfolio Website](https://xpensivemedia.vercel.app)
- [Email](mailto:xpensivemedia.co@gmail.com)

---

> **Readme by DEEPS**

To edit Download CV and View projects - first you need to import the file to src/assets/file. Go to About.jsx and in line 261 you can find:
// make sure to change the name at line 14: import ResumePDF from '../assets/Gurudeep V Resume.pdf';

To edit TOTAL PROJECTS, HAPPY CLIENTS, YEARS OF EXPERIENCE data - go to About.jsx and in line 195 you will find it. Total project automatic count is set to 50+, you can change to automatic by replacing 50+ to totalProjects in line 201: value: "50+", to value: totalProjects,

