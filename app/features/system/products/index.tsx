import { useState } from "react";

import DataTable from "../components/data-table";
import { getColumns, type Product } from "./types";
import { fakeProducts } from "./data/fakeProducts";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(fakeProducts.length / pageSize);

  const paginatedData = fakeProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  return (
    <div className="container">
      <h3 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h3>
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        title="Danh sách sản phẩm"
        filterPlaceholder="Tìm sản phẩm..."
        showFilter
        showAddButton
        addButtonTitle="Thêm sản phẩm"
        onAddClick={handleAdd}
      />
    </div>

    // Code modal here
  );
}
