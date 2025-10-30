import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { NavLink } from "react-router";
import { fakeProducts } from "../data/products";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "₫";
}

function Countdown({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center space-x-1 text-xs">
      <Clock className="h-3 w-3" />
      <span className="font-mono">
        {String(timeLeft.hours).padStart(2, "0")}:
        {String(timeLeft.minutes).padStart(2, "0")}:
        {String(timeLeft.seconds).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function SpecialDeals() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const flashSaleEnd = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const amount = 320;

    if (direction === "right") {
      if (scrollLeft >= scrollWidth - clientWidth - 50) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 50) {
        scrollRef.current.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollBy({ left: -amount, behavior: "smooth" });
      }
    }

    setTimeout(checkScroll, 400);
  }; 
  const dealProducts = fakeProducts.filter((p) => p.discount >= 20);

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
          <h2 className="text-3xl font-bold text-gray-900 mx-8 tracking-wide uppercase">
            Ưu đãi đặc biệt
          </h2>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
        </div>
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            onClick={() => scroll("left")}
            className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all duration-300 ${
              isHovered ? "opacity-100 -translate-x-2" : "opacity-0"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="overflow-x-auto scrollbar-hide scroll-smooth"
          >
            <div className="flex gap-6 md:gap-6">
              {dealProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-full sm:w-64 md:w-64"
                >
                  <NavLink
                    to={`/products/${product.slug}`}
                    className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <Badge
                        variant={
                          product.tag === "Sale" ? "destructive" : "default"
                        }
                        className="absolute top-3 left-3 text-xs font-bold px-3 py-1"
                      >
                        {product.tag}
                      </Badge>
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        -{product.discount}%
                      </div>
                      {product.discount >= 25 && (
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                          <Countdown endTime={flashSaleEnd} />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 group-hover:text-black transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold text-base">
                          {formatPrice(product.price)}
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          {formatPrice(product.oldPrice)}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-x-2" : "opacity-0"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>

\        <div className="flex justify-center mt-12">
          <Button
            size="lg"
            className="bg-gray-900 text-white hover:bg-gray-800 font-semibold px-8 py-6 text-base"
          >
            XEM THÊM
          </Button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
