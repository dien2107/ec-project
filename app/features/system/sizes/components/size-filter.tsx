import React from "react";
import { Input } from "~/components/ui/input";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useDebounce } from "~/hooks/use-debounce";
import { useAppSelector, useAppDispatch } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";

type FilterValues = {
  Search?: string;
  StatusName?: string;
};

type Props = {
  filters: FilterValues;
  setFilters: (updater: (prev: FilterValues) => FilterValues) => void;
};

const SizeFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useAppDispatch();

  // Get status list from Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  // Fetch statuses for the specific entity type when the component mounts
  React.useEffect(() => {
    dispatch(fetchStatuses({ entityType: "Size" }));
  }, [dispatch]);

  // Create status options dynamically based on entity type
  const statuses =
    statusesData["Size"]?.map((s) => ({
      value: s.name, // Use the name for filtering
      label: s.displayName || s.name, // Use the displayName if available, otherwise fallback to name
    })) ?? [];

  // Add "All Statuses" option
  const allStatusesOption = { value: "", label: "Tất cả trạng thái" }; // Option for all statuses
  const statusOptions = [allStatusesOption, ...statuses]; // Combine with existing statuses

  // Internal state for search input
  const [searchInput, setSearchInput] = React.useState(filters.Search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  // Update parent filter on debounce completion
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      Search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  // Update input when parent filter changes (e.g., reset)
  React.useEffect(() => {
    setSearchInput(filters.Search ?? "");
  }, [filters.Search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleStatusChange = (option: any) => {
    setFilters((prev) => ({
      ...prev,
      StatusName: option ? option.value : "", // Use the status name for filtering
    }));
  };

  const handleReset = () => {
    setFilters(() => ({
      Search: "",
      StatusName: "",
    }));
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Search input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
        <Input
          type="text"
          placeholder="Tìm kích thước..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-60"
        />
      </div>

      {/* Status dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
        <Select
          instanceId="size-status-filter"
          placeholder="Tất cả trạng thái"
          options={statusOptions} // Use the combined options
          value={
            statusOptions.find((opt) => opt.value === filters.StatusName) ||
            statusOptions[0]
          }
          onChange={handleStatusChange}
          isSearchable={false}
          styles={reactSelectStyles}
          className="min-w-[180px]"
        />
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        className="text-sm flex items-center gap-2"
        onClick={handleReset}
      >
        <RotateCcw size={16} />
        Đặt lại
      </Button>
    </div>
  );
};

export default SizeFilter;
