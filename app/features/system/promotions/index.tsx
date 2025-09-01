import { useState } from "react";

import DataTable from "../components/data-table";

import { fakePromotions } from "./data/fakePromotions";
import { getColumns, type Promotion } from "./types";

import AddPromotionDialog from "./components/add-promotion-dialog";
import EditPromotionDialog from "./components/edit-promotion-dialog";
import DeletePromotionDialog from "./components/delete-promotion-dialog";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(fakePromotions.length / pageSize);

  const paginatedData = fakePromotions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsEditOpen(true);
  };

  const handleDelete = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý khuyến mãi</h3>
          <AddPromotionDialog />
        </div>
        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          title="Danh sách khuyến mãi"
          filterPlaceholder="Tìm khuyến mãi..."
          showFilter
        />
      </div>

      {/* Edit Modal */}
      <EditPromotionDialog open={isEditOpen} setIsOpen={setIsEditOpen} />

      {/* Delete Modal */}
      <DeletePromotionDialog open={isDeleteOpen} setIsOpen={setIsDeleteOpen} />
    </>
  );
}
