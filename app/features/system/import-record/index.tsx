import React, { useState } from "react";
import { Download, Package, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "~/components/ui/button";
import DataTable from "~/features/system/components/data-table";
import { getColumns, type ImportRecord } from "./types";
import ImportDetailDialog from "./components/import-detail-dialog";
import { mockImportRecords } from "./data/data";
import StatsCard from "./components/stats-card";

export default function ImportHistoryManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [importRecords, setImportRecords] =
    useState<ImportRecord[]>(mockImportRecords);
  const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending" | "cancelled"
  >("all");

  const pageSize = 10;

  const totalPages = Math.ceil(importRecords.length / pageSize);
  const paginatedData = importRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calculate stats
  const statsData = {
    totalOrders: importRecords.length,
    totalProducts: importRecords.reduce(
      (sum, record) => sum + record.quantity,
      0
    ),
    totalValue: importRecords.reduce(
      (sum, record) => sum + record.totalAmount,
      0
    ),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleViewImport = (importRecord: ImportRecord) => {
    setSelectedImport(importRecord);
    setIsDetailOpen(true);
  };

  const handleExportReport = () => {
    // Logic to export report
    console.log("Exporting report...");
  };

  const globalFilterFn = (
    row: ImportRecord,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof ImportRecord)[] = [
      "id",
      "supplier",
      "createdBy",
    ];

    const matchesSearch = searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

    return matchesSearch && matchesStatus;
  };

  const columns = getColumns(handleViewImport, formatCurrency);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Lịch sử nhập hàng
            </h1>
            <Button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatsCard
              title="Tổng đơn nhập"
              value={statsData.totalOrders}
              icon={<Package className="w-6 h-6 text-blue-600" />}
              bgColor="bg-blue-100"
            />
            <StatsCard
              title="Tổng sản phẩm"
              value={statsData.totalProducts}
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
              bgColor="bg-green-100"
            />
            <StatsCard
              title="Tổng giá trị"
              value={formatCurrency(statsData.totalValue)}
              icon={<DollarSign className="w-6 h-6 text-yellow-600" />}
              bgColor="bg-yellow-100"
            />
          </div>
          {/* Data Table */}
          <DataTable
            columns={columns}
            data={paginatedData}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            title=""
            showFilter
            showGlobalFilter={true}
            globalFilterFn={globalFilterFn}
            globalFilterPlaceholder="Tìm kiếm lịch sử nhập hàng..."
          />
        </div>
      </div>

      {/* Import Detail Dialog */}
      <ImportDetailDialog
        importRecord={selectedImport}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedImport(null);
        }}
        formatCurrency={formatCurrency}
      />
    </>
  );
}
