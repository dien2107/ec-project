// ~/features/system/import-orders/index.tsx
import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { AddImportOrderModal } from "./components/add-modal";
import { EditImportOrderModal } from "./components/edit-modal";
import { DeleteImportOrderModal } from "./components/delete-modal";
import { getImportOrderColumns } from "./types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchPurchaseOrderListData } from "~/redux/slices/purchase-orders";
import type { ImportOrder } from "./types";

export default function ImportOrders() {
  const dispatch = useAppDispatch();
  const { data: purchaseOrders, isLoading } = useAppSelector(
    (state) => state.purchaseOrderList
  );

  const [orders, setOrders] = useState<ImportOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPurchaseOrderListData());
  }, [dispatch]);

  useEffect(() => {
    const filtered = purchaseOrders.filter(
      (o) =>
        o.status.name === "Pending" ||
        o.status.name === "Approved"
    );
    setOrders(filtered);
  }, [purchaseOrders]);

  const handleAdd = (order: ImportOrder) => {
    setOrders((prev) => [order, ...prev]);
    setIsAddOpen(false);
  };

  const handleEdit = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleEditSave = (order: ImportOrder) => {
    setOrders((prev) => prev.map((o) => (o.purchaseOrderId === order.purchaseOrderId ? order : o)));
    setIsEditOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = (order: ImportOrder) => {
    setOrders((prev) => prev.filter((o) => o.purchaseOrderId !== order.purchaseOrderId));
    setIsDeleteOpen(false);
    setSelectedOrder(null);
  };

  const columns = getImportOrderColumns(handleEdit, handleDelete);
  const paginatedData = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(orders.length / pageSize);
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span>📦</span> Đơn nhập hàng
        </h3>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tạo đơn nhập hàng
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách đơn nhập hàng"
          showGlobalFilter={true}
          filterPlaceholder="Tìm kiếm đơn nhập hàng..."
          showFilter={true}
          showAddButton={false}
        />
      )}

      <AddImportOrderModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditImportOrderModal
        open={isEditOpen}
        order={selectedOrder}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
      />
      <DeleteImportOrderModal
        open={isDeleteOpen}
        order={selectedOrder}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
}
