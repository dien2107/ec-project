import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchCategoryListData } from "~/redux/slices/categories";

import type { CategoryDetailDto } from "~/types/product/category";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/category";

import AddCategoryDialog from "./components/add-category-dialog";
import EditCategoryDialog from "./components/edit-category-dialog";
import DeleteCategoryDialog from "./components/delete-category-dialog";
import CategoryFilter from "./components/category-filter";

export default function CategoryManagement() {
  const dispatch = useAppDispatch();
  const { categoryList, isLoading: isCategoryLoading } = useAppSelector(
    (state: any) => state.categoryList
  );

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
    ParentId: null,
  });

  const [selectedCategory, setSelectedCategory] =
    useState<CategoryDetailDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchCategoryListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
        ParentId: filters.ParentId || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Xử lý sự kiện CRUD
  const handleEdit = useCallback((category: CategoryDetailDto) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((category: CategoryDetailDto) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  }, []);

  // 🆕 Xử lý sau khi xóa thành công
  const handleDeleteSuccess = useCallback(() => {
    dispatch(
      fetchCategoryListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
        ParentId: filters.ParentId || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Xử lý thay đổi filter
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

  const data = categoryList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý thể loại</h3>
        <AddCategoryDialog
          onAdded={() => {
            dispatch(
              fetchCategoryListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
                ParentId: filters.ParentId || undefined,
              })
            );
          }}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <CategoryFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={categoryList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isCategoryLoading}
      />

      {/* Dialogs */}
      {selectedCategory && (
        <EditCategoryDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedCategory={selectedCategory}
          allCategories={data}
          onUpdated={() => {
            dispatch(
              fetchCategoryListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
                ParentId: filters.ParentId || undefined,
              })
            );
          }}
        />
      )}

      {selectedCategory && (
        <DeleteCategoryDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedCategory={selectedCategory!}
          onDelete={handleDeleteSuccess}
          currentPage={currentPage}
          totalItems={categoryList?.data?.totalCount || 0}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
