import React from "react";
import { Input } from "~/components/ui/input";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useDebounce } from "~/hooks/use-debounce";
import { useAppSelector, useAppDispatch } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { getCategoryHierarchy } from "~/services/categories";

type FilterValues = {
  Search?: string;
  StatusName?: string;
  ParentId?: number;
};

type Props = {
  filters: FilterValues;
  setFilters: (updater: (prev: FilterValues) => FilterValues) => void;
};

const CategoryFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useAppDispatch();
  const [parentCategories, setParentCategories] = React.useState<
    { id: number; name: string; slug?: string }[]
  >([]);

  // Get status list from Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  // Fetch statuses for the specific entity type when the component mounts
  React.useEffect(() => {
    dispatch(fetchStatuses({ entityType: "Category" }));
    loadParentCategories();
  }, [dispatch]);

  // Load parent categories
  const loadParentCategories = async () => {
    try {
      const res = await getCategoryHierarchy();
      if (res?.isSuccess && Array.isArray(res.data)) {
        const mapped = res.data.map((c: any) => ({
          id: c.categoryId,
          name: c.name,
        }));
        setParentCategories(mapped);
      } else {
        setParentCategories([]);
      }
    } catch (error) {
      console.error("Error loading parent categories:", error);
      setParentCategories([]);
    }
  };

  // Create status options dynamically based on entity type
  const statuses =
    statusesData["Category"]?.map((s) => ({
      value: s.name,
      label: s.displayName || s.name,
    })) ?? [];

  // Add "All Statuses" option
  const allStatusesOption = { value: "", label: "Tất cả trạng thái" };
  const statusOptions = [allStatusesOption, ...statuses];

  // Create parent category options
  const allParentOption = { value: 0, label: "Tất cả thể loại cha" };
  const parentOptions = [
    allParentOption,
    ...parentCategories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })),
  ];

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
      StatusName: option ? option.value : "",
    }));
  };

  const handleParentChange = (option: any) => {
    setFilters((prev) => ({
      ...prev,
      ParentId: option && option.value !== 0 ? option.value : undefined,
    }));
  };

  const handleReset = () => {
    setFilters(() => ({
      Search: "",
      StatusName: "",
      ParentId: undefined,
    }));
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Search input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
        <Input
          type="text"
          placeholder="Tìm theo tên hoặc slug..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-60"
        />
      </div>

      {/* Parent category dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Thể loại cha
        </label>
        <Select
          instanceId="category-parent-filter"
          placeholder="Tất cả thể loại cha"
          options={parentOptions}
          value={
            parentOptions.find((opt) => opt.value === filters.ParentId) ||
            parentOptions[0]
          }
          onChange={handleParentChange}
          isSearchable={false}
          styles={reactSelectStyles}
          className="min-w-[180px]"
        />
      </div>

      {/* Status dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
        <Select
          instanceId="category-status-filter"
          placeholder="Tất cả trạng thái"
          options={statusOptions}
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

export default CategoryFilter;
