import Select from "react-select";
import { useState, useEffect } from "react";
import type { ShippingFilterProps } from "../types/shipping-filter-props";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/use-debounce";

export default function ShippingFilter({
  filters,
  setFilters,
  meta,
}: ShippingFilterProps) {
  const statusOptions = meta.map((s) => ({
    value: s.statusId,
    label: s.displayName ?? s.name,
  }));

  const [searchInput, setSearchInput] = useState(filters.corpName ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      corpName: debouncedSearch,
    }));
  }, [debouncedSearch]);

  return (
    <div className="flex items-center gap-4 mb-4">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Tìm đơn vị vận chuyển..."
        className="bg-white flex-2 max-w-[300px]"
      />

      <div style={{ maxWidth: 220 }} className="flex-1">
        <Select
          options={statusOptions}
          value={
            statusOptions.find((opt) => opt.value === filters.statusId) || null
          }
          styles={reactSelectStyles}
          classNames={{ menu: () => "scrollbar-custom" }}
          onChange={(option) =>
            setFilters((prev) => ({
              ...prev,
              statusId: option ? option.value : undefined,
            }))
          }
          placeholder="Trạng thái"
        />
      </div>
    </div>
  );
}
