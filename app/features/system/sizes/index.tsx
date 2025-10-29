import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { getSizeColumns } from "./columns/size";
import AddSizeDialog from "./components/add-size-dialog";
import EditSizeDialog from "./components/edit-size-dialog";
import DeleteSizeDialog from "./components/delete-size-dialog";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchSizeListData } from "~/redux/slices/sizes"; // Gọi API để lấy dữ liệu kích thước
import { type Size } from "./types";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import SizeFilter from "./components/size-filter"; // Giả định có SizeFilter

const Sizes: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6; // Số lượng kích thước mỗi trang
  const { sizeList, isLoading: isSizeLoading } = useAppSelector(
    (state: any) => state.sizeList ?? { sizeList: null, isLoading: false }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    StatusName?: string;
  }>({});

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔹 Gọi API để tải danh sách kích thước
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchSizeListData({
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

  const data = sizeList?.data?.items ?? sizeList?.data ?? [];

  // 🔹 CRUD handler
  const handleAdd = (size: Size) => {
    // TODO: gọi API thêm kích thước
    setIsAddOpen(false);
    reloadList();
  };

  const handleEdit = (size: Size) => {
    setSelectedSize(size);
    setIsEditOpen(true);
  };

  const handleEditSave = (size: Size) => {
    // TODO: gọi API cập nhật kích thước
    setIsEditOpen(false);
    setSelectedSize(null);
    reloadList();
  };

  const handleDelete = (size: Size) => {
    setSelectedSize(size);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: gọi API xóa kích thước
    setIsDeleteOpen(false);
    setSelectedSize(null);
    reloadList();
  };

  const columns = useMemo(
    () => getSizeColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Quản lý kích thước</h1>

          <Button
            variant="add"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm kích thước
          </Button>
        </div>
        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          {isSizeLoading ? (
            <SkeletonFilter />
          ) : (
            <SizeFilter
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
              isLoading={isSizeLoading}
            />
          )}
        </div>
        {/*  */}
        {isSizeLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={sizeList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm kiếm kích thước..."
            isLoading={isSizeLoading}
          />
        )}

        {/* Dialogs */}
        <AddSizeDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdd={handleAdd}
        />
        <EditSizeDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          size={selectedSize}
          onSave={handleEditSave}
        />
        <DeleteSizeDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onDelete={handleDeleteConfirm}
          sizeName={selectedSize?.name}
        />
      </div>
    </div>
  );
};

export default Sizes;
