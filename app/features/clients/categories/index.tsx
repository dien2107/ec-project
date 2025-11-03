import { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router";
import Pagination from "~/components/common/pagination";
import { useDebounce } from "~/hooks/use-debounce";
import { getProductCatelog } from "~/services/products";
import type { Product } from "~/types/product/product";
import ProductFilterBar from "./components/product-filter-bar";
import ProductGrid from "./components/product-grid";
import type { FilterState } from "./types/product-category-slug-filter-props";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SearchResultHeader from "./components/search-result-header";

export default function Categories() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = searchParams.get("q");

  const mainRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(q || "");
  const [categoryName, setCategoryName] = useState<string>("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 12,
  });
  const [filters, setFilters] = useState<FilterState>({
    colorIds: [],
    materialIds: [],
    productGroupIds: [],
    orderBy: "date_newest",
    minPrice: undefined,
    maxPrice: undefined,
    outOfStock: false,
    inStock: false,
  });
  const debouncedFilters = useDebounce(filters, 800);
  const [isFiltering, setIsFiltering] = useState(false);

  // Sync search query with URL param
  useEffect(() => {
    setSearchQuery(q || "");
  }, [q]);

  useEffect(() => {
    if (!slug && !q) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setIsFiltering(true); // Add this
        const response = await getProductCatelog({
          categorySlug: slug,
          search: q || undefined,
          colorIds: filters.colorIds,
          materialIds: filters.materialIds,
          productGroupIds: filters.productGroupIds,
          orderBy: filters.orderBy,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          outOfStock: filters.outOfStock,
          inStock: filters.inStock,
          pageNumber: pagination.currentPage,
          pageSize: pagination.pageSize,
        });

        // Set category name from response
        if (response.data.categoryName) {
          setCategoryName(response.data.categoryName);
        }

        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages ?? 0,
          totalCount: response.data.totalCount ?? 0,
          currentPage: response.data.pageNumber ?? prev.currentPage,
          pageSize: response.data.pageSize ?? prev.pageSize,
        }));
        setProducts(response.data.items);
        setIsSuccess(response.isSuccess);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
        setIsFiltering(false); // Add this
        setHasLoaded(true);
      }
    };

    fetchProducts();
  }, [slug, q, debouncedFilters, pagination.currentPage]);

  useEffect(() => {
    if (!slug && !q) return;
    setPagination((prev) =>
      prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }
    );
  }, [slug, q, filters, debouncedFilters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (isLoading && !hasLoaded) {
    return (
      <div ref={mainRef} className="max-w-[1280px] mx-auto p-4 md:p-6">
        {q && (
          <SearchResultHeader
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            onClear={handleClearSearch}
          />
        )}

        <div
          className="flex items-center justify-center gap-4 min-h-[60vh]"
          aria-live="polite"
        >
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="text-gray-700">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="max-w-[1280px] mx-auto p-4 md:p-6">
      {slug ? (
        <>
          {isSuccess ? (
            <motion.div
              key={categoryName}
              className="flex items-center justify-between pb-4 border-b border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1 className="font-medium text-4xl">{categoryName}</h1>
            </motion.div>
          ) : hasLoaded ? (
            <SearchResultHeader
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              onClear={handleClearSearch}
            />
          ) : null}
        </>
      ) : (
        <SearchResultHeader
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
        />
      )}

      {(slug || q) && (
        <>
          {isSuccess && (
            <ProductFilterBar
              filters={filters}
              setFilters={setFilters}
              totalCount={pagination.totalCount}
              isFiltering={isFiltering} // Add this prop
            />
          )}

          <div className="flex flex-col md:flex-row mt-4 min-h-[calc(100vh-180px)]">
            <main className={`w-full py-4`}>
              {hasLoaded ? <ProductGrid products={products} /> : null}

              {products.length > 0 && (
                <div className="mt-20 pb-8 flex justify-center">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(newPage: number) => {
                      setPagination((prev) =>
                        prev.currentPage === newPage
                          ? prev
                          : { ...prev, currentPage: newPage }
                      );

                      // Scroll to top
                      const headerOffset = 64;
                      const el = mainRef.current!;
                      const top =
                        el.getBoundingClientRect().top +
                        window.scrollY -
                        headerOffset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }}
                  />
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </div>
  );
}
