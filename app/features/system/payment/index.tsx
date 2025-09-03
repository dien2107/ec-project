import React, { useState } from "react";
import DataTable from "../components/data-table";
import { getColumns, type PaymentMethod } from "./types";
import AddPaymentMethodDialog from "./components/add-payment";
import { mockPaymentMethods } from "./data/data";
import EditPaymentMethodDialog from "./components/edit-payment";
import DeletePaymentMethodDialog from "./components/delete-payment";

export default function PaymentMethodManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "bank_transfer" | "e_wallet" | "cash" | "credit_card"
  >("all");
  const [paymentMethods, setPaymentMethods] =
    useState<PaymentMethod[]>(mockPaymentMethods);
  const pageSize = 10;

  // Filter payment methods based on status and type
  const filteredPaymentMethods = paymentMethods.filter(method => {
    const statusMatch =
      statusFilter === "all" || method.status === statusFilter;
    const typeMatch = typeFilter === "all" || method.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const totalPages = Math.ceil(filteredPaymentMethods.length / pageSize);
  const paginatedData = filteredPaymentMethods.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsDetailOpen(true);
  };

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsEditOpen(true);
  };

  const handleDelete = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setIsDeleteOpen(true);
  };

  const handleSavePaymentMethod = (methodData: Partial<PaymentMethod>) => {
    if (selectedPaymentMethod) {
      // Update existing payment method
      setPaymentMethods(prev =>
        prev.map(method =>
          method.id === selectedPaymentMethod.id
            ? { ...method, ...methodData }
            : method
        )
      );
    } else {
      // Add new payment method
      const newPaymentMethod: PaymentMethod = {
        id: `PM${String(paymentMethods.length + 1).padStart(3, "0")}`,
        name: methodData.name || "",
        type: methodData.type || "bank_transfer",
        description: methodData.description || "",
        provider: methodData.provider || "",
        accountInfo: methodData.accountInfo || "",
        transactionFee: methodData.transactionFee || 0,
        status: methodData.status || "active",
        createdDate: new Date().toLocaleDateString("vi-VN"),
      };
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
    }
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const globalFilterFn = (
    row: PaymentMethod,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof PaymentMethod)[] = [
      "id",
      "name",
      "provider",
      "description",
    ];
    return searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const columns = getColumns(handleView, handleEdit, handleDelete);

  return (
    <>
      <div className="container">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Quản lý phương thức thanh toán</h3>
          <AddPaymentMethodDialog onSave={handleSavePaymentMethod} />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Tổng cộng: {filteredPaymentMethods.length} phương thức thanh toán
          </div>
          <div className="flex gap-3">
            <select
              value={typeFilter}
              onChange={e =>
                setTypeFilter(
                  e.target.value as
                    | "all"
                    | "bank_transfer"
                    | "e_wallet"
                    | "cash"
                    | "credit_card"
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="e_wallet">Ví điện tử</option>
              <option value="credit_card">Thẻ tín dụng</option>
              <option value="cash">Tiền mặt</option>
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
          title="Danh sách phương thức thanh toán"
          filterPlaceholder="Tìm kiếm phương thức thanh toán..."
          showFilter
          addButtonTitle="Thêm phương thức"
          globalFilterFn={globalFilterFn}
        />
      </div>

      {/* Detail Modal */}
      {/* <PaymentMethodDetailDialog
        open={isDetailOpen}
        setIsOpen={setIsDetailOpen}
        paymentMethod={selectedPaymentMethod}
      /> */}

      {/* Edit Modal */}
      <EditPaymentMethodDialog
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        paymentMethod={selectedPaymentMethod}
        onSave={handleSavePaymentMethod}
      />

      {/* Delete Modal */}
      <DeletePaymentMethodDialog
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        paymentMethod={selectedPaymentMethod}
        onDelete={handleDeletePaymentMethod}
      />
    </>
  );
}
