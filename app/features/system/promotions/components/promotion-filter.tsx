import React from "react";
import { Input } from "~/components/ui/input";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import { RotateCcw } from "lucide-react";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useDebounce } from "~/hooks/use-debounce";
import { useAppSelector, useAppDispatch } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { toast } from "react-hot-toast";
import { updateInactiveDiscounts } from "~/services/discounts";

type FilterValues = {
  Search?: string;
  StatusName?: string;
  DiscountType?: string;
  isActiveTime?: boolean; // 🔹 Thêm lọc còn hạn / hết hạn
};

type Props = {
  filters: FilterValues;
  setFilters: (updater: (prev: FilterValues) => FilterValues) => void;
  refetch: () => Promise<void>; // 🔹 để reload lại bảng sau khi cập nhật trạng thái
};

const DiscountFilter: React.FC<Props> = ({ filters, setFilters, refetch }) => {
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

  const discountTypeOptions = [
    { value: "", label: "Tất cả các loại khuyến mãi" },
    { value: "percentage", label: "Phần trăm (%)" },
    { value: "fixed", label: "Số tiền cố định" },
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
      StatusName: option?.value || "",
    }));
  };

  const handleDiscountTypeChange = (option: any) => {
    setFilters((prev) => ({
      ...prev,
      DiscountType: option?.value || "",
    }));
  };

  const handleActiveTimeChange = (option: any) => {
    const isActiveTime =
      option.value === "active"
        ? true
        : option.value === "expired"
          ? false
          : undefined;

    setFilters((prev) => ({
      ...prev,
      isActiveTime,
    }));
  };

  const handleReset = () => {
    setFilters(() => ({
      Search: "",
      StatusName: "",
      DiscountType: "",
      isActiveTime: undefined,
    }));
  };

  const handleUpdateInactive = async () => {
    try {
      const res = await updateInactiveDiscounts();

      // Nếu API không trả về hoặc trả về lỗi logic
      if (!res || typeof res.updatedCount !== "number") {
        toast.error("Không thể cập nhật trạng thái khuyến mãi.");
        return;
      }

      if (res.updatedCount > 0) {
        toast.success(`Đã cập nhật ${res.updatedCount} khuyến mãi hết hạn.`);
      } else {
        toast("Không có khuyến mãi nào cần cập nhật.");
      }

      await refetch();
    } catch (err: any) {
      console.error("Lỗi khi cập nhật khuyến mãi:", err);
      toast.error("Cập nhật trạng thái thất bại.");
    }
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

      {/* Discount Type */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Loại khuyến mãi
        </label>
        <Select
          instanceId="discount-type-filter"
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

      {/* Active time filter */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Thời hạn khuyến mãi
        </label>
        <Select
          options={[
            { value: "all", label: "Tất cả" },
            { value: "active", label: "Còn hạn" },
            { value: "expired", label: "Hết hạn" },
          ]}
          onChange={handleActiveTimeChange}
          isSearchable={false}
          styles={reactSelectStyles}
          className="min-w-[150px]"
          placeholder="Thời hạn"
        />
      </div>

      {/* Status dropdown */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Trạng thái</label>
        <Select
          instanceId="discount-status-filter"
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

      {/* Update Inactive Button */}
      <Button
        onClick={handleUpdateInactive}
        className="bg-yellow-500 hover:bg-yellow-600 text-white"
      >
        Làm mới trạng thái
      </Button>

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
