// ~/features/system/import-orders/index.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { createPurchaseOrder } from "~/services/purchase-order";
import SkeletonTable from "~/components/ui/skeleton-table";
import { ImportOrderFilter } from "./components/import-order-filter";

export default function ImportOrders() {
  const dispatch = useAppDispatch();
  const { purchaseOrderList, isLoading } = useAppSelector(
    (state) => state.purchaseOrderList ?? {}
  );

  const items = purchaseOrderList?.data?.items ?? [];
  const totalCount = purchaseOrderList?.data?.totalCount ?? 0;
  const totalPages = purchaseOrderList?.data?.totalPages ?? 1;
  const currentPage = purchaseOrderList?.data?.pageNumber ?? 1;
  const pageSize = purchaseOrderList?.data?.pageSize ?? 10;

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Lưu filter hiện tại để dùng khi chuyển trang
  const currentFiltersRef = useRef<any>({});

  const handleFilterChange = useCallback((filters: any) => {
    currentFiltersRef.current = filters;
    dispatch(
      fetchPurchaseOrderListData({
        ...filters,
        PageNumber: 1,
        PageSize: pageSize,
      })
    );
    setPageNumber(1);
  }, [dispatch, pageSize]);

  // GỌI LẠI KHI CHUYỂN TRANG
  useEffect(() => {
    if (currentFiltersRef.current) {
      dispatch(
        fetchPurchaseOrderListData({
          ...currentFiltersRef.current,
          PageNumber: pageNumber,
          PageSize: pageSize,
        })
      );
    }
  }, [dispatch, pageNumber, pageSize]);

  const handleAdd = async (payload: any) => {
    try {
      await createPurchaseOrder(payload);
      setIsAddOpen(false);
      alert("Tạo đơn thành công!");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Tạo đơn thất bại");
    }
  };

  const handleEdit = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
  };

  const handleDelete = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setSelectedOrder(null);
  };

  const columns = getImportOrderColumns(handleEdit, handleDelete);

  const isInitialLoading = isLoading && !purchaseOrderList?.data;
  const isSearching = isLoading && purchaseOrderList?.data;

  return (
    <div className="container mx-auto p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <span>Nhập hàng</span> Đơn nhập hàng
        </h3>
        <Button variant="add" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Tạo đơn nhập hàng
        </Button>
      </div>

      {/* FILTER: CÓ SKELETON KHI LẦN ĐẦU */}
      <ImportOrderFilter
        onFilterChange={handleFilterChange}
        isLoading={isInitialLoading}
      />

      {/* TABLE */}
      {isInitialLoading ? (
        <SkeletonTable />
      ) : (
        <>
          {isSearching && <div className="text-sm text-blue-600 mb-2">Đang tìm kiếm...</div>}
          <DataTable
            columns={columns}
            data={items.flat()}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </>
      )}

      {/* MODALS */}
      <AddImportOrderModal open={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
      <EditImportOrderModal open={isEditOpen} order={selectedOrder} onClose={() => setIsEditOpen(false)} onSave={handleEditSave} />
      <DeleteImportOrderModal open={isDeleteOpen} order={selectedOrder} onClose={() => setIsDeleteOpen(false)} onDelete={handleDeleteConfirm} />
    </div>
  );
}