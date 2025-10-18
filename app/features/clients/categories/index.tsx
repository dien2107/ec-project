import { useState, useMemo, useCallback, useEffect } from "react";
import { Funnel } from "lucide-react";
import ProductCard from "~/components/ui/product-card";
import Pagination from "~/components/common/pagination";
import type { FilterState } from "./types/product-category-slug-filter-props";
import { useParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { getProductByCategorySlug } from "~/services/products";
import { fakeProducts } from "~/features/clients/categories/data/products";
import ProductFilterBar from "./components/product-filter-bar";

export default function Categories() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [filters, setFilters] = useState<FilterState>({
    colorIds: [],
    materialIds: [],
    productGroupIds: [],
    orderBy: "",
    minPrice: undefined,
    maxPrice: undefined,
    outOfStock: undefined,
    inStock: undefined,
  });

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
          pageNumber: currentPage,
          pageSize: pageSize,
        });

        setProducts(response.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [slug, filters]);

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="font-bold text-xl md:text-2xl">Áo</h1>
      </div>

      <ProductFilterBar filters={filters} setFilters={setFilters} />

      <div className="flex flex-col md:flex-row mt-4 min-h-[calc(100vh-180px)]">
        <main className={`w-full py-4`}>
          {/* <ProductGrid products={displayedProducts} />

          <div className="mt-8 pb-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div> */}
        </main>
      </div>
    </div>
  );
}
