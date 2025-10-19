import { useState, useMemo, useCallback, useEffect } from "react";
import { Funnel } from "lucide-react";
import ProductCard from "~/components/ui/product-card";
import Pagination from "~/components/common/pagination";
import type { FilterState } from "./types/product-category-slug-filter-props";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { getProductByCategorySlug } from "~/services/products";
import ProductFilterBar from "./components/product-filter-bar";
import { useDebounce } from "~/hooks/use-debounce";
import ProductGrid from "./components/product-grid";
import type { Product } from "~/types/product";

export default function Categories() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);

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
    outOfStock: undefined,
    inStock: undefined,
  });
  const debouncedFilters = useDebounce(filters, 800);

  console.log(filters);

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      try {
        const response = await getProductByCategorySlug(slug, {
          colorIds: filters.colorIds,
          materialIds: filters.materialIds,
          productGroupIds: filters.productGroupIds,
          orderBy: filters.orderBy,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
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
    <div className="max-w-[1280px] mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="font-bold text-xl md:text-2xl">Áo</h1>
      </div>

      <ProductFilterBar filters={filters} setFilters={setFilters} />

      <div className="flex flex-col md:flex-row mt-4 min-h-[calc(100vh-180px)]">
        <main className={`w-full py-4`}>
          <ProductGrid products={products} />

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
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
