import { useEffect, useState } from "react";
import { assetUrl, getBanners } from "../services/api";

const fallbackBanners = [
  "/images/hero.webp",
  "/images/football.webp",
  "/images/basketball.webp",
];

function Hero() {
  const [banners, setBanners] = useState(fallbackBanners);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getBanners()
      .then((data) => {
        const uploadedBanners = data
          .map((banner) => assetUrl(banner.image))
          .filter(Boolean);

        if (uploadedBanners.length > 0) {
          setBanners(uploadedBanners);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((previous) => (previous + 1) % banners.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [banners.length]);

  return (
    <section id="home" className="hero">
      <div className="hero-copy">
        <p>SportifyX store</p>
        <h1>Sports gear that is ready for match day</h1>
        <a href="#products">Shop Products</a>
      </div>

      <div className="hero-media" aria-label="Featured sports collection">
        <img src={banners[current]} alt="Featured sports products" />

        <div className="banner-dots" aria-hidden="true">
          {banners.map((banner, index) => (
            <span
              key={`${banner}-${index}`}
              className={index === current ? "dot active-dot" : "dot"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
