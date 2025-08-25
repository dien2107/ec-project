import { useState } from "react";
import DataTable from "../components/data-table";

import { getColumns, type Order } from "./types";
import ViewOrderDetailDialog from "./components/view-order-detail-dialog";
import { fakeOrders } from "./data/fakeOrders";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(fakeOrders.length / pageSize);

  const paginatedData = fakeOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const columns = getColumns(handleView);

  function globalFilterFn<TData>(
    row: any,
    columnId: string,
    filterValue: string
  ): boolean {
    if (!filterValue) return true;

    const search = filterValue.toLowerCase();
    const orderId = row.original.id.toLowerCase();
    const customerName =
      row.original.address?.recipient_name?.toLowerCase() ?? "";

    return orderId.includes(search) || customerName.includes(search);
  }

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý đơn hàng</h3>
        </div>
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách đơn hàng"
          showFilter
          showGlobalFilter
          globalFilterFn={globalFilterFn}
          globalFilterPlaceholder="Tìm kiếm đơn hàng..."
        />
      </div>

      {/* View order detail dialog */}
      <ViewOrderDetailDialog open={isViewOpen} setIsOpen={setIsViewOpen} />
    </>
  );
}
