import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import Pagination from "~/components/common/pagination";
import { useDebounce } from "~/hooks/use-debounce";
import { getProductByCategorySlug } from "~/services/products";
import type { Product } from "~/types/product/product";
import ProductFilterBar from "./components/product-filter-bar";
import ProductGrid from "./components/product-grid";
import type { FilterState } from "./types/product-category-slug-filter-props";
import ProductCardSkeleton from "~/components/ui/product-card-skeleton";

export default function Categories() {
  const { slug } = useParams<{ slug: string }>();
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    orderBy: "az",
    minPrice: undefined,
    maxPrice: undefined,
    outOfStock: false,
    inStock: false,
  });
  const debouncedFilters = useDebounce(filters, 800);

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProductByCategorySlug(slug, {
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
        console.log(response);
        setPagination((prev) => ({
          ...prev,
          totalPages: response.data.totalPages ?? 0,
          totalCount: response.data.totalCount ?? 0,
          currentPage: response.data.pageNumber ?? prev.currentPage,
          pageSize: response.data.pageSize ?? prev.pageSize,
        }));
        setProducts(response.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [slug, debouncedFilters, pagination.currentPage]);

  useEffect(() => {
    if (!slug) return;
    setPagination((prev) =>
      prev.currentPage === 1 ? prev : { ...prev, currentPage: 1 }
    );
  }, [slug, filters, debouncedFilters]);

  return (
    <div ref={mainRef} className="max-w-[1280px] mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="font-bold text-xl md:text-2xl">Áo</h1>
      </div>

      <ProductFilterBar
        filters={filters}
        setFilters={setFilters}
        totalCount={pagination.totalCount}
      />

      <div className="flex flex-col md:flex-row mt-4 min-h-[calc(100vh-180px)]">
        <main className={`w-full py-4`}>
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              {products.length > 0 && (
                <div className="mt-8 pb-8 flex justify-center">
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}
