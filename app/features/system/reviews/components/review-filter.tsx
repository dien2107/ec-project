import { useState, useEffect } from "react";
import type { ReviewFilterProps } from "../types/review-filter-props";
import { Input } from "~/components/ui/input";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import Select from "react-select";
import { useDebounce } from "~/hooks/use-debounce";

export default function ReviewFilter({
  filters,
  setFilters,
  meta,
}: ReviewFilterProps) {
  const statusOptions = meta.statuses.map((s) => ({
    value: s.name,
    label: s.displayName,
  }));

  const ratingOptions = [
    { value: 5, label: "5 sao" },
    { value: 4, label: "4 sao" },
    { value: 3, label: "3 sao" },
    { value: 2, label: "2 sao" },
    { value: 1, label: "1 sao" },
  ];

  const [searchInput, setSearchInput] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  return (
    <div className="flex gap-4 items-end pt-1">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Tìm đánh giá..."
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
        options={ratingOptions}
        value={
          ratingOptions.find((opt) => opt.value === filters.rating) || null
        }
        styles={reactSelectStyles}
        classNames={{
          menu: () => "scrollbar-custom",
        }}
        onChange={(option) =>
          setFilters((prev) => ({
            ...prev,
            rating: option ? option.value : undefined,
          }))
        }
        placeholder="Đánh giá"
        isClearable
      />
    </div>
  );
}
