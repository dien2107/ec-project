import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  ChevronRight,
  ArrowRight,
  Search as SearchIcon,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { useDebounce } from "~/hooks/use-debounce";
import { getProductCatelog } from "~/services/products";
import type { Product } from "~/types/product/product";
import { Input } from "~/components/ui/input";

type SearchBarDropdownProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
};

export default function SearchBarDropdown({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  onClear,
}: SearchBarDropdownProps) {
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      try {
        setIsLoadingSuggestions(true);
        const response = await getProductCatelog({
          search: debouncedSearch,
          pageNumber: 1,
          pageSize: 5,
        });
        setSuggestions(response.data.items);
        setShowDropdown(true); // Always show dropdown when searching
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowDropdown(true);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
      <h1 className="text-3xl font-normal text-center mb-8 text-gray-800">
        Kết quả tìm kiếm
      </h1>

      <div className="max-w-4xl mx-auto mb-12 relative" ref={dropdownRef}>
        <form onSubmit={onSubmit} className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              if (e.target.value.trim().length >= 2) {
                setShowDropdown(true);
              }
            }}
            onFocus={() => {
              if (searchQuery.trim().length >= 2) {
                setShowDropdown(true);
              }
            }}
            className="w-full h-12 px-6 text-base border border-gray-300 rounded focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors pr-24"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setShowDropdown(false);
              }}
              className="absolute cursor-pointer right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Xóa tìm kiếm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            aria-label="Tìm kiếm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>

        {/* Dropdown Suggestions */}
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow-xl z-50 max-h-96 overflow-y-auto scrollbar-custom"
          >
            {isLoadingSuggestions ? (
              <div className="p-4 flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Đang tìm kiếm...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase">
                    Sản phẩm
                  </h3>
                  <button
                    onClick={() => {
                      onSubmit(new Event("submit") as any);
                      setShowDropdown(false);
                    }}
                    className="flex cursor-pointer items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Xem tất cả
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Product List */}
                <div className="divide-y divide-gray-100">
                  {suggestions.map((product, index) => (
                    <motion.div
                      key={product.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.08,
                        ease: "easeOut",
                      }}
                    >
                      <Link
                        to={`/products/${product.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={
                              product.primaryImage?.imageUrl ||
                              "/placeholder.png"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                            {product.category.name || "Chưa phân loại"}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-base font-semibold text-blue-600">
                              {product.sellingPrice?.toLocaleString("vi-VN")} ₫
                            </p>
                            {product.discountPercentage &&
                              product.discountPercentage > 0 && (
                                <>
                                  <p className="text-sm text-gray-400 line-through">
                                    {product.basePrice?.toLocaleString("vi-VN")}{" "}
                                    ₫
                                  </p>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                    -{product.discountPercentage}%
                                  </span>
                                </>
                              )}
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="flex-shrink-0">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="p-8 flex flex-col items-center justify-center text-center"
              >
                {/* Search Icon */}
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="w-8 h-8 text-gray-400" />
                </div>

                {/* Message */}
                <p className="text-gray-600 mb-1">
                  Không tìm thấy sản phẩm phù hợp với "{debouncedSearch}"
                </p>

                {/* Suggestion */}
                <button
                  onClick={() => {
                    onSubmit(new Event("submit") as any);
                    setShowDropdown(false);
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                >
                  Thử tìm kiếm với từ khóa khác
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
