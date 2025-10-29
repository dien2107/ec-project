import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { type Category } from "./types"; // Đảm bảo đường dẫn chính xác
import AddCategoryDialog from "./components/add-category";
import EditCategoryDialog from "./components/edit-category";
import DeleteCategoryDialog from "./components/delete-category";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchCategoryListData } from "~/redux/slices/categories";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import { getColumns } from "./columns/category"; // Đảm bảo đường dẫn chính xác
import CategoryFilter from "./components/category-filter"; // Đảm bảo đường dẫn chính xác

const CategoryManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6;

  const { categoryList, isLoading: isCategoryLoading } = useAppSelector(
    (state: any) =>
      state.categoryList ?? { categoryList: null, isLoading: false }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    StatusName?: string;
  }>({});

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Gọi API load list
  const reloadList = useCallback(() => {
    dispatch(
      fetchCategoryListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        ...(filters.Search ? { Search: filters.Search } : {}),
        ...(filters.StatusName ? { StatusName: filters.StatusName } : {}),
      })
    );
  }, [dispatch, currentPage, filters, PAGE_SIZE]);

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const data = categoryList?.data?.items ?? [];
  const totalPages = categoryList?.data?.totalPages ?? 1;

  // 🔹 CRUD handler
  const handleAdd = (category: Category) => {
    // TODO: gọi API thêm category
    setIsAddOpen(false);
    reloadList();
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleEditSave = (category: Category) => {
    // TODO: gọi API update
    setIsEditOpen(false);
    setSelectedCategory(null);
    reloadList();
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: gọi API delete
    setIsDeleteOpen(false);
    setSelectedCategory(null);
    reloadList();
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Quản lý danh mục</h1>
          <Button
            variant="add"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>
        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          {isCategoryLoading ? (
            <SkeletonFilter />
          ) : (
            <CategoryFilter
              initial={filters}
              onChange={(values) => {
                setFilters(values);
                setCurrentPage(1);
              }}
              statuses={[
                { statusId: 1, name: "active", displayName: "Hoạt động" },
                {
                  statusId: 2,
                  name: "inactive",
                  displayName: "Không hoạt động",
                },
              ]}
              isLoading={isCategoryLoading}
            />
          )}
        </div>
        {/* Table */}
        {isCategoryLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm kiếm danh mục..."
            isLoading={isCategoryLoading}
          />
        )}
        {/* Dialogs */}
        <AddCategoryDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdd={handleAdd}
        />
        <EditCategoryDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          category={selectedCategory}
          onSave={handleEditSave}
        />
        <DeleteCategoryDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onDelete={handleDeleteConfirm}
          categoryName={selectedCategory?.name}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;
