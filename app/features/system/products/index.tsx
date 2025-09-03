import React, { useState } from "react";

import { Package, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataTable from "../components/data-table";
import { fakeProducts } from "./data/fakeProducts";
import { getColumns, type Product } from "./types";

import ProductVariant from "./components/product-variant";
import AddProductDialog from "./components/add-product-dialog";
import EditProductDialog from "./components/edit-product-dialog";
import DeleteProductDialog from "./components/delete-product-dialog";
import ReviewDialog from "./components/review-dialog";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(fakeProducts.length / pageSize);

  const paginatedData = fakeProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleReview = (product: Product) => {
    setSelectedProduct(product);
    setIsReviewOpen(true);
  };

  const handleRenderExpandedRowContent = (
    product: Product
  ): React.ReactNode => {
    return (
      <div className="flex flex-col p-2">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium flex items-center gap-2">
            <Package />
            Biến thể sản phẩm (3)
          </h4>
          <Button className="bg-[#3770EC] text-white">
            <Plus />
            Thêm biến thể
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {product.product_variant.map((variant) => (
            <ProductVariant
              key={variant.product_variant_id}
              variant={variant}
            />
          ))}
        </div>
      </div>
    );
  };

  const columns = getColumns(handleEdit, handleDelete, handleReview);

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý sản phẩm</h3>
          <AddProductDialog />
        </div>
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách sản phẩm"
          filterPlaceholder="Tìm sản phẩm..."
          showFilter
          addButtonTitle="Thêm sản phẩm"
          expandedRowContent={handleRenderExpandedRowContent}
        />
      </div>

      {/* Edit Modal */}
      <EditProductDialog open={isEditOpen} setIsOpen={setIsEditOpen} />

      {/* Delete Modal */}
      <DeleteProductDialog open={isDeleteOpen} setIsOpen={setIsDeleteOpen} />

      {/* Review Modal */}
      <ReviewDialog
        open={isReviewOpen}
        setIsOpen={setIsReviewOpen}
        product={selectedProduct}
      />
    </>
  );
}
