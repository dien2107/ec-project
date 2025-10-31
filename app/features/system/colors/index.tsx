import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchColorListData } from "~/redux/slices/colors";

import type { ColorDetailDto } from "../../../types/product/color";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/colors";

import AddColorDialog from "./components/add-color-dialog";
import EditColorDialog from "./components/edit-color-dialog";
import DeleteColorDialog from "./components/delete-color-dialog";
import ColorFilter from "./components/color-filter";

export default function ColorManagement() {
  const dispatch = useAppDispatch();
  const { colorList, isLoading: isColorLoading } = useAppSelector(
    (state: any) => state.colorList
  );

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedColor, setSelectedColor] = useState<ColorDetailDto | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchColorListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // Xử lý sự kiện CRUD
  const handleEdit = useCallback((color: ColorDetailDto) => {
    setSelectedColor(color);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((color: ColorDetailDto) => {
    setSelectedColor(color);
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

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const data = colorList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý màu sắc</h3>
        <AddColorDialog
          onAdded={() => {
            // Reload lại danh sách sau khi thêm
            dispatch(
              fetchColorListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <ColorFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={colorList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isColorLoading}
      />

      {/* Dialogs */}
      {selectedColor && (
        <EditColorDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedColor={selectedColor}
          onUpdated={() => {
            dispatch(
              fetchColorListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      )}
      {selectedColor && (
        <DeleteColorDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedColor={selectedColor}
          onDelete={() => {
            dispatch(
              fetchColorListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      )}
    </div>
  );
}
