import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import Select from "react-select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { FilterState } from "../types/product-category-slug-filter-props";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useDebounce } from "~/hooks/use-debounce";
import { useParams, useSearchParams } from "react-router";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchProductCatelogFilterOptions } from "~/redux/slices/product-filter-options";
import ProductFilterBadge from "./product-filter-badge";
import { motion, AnimatePresence } from "framer-motion";

const filterOptions = [
  { label: "Màu", type: "multi", options: "colors" },
  { label: "Chất liệu", type: "multi", options: "materials" },
  { label: "Bộ sưu tập", type: "multi", options: "productGroups" },
  { label: "Giá", type: "price", options: "priceRange" },
];

const sortOptions = [
  { label: "Mới nhất", value: "date_newest" },
  { label: "Cũ nhất", value: "date_oldest" },
  { label: "Thứ tự bảng chữ cái (A-Z)", value: "az" },
  { label: "Thứ tự bảng chữ cái (Z-A)", value: "za" },
  { label: "Giá tăng dần", value: "price_asc" },
  { label: "Giá giảm dần", value: "price_desc" },
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
  totalCount,
  isFiltering = false,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  isFiltering?: boolean;
}) {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const dispatch = useAppDispatch();
  const { productFilterOptions, isLoading } = useAppSelector(
    (state) => state.productFilterOptions
  );

  const [minPrice, setMinPrice] = useState(String(filters.minPrice ?? ""));
  const [maxPrice, setMaxPrice] = useState(String(filters.maxPrice ?? ""));
  const [priceError, setPriceError] = useState<string>("");

  const minPriceDebounced = useDebounce(minPrice, 800);
  const maxPriceDebounced = useDebounce(maxPrice, 800);

  useEffect(() => {
    if (!slug && !searchQuery) return;

    dispatch(
      fetchProductCatelogFilterOptions({
        categorySlug: slug,
        search: searchQuery || undefined,
      })
    );
  }, [dispatch, slug, searchQuery]);

  useEffect(() => {
    const next =
      minPriceDebounced === "" ? undefined : Number(minPriceDebounced);

    // Validate min price
    if (next !== undefined && maxPrice !== "" && next >= Number(maxPrice)) {
      setPriceError("Giá tối thiểu phải nhỏ hơn giá tối đa");
      return;
    }

    setPriceError("");
    setFilters((prev) => {
      if (prev.minPrice === next) return prev;
      return { ...prev, minPrice: next };
    });
  }, [minPriceDebounced, maxPrice, setFilters]);

  useEffect(() => {
    const next =
      maxPriceDebounced === "" ? undefined : Number(maxPriceDebounced);

    // Validate max price
    if (next !== undefined && minPrice !== "" && next <= Number(minPrice)) {
      setPriceError("Giá tối đa phải lớn hơn giá tối thiểu");
      return;
    }

    setPriceError("");
    setFilters((prev) => {
      if (prev.maxPrice === next) return prev;
      return { ...prev, maxPrice: next };
    });
  }, [maxPriceDebounced, minPrice, setFilters]);

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

  const selectedColors = useMemo(() => {
    return colorOptions.filter((o) =>
      (filters.colorIds ?? []).includes(o.value)
    );
  }, [colorOptions, filters.colorIds]);

  const selectedMaterials = useMemo(() => {
    return materialOptions.filter((o) =>
      (filters.materialIds ?? []).includes(o.value)
    );
  }, [materialOptions, filters.materialIds]);

  const selectedProductGroups = useMemo(() => {
    return groupOptions.filter((o) =>
      (filters.productGroupIds ?? []).includes(o.value)
    );
  }, [groupOptions, filters.productGroupIds]);

  const selectedStockStatuses = useMemo(() => {
    return stockStatusOptions.filter((o) => {
      if (o.value === true && filters.inStock) return true;
      if (o.value === false && filters.outOfStock) return true;
      return false;
    });
  }, [stockStatusOptions, filters.inStock, filters.outOfStock]);

  const handleClearFilter = useCallback(
    (id: number | boolean, option: string) => {
      if (option === "color") {
        if (typeof id !== "number") return;
        setFilters((prev) => {
          const newColorIds =
            prev.colorIds?.filter((colorId) => colorId !== id) ?? [];
          return { ...prev, colorIds: newColorIds };
        });
        return;
      } else if (option === "material") {
        if (typeof id !== "number") return;
        setFilters((prev) => {
          const newMaterialIds =
            prev.materialIds?.filter((materialId) => materialId !== id) ?? [];
          return { ...prev, materialIds: newMaterialIds };
        });
        return;
      } else if (option === "productGroup") {
        if (typeof id !== "number") return;
        setFilters((prev) => {
          const newProductGroupIds =
            prev.productGroupIds?.filter(
              (productGroupId) => productGroupId !== id
            ) ?? [];
          return { ...prev, productGroupIds: newProductGroupIds };
        });
        return;
      } else if (option === "price") {
        setFilters((prev) => ({
          ...prev,
          minPrice: undefined,
          maxPrice: undefined,
        }));
        setMinPrice("");
        setMaxPrice("");
        return;
      } else if (option === "stock") {
        if (id === true) {
          setFilters((prev) => ({ ...prev, inStock: undefined }));
        } else {
          setFilters((prev) => ({ ...prev, outOfStock: undefined }));
        }
        return;
      }
    },
    [setFilters]
  );

  if (isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ overflow: "visible" }}
      >
        <div className="flex flex-col gap-3 sm:gap-4 border-b border-gray-200 py-3 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            {/* Bộ lọc */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-800">
              <span className="text-sm sm:text-sm text-gray-400">Bộ lọc:</span>

              {filterOptions.map((f) => (
                <Popover key={f.label}>
                  <PopoverTrigger asChild>
                    <Button className="flex items-center gap-1 text-sm sm:text-sm text-gray-700 hover:text-black hover:underline px-2 sm:px-3 h-8 sm:h-9">
                      {f.label}
                      <ChevronDown size={14} className="hidden sm:block" />
                      <ChevronDown size={12} className="sm:hidden" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="inline-block p-3 rounded-xl shadow-md bg-white overflow-visible w-[280px] sm:w-auto"
                  >
                    {f.type === "price" ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Chọn khoảng giá</span>
                          <button
                            className="cursor-pointer text-gray-500 hover:text-gray-800 hover:underline"
                            onClick={() => {
                              handleClearFilter(0, "price");
                              setPriceError("");
                            }}
                          >
                            Đặt lại
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-500 text-sm">
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
                                  setPriceError("");
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const minVal =
                                    minPrice === ""
                                      ? undefined
                                      : Number(minPrice);
                                  const maxVal =
                                    maxPrice === ""
                                      ? undefined
                                      : Number(maxPrice);

                                  if (
                                    minVal !== undefined &&
                                    maxVal !== undefined &&
                                    minVal >= maxVal
                                  ) {
                                    setPriceError(
                                      "Giá tối thiểu phải nhỏ hơn giá tối đa"
                                    );
                                    return;
                                  }

                                  setPriceError("");
                                  setFilters((prev) => ({
                                    ...prev,
                                    minPrice: minVal,
                                  }));
                                }
                              }}
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-2 top-2 text-gray-500 text-sm">
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
                                  setPriceError("");
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const minVal =
                                    minPrice === ""
                                      ? undefined
                                      : Number(minPrice);
                                  const maxVal =
                                    maxPrice === ""
                                      ? undefined
                                      : Number(maxPrice);

                                  if (
                                    maxVal !== undefined &&
                                    minVal !== undefined &&
                                    maxVal <= minVal
                                  ) {
                                    setPriceError(
                                      "Giá tối đa phải lớn hơn giá tối thiểu"
                                    );
                                    return;
                                  }

                                  setPriceError("");
                                  setFilters((prev) => ({
                                    ...prev,
                                    maxPrice: maxVal,
                                  }));
                                }
                              }}
                            />
                          </div>
                        </div>
                        {priceError && (
                          <p className="text-sm text-red-500 mt-1">
                            {priceError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm text-gray-500">
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
                          value={
                            f.options === "colors"
                              ? selectedColors
                              : f.options === "materials"
                                ? selectedMaterials
                                : f.options === "productGroups"
                                  ? selectedProductGroups
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
                          onChange={(selected) => {
                            const selectedArray = Array.isArray(selected)
                              ? selected
                              : selected
                                ? [selected]
                                : [];
                            const values = selectedArray.map((x) => x.value);
                            setFilters((prev) => {
                              if (f.options === "colors") {
                                return { ...prev, colorIds: values };
                              } else if (f.options === "materials") {
                                return { ...prev, materialIds: values };
                              } else if (f.options === "productGroups") {
                                return { ...prev, productGroupIds: values };
                              }
                              return prev;
                            });
                          }}
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              ))}
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="flex items-center gap-1 text-sm sm:text-sm text-gray-700 hover:text-black hover:underline px-2 sm:px-3 h-8 sm:h-9">
                    Còn hàng
                    <ChevronDown size={14} className="hidden sm:block" />
                    <ChevronDown size={12} className="sm:hidden" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="inline-block p-3 rounded-xl shadow-md bg-white overflow-visible w-[280px] sm:w-auto"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Chọn trạng thái hàng</span>
                    </div>
                    <Select<{ label: string; value: boolean }, true>
                      isMulti={true}
                      menuIsOpen={true}
                      value={selectedStockStatuses}
                      options={stockStatusOptions}
                      placeholder="Chọn trạng thái..."
                      classNamePrefix="react-select"
                      styles={selectInnerStyles}
                      menuPortalTarget={
                        typeof document !== "undefined"
                          ? document.body
                          : undefined
                      }
                      menuPosition="fixed"
                      onChange={(selected) => {
                        const values = selected?.map((x) => x.value) ?? [];
                        setFilters((prev) => ({
                          ...prev,
                          inStock: values.includes(true),
                          outOfStock: values.includes(false),
                        }));
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <span className="text-sm sm:text-sm text-gray-400 whitespace-nowrap">
                Sắp xếp theo:
              </span>
              <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Select
                  options={sortOptions}
                  value={
                    sortOptions.find((o) => o.value === filters.orderBy) ?? null
                  }
                  onChange={(option: any) =>
                    setFilters((prev) => ({
                      ...prev,
                      orderBy: option?.value ?? "",
                    }))
                  }
                  isSearchable={false}
                  className="min-w-[180px] sm:min-w-[240px] flex-1 sm:flex-none"
                  classNamePrefix="react-select"
                  styles={reactSelectStyles}
                />
                <div className="flex items-center gap-2 text-sm sm:text-sm text-gray-400 whitespace-nowrap">
                  {isFiltering ? (
                    <Loader2 className="animate-spin w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <span>Có {totalCount} sản phẩm</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter badges */}
          <ProductFilterBadge
            filters={filters}
            setFilters={setFilters}
            selectedColors={selectedColors}
            selectedMaterials={selectedMaterials}
            selectedProductGroups={selectedProductGroups}
            selectedStockStatuses={selectedStockStatuses}
            handleClearFilter={handleClearFilter}
            onClearAllFilters={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
