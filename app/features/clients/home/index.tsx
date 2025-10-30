import { useEffect } from "react";
import Banner from "./components/banner";
import FeaturedProducts from "./components/featured-products";
import SpecialDeals from "./components/special-deals";

export default function Home() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-white">
      <Banner />
      <FeaturedProducts />
      <SpecialDeals />
    </main>
  );
}
