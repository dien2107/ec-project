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

import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";

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

  // 🔹 Gọi API load danh sách
  const reloadList = useCallback(() => {
    dispatch(
      fetchColorListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, PAGE_SIZE, filters]);

  // 🔹 Load lần đầu
  useEffect(() => {
    reloadList();
  }, [reloadList]);

  // 🔹 Xử lý sự kiện CRUD
  const handleEdit = useCallback((color: ColorDetailDto) => {
    setSelectedColor(color);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((color: ColorDetailDto) => {
    setSelectedColor(color);
    setIsDeleteOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  // 🔹 Xử lý sau khi thêm/sửa/xoá
  const handleReload = useCallback(() => {
    reloadList();
  }, [reloadList]);

  const data = colorList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      {isColorLoading ? (
        <SkeletonHeader />
      ) : (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý màu sắc</h3>
          <AddColorDialog onAdded={handleReload} />
        </div>
      )}
      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        {isColorLoading ? (
          <SkeletonFilter />
        ) : (
          <ColorFilter
            initial={filters}
            onChange={(values) => {
              setFilters(values);
              setCurrentPage(1);
            }}
            statuses={[
              { statusId: 1, name: "active", displayName: "Hoạt động" },
              { statusId: 2, name: "inactive", displayName: "Không hoạt động" },
            ]}
            isLoading={isColorLoading}
          />
        )}
      </div>
      {/* Table */}
      {isColorLoading ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          currentPage={currentPage}
          totalPages={colorList?.data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
          isLoading={isColorLoading}
        />
      )}
      {/* Dialogs */}
      {selectedColor && (
        <EditColorDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedColor={selectedColor} // ✅ đổi từ color -> selectedColor
          onUpdated={handleReload} // ✅ thống nhất tên hàm
        />
      )}

      {selectedColor && (
        <DeleteColorDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedColor={selectedColor} // ✅ Sửa từ colorName thành selectedColor
          onDelete={handleReload} // ✅ Đã thống nhất với DeleteColorDialog là onDelete
        />
      )}
    </div>
  );
}
