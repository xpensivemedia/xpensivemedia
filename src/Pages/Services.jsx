import React, { memo } from "react";

const Services = memo(() => {
  // Services data with unique images and text for each card
  const servicesData = [
    {
      id: 1,
      title: "Corporate Events",
      description:
        "We plan and manage professional corporate events that are seamless, impactful, and aligned with your brand. From conferences to product launches, we handle every detail to deliver a smooth and memorable experience.",
      image: "/services-images/corporate-events.jpg",
    },
    {
      id: 2,
      title: "Bars & Restaurants",
      description:
        "We shoot and edit high-quality photos and videos that showcase your food, drinks, and atmosphere, helping your brand stand out and attract cust.",
      image: "/services-images/bars-restaurants.jpg",
    },
    {
      id: 3,
      title: "Real Estate",
      description:
        "We shoot and edit professional photos and videos that highlight properties, enhance listings, and attract buyers.Our visuals focus on space, lighting, and detail to present each property at its best and drive faster engagement.",
      image: "/services-images/real-estate.jpg",
    },
    {
      id: 4,
      title: "Testimonials",
      description:
        "We produce professional testimonial shoots that capture genuine client experiences with clarity and authenticity. From planning to filming and editing, we ensure each testimonial feels natural, credible, and aligned with your brand.",
      image: "/services-images/testimonials.jpg",
    },
    {
      id: 5,
      title: "Digital Marketing",
      description:
        "We create data-driven digital marketing strategies that increase visibility, engagement, and conversions.From social media to online campaigns, we help brands connect with the right audience and grow consistently.",
      image: "/services-images/digital-marketing.jpg",
    },
    {
      id: 6,
      title: "Social Media",
      description:
        "We manage your social media presence with strategic content, consistent posting, and audience engagement.Our approach helps build brand identity, grow followers, and maintain a strong online presence.",
      image: "/services-images/social-media.jpg",
    },
    {
      id: 7,
      title: "Influencer Marketing",
      description:
        "We connect brands with relevant influencers to create authentic, engaging campaigns From strategy to execution, we manage collaborations that increase reach, trust, and brand awareness.",
      image: "/services-images/influencer-marketing.jpg",
    },
    {
      id: 8,
      title: "Podcast",
      description:
        "We handle podcast recording, editing, and production with a focus on clear sound and polished visuals.From setup to final delivery, we help create podcasts that engage audiences and elevate your brand.",
      image: "/services-images/podcast.jpg",
    },
  ];

  return (
    // add id so hash links (#Services) can find this section
    <section id="Services" className="w-full relative overflow-hidden py-16 bg-transparent">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* transparent base so underlying page background/grid shows through */}
        <div className="absolute inset-0 bg-transparent" />

        {/* subtle layered radial glows (indigo -> purple) */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10% 20%, rgba(99,102,241,0.16), transparent 18%)," +
              "radial-gradient(circle at 85% 75%, rgba(168,85,247,0.12), transparent 22%)",
          }}
        />

        {/* larger soft blur blobs for extra depth */}
        <div className="absolute -inset-40 opacity-30">
          <div
            className="absolute -inset-40 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.14), transparent 25%)",
            }}
          />
          <div
            className="absolute -inset-56 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 80% 70%, rgba(168,85,247,0.10), transparent 26%)",
            }}
          />
        </div>

        {/* faint grid lines like Home: two perpendicular repeating linear-gradients */}
        <div
          className="absolute inset-0 opacity-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "36px 36px, 36px 36px",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 bg-transparent">
        <h3
          className="text-center text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          We Offer
        </h3>

        {/* Change grid to show 2 columns on mobile and desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {servicesData.map((service, i) => (
            <div
              key={service.id}
              className="w-full flex flex-col items-start gap-2 bg-transparent p-3 sm:p-4 rounded-lg"
              data-aos="fade-up"
              data-aos-duration={900 + i * 50}
            >
              <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-r from-purple-700 to-indigo-600 shadow-lg border border-white/10 p-1">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>

              <div className="w-full">
                <h4 className="text-white font-bold text-xs sm:text-base mb-1">
                  {service.title}
                </h4>
                <p className="text-[0.6rem] sm:text-xs text-gray-300 leading-tight">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Services.displayName = "Services";

export default Services;