import React, { useState } from "react";
import DataTable from "../components/data-table";
import { mockImportOrders as initialOrders } from "./data/mockImportOrders";
import type { ImportOrder } from "./types";
import { AddImportOrderModal } from "./components/add-modal";
import { EditImportOrderModal } from "./components/edit-modal";
import { DeleteImportOrderModal } from "./components/delete-modal";
import { getImportOrderColumns } from "./types/index.jsx";


export default function ImportOrders() {
  const [orders, setOrders] = useState<ImportOrder[]>(initialOrders);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAdd = (order: ImportOrder) => {
    setOrders(prev => [
      { ...order, id: `IMP-${Date.now()}` },
      ...prev,
    ]);
    setIsAddOpen(false);
  };
  const handleEdit = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };
  const handleEditSave = (order: ImportOrder) => {
    setOrders(prev => prev.map(o => o.id === order.id ? order : o));
    setIsEditOpen(false);
    setSelectedOrder(null);
  };
  const handleDelete = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };
  const handleDeleteConfirm = (order: ImportOrder) => {
    setOrders(prev => prev.filter(o => o.id !== order.id));
    setIsDeleteOpen(false);
    setSelectedOrder(null);
  };

  const columns = getImportOrderColumns(handleEdit, handleDelete);
  const inProgressOrders = orders.filter(o => o.status !== "received");
  const paginatedData = inProgressOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(inProgressOrders.length / pageSize);

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span>📦</span> Đơn nhập hàng
        </h3>
      </div>
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        title=""
        showGlobalFilter={true}
        filterPlaceholder="Tìm kiếm đơn nhập hàng..."
        showFilter={true}
        showAddButton={true}
        addButtonTitle="Tạo đơn nhập hàng"
        onAddClick={() => setIsAddOpen(true)}
      />
      <AddImportOrderModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditImportOrderModal open={isEditOpen} order={selectedOrder} onClose={() => setIsEditOpen(false)} onSave={handleEditSave} />
      <DeleteImportOrderModal open={isDeleteOpen} order={selectedOrder} onClose={() => setIsDeleteOpen(false)} onDelete={handleDeleteConfirm} />
    </div>
  );
}
