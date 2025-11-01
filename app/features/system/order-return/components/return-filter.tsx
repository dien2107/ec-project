// components/return-filter.tsx
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface Filters {
  status: string;
  dateFrom: string;
  dateTo: string;
  productSearch: string;
  customerSearch: string;
  phoneSearch: string;
}

interface ReturnFilterProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

export default function ReturnFilter({
  filters,
  setFilters,
}: ReturnFilterProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      {/* Status Filter Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map(status => (
            <Button
              key={status.value}
              onClick={() => setFilters({ ...filters, status: status.value })}
              variant={filters.status === status.value ? "default" : "outline"}
              className={`px-4 py-2 text-sm font-medium transition-all ${
                filters.status === status.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status.label}
            </Button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-slate-600 whitespace-nowrap">
            Từ ngày
          </span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
            className="w-40"
          />
          <span className="text-sm text-slate-600">-</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
            className="w-40"
          />
        </div>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Tìm theo sản phẩm (tên hoặc SKU)..."
          value={filters.productSearch}
          onChange={e =>
            setFilters({ ...filters, productSearch: e.target.value })
          }
          className="w-full"
        />
        <Input
          placeholder="Tìm theo tên khách hàng..."
          value={filters.customerSearch}
          onChange={e =>
            setFilters({ ...filters, customerSearch: e.target.value })
          }
          className="w-full"
        />
        <Input
          placeholder="Tìm theo số điện thoại..."
          value={filters.phoneSearch}
          onChange={e =>
            setFilters({ ...filters, phoneSearch: e.target.value })
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
