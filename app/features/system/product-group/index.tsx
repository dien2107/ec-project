import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/product-group";
import AddProductGroupDialog from "./components/add-product-group-dialog";
import EditProductGroupDialog from "./components/edit-product-group-dialog";
import DeleteProductGroupDialog from "./components/delete-product-group-dialog";
import ProductGroupFilter from "./components/product-group-filter";
import type { ProductGroupDetailDto } from "../../../types/product/product-group";
import { fetchProductGroupListData } from "~/redux/slices/product-groups"; // ✅ slice giả định

export default function ProductGroupManagement() {
  const dispatch = useAppDispatch();

  // Lấy dữ liệu từ redux store
  const { productGroupList, isLoading } = useAppSelector(
    (state: any) => state.productGroupList
  );

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedItem, setSelectedItem] =
    useState<ProductGroupDetailDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Lấy danh sách trạng thái khi khởi động
  useEffect(() => {
    dispatch(fetchStatuses({ entityType: "ProductGroup" }));
  }, [dispatch]);

  // ✅ Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchProductGroupListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Xử lý mở dialog sửa
  const handleEdit = useCallback((item: ProductGroupDetailDto) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  }, []);

  // ✅ Xử lý mở dialog xóa
  const handleDelete = useCallback((item: ProductGroupDetailDto) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  }, []);

  // ✅ Cập nhật filter
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  // ✅ Reload danh sách sau khi CRUD
  const handleReload = useCallback(() => {
    dispatch(
      fetchProductGroupListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Cột bảng
  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  // ✅ Dữ liệu hiển thị
  const data = productGroupList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý nhóm sản phẩm</h3>
        <AddProductGroupDialog onAdded={handleReload} />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <ProductGroupFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={productGroupList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Dialogs */}
      {selectedItem && (
        <EditProductGroupDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedItem={selectedItem}
          onUpdated={handleReload}
        />
      )}
      {selectedItem && (
        <DeleteProductGroupDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedItem={selectedItem}
          onDeleted={handleReload}
        />
      )}
    </div>
  );
}
