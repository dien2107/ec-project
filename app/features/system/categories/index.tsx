import React, { useState } from "react";
import { Eye, X, Edit, Trash2, Plus } from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import DataTable from "~/features/system/components/data-table";
import { Button } from "~/components/ui/button";
import type {
  Category,
  CategoryDetailModalProps,
  CategoryFormModalProps,
  ModalProps,
} from "./types";
import { mockCategories } from "./data/data";

// ------------------- Modal Component -------------------
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// ------------------- Category Detail Modal -------------------
const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  category,
  isOpen,
  onClose,
}) => {
  if (!category) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          Thông tin danh mục {category.id}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tên danh mục
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {category.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Mô tả
              </label>
              <p className="text-gray-900">{category.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Ngày tạo
              </label>
              <p className="text-gray-900">{category.createdDate}</p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Trạng thái
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  category.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {category.status === "active" ? "Hoạt động" : "Không hoạt động"}
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Số sản phẩm
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {category.productCount} sản phẩm
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
          Đóng
        </Button>
        <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>
    </Modal>
  );
};

// ------------------- Category Form Modal -------------------
const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCategory,
}) => {
  const [formData, setFormData] = useState({
    name: editingCategory?.name || "",
    description: editingCategory?.description || "",
    status: editingCategory?.status || ("active" as "active" | "inactive"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ name: "", description: "", status: "active" });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Tên danh mục *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleInputChange("name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên danh mục"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleInputChange("description", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả danh mục"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Trạng thái
            </label>
            <select
              value={formData.status}
              onChange={e => handleInputChange("status", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
          >
            {editingCategory ? "Cập nhật" : "Thêm mới"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ------------------- Main Component -------------------
const CategoryManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const handleViewCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      // Update existing category
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
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
    setEditingCategory(null);
  };

  const columns: ColumnDef<Category>[] = [
    { accessorKey: "id", header: "Mã danh mục" },
    { accessorKey: "name", header: "Tên danh mục" },
    { accessorKey: "description", header: "Mô tả" },
    { accessorKey: "productCount", header: "Số sản phẩm" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }: CellContext<Category, unknown>) => {
        const status = getValue() as Category["status"];
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        );
      },
    },
    { accessorKey: "createdDate", header: "Ngày tạo" },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }: CellContext<Category, unknown>) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewCategory(row.original)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleEditCategory(row.original)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => handleDeleteCategory(row.original.id)}
            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  const globalFilterFn = (
    row: Category,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof Category)[] = ["id", "name", "description"];
    const matchesSearch = searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

    return matchesSearch && matchesStatus;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
          <Button
            onClick={() => setIsFormModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Tổng cộng: {categories.length} danh mục
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

        <DataTable<Category, unknown>
          columns={columns}
          data={categories}
          currentPage={currentPage}
          totalPages={Math.ceil(categories.length / 10)}
          onPageChange={setCurrentPage}
          title="Danh sách danh mục"
          showGlobalFilter={true}
          globalFilterFn={globalFilterFn}
          globalFilterPlaceholder="Tìm kiếm danh mục..."
        />

        {/* Modals */}
        <CategoryDetailModal
          category={selectedCategory}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedCategory(null);
          }}
        />

        <CategoryFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
          editingCategory={editingCategory}
        />
      </div>
    </div>
  );
};

export default CategoryManagement;
