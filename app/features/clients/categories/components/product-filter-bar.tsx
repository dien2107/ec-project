import { useState, useEffect, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import Select from "react-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import type { FilterState } from "../types/product-category-slug-filter-props";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useDebounce } from "~/hooks/use-debounce";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchProductFilterOptionsByCategorySlug } from "~/redux/slices/product-filter-options";
import SkeletonFilter from "~/components/ui/skeleton-filter";

const filterOptions = [
  { label: "Màu", type: "multi", options: "colors" },
  { label: "Chất liệu", type: "multi", options: "materials" },
  { label: "Bộ sưu tập", type: "multi", options: "productGroups" },
  { label: "Giá", type: "price", options: "priceRange" },
];

const sortOptions = [
  { label: "Thứ tự bảng chữ cái (A-Z)", value: "az" },
  { label: "Thứ tự bảng chữ cái (Z-A)", value: "za" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
  { label: "Cũ nhất", value: "date_oldest" },
  { label: "Mới nhất", value: "date_newest" },
];

const selectInnerStyles = {
  ...reactSelectStyles,
  valueContainer: (base: any) => ({ ...base, flexWrap: "wrap", gap: 6 }),
  multiValue: (base: any) => ({ ...base, margin: "3px 6px", maxWidth: "100%" }),
  control: (base: any) => ({ ...base, minHeight: 40, flexWrap: "wrap" }),
  menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
};

export default function ProductFilterBar({
  filters,
  setFilters,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}) {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { productFilterOptions, isLoading } = useAppSelector(
    (state) => state.productFilterOptions
  );

  console.log(productFilterOptions);

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [minPrice, setMinPrice] = useState(String(filters.minPrice ?? ""));
  const [maxPrice, setMaxPrice] = useState(String(filters.maxPrice ?? ""));

  const minPriceDebounced = useDebounce(minPrice, 800);
  const maxPriceDebounced = useDebounce(maxPrice, 800);

  useEffect(() => {
    if (!slug) return;

    dispatch(fetchProductFilterOptionsByCategorySlug(slug));
  }, [dispatch, slug]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: Number(minPriceDebounced),
    }));
  }, [minPriceDebounced, setFilters]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: Number(maxPriceDebounced),
    }));
  }, [maxPriceDebounced, setFilters]);

  const colorOptions = useMemo(
    () =>
      (productFilterOptions?.data?.colorOptions ?? []).map((c) => ({
        label: `${c.name} (${c.productCount})`,
        value: c.colorId,
      })),
    [productFilterOptions?.data?.colorOptions]
  );

  const materialOptions = useMemo(
    () =>
      (productFilterOptions?.data?.materialOptions ?? []).map((m) => ({
        label: `${m.name} (${m.productCount})`,
        value: m.materialId,
      })),
    [productFilterOptions?.data?.materialOptions]
  );

  const groupOptions = useMemo(
    () =>
      (productFilterOptions?.data?.productGroupOptions ?? []).map((g) => ({
        label: `${g.name} (${g.productCount})`,
        value: g.productGroupId,
      })),
    [productFilterOptions?.data?.productGroupOptions]
  );

  const stockStatusOptions = useMemo(
    () =>
      (productFilterOptions?.data?.stockStatusOptions ?? []).map((s) => ({
        label: `${s.inStock ? "Còn hàng" : "Hết hàng"} (${s.productCount})`,
        value: s.inStock,
      })),
    [productFilterOptions?.data?.stockStatusOptions]
  );

  console.log(filters);
  if (isLoading) return <SkeletonFilter />;

  return (
    <div className="flex flex-col gap-3 border-b border-gray-200 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-800">
          <span className="text-sm text-gray-400">Bộ lọc:</span>

          {filterOptions.map((f) => (
            <Popover key={f.label}>
              <PopoverTrigger asChild>
                <Button className="flex items-center gap-1 text-gray-700 hover:text-black hover:underline">
                  {f.label}
                  <ChevronDown size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="inline-block p-3 rounded-xl shadow-md bg-white overflow-visible"
              >
                {f.type === "price" ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Chọn khoảng giá</span>
                      <button className="cursor-pointer text-gray-500 hover:text-gray-800 hover:underline">
                        Đặt lại
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-500 text-xs">
                          ₫
                        </span>
                        <Input
                          placeholder="Từ"
                          className="pl-5 text-sm"
                          value={minPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setMinPrice(value);
                            }
                          }}
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-2 top-2 text-gray-500 text-xs">
                          ₫
                        </span>
                        <Input
                          placeholder="Đến"
                          className="pl-5 text-sm"
                          value={maxPrice}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                              setMaxPrice(value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Chọn {f.label.toLowerCase()}</span>
                    </div>
                    <Select
                      isMulti={f.type === "multi"}
                      options={
                        f.options === "colors"
                          ? colorOptions
                          : f.options === "materials"
                            ? materialOptions
                            : f.options === "productGroups"
                              ? groupOptions
                              : []
                      }
                      menuIsOpen={true}
                      placeholder={`Tìm ${f.label.toLowerCase()}...`}
                      classNamePrefix="react-select"
                      styles={selectInnerStyles}
                      menuPortalTarget={
                        typeof document !== "undefined"
                          ? document.body
                          : undefined
                      }
                      menuPosition="fixed"
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center gap-1 text-gray-700 hover:text-black hover:underline">
                Còn hàng
                <ChevronDown size={14} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="inline-block p-3 rounded-xl shadow-md bg-white overflow-visible"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Chọn trạng thái hàng</span>
                </div>
                <Select<{ label: string; value: boolean }, true>
                  isMulti={true}
                  menuIsOpen={true}
                  options={stockStatusOptions}
                  placeholder="Chọn trạng thái..."
                  classNamePrefix="react-select"
                  styles={selectInnerStyles}
                  menuPortalTarget={
                    typeof document !== "undefined" ? document.body : undefined
                  }
                  menuPosition="fixed"
                  onChange={(selected) => {
                    const values = selected?.map((x) => x.value) ?? [];
                    setFilters((prev) => ({
                      ...prev,
                      inStock: values.includes(true) || undefined,
                      outOfStock: values.includes(false) || undefined,
                    }));
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Sắp xếp theo:</span>
          <Select
            options={sortOptions}
            value={selectedSort}
            onChange={(v: any) => setSelectedSort(v)}
            isSearchable={false}
            className="min-w-[240px]"
            classNamePrefix="react-select"
            styles={reactSelectStyles}
          />
          <span className="text-gray-500 text-sm">230 sản phẩm</span>
        </div>
      </div>

      {/* Tag hiển thị filter */}
      <div className="flex flex-wrap gap-2 mt-1.5">
        <Badge variant="secondary" className="cursor-pointer">
          Màu: Đen ✕
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Giá: 100.000 - 200.000 ✕
        </Badge>
        <Badge variant="secondary" className="cursor-pointer">
          Còn hàng ✕
        </Badge>
      </div>
    </div>
  );
}
