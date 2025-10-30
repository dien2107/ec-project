import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { type Color } from "./types";
import AddColorDialog from "./components/add-color-dialog";
import EditColorDialog from "./components/edit-color-dialog";
import DeleteColorDialog from "./components/delete-color-dialog";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchColorListData } from "~/redux/slices/colors";
import toast, { Toaster } from "react-hot-toast";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import { getColumns } from "./columns/colors";
import ColorFilter from "./components/color-filter";

const ColorManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6;
  const { colorList, isLoading: isColorLoading } = useAppSelector(
    (state: any) => state.colorList ?? { colorList: null, isLoading: false }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    StatusName?: string;
  }>({});

  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔹 Gọi API load list
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchColorListData({
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
  const data = colorList?.data?.items ?? colorList?.data ?? [];
  console.log(data);
  console.log(filters);
  // 🔹 CRUD handler
  const handleAdd = (color: Color) => {
    // TODO: gọi API thêm color
    setIsAddOpen(false);
    reloadList();
  };

  const handleEdit = (color: Color) => {
    setSelectedColor(color);
    setIsEditOpen(true);
  };

  const handleEditSave = (color: Color) => {
    // TODO: gọi API update
    setIsEditOpen(false);
    setSelectedColor(null);
    reloadList();
  };

  const handleDelete = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: gọi API delete
    setIsDeleteOpen(false);
    setSelectedColor(null);
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
          <h1 className="text-xl font-semibold">Quản lý màu sắc</h1>

          <Button
            variant="add"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm màu
          </Button>
        </div>
        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          {isColorLoading ? (
            <SkeletonFilter />
          ) : (
            <ColorFilter
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
              isLoading={isColorLoading}
            />
          )}
        </div>
        {/*  */}
        {isColorLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={colorList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm kiếm màu..."
            isLoading={isColorLoading}
          />
        )}

        {/* Dialogs */}
        <AddColorDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdd={handleAdd}
        />
        <EditColorDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          color={selectedColor}
          onSave={handleEditSave}
        />
        <DeleteColorDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onDelete={handleDeleteConfirm}
          colorName={selectedColor?.name}
        />
      </div>
    </div>
  );
};

export default ColorManagement;
