import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataTable from "../components/data-table";
import { getColumns, type Material } from "./types";
import AddMaterialDialog from "./components/add-material";
import EditMaterialDialog from "./components/edit-material";
import DeleteMaterialDialog from "./components/delete-material";
import { mockMaterials } from "./data/data";

export default function MaterialManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    | "all"
    | "cotton"
    | "polyester"
    | "silk"
    | "wool"
    | "linen"
    | "denim"
    | "leather"
    | "synthetic"
  >("all");
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const pageSize = 10;

  // Filter materials based on status and type
  const filteredMaterials = materials.filter(material => {
    const statusMatch =
      statusFilter === "all" || material.status === statusFilter;
    const typeMatch = typeFilter === "all" || material.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredMaterials.length / pageSize);
  const paginatedData = filteredMaterials.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditOpen(true);
  };

  const handleDelete = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteOpen(true);
  };

  const handleSaveMaterial = (materialData: Partial<Material>) => {
    if (selectedMaterial) {
      // Update existing material
      setMaterials(prev =>
        prev.map(material =>
          material.id === selectedMaterial.id
            ? { ...material, ...materialData }
            : material
        )
      );
    } else {
      // Add new material
      const newMaterial: Material = {
        id: `MAT${String(materials.length + 1).padStart(3, "0")}`,
        name: materialData.name || "",
        type: materialData.type || "cotton",
        description: materialData.description || "",
        composition: materialData.composition || "",
        careInstructions: materialData.careInstructions || "",
        durability: materialData.durability || 5,
        breathability: materialData.breathability || 5,
        comfort: materialData.comfort || 5,
        status: materialData.status || "active",
        createdDate: new Date().toLocaleDateString("vi-VN"),
      };
      setMaterials(prev => [...prev, newMaterial]);
    }
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(prev => prev.filter(material => material.id !== materialId));
  };

  const globalFilterFn = (
    row: Material,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof Material)[] = [
      "id",
      "name",
      "description",
      "composition",
    ];
    return searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const columns = getColumns(handleEdit, handleDelete);

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý chất liệu</h3>
          <AddMaterialDialog onSave={handleSaveMaterial} />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Tổng cộng: {filteredMaterials.length} chất liệu
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={e =>
                setTypeFilter(
                  e.target.value as
                    | "all"
                    | "cotton"
                    | "polyester"
                    | "silk"
                    | "wool"
                    | "linen"
                    | "denim"
                    | "leather"
                    | "synthetic"
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="cotton">Cotton</option>
              <option value="polyester">Polyester</option>
              <option value="silk">Silk</option>
              <option value="wool">Wool</option>
              <option value="linen">Linen</option>
              <option value="denim">Denim</option>
              <option value="leather">Leather</option>
              <option value="synthetic">Synthetic</option>
            </select>
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as "all" | "active" | "inactive")
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách chất liệu"
          filterPlaceholder="Tìm kiếm chất liệu..."
          showFilter
          addButtonTitle="Thêm chất liệu"
          globalFilterFn={globalFilterFn}
        />
      </div>

      {/* Edit Modal */}
      <EditMaterialDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        material={selectedMaterial}
        onSave={handleSaveMaterial}
      />

      {/* Delete Modal */}
      <DeleteMaterialDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        material={selectedMaterial}
        onDelete={handleDeleteMaterial}
      />
    </>
  );
}
