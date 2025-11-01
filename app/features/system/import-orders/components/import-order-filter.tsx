// ~/features/system/import-orders/components/import-order-filter.tsx
import React, { useEffect, useState } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import { fetchStatuses } from "~/redux/slices/statuses";
import { ENTITY_TYPE } from "~/constants/entity-types";

interface ImportOrderFilterProps {
  onFilterChange: (filters: {
    Search: string;
    StatusId?: number;
    SupplierId?: number;
    startDate: string;
    endDate: string;
    OrderBy: string;
  }) => void;
  isLoading?: boolean;
}

export const ImportOrderFilter: React.FC<ImportOrderFilterProps> = ({
  onFilterChange,
  isLoading = false,
}) => {
  const [search, setSearch] = useState("");
  const [statusId, setStatusId] = useState<number | undefined>();
  const [supplierId, setSupplierId] = useState<number | undefined>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const dispatch = useAppDispatch();

  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.PURCHASE_ORDER] ?? []
  );
  const isStatusesLoading = useAppSelector((state) => state.statuses.isLoading);
  const statusesError = useAppSelector((state) => state.statuses.isError);

  const {
    supplierList,
    isLoading: isSupplierListLoading,
    isError: supplierListError,
  } = useAppSelector((s) => s.SupplierList);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(
      fetchSupplierListData({
        PageNumber: 1,
        PageSize: 1000,
      })
    );
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.PURCHASE_ORDER }));
  }, [dispatch]);
  useEffect(() => {
    onFilterChange({
      Search: debouncedSearch,
      StatusId: statusId,
      SupplierId: supplierId,
      startDate,
      endDate,
      OrderBy: orderBy,
    });
  }, [
    debouncedSearch,
    statusId,
    supplierId,
    startDate,
    endDate,
    orderBy,
    onFilterChange,
  ]);
  const handleReset = () => {
    setSearch("");
    setStatusId(undefined);
    setSupplierId(undefined);
    setStartDate("");
    setEndDate("");
    setOrderBy("");
  };

  const isAnyLoading = isLoading || isStatusesLoading || isSupplierListLoading;

  if (isAnyLoading) {
    return <SkeletonFilter />;
  }

  return (
    <div className="bg-white p-4 rounded-md mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* TÌM KIẾM */}
        {/* TÌM KIẾM */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mã đơn, nhà cung cấp..."
            className="mt-1 block w-full rounded border px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* TRẠNG THÁI - Lấy từ API */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái
          </label>
          <select
            value={statusId ?? ""}
            onChange={(e) =>
              setStatusId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="mt-1 block w-full rounded border px-3 py-2 text-sm"
            disabled={statusesError}
          >
            <option value="">Tất cả</option>
            {statuses.map((status) => (
              <option key={status.statusId} value={status.statusId}>
                {status.displayName}
              </option>
            ))}
          </select>
          {statusesError && (
            <p className="mt-1 text-xs text-red-600">Lỗi tải trạng thái</p>
          )}
        </div>

        {/* NHÀ CUNG CẤP - Lấy từ API */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nhà cung cấp
          </label>
          <select
            value={supplierId ?? ""}
            onChange={(e) =>
              setSupplierId(e.target.value ? Number(e.target.value) : undefined)
            }
            className="mt-1 block w-full rounded border px-3 py-2 text-sm"
            disabled={supplierListError}
          >
            <option value="">Tất cả</option>
            {supplierList?.data?.items
              ?.flat() // làm phẳng mảng 2 chiều
              .map((supplier) => (
                <option key={supplier.supplierId} value={supplier.supplierId}>
                  {supplier.name}
                </option>
              ))}
          </select>
          {supplierListError && (
            <p className="mt-1 text-xs text-red-600">Lỗi tải nhà cung cấp</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Từ ngày
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Đến ngày
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-50 transition"
          >
            Đặt lại
          </button>
        </div>
      </div>
    </div>
  );
};
