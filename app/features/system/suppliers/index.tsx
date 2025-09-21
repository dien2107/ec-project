import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import AddSupplierDialog from "./components/add-supplier-dialog";
import EditSupplierDialog from "./components/edit-supplier-dialog";
import DeleteSupplierDialog from "./components/delete-supplier-dialog";
import { getSupplierColumns, type Supplier } from "./types";
import { mockSuppliers } from "./data/mockSuppliers";
import DataTable from "../components/data-table";

export default function Suppliers() {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(mockSuppliers.length / pageSize);

    const paginatedData = mockSuppliers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const handleEdit = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsEditOpen(true);
    };

    const handleDelete = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        // TODO: Thực hiện xoá supplier ở đây
        setIsDeleteOpen(false);
    };

    const columns = getSupplierColumns(handleEdit, handleDelete);

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Quản lý nhà cung cấp</h3>
                <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm nhà cung cấp
                </Button>
            </div>
            
            <DataTable
                columns={columns}
                data={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                title="Danh sách nhà cung cấp"
                showGlobalFilter={true}
                showFilter={true}
                filterPlaceholder="Tìm nhà cung cấp..."
                showAddButton={false}
            />
            
            <AddSupplierDialog open={isAddOpen} setIsOpen={setIsAddOpen} />
            <EditSupplierDialog open={isEditOpen} setIsOpen={setIsEditOpen} supplier={selectedSupplier} />
            <DeleteSupplierDialog
                open={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                onDelete={handleDeleteConfirm}
                supplierName={selectedSupplier?.name}
            />
        </div>
    );
}
