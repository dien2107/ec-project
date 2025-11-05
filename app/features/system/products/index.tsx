import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchProductFormMeta } from "~/redux/slices/product-form-meta";
import { fetchProductListData } from "~/redux/slices/products";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { Product } from "../../../types/product/product";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/product";

import ProductVariantRow from "~/features/system/product-variants";
import SkeletonFilter from "../../../components/ui/skeleton-filter";
import SkeletonHeader from "../../../components/ui/skeleton-header";
import SkeletonTable from "../../../components/ui/skeleton-table";
import ReviewDialog from "../reviews";
import AddProductDialog from "./components/add-product-dialog";
import DeleteProductDialog from "./components/delete-product-dialog";
import EditProductDialog from "./components/edit-product-dialog";
import ProductFilter from "./components/product-filter";

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý sản phẩm</h3>
          <AddProductDialog onAdded={handleReloadProductList} />
        </div>

        {meta?.data && (
          <ProductFilter
            filters={filters}
            setFilters={setFilters}
            meta={meta.data}
          />
        )}

        <DataTable
          columns={columns}
          data={productList?.data?.items.flat() ?? []}
          currentPage={currentPage}
          totalPages={productList?.data?.totalPages ?? 1}
          onPageChange={setCurrentPage}
          expandedRowContent={(product: Product) => (
            <ProductVariantRow productId={product.productId} />
          )}
          isLoading={isProductListLoading}
        />
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
