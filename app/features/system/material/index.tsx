import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchMaterialListData } from "~/redux/slices/materials";

import DataTable from "../components/data-table";
import { getColumns } from "./columns/material";
import MaterialFilter from "./components/material-filter";
import AddMaterialDialog from "./components/add-material";
import EditMaterialDialog from "./components/edit-material";
import DeleteMaterialDialog from "./components/delete-material";

import type { Material } from "./types";

export default function MaterialManagement() {
  const dispatch = useAppDispatch();
  const { materialList, isLoading: isMaterialLoading } = useAppSelector(
    (state: any) => state.materialList
  );

  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Gọi API khi phân trang hoặc filter thay đổi
  useEffect(() => {
    dispatch(
      fetchMaterialListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters]);

  // CRUD handlers
  const handleEdit = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteOpen(true);
  }, []);

  // Khi đổi filter thì reset về trang 1
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  const columns = useMemo(
    () => getColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const data = materialList?.data?.items ?? [];

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Quản lý chất liệu</h3>
        <AddMaterialDialog
          onAdded={() => {
            dispatch(
              fetchMaterialListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center justify-between mb-4">
        <MaterialFilter filters={filters} setFilters={handleFilterChange} />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        currentPage={currentPage}
        totalPages={materialList?.data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
        isLoading={isMaterialLoading}
      />

      {/* Dialogs */}
      {selectedMaterial && (
        <EditMaterialDialog
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedMaterial={selectedMaterial}
          onUpdated={() => {
            dispatch(
              fetchMaterialListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      )}
      {selectedMaterial && (
        <DeleteMaterialDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedMaterial={selectedMaterial}
          onDeleted={() => {
            dispatch(
              fetchMaterialListData({
                PageNumber: currentPage,
                PageSize: PAGE_SIZE,
                Search: filters.Search || undefined,
                StatusName: filters.StatusName || undefined,
              })
            );
          }}
        />
      )}
    </div>
  );
}
