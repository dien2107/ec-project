import React from "react";
import { X } from "lucide-react";
import type { FilterState } from "../types/product-category-slug-filter-props";
import { Badge } from "~/components/ui/badge";
import { formatVND } from "~/libs";

export default function ProductFilterBadge({
  filters,
  setFilters,
  selectedColors = [],
  selectedMaterials = [],
  selectedProductGroups = [],
  selectedStockStatuses = [],
  handleClearFilter,
  onClearAllFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedColors: Array<{ label: string; value: number }>;
  selectedMaterials: Array<{ label: string; value: number }>;
  selectedProductGroups: Array<{ label: string; value: number }>;
  selectedStockStatuses: Array<{ label: string; value: boolean }>;
  handleClearFilter: (id: number | boolean, option: string) => void;
  onClearAllFilters?: () => void;
}) {
  const handleClearAllFilter = () => {
    setFilters({
      colorIds: [],
      materialIds: [],
      productGroupIds: [],
      orderBy: "date_newest",
      minPrice: undefined,
      maxPrice: undefined,
      outOfStock: undefined,
      inStock: undefined,
    });
    onClearAllFilters?.();
  };

  // whether any filter is active
  const anySelected =
    (selectedColors?.length ?? 0) +
      (selectedMaterials?.length ?? 0) +
      (selectedProductGroups?.length ?? 0) +
      (selectedStockStatuses?.length ?? 0) +
      (filters.minPrice != null && filters.minPrice > 0 ? 1 : 0) +
      (filters.maxPrice != null && filters.maxPrice > 0 ? 1 : 0) >
    0;

  return (
    <>
      {/* Tag hiển thị filter */}
      <div className="flex flex-wrap gap-3">
        {/* Colors */}
        {selectedColors?.map((c) => {
          return (
            <Badge
              variant="secondary"
              className="cursor-pointer bg-white border-gray-300 px-2 py-1 hover:border-black"
              key={`color-${String(c.value)}`}
              onClick={() => handleClearFilter(c.value, "color")}
            >
              Màu: {c.label}
              <X size={14} />
            </Badge>
          );
        })}

        {/* Materials */}
        {selectedMaterials?.map((c) => {
          return (
            <Badge
              variant="secondary"
              className="cursor-pointer bg-white border-gray-300 px-2 py-1 hover:border-black"
              key={`material-${String(c.value)}`}
              onClick={() => handleClearFilter(c.value, "material")}
            >
              Chất liệu: {c.label}
              <X size={14} />
            </Badge>
          );
        })}
        {/* Bộ sưu tập */}
        {selectedProductGroups?.map((c) => {
          return (
            <Badge
              variant="secondary"
              className="cursor-pointer bg-white border-gray-300 px-2 py-1 hover:border-black"
              key={`group-${String(c.value)}`}
              onClick={() => handleClearFilter(c.value, "productGroup")}
            >
              Bộ sưu tập: {c.label}
              <X size={14} />
            </Badge>
          );
        })}

        {/* Price */}
        {((filters.minPrice != null && filters.minPrice > 0) ||
          (filters.maxPrice != null && filters.maxPrice > 0)) && (
          <Badge
            variant="secondary"
            className="cursor-pointer bg-white border-gray-300 px-2 py-1 hover:border-black"
            key="price"
            onClick={() => handleClearFilter(0, "price")}
          >
            Giá:{" "}
            {filters.minPrice != null && "từ " + formatVND(filters.minPrice)}
            {filters.maxPrice != null &&
              filters.maxPrice > 0 &&
              " đến " + formatVND(filters.maxPrice)}
            <X size={14} />
          </Badge>
        )}

        {/* In Stock/Out of Stock */}
        {selectedStockStatuses?.map((c) => {
          return (
            <Badge
              variant="secondary"
              className="cursor-pointer bg-white border-gray-300 px-2 py-1 hover:border-black"
              key={`stock-${String(c.value)}`}
              onClick={() => handleClearFilter(c.value, "stock")}
            >
              {c.label}
              <X size={14} />
            </Badge>
          );
        })}

        {/* Clear All */}
        {anySelected && (
          <span
            className="flex items-center justify-center gap-2 cursor-pointer text-sm  bg-white px-2 py-1 border-b-1 border-b-black hover:border-b-2"
            key="clear-all"
            onClick={() => handleClearAllFilter()}
          >
            Xóa tất cả
            <X size={14} />
          </span>
        )}
      </div>
    </>
  );
}
