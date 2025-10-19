import React, { useCallback, useMemo, useState, useEffect } from "react";

import { Package, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataTable from "../components/data-table";
import type { Product } from "./types/product";
import { getColumns } from "./columns/product";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchProductListData } from "~/redux/slices/products";
import { fetchProductFormMeta } from "~/redux/slices/product-form-meta";

import ProductVariant from "./components/product-variant";
import AddProductDialog from "./components/add-product-dialog";
import EditProductDialog from "./components/edit-product-dialog";
import DeleteProductDialog from "./components/delete-product-dialog";
import ReviewDialog from "../reviews";
import ProductFilter from "./components/product-filter";
import SkeletonFilter from "../components/skeleton-filter";
import SkeletonTable from "../components/skeleton-table";
import SkeletonHeader from "../components/skeleton-header";

export default function Products() {
  const dispatch = useAppDispatch();
  const { productList, isLoading: isProductListLoading } = useAppSelector(
    (state) => state.productList
  );
  const { meta, isLoading: isMetaLoading } = useAppSelector(
    (state) => state.productMeta
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [filters, setFilters] = useState({
    materialId: undefined as number | undefined,
    colorId: undefined as number | undefined,
    categoryId: undefined as number | undefined,
    productGroupId: undefined as number | undefined,
    statusName: undefined as string | undefined,
    search: "",
  });

  useEffect(() => {
    dispatch(
      fetchProductListData({
        PageNumber: currentPage,
        PageSize: pageSize,
        MaterialId: filters.materialId,
        ColorId: filters.colorId,
        CategoryId: filters.categoryId,
        ProductGroupId: filters.productGroupId,
        Search: filters.search,
        StatusName: filters.statusName,
      })
    );
  }, [dispatch, currentPage, pageSize, filters]);

  useEffect(() => {
    dispatch(fetchProductFormMeta());
  }, [dispatch]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleEdit = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  }, []);

  const handleReview = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsReviewOpen(true);
  }, []);

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
          {/* {product.product_variant.map((variant) => (
            <ProductVariant
              key={variant.product_variant_id}
              variant={variant}
            />
          ))} */}
        </div>
      </div>
    );
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete, handleReview),
    [handleEdit, handleDelete, handleReview]
  );

  const handleReloadProductList = useCallback(() => {
    dispatch(
      fetchProductListData({
        PageNumber: currentPage,
        PageSize: pageSize,
        MaterialId: filters.materialId,
        ColorId: filters.colorId,
        CategoryId: filters.categoryId,
        ProductGroupId: filters.productGroupId,
        Search: filters.search,
        StatusName: filters.statusName,
      })
    );
  }, [dispatch, currentPage, pageSize, filters]);
  return (
    <>
      <div className="container">
        {/* Header */}
        {isMetaLoading || !meta?.data ? (
          <SkeletonHeader />
        ) : (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Quản lý sản phẩm</h3>
            <AddProductDialog onAdded={handleReloadProductList} />
          </div>
        )}

        {/* Filter component */}
        {isMetaLoading || !meta?.data ? (
          <SkeletonFilter />
        ) : (
          <ProductFilter
            filters={filters}
            setFilters={setFilters}
            meta={meta.data}
          />
        )}

        {/* DataTable */}
        {isProductListLoading || !productList?.data.items ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={productList?.data?.items.flat() ?? []}
            currentPage={currentPage}
            totalPages={productList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            expandedRowContent={handleRenderExpandedRowContent}
          />
        )}
      </div>

      {/* Edit Modal */}
      {selectedProduct && (
        <EditProductDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedProduct={selectedProduct}
          onUpdated={handleReloadProductList}
        />
      )}

      {/* Delete Modal */}
      {selectedProduct && (
        <DeleteProductDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedProduct={selectedProduct}
          onDeleted={handleReloadProductList}
        />
      )}

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewDialog
          open={isReviewOpen}
          setIsOpen={setIsReviewOpen}
          selectedProduct={selectedProduct}
        />
      )}
    </>
  );
}
