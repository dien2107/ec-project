import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchDiscountListData } from "~/redux/slices/discount";
import { fetchStatuses } from "~/redux/slices/statuses";

import type { Discount } from "./types";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/promotion";

import AddDiscountDialog from "./components/add-promotion-dialog";
import EditDiscountDialog from "./components/edit-promotion-dialog";
import DeleteDiscountDialog from "./components/delete-promotion-dialog";
import DiscountFilter from "./components/promotion-filter";

export default function DiscountManagement() {
  const dispatch = useAppDispatch();
  const { discountList, isLoading: isDiscountLoading } = useAppSelector(
    (state: any) => state.discountList
  );

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Lấy danh sách trạng thái khi khởi động
  useEffect(() => {
    dispatch(fetchStatuses({ entityType: "Discount" }));
  }, [dispatch]);

  // ✅ Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchDiscountListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Xử lý sự kiện CRUD
  const handleEdit = useCallback((discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDeleteOpen(true);
  }, []);

  // ✅ Xử lý thay đổi filter
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  // ✅ Reload danh sách sau khi CRUD
  const handleReload = useCallback(() => {
    dispatch(
      fetchDiscountListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const data = discountList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý khuyến mãi</h3>
        <AddDiscountDialog onAdded={handleReload} />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <DiscountFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={discountList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isDiscountLoading}
      />

      {/* Dialogs */}
      {selectedDiscount && (
        <EditDiscountDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          discount={selectedDiscount}
          onUpdated={handleReload}
        />
      )}

      {selectedDiscount && (
        <DeleteDiscountDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedDiscount={selectedDiscount}
          onDeleted={handleReload}
        />
      )}
    </div>
  );
}
