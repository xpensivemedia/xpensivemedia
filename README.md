# Xpensive Media Portfolio

A modern, interactive portfolio website for Xpensive Media, showcasing creative projects, services, and brand identity.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Services](#services)
- [Portfolio](#portfolio)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Responsive, animated landing page
- Dynamic portfolio with categorized video and image showcases
- Services section with detailed cards
- About page with brand story and stats
- Contact form
- Smooth navigation and scroll animations
- Error boundaries for robust UX
- Integration with Firebase and Supabase for data and media
- Modern UI with Tailwind CSS, MUI, and custom gradients

## Demo

Live demo: [https://xpensivemedia.vercel.app] , [https://xpensivemedia.vercel.app]

## Project Structure

- `src/`
  - `components/`: Reusable UI components (Navbar, CardProject, Modal, etc.)
  - `Pages/`: Main pages (Home, About, Services, Portfolio, Contact, Showcase)
  - `constants/`: Project data and configuration
  - `assets/`: Images, PDFs, and other static files
  - `styles/`: Custom CSS
  - `firebase.js`, `supabase.js`: Backend integrations

## Tech Stack

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

## Setup & Installation

1. **Clone the repository:**
   ```
   git clone <repo-url>
   cd Xpensive Media Portfolio
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start development server:**
   ```
   npm run dev
   ```

4. **Build for production:**
   ```
   npm run build
   ```

## Firebase & Supabase Configuration

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In your project, add a web app and copy the Firebase config object.
3. In your project, create a `.env` file or directly update `src/firebase.js` with your config:
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
4. Replace the placeholder values with your actual Firebase project credentials.

### Supabase Setup

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. In your Supabase project, go to Project Settings > API and copy your `SUPABASE_URL` and `SUPABASE_KEY`.
3. In your project, create a `.env` file or directly update `src/supabase.js`:
   ```js
   // src/supabase.js
   import { createClient } from '@supabase/supabase-js';
   const supabaseUrl = "YOUR_SUPABASE_URL";
   const supabaseKey = "YOUR_SUPABASE_KEY";
   export const supabase = createClient(supabaseUrl, supabaseKey);
   ```
4. Replace the placeholder values with your actual Supabase credentials.

> For security, use environment variables and never commit your keys to public repositories.

## Usage

- Visit the homepage for an animated introduction.
- Explore the About, Services, Portfolio, and Contact pages.
- Portfolio section displays categorized video/image projects.
- Services section highlights offerings with images and descriptions.

## Services

- Corporate Events
- Bars & Restaurants
- Real Estate
- Testimonials
- Digital Marketing
- Social Media Management
- Influencer Marketing
- Podcast Production

## Portfolio

Sample projects include:
- Logo Reveal Animation
- Car Delivery Video Edit
- Podcast Reel Sample

See `src/constants/projects.js` for more.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is [MIT](LICENSE) licensed.

## Contact
- Gurudeep V
- [Portfolio Website](https://xpensivemedia.vercel.app)
- [Email](mailto:xpensivemedia.co@gmail.com)


! **Readme by DEEPS** !

To edit Download CV and View projects - first you need to import the file to src>assets>file. goto About.jsx and in line 261 you can find //make sure to change the name at 14 line import ResumePDF from '../assets/Gurudeep V Resume.pdf';

To edit TOTAL PROJECTS, HAPPY CLIENTS, YEARS OF EXPERIENCE data - goto to About.jsx and in line 195 you will find it . Total project automatic count is set to 50+ , you can change to automatic by replacing 50+ to totalProjects in line 201 , value: "50+", to value: totalProjects,

