import { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router";

interface SearchSuggestion {
  id: number;
  name: string;
  image: string;
  category: string;
  price: number;
}

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingSearches] = useState([
    "Áo thun",
    "Áo khoác",
    "Quần jeans",
    "Áo polo",
  ]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock data - Replace with actual API call
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: 1,
      name: "Áo Thun Waffle Thoáng Mát Non Branded 01 Đen",
      image: "/api/placeholder/80/80",
      category: "Áo Thun",
      price: 299000,
    },
    {
      id: 2,
      name: "Áo Polo Pique Thoáng Mát Non Branded 03 Đen",
      image: "/api/placeholder/80/80",
      category: "Áo Polo",
      price: 399000,
    },
    {
      id: 3,
      name: "Áo Polo Pique Thoáng Mát Non Branded 03 Trắng",
      image: "/api/placeholder/80/80",
      category: "Áo Polo",
      price: 399000,
    },
    {
      id: 4,
      name: "Áo Khoác Gió Trượt Nước Seventy Seven 40 Đen",
      image: "/api/placeholder/80/80",
      category: "Áo Khoác",
      price: 599000,
    },
    {
      id: 5,
      name: "Áo Thun Waffle Thoáng Mát Non Branded 01 Trắng",
      image: "/api/placeholder/80/80",
      category: "Áo Thun",
      price: 299000,
    },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      // Simulate API call
      const timer = setTimeout(() => {
        const filtered = mockSuggestions.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity duration-300" />

      {/* Search Container */}
      <div className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top duration-300">
        <div className="bg-white shadow-2xl border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div ref={searchRef} className="space-y-6">
              {/* Search Input */}
              <div className="relative">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-6 py-4 border-2 border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200 shadow-sm">
                  <Search className="w-6 h-6 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Tìm kiếm sản phẩm, danh mục..."
                    className="flex-1 bg-transparent outline-none text-lg placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>            
              {/* Search Results */}
              {searchQuery && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      SẢN PHẨM
                    </h3>
                    {suggestions.length > 0 && (
                      <button
                        onClick={handleSearch}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        Xem tất cả
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl animate-pulse"
                        >
                          <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {suggestions.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-gray-200 hover:shadow-sm"
                        >
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg bg-gray-100"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {product.category}
                            </p>
                            <p className="text-sm font-semibold text-blue-600 mt-1">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">
                        Không tìm thấy sản phẩm phù hợp với "{searchQuery}"
                      </p>
                      <button
                        onClick={handleSearch}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Thử tìm kiếm với từ khóa khác
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
}
