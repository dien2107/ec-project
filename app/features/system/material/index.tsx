import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { type Material } from "./types"; // Ensure Material type is defined
import AddMaterialDialog from "./components/add-material";
import EditMaterialDialog from "./components/edit-material";
import DeleteMaterialDialog from "./components/delete-material";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchMaterialListData } from "~/redux/slices/materials"; // Adjust the import as necessary
import toast, { Toaster } from "react-hot-toast";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import { getColumns } from "./columns/material"; // Ensure this function is defined
import MaterialFilter from "./components/material-filter"; // Ensure this component is defined

const MaterialManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6;
  const { materialList, isLoading: isMaterialLoading } = useAppSelector(
    (state: any) =>
      state.materialList ?? { materialList: null, isLoading: false }
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<{
    Search?: string;
    StatusName?: string;
  }>({});

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔹 Load material list
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchMaterialListData({
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

  const data = materialList?.data?.items ?? materialList?.data ?? [];

  // 🔹 CRUD handlers
  const handleAdd = (material: Material) => {
    // TODO: Call API to add material
    setIsAddOpen(false);
    reloadList();
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  };

  const handleEditSave = (material: Material) => {
    // TODO: Call API to update material
    setIsEditOpen(false);
    setSelectedMaterial(null);
    reloadList();
  };

  const handleDelete = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Call API to delete material
    setIsDeleteOpen(false);
    setSelectedMaterial(null);
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
          <h1 className="text-xl font-semibold">Quản lý chất liệu</h1>

          <Button
            variant="add"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm chất liệu
          </Button>
        </div>
        {/* Filter */}
        <div className="flex items-center justify-between mb-4">
          {isMaterialLoading ? (
            <SkeletonFilter />
          ) : (
            <MaterialFilter
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
              isLoading={isMaterialLoading}
            />
          )}
        </div>
        {/* Table */}
        {isMaterialLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={materialList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm kiếm chất liệu..."
            isLoading={isMaterialLoading}
          />
        )}

        {/* Dialogs */}
        <AddMaterialDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdd={handleAdd}
        />
        <EditMaterialDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          material={selectedMaterial}
          onSave={handleEditSave}
        />
        <DeleteMaterialDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          onDelete={handleDeleteConfirm}
          materialName={selectedMaterial?.name}
        />
      </div>
    </div>
  );
};

export default MaterialManagement;
