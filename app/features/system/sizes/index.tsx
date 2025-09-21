import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "../components/data-table";
import { getSizeColumns, type Size } from "./types";
import { mockSizes } from "./data/mockSizes";
import AddSizeDialog from "./components/add-size-dialog";
import EditSizeDialog from "./components/edit-size-dialog";
import DeleteSizeDialog from "./components/delete-size-dialog";

export default function Sizes() {
    const [sizes, setSizes] = useState<Size[]>(mockSizes);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleAdd = (size: Size) => {
        setSizes(prev => [
            { ...size, id: `SIZE-${Date.now().toString().slice(-3)}` },
            ...prev,
        ]);
        setIsAddOpen(false);
    };

    const handleEdit = (size: Size) => {
        setSelectedSize(size);
        setIsEditOpen(true);
    };

    const handleEditSave = (size: Size) => {
        setSizes(prev => prev.map(s => s.id === size.id ? size : s));
        setIsEditOpen(false);
        setSelectedSize(null);
    };

    const handleDelete = (size: Size) => {
        setSelectedSize(size);
        setIsDeleteOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedSize) {
            setSizes(prev => prev.filter(s => s.id !== selectedSize.id));
            setIsDeleteOpen(false);
            setSelectedSize(null);
        }
    };

    const columns = getSizeColumns(handleEdit, handleDelete);
    const totalPages = Math.ceil(sizes.length / pageSize);

    const paginatedData = sizes.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="container">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                    <span>📏</span> Quản lý kích thước
                </h3>
                <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Thêm kích thước
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={paginatedData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                title="Danh sách kích thước"
                showGlobalFilter={true}
                showFilter={true}
                filterPlaceholder="Tìm kiếm kích thước..."
                showAddButton={false}
            />

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
    );
}