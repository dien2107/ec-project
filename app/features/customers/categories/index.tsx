import { useState, useMemo, useCallback } from "react";
import { Funnel } from "lucide-react";
import ProductCard from "./components/product-card";
import Pagination from "~/components/common/pagination";
import type { PriceRange, CategoryFilters } from "./types";
import { useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { fakeProducts } from "~/features/customers/categories/data/products";

const PRODUCTS_PER_PAGE = 12;
const PRICE_RANGES = [
  { label: "Dưới 200.000₫", min: 0, max: 200000 },
  { label: "200.000₫ - 400.000₫", min: 200000, max: 400000 },
  { label: "Trên 400.000₫", min: 400000, max: Infinity },
] as const;

const SIZES = ["S", "M", "L", "XL"] as const;

const COLORS = [
  { name: "Black", class: "bg-black" },
  { name: "White", class: "bg-white border-gray-200 border-2" },
  { name: "Blue", class: "bg-blue-500" },
  { name: "Red", class: "bg-red-500" },
] as const;

export default function Categories() {
  const [filters, setFilters] = useState<CategoryFilters>({
    price: { label: "Any", min: 0, max: 10 },
    size: "10",
    color: "10",
  });

  const [hideFilter, setHideFilter] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(fakeProducts.length / PRODUCTS_PER_PAGE);

  const handlePriceChange = useCallback((range: PriceRange) => {
    setFilters((prev) => ({
      ...prev,
      price: range,
    }));
  }, []);

  const handleSizeChange = useCallback((size: string) => {
    setFilters((prev) => ({
      ...prev,
      size,
    }));
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setFilters((prev) => ({
      ...prev,
      color,
    }));
  }, []);

  const handleChangePage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        prev.set("page", page.toString());
        return prev;
      });
    },
    [setSearchParams]
  );

  const displayedProducts = useMemo(() => {
    return fakeProducts.slice(
      (currentPage - 1) * PRODUCTS_PER_PAGE,
      currentPage * PRODUCTS_PER_PAGE
    );
  }, [currentPage]);

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="font-bold text-xl md:text-2xl">Áo</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2 py-2 px-4 h-10"
          onClick={() => setHideFilter((prev) => !prev)}
          aria-label={hideFilter ? "Show filters" : "Hide filters"}
        >
          <Funnel size={16} />
          <span className="text-sm">Lọc</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row mt-4 min-h-[calc(100vh-180px)]">
        {!hideFilter && (
          <aside className="w-full md:w-1/4 md:pr-6 py-6 space-y-6 overflow-y-auto">
            <FilterSection title="Giá">
              {PRICE_RANGES.map((range, idx) => (
                <FilterCheckbox
                  key={idx}
                  id={`price-${idx}`}
                  label={range.label}
                  checked={filters.price?.min === range.min}
                  onChange={() => handlePriceChange(range)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Kích thước">
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <FilterButton
                    key={size}
                    label={size}
                    active={filters.size === size}
                    onClick={() => handleSizeChange(size)}
                  />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Màu sắc">
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color, idx) => (
                  <ColorFilter
                    key={idx}
                    color={color}
                    active={filters.color === color.name}
                    onClick={() => handleColorChange(color.name)}
                  />
                ))}
              </div>
            </FilterSection>
          </aside>
        )}

        <main className={`${hideFilter ? "w-full" : "w-full md:w-3/4"} py-4`}>
          <ProductGrid products={displayedProducts} />

          <div className="mt-8 pb-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

const FilterSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="font-medium mb-3">{title}</h3>
    {children}
  </div>
);

const FilterCheckbox = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <div className="flex items-center">
    <Checkbox
      id={id}
      className="mr-2 border-gray-400 cursor-pointer"
      checked={checked}
      onCheckedChange={onChange}
    />
    <label htmlFor={id} className="cursor-pointer text-sm">
      {label}
    </label>
  </div>
);

const FilterButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={active ? "default" : "outline"}
    className="h-8 px-3 text-xs md:text-sm"
    onClick={onClick}
  >
    {label}
  </Button>
);

const ColorFilter = ({
  color,
  active,
  onClick,
}: {
  color: { name: string; class: string };
  active: boolean;
  onClick: () => void;
}) => (
  <div
    className={`w-6 h-6 rounded-full ${color.class} cursor-pointer ${
      active ? "ring-2 ring-offset-2 ring-gray-400" : ""
    }`}
    title={color.name}
    onClick={onClick}
    aria-label={`Filter by ${color.name} color`}
  />
);

const ProductGrid = ({ products }: { products: typeof fakeProducts }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>
);
