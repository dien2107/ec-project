import React, { useState } from "react";
import { Plus, Package } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataTable from "../components/data-table";
import { mockCategories } from "./data/data";
import { getColumns, type Category } from "./types";
import AddCategoryDialog from "./components/add-category";
import CategoryDetailDialog from "./components/category-detail";
import EditCategoryDialog from "./components/edit-category";
import DeleteCategoryDialog from "./components/delete-category";

export default function CategoryManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const pageSize = 10;

  // Filter categories based on status
  const filteredCategories = categories.filter(category => {
    if (statusFilter === "all") return true;
    return category.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedData = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(prev =>
        prev.map(cat =>
          cat.id === selectedCategory.id ? { ...cat, ...categoryData } : cat
        )
      );
    } else {
      // Add new category
      const newCategory: Category = {
        id: `CAT${String(categories.length + 1).padStart(3, "0")}`,
        name: categoryData.name || "",
        description: categoryData.description || "",
        productCount: 0,
        status: categoryData.status || "active",
        createdDate: new Date().toLocaleDateString("vi-VN"),
      };
      setCategories(prev => [...prev, newCategory]);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const globalFilterFn = (
    row: Category,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof Category)[] = ["id", "name", "description"];
    return searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const columns = getColumns(handleView, handleEdit, handleDelete);

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý danh mục</h3>
          <AddCategoryDialog onSave={handleSaveCategory} />
        </div>

        {/* Status Filter */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Tổng cộng: {filteredCategories.length} danh mục
          </div>
          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(e.target.value as "all" | "active" | "inactive")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách danh mục"
          filterPlaceholder="Tìm kiếm danh mục..."
          showFilter
          addButtonTitle="Thêm danh mục"
          globalFilterFn={globalFilterFn}
        />
      </div>

      {/* Detail Modal */}
      <CategoryDetailDialog
        open={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        category={selectedCategory}
      />

      {/* Edit Modal */}
      <EditCategoryDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Delete Modal */}
      <DeleteCategoryDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </>
  );
}
