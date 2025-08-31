import React, { useState } from "react";
import {
  Eye,
  X,
  Download,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import DataTable from "~/features/system/components/data-table";
import { Button } from "~/components/ui/button";

// ------------------- Types -------------------
interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  currentStock: number;
  maxStock: number;
  minStock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
  unitPrice: number;
  totalValue: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

interface StockUpdateModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (productId: string, newStock: number) => void;
}

// ------------------- Mock data -------------------
const mockProducts: Product[] = [
  {
    id: "men-1",
    name: "Nike Air Max 90",
    brand: "Nike",
    category: "Giày nam",
    currentStock: 38,
    maxStock: 100,
    minStock: 10,
    status: "in_stock",
    lastUpdated: "25/04/2025",
    unitPrice: 2500000,
    totalValue: 95000000,
  },
  {
    id: "men-2",
    name: "Adidas Ultraboost 21",
    brand: "Adidas",
    category: "Giày nam",
    currentStock: 68,
    maxStock: 100,
    minStock: 15,
    status: "in_stock",
    lastUpdated: "27/03/2025",
    unitPrice: 3200000,
    totalValue: 217600000,
  },
  {
    id: "men-3",
    name: "New Balance 574",
    brand: "New Balance",
    category: "Giày nam",
    currentStock: 1,
    maxStock: 100,
    minStock: 5,
    status: "low_stock",
    lastUpdated: "10/02/2025",
    unitPrice: 1800000,
    totalValue: 1800000,
  },
  {
    id: "men-4",
    name: "Puma RS-X",
    brand: "Puma",
    category: "Giày nam",
    currentStock: 23,
    maxStock: 100,
    minStock: 10,
    status: "in_stock",
    lastUpdated: "06/03/2025",
    unitPrice: 2100000,
    totalValue: 48300000,
  },
  {
    id: "men-5",
    name: "Converse Chuck Taylor All Star",
    brand: "Converse",
    category: "Giày nam",
    currentStock: 93,
    maxStock: 100,
    minStock: 20,
    status: "in_stock",
    lastUpdated: "06/02/2025",
    unitPrice: 1200000,
    totalValue: 111600000,
  },
  {
    id: "men-6",
    name: "Vans Old Skool",
    brand: "Vans",
    category: "Giày nam",
    currentStock: 1,
    maxStock: 100,
    minStock: 8,
    status: "low_stock",
    lastUpdated: "13/02/2025",
    unitPrice: 1500000,
    totalValue: 1500000,
  },
  {
    id: "women-1",
    name: "Nike Air Force 1",
    brand: "Nike",
    category: "Giày nữ",
    currentStock: 63,
    maxStock: 100,
    minStock: 15,
    status: "in_stock",
    lastUpdated: "12/04/2025",
    unitPrice: 2300000,
    totalValue: 144900000,
  },
];

// ------------------- Stats calculation -------------------
const calculateStats = (products: Product[]) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    p => p.status === "low_stock"
  ).length;
  const outOfStockProducts = products.filter(
    p => p.status === "out_of_stock"
  ).length;

  return {
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
  };
};

// ------------------- Modal Component -------------------
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// ------------------- Product Detail Modal -------------------
const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stockPercentage = (product.currentStock / product.maxStock) * 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          Chi tiết sản phẩm {product.id}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tên sản phẩm
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {product.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Thương hiệu
              </label>
              <p className="text-gray-900">{product.brand}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Danh mục
              </label>
              <p className="text-gray-900">{product.category}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Đơn giá
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(product.unitPrice)}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Trạng thái kho
              </label>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "in_stock"
                    ? "bg-green-100 text-green-800"
                    : product.status === "low_stock"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {product.status === "in_stock"
                  ? "Còn hàng"
                  : product.status === "low_stock"
                    ? "Sắp hết"
                    : "Hết hàng"}
              </span>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tồn kho hiện tại
              </label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {product.currentStock} / {product.maxStock}
                  </span>
                  <span>{stockPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stockPercentage > 50
                        ? "bg-green-500"
                        : stockPercentage > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tổng giá trị tồn kho
              </label>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(product.totalValue)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Cập nhật lần cuối
              </label>
              <p className="text-gray-900">{product.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
          Đóng
        </Button>
        <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Edit className="w-4 h-4" />
          Cập nhật kho
        </Button>
      </div>
    </Modal>
  );
};

