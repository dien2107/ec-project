import Select from "react-select";
import { useState, useEffect } from "react";
import type { ProductFilterProps } from "../types/product-filter-props";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/use-debounce";

export default function ProductFilter({
  filters,
  setFilters,
  meta,
}: ProductFilterProps) {
  const materialOptions = meta.materials.map((m) => ({
    value: m.materialId,
    label: m.name,
  }));
  const colorOptions = meta.colors.map((c) => ({
    value: c.colorId,
    label: c.name,
  }));
  const categoryOptions = meta.categories.map((cat) => ({
    value: cat.categoryId,
    label: cat.name,
  }));
  const productGroupOptions = meta.productGroups.map((pg) => ({
    value: pg.productGroupId,
    label: pg.name,
  }));
  const statusOptions = meta.statuses.map((s) => ({
    value: s.name,
    label: s.displayName,
  }));

  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  return (
    <div className="flex items-center gap-4 mb-4">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Tìm sản phẩm..."
        className="bg-white flex-2"
      />
      <Select
        className="flex-1"
        options={statusOptions}
        value={
          statusOptions.find((opt) => opt.value === filters.statusName) || null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            statusName: option ? option.value : undefined,
          }))
        }
        placeholder="Trạng thái"
        isClearable
      />
      <Select
        className="flex-1"
        options={materialOptions}
        value={
          materialOptions.find((opt) => opt.value === filters.materialId) ||
          null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            materialId: option ? option.value : undefined,
          }))
        }
        placeholder="Vật liệu"
        isClearable
      />
      <Select
        className="flex-1"
        options={colorOptions}
        value={
          colorOptions.find((opt) => opt.value === filters.colorId) || null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            colorId: option ? option.value : undefined,
          }))
        }
        placeholder="Màu sắc"
        isClearable
      />
      <Select
        className="flex-1"
        options={categoryOptions}
        value={
          categoryOptions.find((opt) => opt.value === filters.categoryId) ||
          null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            categoryId: option ? option.value : undefined,
          }))
        }
        placeholder="Thể loại"
        isClearable
      />
      <Select
        className="flex-1"
        options={productGroupOptions}
        value={
          productGroupOptions.find(
            (opt) => opt.value === filters.productGroupId
          ) || null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            productGroupId: option ? option.value : undefined,
          }))
        }
        placeholder="Nhóm SP"
        isClearable
      />
    </div>
  );
}
