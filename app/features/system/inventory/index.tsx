// Main component: InventoryManagement.tsx
import React, { useState } from "react";
import { Package, X, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useInventoryStats, type Product } from "./types";
import StatsCard from "./components/StatsCard";
import ProductDetailModal from "./components/ProductDetailModal";
import StockUpdateModal from "./components/StockUpdateModal";
import { getColumns } from "./columns/column";
import { mockProducts } from "./data";
import DataTable from "../components/data-table";

const InventoryManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(mockProducts.length / pageSize);

  const paginatedData = mockProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isStockUpdateModalOpen, setIsStockUpdateModalOpen] =
    useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const stats = useInventoryStats(products);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStock = (product: Product) => {
    setSelectedProduct(product);
    setIsStockUpdateModalOpen(true);
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(prev =>
      prev.map(product => {
        if (product.id === productId) {
          let newStatus: Product["status"] = "in_stock";
          if (newStock === 0) {
            newStatus = "out_of_stock";
          }
          return {
            ...product,
            currentStock: newStock,
            status: newStatus,
            totalValue: newStock * product.unitPrice,
            lastUpdated: new Date().toLocaleDateString("vi-VN"),
          };
        }
        return product;
      })
    );
  };

  const columns = getColumns(handleViewProduct, handleUpdateStock);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Quản lý kho hàng
          </h1>
          <p className="text-gray-500">Theo dõi và quản lý tồn kho sản phẩm</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Tổng số sản phẩm"
          value={stats.totalProducts}
          subtitle="Tổng số mặt hàng trong kho"
          icon={<Package className="w-6 h-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatsCard
          title="Sản phẩm hết hàng"
          value={stats.outOfStockProducts}
          subtitle="Sản phẩm cần nhập ngay"
          icon={<X className="w-6 h-6 text-red-600" />}
          bgColor="bg-red-100"
        />
      </div>

      {/* Section Title and Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Quản lý kho</h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        title="Danh sách tồn kho"
        showFilter
      />

      {/* Modals */}
      <ProductDetailModal
        product={selectedProduct}
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        onUpdateStock={handleUpdateStock}
      />

      <StockUpdateModal
        product={selectedProduct}
        open={isStockUpdateModalOpen}
        onOpenChange={setIsStockUpdateModalOpen}
        onUpdate={handleStockUpdate}
      />
    </div>
  );
};

export default InventoryManagement;
