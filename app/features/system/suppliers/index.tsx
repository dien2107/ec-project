import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import AddSupplierDialog from "./components/add-supplier-dialog";
import EditSupplierDialog from "./components/edit-supplier-dialog";
import DeleteSupplierDialog from "./components/delete-supplier-dialog";
import { getSupplierColumns, type Supplier } from "./types";
import DataTable from "../components/data-table";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import SkeletonTable from "~/components/ui/skeleton-table";
import SupplierFilters from "./components/supplier-filters";

export default function Suppliers() {
  const dispatch = useAppDispatch();
  const { supplierList, isLoading: isSupplierListLoading } = useAppSelector(
    (state) => state.SupplierList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [filters, setFilters] = useState({
    search: "",
    statusId: undefined as number | undefined,
    orderBy: undefined as string | undefined,
    supplierGroupId: undefined as number | undefined,
  });

  // Fetch danh sách
  useEffect(() => {
    dispatch(
      fetchSupplierListData({
        PageNumber: currentPage,
        PageSize: pageSize,
        Name: filters.search,
        StatusId: filters.statusId,
        OrderBy: filters.orderBy,
        SupplierGroupId: filters.supplierGroupId,
      })
    );
  }, [dispatch, currentPage, pageSize, filters]);

  const handleFilterChange = useCallback((newFilters: typeof filters) => {
    setCurrentPage(1);
    setFilters(newFilters);
  }, []);

  // Dialog states
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);
  const [selectedSupplierName, setSelectedSupplierName] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleEdit = useCallback((supplier: Supplier) => {
    setSelectedSupplierId(supplier.supplierId);
    setIsEditOpen(true);
  }, []);

  const handleDelete = useCallback((supplier: Supplier) => {
    setSelectedSupplierId(supplier.supplierId);
    setSelectedSupplierName(supplier.name);
    setIsDeleteOpen(true);
  }, []);

  const reloadSuppliers = useCallback(() => {
    dispatch(
      fetchSupplierListData({
        PageNumber: currentPage,
        PageSize: pageSize,
        Name: filters.search,
        StatusId: filters.statusId,
        OrderBy: filters.orderBy,
        SupplierGroupId: filters.supplierGroupId,
      })
    );
  }, [dispatch, currentPage, pageSize, filters]);

  const columns = useMemo(
    () => getSupplierColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Quản lý nhà cung cấp</h3>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Thêm nhà cung cấp
        </Button>
      </div>

      {/* Bộ lọc */}
      <SupplierFilters onFilterChange={handleFilterChange} />

      {/* Bảng dữ liệu */}
      {isSupplierListLoading && !supplierList?.data?.items ? (
        <SkeletonTable />
      ) : (
        <DataTable
          columns={columns}
          data={supplierList?.data?.items ?? []}
          currentPage={supplierList?.data?.pageNumber ?? currentPage}
          totalPages={supplierList?.data?.totalPages ?? 1}
          onPageChange={(page) => setCurrentPage(page)}
          title="Danh sách nhà cung cấp"
        />
      )}

      {/* Dialogs */}
      <AddSupplierDialog open={isAddOpen} setIsOpen={setIsAddOpen} />

      <EditSupplierDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        supplierId={selectedSupplierId}
        onUpdated={reloadSuppliers}
      />

      <DeleteSupplierDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        supplierId={selectedSupplierId ?? 0}       
        supplierName={selectedSupplierName ?? ""}  
        onDeleted={reloadSuppliers}              
      />
    </div>
  );
}