// ------------------- Stock Update Modal -------------------
const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [newStock, setNewStock] = useState(product?.currentStock || 0);
  const [updateType, setUpdateType] = useState<"set" | "add" | "subtract">(
    "set"
  );

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalStock = newStock;

    if (updateType === "add") {
      finalStock = product.currentStock + newStock;
    } else if (updateType === "subtract") {
      finalStock = Math.max(0, product.currentStock - newStock);
    }

    onUpdate(product.id, finalStock);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          Cập nhật tồn kho - {product.name}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Tồn kho hiện tại:
              <span className="font-semibold text-gray-900 ml-1">
                {product.currentStock}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Loại cập nhật
            </label>
            <select
              value={updateType}
              onChange={e =>
                setUpdateType(e.target.value as "set" | "add" | "subtract")
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="set">Đặt số lượng mới</option>
              <option value="add">Nhập thêm hàng</option>
              <option value="subtract">Xuất hàng</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {updateType === "set"
                ? "Số lượng mới"
                : updateType === "add"
                  ? "Số lượng nhập"
                  : "Số lượng xuất"}
            </label>
            <input
              type="number"
              value={newStock}
              onChange={e => setNewStock(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>

          {updateType !== "set" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Tồn kho sau cập nhật:
                <span className="font-semibold ml-1">
                  {updateType === "add"
                    ? product.currentStock + newStock
                    : Math.max(0, product.currentStock - newStock)}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ------------------- Stats Card Component -------------------
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}> = ({ title, value, subtitle, icon, bgColor }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    </div>
  </div>
);

// ------------------- Main Component -------------------
const InventoryManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isStockUpdateModalOpen, setIsStockUpdateModalOpen] =
    useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in_stock" | "low_stock" | "out_of_stock"
  >("all");
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const stats = calculateStats(products);

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
          } else if (newStock <= product.minStock) {
            newStatus = "low_stock";
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStockBarColor = (percentage: number) => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "name",
      header: "Tên sản phẩm",
      cell: ({ row }: CellContext<Product, unknown>) => (
        <div>
          <p className="font-medium text-gray-900">{row.original.name}</p>
          <p className="text-sm text-gray-500">{row.original.brand}</p>
        </div>
      ),
    },
    { accessorKey: "category", header: "Danh mục" },
    {
      accessorKey: "currentStock",
      header: "Số lượng",
      cell: ({ row }: CellContext<Product, unknown>) => {
        const product = row.original;
        const percentage = (product.currentStock / product.maxStock) * 100;

        return (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                {product.currentStock} / {product.maxStock}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getStockBarColor(percentage)}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }: CellContext<Product, unknown>) => {
        const status = getValue() as Product["status"];
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              status === "in_stock"
                ? "bg-green-100 text-green-800"
                : status === "low_stock"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status === "in_stock"
              ? "Còn hàng"
              : status === "low_stock"
                ? "Sắp hết"
                : "Hết hàng"}
          </span>
        );
      },
    },
    { accessorKey: "lastUpdated", header: "Nhập gần nhất" },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }: CellContext<Product, unknown>) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleViewProduct(row.original)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => handleUpdateStock(row.original)}
            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
          >
            Cập nhật kho
          </button>
        </div>
      ),
    },
  ];

  const globalFilterFn = (
    row: Product,
    _columnId: string,
    filterValue: string
  ) => {
    const searchableFields: (keyof Product)[] = [
      "id",
      "name",
      "brand",
      "category",
    ];
    const matchesSearch = searchableFields.some(field =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

    return matchesSearch && matchesStatus;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kho hàng</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Tổng số sản phẩm"
            value={stats.totalProducts}
            subtitle="Tổng số mặt hàng trong kho"
            icon={<Package className="w-6 h-6 text-blue-600" />}
            bgColor="bg-blue-100"
          />
          <StatsCard
            title="Sản phẩm sắp hết hàng"
            value={stats.lowStockProducts}
            subtitle="Sản phẩm cần nhập thêm"
            icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
            bgColor="bg-yellow-100"
          />
          <StatsCard
            title="Sản phẩm hết hàng"
            value={stats.outOfStockProducts}
            subtitle="Sản phẩm cần nhập ngay"
            icon={<X className="w-6 h-6 text-red-600" />}
            bgColor="bg-red-100"
          />
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách tồn kho
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(
                  e.target.value as
                    | "all"
                    | "in_stock"
                    | "low_stock"
                    | "out_of_stock"
                )
              }
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="in_stock">Còn hàng</option>
              <option value="low_stock">Sắp hết</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
            <Button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <DataTable<Product, unknown>
          columns={columns}
          data={products}
          currentPage={currentPage}
          totalPages={Math.ceil(products.length / 10)}
          onPageChange={setCurrentPage}
          title=""
          showGlobalFilter={true}
          globalFilterFn={globalFilterFn}
          globalFilterPlaceholder="Tìm sản phẩm..."
        />

        {/* Modals */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedProduct(null);
          }}
        />

        <StockUpdateModal
          product={selectedProduct}
          isOpen={isStockUpdateModalOpen}
          onClose={() => {
            setIsStockUpdateModalOpen(false);
            setSelectedProduct(null);
          }}
          onUpdate={handleStockUpdate}
        />
      </div>
    </div>
  );
};

export default InventoryManagement;
