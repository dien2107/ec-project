import React, { useState } from "react";
import DataTable from "../components/data-table";
import { getColumns, type ShippingMethod } from "./types";
import AddShippingDialog from "./components/add-shipping-dialog";
import EditShippingDialog from "./components/edit-shipping-dialog";
import DeleteShippingDialog from "./components/delete-shipping-dialog";
import { mockShippingMethods } from "./data/data";

export default function ShippingMethodManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [methods, setMethods] = useState<ShippingMethod[]>(mockShippingMethods);
  const pageSize = 10;

  const totalPages = Math.ceil(methods.length / pageSize);
  const paginatedData = methods.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (method: ShippingMethod) => {
    setSelectedMethod(method);
    setIsEditOpen(true);
  };

  const handleDelete = (method: ShippingMethod) => {
    setSelectedMethod(method);
    setIsDeleteOpen(true);
  };

  const handleSaveMethod = (methodData: Partial<ShippingMethod>) => {
    if (selectedMethod) {
      // Update existing method
      setMethods(prev =>
        prev.map(method =>
          method.id === selectedMethod.id
            ? {
                ...method,
                ...methodData,
                updatedAt: new Date().toLocaleDateString("vi-VN"),
              }
            : method
        )
      );
    } else {
      // Add new method
      const newMethod: ShippingMethod = {
        id: `SHIP${String(methods.length + 1).padStart(3, "0")}`,
        corpName: methodData.corpName || "",
        description: methodData.description || "",
        baseCost: methodData.baseCost || 0,
        estimatedDays: methodData.estimatedDays || 3,
        status: methodData.status || "active",
        createdAt: new Date().toLocaleDateString("vi-VN"),
        updatedAt: new Date().toLocaleDateString("vi-VN"),
      };
      setMethods(prev => [...prev, newMethod]);
    }
    setSelectedMethod(null);
  };

  const handleDeleteMethod = (methodId: string) => {
    setMethods(prev => prev.filter(method => method.id !== methodId));
    setSelectedMethod(null);
  };

  const globalFilterFn = (
    row: ShippingMethod,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof ShippingMethod)[] = [
      "id",
      "corpName",
      "description",
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
          <h3 className="text-2xl font-bold">Quản lý phương thức vận chuyển</h3>
          <AddShippingDialog onSave={handleSaveMethod} />
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách phương thức vận chuyển"
          filterPlaceholder="Tìm kiếm phương thức vận chuyển..."
          showFilter
          globalFilterFn={globalFilterFn}
        />
      </div>

      {/* Edit Modal */}
      <EditShippingDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        method={selectedMethod}
        onSave={handleSaveMethod}
      />

      {/* Delete Modal */}
      <DeleteShippingDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        method={selectedMethod}
        onDelete={handleDeleteMethod}
      />
    </>
  );
}
