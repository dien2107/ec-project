import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchDiscountListData } from "~/redux/slices/discount";
import { fetchStatuses } from "~/redux/slices/statuses";

import type { DiscountDetailDto } from "~/types/discounts";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/promotion";

import AddPromotionDialog from "./components/add-promotion-dialog";
import EditPromotionDialog from "./components/edit-promotion-dialog";
import DeletePromotionDialog from "./components/delete-promotion-dialog";
import PromotionFilter from "./components/promotion-filter";

export default function PromotionManagement() {
  const dispatch = useAppDispatch();
  const { discountList, isLoading: isDiscountLoading } = useAppSelector(
    (state: any) => state.discountList
  );

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
    DiscoyntType: "",
  });

  const [selectedDiscount, setSelectedDiscount] =
    useState<DiscountDetailDto | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // ✅ Lấy danh sách trạng thái khi khởi động
  useEffect(() => {
    dispatch(fetchStatuses({ entityType: "Discount" }));
  }, [dispatch]);

  // ✅ Gọi API load danh sách khi filter hoặc phân trang thay đổi
  useEffect(() => {
    dispatch(
      fetchDiscountListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
        DiscountType: filters.DiscountType || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // ✅ Xử lý sự kiện CRUD
  const handleEdit = useCallback((discount: DiscountDetailDto) => {
    setSelectedDiscount(discount);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((discount: DiscountDetailDto) => {
    setSelectedDiscount(discount);
    setIsDeleteOpen(true);
  }, []);

  // ✅ Xử lý thay đổi filter
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  // 🆕 Xử lý sau khi thêm thành công (async)
  const handleAddSuccess = useCallback(async () => {
    await dispatch(
      fetchDiscountListData({
        PageNumber: 1, // Reset về trang 1 khi thêm mới
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
    setCurrentPage(1);
  }, [dispatch, filters]);

  // 🆕 Xử lý sau khi sửa thành công (async)
  const handleEditSuccess = useCallback(async () => {
    await dispatch(
      fetchDiscountListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // 🆕 Xử lý sau khi xóa thành công (async)
  const handleDeleteSuccess = useCallback(async () => {
    await dispatch(
      fetchDiscountListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const data = discountList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý khuyến mãi</h3>
        <AddPromotionDialog onAdded={handleAddSuccess} />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <PromotionFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Bảng dữ liệu */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={discountList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isDiscountLoading}
      />

      {/* Dialogs */}
      {selectedDiscount && (
        <EditPromotionDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedPromotion={selectedDiscount}
          onUpdated={handleEditSuccess}
        />
      )}

      {selectedDiscount && (
        <DeletePromotionDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedPromotion={selectedDiscount}
          onDelete={handleDeleteSuccess}
          currentPage={currentPage}
          totalItems={discountList?.data?.totalCount || 0}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
