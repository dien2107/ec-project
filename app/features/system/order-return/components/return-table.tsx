// components/return-table.tsx
import React, { useMemo } from "react";
import DataTable from "~/features/system/components/data-table";
import { getReturnColumns } from "../columns/return-column";
import type { ReturnStatus } from "../types";
type ReturnType = "exchange" | "return";

interface Customer {
  name: string;
  phone: string;
}

interface Product {
  name: string;
  sku: string;
  price: number;
  image: string;
}

interface Return {
  id: string;
  orderId: string;
  type: ReturnType;
  customer: Customer;
  product: Product;
  reason: string;
  description: string;
  status: ReturnStatus;
  requestDate: string;
  quantity: number;
}

interface ReturnTableProps {
  data: Return[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (ret: Return) => void;
  onApprove: (ret: Return) => void;
  onReject: (ret: Return) => void;
}

export default function ReturnTable({
  data,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onApprove,
  onReject,
}: ReturnTableProps) {
  const columns = useMemo(
    () => getReturnColumns(onView, onApprove, onReject),
    [onView, onApprove, onReject]
  );

  if (data.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-center">
        <p className="text-slate-500 text-lg">
          Không tìm thấy phiếu đổi/trả hàng nào phù hợp.
        </p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
