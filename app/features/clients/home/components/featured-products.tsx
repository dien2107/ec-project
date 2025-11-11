import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "~/components/ui/product-card";
import type { Product } from "~/types/home-page";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const atStart = scrollLeft <= 10;
    const atEnd = scrollLeft >= scrollWidth - clientWidth - 10;

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);
  }, []);
  useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkScroll]);
  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const amount = 320;

    if (direction === "right") {
      // Nếu gần cuối, quay về đầu
      if (scrollLeft >= scrollWidth - clientWidth - 50) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
      }
    } else {
      // Nếu ở đầu, nhảy về cuối
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

  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center mb-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <h2 className="text-3xl font-bold text-gray-900 mx-8 tracking-wide uppercase">
          Sản phẩm nổi bật
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
          className={`
            hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
            bg-white shadow-lg rounded-full p-3
            hover:bg-gray-100 transition-all duration-300
            ${isHovered ? "opacity-100 -translate-x-2" : "opacity-0"}
          `}
          aria-label="Cuộn trái"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div className="flex gap-4 md:gap-6 snap-x snap-mandatory">
            {products.map((product, index) => (
              <div
                key={product.productId}
                className="snap-start flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-64 opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <ProductCard
                  id={product.productId}
                  title={product.name}
                  slug={`${product.slug}`}
                  price={product.salePrice || product.price}
                  oldPrice={product.price}
                  discount={product.discountPercentage}
                  image={product.thumbnail}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scroll("right")}
          className={`
            hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
            bg-white shadow-lg rounded-full p-3
            hover:bg-gray-100 transition-all duration-300
            ${isHovered ? "opacity-100 translate-x-2" : "opacity-0"}
          `}
          aria-label="Cuộn phải"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>
      </div>
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
