import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "~/redux/store";
import { useRef, useState, useEffect, useCallback } from "react";
import type { Category } from "~/types/home-page";

const categoryColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
];

// Patterns đơn giản và đẹp mắt cho từng category
const categoryPatterns = [
  "🏷️", // Tag
  "✨", // Sparkles
  "🎯", // Target
  "💎", // Diamond
  "🌟", // Star
  "🎨", // Art
  "🔥", // Fire
  "⚡", // Lightning
  "🎪", // Tent (unique)
  "🎭", // Theater masks
  "🎨", // Palette
  "💫", // Dizzy
];

export default function CategorySection() {
  const bestSellingCategories = useAppSelector(
    (state) => state.homePage.homeData?.bestSellingCategories || []
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Nếu không có bestSellingCategories thì ẩn section
  if (bestSellingCategories.length === 0) {
    return null;
  }

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
    const amount = 200;

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

  return (
    <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <h2 className="text-3xl font-bold text-gray-900 mx-8 tracking-wide uppercase">
          Danh mục sản phẩm
        </h2>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>

      {/* Categories Scroll */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow */}
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

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto scrollbar-hide scroll-smooth"
        >
          <div className="flex gap-4 md:gap-6">
            {bestSellingCategories.map((category, index) => (
              <CategoryCard
                key={category.categoryId}
                category={category}
                index={index}
                colorClass={categoryColors[index % categoryColors.length]}
              />
            ))}
          </div>
        </div>

        {/* Right Arrow */}
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

      {/* Custom CSS */}
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

function CategoryCard({
  category,
  index,
  colorClass,
}: {
  category: Category;
  index: number;
  colorClass: string;
}) {
  const subcategoryCount = category.children?.length || 0;
  // Lấy pattern/emoji tương ứng với index
  const pattern = categoryPatterns[index % categoryPatterns.length];

  return (
    <Link
      to={`/category/${category.slug}`}
      className="flex-shrink-0 w-40 sm:w-44 opacity-0 animate-fadeInUp group"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-100 group-hover:scale-105">
        {/* Gradient Circle with Emoji Pattern */}
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
          >
            <span className="text-3xl">{pattern}</span>
          </div>
        </div>

        {/* Category Name */}
        <h3 className="text-center text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {category.name}
        </h3>

        {/* Subcategory Count */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {subcategoryCount} loại
          </span>
        </div>
      </div>
    </Link>
  );
}
