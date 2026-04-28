import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Slider from 'react-slick';
import { getSupabaseImageUrl } from '../utils/supabaseImages';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const projects = [
  {
    id: 1,
    title: 'The Wed 24',
    description: 'Developed a dynamic Full-Stack web application using HTML for Kiran A N, an creative Photographer.',
    image: getSupabaseImageUrl('website-projects-images', 'thewed24.webp'),
    url: 'https://thewed24.com'
  },
  {
    id: 2,
    title: 'Likhith Portfolio',
    description: 'Developed a dynamic 3D web applications using React js for Likhith D A, an creative video editor.',
    image: getSupabaseImageUrl('website-projects-images', 'likhith-portfolio.webp'),
    url: 'https://portfolio-likhith.vercel.app'
  },
  {
    id: 3,
    title: 'South-Indian Wedding Invitation',
    description: 'Developed a south-indian wedding invitation dynamic web applications using React js.',
    image: getSupabaseImageUrl('website-projects-images', 'weddinginvitation-vg.webp'),
    url: 'https://wedding-invitation-vg.vercel.app'
  },
  {
    id: 4,
    title: 'Goat Ready Mutton Predictor',
    description: 'Developed a dynamic Full-Stack web application using React js for Goat Ready Mutton Predictor.',
    image: getSupabaseImageUrl('website-projects-images', 'goatreadymutton.webp'),
    url: 'https://goat-ready-mutton.vercel.app'
  },
  {
    id: 5,
    title: 'Karunadu Editors Club',
    description: 'Developed and maintaining a dynamic web applications using HTML for Karnataka Editors, service provided for Karnataka Editors.',
    image: getSupabaseImageUrl('website-projects-images', 'kec.webp'),
    url: 'https://karunadu-editors-club.vercel.app'
  },
  {
    id: 6,
    title: 'M S Properties',
    description: 'Developed a dynamic web applications using HTML for Yogesh Gowda, a most popular Real-estate Business.',
    image: getSupabaseImageUrl('website-projects-images', 'ms-properties.webp'),
    url: 'https://ms-properties.vercel.app'
  },
];

const WebsiteProjects = () => {
  const [loadedImages, setLoadedImages] = useState({});

  const handleImageLoaded = (id) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    appendDots: dots => (
      <div className="slider-dots" style={{ marginTop: 16 }}>
        {dots}
      </div>
    ),
    customPaging: () => (
      <button type="button" className="website-dot" />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const PrevArrow = ({ className, style, onClick }) => (
    <button
      type="button"
      aria-label="Previous"
      className="nav-button prev"
      onClick={onClick}
      style={{ ...style, left: -40, right: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 45, height: 45 }}
    >
      <ChevronLeft size={18} />
    </button>
  );

  const NextArrow = ({ className, style, onClick }) => (
    <button
      type="button"
      aria-label="Next"
      className="nav-button next"
      onClick={onClick}
      style={{ ...style, right: -40, left: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 45, height: 45 }}
    >
      <ChevronRight size={18} />
    </button>
  );

  return (
    <section id="WebsiteProjects" className="py-16">
      <style>{`
        .website-projects-slider .slick-dots {
          position: static;
          width: 100%;
          margin-top: 20px;
          padding: 0;
          display: flex !important;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }
        .website-projects-slider .slick-dots li {
          width: auto;
          height: auto;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .website-projects-slider .slick-dots li button {
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 0;
        }
        .website-projects-slider .slick-dots li button:before {
          content: none;
        }
        .website-projects-slider .website-dot {
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(255, 255, 255, 0.7);
          transition: all 0.25s ease;
        }
        .website-projects-slider .slick-dots li.slick-active .website-dot {
          width: 26px;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          border-color: transparent;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-center">Website Projects</h3>
        <Slider {...settings} className="website-projects-slider" prevArrow={<PrevArrow/>} nextArrow={<NextArrow/>}>
          {projects.map(p => (
            <div key={p.id} className="px-3">
              <div className="bg-[#0b0720] rounded-2xl p-6 shadow-lg border border-white/5 h-full flex flex-col justify-between">
                <div>
                  <div className="rounded-lg overflow-hidden mb-6">
                    {!loadedImages[p.id] && (
                      <div className="w-full h-44 rounded-lg bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-pulse" />
                    )}
                    <img
                      src={p.image}
                      alt={p.title}
                      className={`w-full h-44 object-cover rounded-lg ${loadedImages[p.id] ? 'opacity-100' : 'opacity-0'}`}
                      loading="lazy"
                      onLoad={() => handleImageLoaded(p.id)}
                      onError={() => handleImageLoaded(p.id)}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{p.description}</p>
                </div>

                <div className="flex justify-center mt-4">
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-block bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white px-4 py-2 rounded-lg">Live Website</a>
                </div>
              </div>
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
};

export default WebsiteProjects;
