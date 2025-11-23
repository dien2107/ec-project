import React, { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { ENTITY_TYPE } from "~/constants/entity-types";

interface SupplierFiltersProps {
  onFilterChange: (filters: {
    search: string;
    statusId?: number;
    orderBy?: string;
  }) => void;
}

const orderByOptions = [
  { value: "name_asc", label: "Tên A-Z" },
  { value: "name_desc", label: "Tên Z-A" },
  { value: "createdAt_asc", label: "Cũ nhất" },
  { value: "createdAt_desc", label: "Mới nhất" },
];

export default function SupplierFilters({
  onFilterChange,
}: SupplierFiltersProps) {
  const dispatch = useAppDispatch();
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  const [search, setSearch] = useState("");
  const [statusId, setStatusId] = useState<number | undefined>();
  const [orderBy, setOrderBy] = useState<string | undefined>();
  const searchDebounced = useDebounce(search, 400);

  // Fetch statuses when component mounts
  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.SUPPLIER }));
  }, [dispatch]);

  // Get status options from Redux
  const statusOptions =
    statusesData[ENTITY_TYPE.SUPPLIER]?.map((status) => ({
      value: status.statusId,
      label: status.displayName || status.name,
    })) ?? [];

  useEffect(() => {
    onFilterChange({ search: searchDebounced, statusId, orderBy });
  }, [searchDebounced, statusId, orderBy, onFilterChange]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusId(undefined);
    setOrderBy(undefined);
    onFilterChange({ search: "", statusId: undefined, orderBy: undefined });
  };

  return (
    <div className="flex items-center gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
      <Input
        placeholder="Tìm theo tên nhà cung cấp..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <Select
        value={statusId?.toString() ?? ""}
        onValueChange={(value) =>
          setStatusId(value ? Number(value) : undefined)
        }
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {isStatusesLoading ? (
            <SelectItem value="loading" disabled>
              Đang tải...
            </SelectItem>
          ) : statusOptions.length > 0 ? (
            statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-data" disabled>
              Không có dữ liệu
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      <Select value={orderBy ?? ""} onValueChange={setOrderBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          {orderByOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        onClick={handleClearFilters}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
        Xóa bộ lọc
      </Button>
    </div>
  );
}
