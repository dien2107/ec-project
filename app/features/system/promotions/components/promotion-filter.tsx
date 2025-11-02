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
  DiscountType?: string; // 🔹 Thêm filter cho loại khuyến mãi
};

type Props = {
  filters: FilterValues;
  setFilters: (updater: (prev: FilterValues) => FilterValues) => void;
};

const DiscountFilter: React.FC<Props> = ({ filters, setFilters }) => {
  const dispatch = useAppDispatch();

  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  React.useEffect(() => {
    dispatch(fetchStatuses({ entityType: "Discount" }));
  }, [dispatch]);

  const statuses =
    statusesData["Discount"]?.map((s) => ({
      value: s.name,
      label: s.displayName || s.name,
    })) ?? [];

  const allStatusesOption = { value: "", label: "Tất cả trạng thái" };
  const statusOptions = [allStatusesOption, ...statuses];

  // 🔹 Cứng cho loại khuyến mãi
  const discountTypeOptions = [
    { value: "", label: "Tất cả các loại khuyến mãi" },
    { value: "percentage", label: "Phần trăm (%)" },
    { value: "fixed", label: "Số tiền" },
  ];

  const [searchInput, setSearchInput] = React.useState(filters.Search ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      Search: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

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

  const handleDiscountTypeChange = (option: any) => {
    setFilters((prev) => ({
      ...prev,
      DiscountType: option ? option.value : "",
    }));
  };

  const handleReset = () => {
    setFilters(() => ({
      Search: "",
      StatusName: "",
      DiscountType: "",
    }));
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      {/* Search input */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Tìm kiếm</label>
        <Input
          type="text"
          placeholder="Tìm theo mã hoặc mô tả..."
          value={searchInput}
          onChange={handleSearchChange}
          className="w-60"
        />
      </div>

      {/* Discount Type dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Loại khuyến mãi
        </label>
        <Select
          instanceId="discount-type-filter"
          placeholder="Tất cả các loại khuyến mãi"
          options={discountTypeOptions}
          value={
            discountTypeOptions.find(
              (opt) => opt.value === filters.DiscountType
            ) || discountTypeOptions[0]
          }
          onChange={handleDiscountTypeChange}
          isSearchable={false}
          styles={reactSelectStyles}
          className="min-w-[180px]"
        />
      </div>

      {/* Status dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
        <Select
          instanceId="discount-status-filter"
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

export default DiscountFilter;
