import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchSizeListData } from "~/redux/slices/sizes";

import type { SizeDetailDto } from "../../../types/product/size";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/size";

import AddSizeDialog from "./components/add-size-dialog";
import EditSizeDialog from "./components/edit-size-dialog";
import DeleteSizeDialog from "./components/delete-size-dialog";
import SizeFilter from "./components/size-filter";

export default function SizeManagement() {
  const dispatch = useAppDispatch();
  const { sizeList, isLoading: isSizeLoading } = useAppSelector(
    (state: any) => state.sizeList
  );

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedSize, setSelectedSize] = useState<SizeDetailDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchSizeListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // Xử lý sự kiện CRUD
  const handleEdit = useCallback((size: SizeDetailDto) => {
    setSelectedSize(size);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((size: SizeDetailDto) => {
    setSelectedSize(size);
    setIsDeleteOpen(true);
  }, []);

  // Xử lý thay đổi filter - nhận callback updater
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  // Reload danh sách sau khi thêm/sửa/xóa
  const handleReload = useCallback(() => {
    dispatch(
      fetchSizeListData({
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

  const data = sizeList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý kích thước</h3>
        <AddSizeDialog onAdded={handleReload} />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <SizeFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={sizeList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isSizeLoading}
      />

      {/* Dialogs */}
      {selectedSize && (
        <EditSizeDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedSize={selectedSize}
          onUpdated={handleReload}
        />
      )}
      {selectedSize && (
        <DeleteSizeDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedSize={selectedSize}
          onDeleted={handleReload}
        />
      )}
    </div>
  );
}
