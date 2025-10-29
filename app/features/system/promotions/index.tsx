import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/promotion";
import AddDiscountDialog from "./components/add-promotion-dialog";
import EditDiscountDialog from "./components/edit-promotion-dialog";
import DeleteDiscountDialog from "./components/delete-promotion-dialog";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchDiscountListData } from "~/redux/slices/discount";
import toast, { Toaster } from "react-hot-toast";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import DiscountFilter from "./components/promotion-filter";
import { type Discount } from "./types";

const DiscountManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6; // Số lượng giảm giá mỗi trang
  const { discountList, isLoading: isDiscountLoading } = useAppSelector(
    (state: any) =>
      state.discountList ?? { discountList: null, isLoading: false }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    StatusName?: string;
  }>({});

  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔹 Gọi API load danh sách giảm giá
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchDiscountListData({
          PageNumber: override?.PageNumber ?? currentPage,
          PageSize: PAGE_SIZE,
          ...(filters.Search ? { Search: filters.Search } : {}),
          ...(filters.StatusName ? { StatusName: filters.StatusName } : {}),
        })
      );
    },
    [dispatch, currentPage, filters, PAGE_SIZE]
  );

  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const data = discountList?.data?.items ?? discountList?.data ?? [];

  // 🔹 CRUD handler
  const handleAdd = (discount: Discount) => {
    // TODO: gọi API thêm discount
    setIsAddOpen(false);
    reloadList();
  };

  const handleEdit = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsEditOpen(true);
  };

  const handleEditSave = (discount: Discount) => {
    // TODO: gọi API update
    setIsEditOpen(false);
    setSelectedDiscount(null);
    reloadList();
  };

  const handleDelete = (discount: Discount) => {
    setSelectedDiscount(discount);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: gọi API delete
    setIsDeleteOpen(false);
    setSelectedDiscount(null);
    reloadList();
  };

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Quản lý giảm giá</h1>

          <Button
            variant="add"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm giảm giá
          </Button>
        </div>
        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          {isDiscountLoading ? (
            <SkeletonFilter />
          ) : (
            <DiscountFilter
              initial={filters}
              onChange={(values) => {
                setFilters(values);
                setCurrentPage(1);
              }}
              statuses={[
                { statusId: 1, name: "active", displayName: "Còn hạn" },
                { statusId: 2, name: "inactive", displayName: "Ngừng áp dụng" },
                { statusId: 3, name: "expired", displayName: "Hết hạn" },
              ]}
              isLoading={isDiscountLoading}
            />
          )}
        </div>
        {/*  */}
        {isDiscountLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={discountList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm kiếm giảm giá..."
            isLoading={isDiscountLoading}
          />
        )}

        {/* Dialogs */}
        <AddDiscountDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdd={handleAdd}
        />
        <EditDiscountDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          discount={selectedDiscount}
          onSave={handleEditSave}
        />
        <DeleteDiscountDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onDelete={handleDeleteConfirm}
          discountCode={selectedDiscount?.code}
        />
      </div>
    </div>
  );
};

export default DiscountManagement;
