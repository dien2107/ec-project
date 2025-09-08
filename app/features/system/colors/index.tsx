import React, { useState } from "react";
import DataTable from "../components/data-table";
import { getColorColumns, type Color } from "./types";
import { mockColors } from "./data/mockColors";
import AddColorDialog from "./components/add-color-dialog";
import EditColorDialog from "./components/edit-color-dialog"; 
import DeleteColorDialog from "./components/delete-color-dialog";

export default function Colors() {
  const [colors, setColors] = useState<Color[]>(mockColors);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAdd = (color: Color) => {
    setColors(prev => [
      { ...color, id: `CLR-${Date.now().toString().slice(-3)}` },
      ...prev,
    ]);
    setIsAddOpen(false);
  };

  const handleEdit = (color: Color) => {
    setSelectedColor(color);
    setIsEditOpen(true);
  };

  const handleEditSave = (color: Color) => {
    setColors(prev => prev.map(c => c.id === color.id ? color : c));
    setIsEditOpen(false);
    setSelectedColor(null);
  };

  const handleDelete = (color: Color) => {
    setSelectedColor(color);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedColor) {
      setColors(prev => prev.filter(c => c.id !== selectedColor.id));
      setIsDeleteOpen(false);
      setSelectedColor(null);
    }
  };

  const columns = getColorColumns(handleEdit, handleDelete);
  const totalPages = Math.ceil(colors.length / pageSize);
  
  const paginatedData = colors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold">Quản lý màu sắc</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{colors.length}</span>
              <span className="text-gray-600">Tổng số</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {colors.filter(c => c.status === "active").length}
              </span>
              <span className="text-gray-600">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        title="Danh sách màu sắc"
        showGlobalFilter={true}
        showFilter={true}
        filterPlaceholder="Tìm kiếm màu sắc..."
        showAddButton={true}
        addButtonTitle="Thêm màu"
        onAddClick={() => setIsAddOpen(true)}
      />

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
  );
}