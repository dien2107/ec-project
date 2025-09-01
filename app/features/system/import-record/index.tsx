import React, { useState } from "react";
import {
  Eye,
  X,
  Download,
  Package,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import DataTable from "~/features/system/components/data-table";
import { Button } from "~/components/ui/button";

// ------------------- Types -------------------
interface ImportItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ImportRecord {
  id: string;
  supplier: string;
  quantity: number;
  totalAmount: number;
  importDate: string;
  createdBy: string;
  status: "completed" | "pending" | "cancelled";
  items: ImportItem[];
  notes?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface ImportDetailModalProps {
  importRecord: ImportRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

// ------------------- Mock data -------------------
const mockImportRecords: ImportRecord[] = [
  {
    id: "IMP-2024-003",
    supplier: "Fashion Import Ltd",
    quantity: 67,
    totalAmount: 25000000,
    importDate: "14/01/2024",
    createdBy: "Admin",
    status: "completed",
    notes: "Hàng mùa xuân 2024",
    items: [
      {
        id: "ITEM-001",
        productName: "Áo sơ mi nam",
        category: "Áo nam",
        quantity: 30,
        unitPrice: 250000,
        totalPrice: 7500000,
      },
      {
        id: "ITEM-002",
        productName: "Quần jean nữ",
        category: "Quần nữ",
        quantity: 25,
        unitPrice: 450000,
        totalPrice: 11250000,
      },
      {
        id: "ITEM-003",
        productName: "Giày sneaker",
        category: "Giày dép",
        quantity: 12,
        unitPrice: 520000,
        totalPrice: 6240000,
      },
    ],
  },
  {
    id: "IMP-2024-002",
    supplier: "Xưởng May Xuân Hà",
    quantity: 23,
    totalAmount: 6500000,
    importDate: "12/01/2024",
    createdBy: "Manager",
    status: "completed",
    items: [
      {
        id: "ITEM-004",
        productName: "Váy midi",
        category: "Váy đầm",
        quantity: 15,
        unitPrice: 300000,
        totalPrice: 4500000,
      },
      {
        id: "ITEM-005",
        productName: "Áo khoác",
        category: "Áo khoác",
        quantity: 8,
        unitPrice: 250000,
        totalPrice: 2000000,
      },
    ],
  },
  {
    id: "IMP-2024-001",
    supplier: "Công ty TNHH Thời Trang ABC",
    quantity: 45,
    totalAmount: 15000000,
    importDate: "08/01/2024",
    createdBy: "Staff",
    status: "completed",
    items: [
      {
        id: "ITEM-006",
        productName: "Túi xách da",
        category: "Phụ kiện",
        quantity: 20,
        unitPrice: 450000,
        totalPrice: 9000000,
      },
      {
        id: "ITEM-007",
        productName: "Dây nịt nam",
        category: "Phụ kiện",
        quantity: 25,
        unitPrice: 240000,
        totalPrice: 6000000,
      },
    ],
  },
];

// ------------------- Stats data -------------------
const statsData = {
  totalOrders: 3,
  totalProducts: 135,
  totalValue: 48500000,
};

// ------------------- Modal Component -------------------
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// ------------------- Import Detail Modal -------------------
const ImportDetailModal: React.FC<ImportDetailModalProps> = ({
  importRecord,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "items">("info");

  if (!importRecord) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-xl font-semibold">
          Chi tiết nhập hàng {importRecord.id}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "info"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thông tin chung
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "items"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Chi tiết sản phẩm ({importRecord.items.length})
        </button>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {activeTab === "info" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Nhà cung cấp
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {importRecord.supplier}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Ngày nhập
                </label>
                <p className="text-gray-900">{importRecord.importDate}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Người tạo
                </label>
                <p className="text-gray-900">{importRecord.createdBy}</p>
              </div>

              {importRecord.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Ghi chú
                  </label>
                  <p className="text-gray-900">{importRecord.notes}</p>
                </div>
              )}
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Trạng thái
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    importRecord.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : importRecord.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {importRecord.status === "completed"
                    ? "Hoàn thành"
                    : importRecord.status === "pending"
                      ? "Đang xử lý"
                      : "Đã hủy"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tổng số lượng
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {importRecord.quantity} sản phẩm
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tổng giá trị
                </label>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(importRecord.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
              <div>Tên sản phẩm</div>
              <div>Danh mục</div>
              <div>Số lượng</div>
              <div>Đơn giá</div>
              <div>Thành tiền</div>
              <div>Mã sản phẩm</div>
            </div>

            {importRecord.items.map(item => (
              <div
                key={item.id}
                className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100"
              >
                <div className="font-medium text-gray-900">
                  {item.productName}
                </div>
                <div className="text-gray-600">{item.category}</div>
                <div className="text-gray-900">{item.quantity}</div>
                <div className="text-gray-900">
                  {formatCurrency(item.unitPrice)}
                </div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(item.totalPrice)}
                </div>
                <div className="text-gray-600">{item.id}</div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng cộng:
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(importRecord.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
        <Button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium transition-colors"
        >
          Đóng
        </Button>
        <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </Button>
      </div>
    </Modal>
  );
};

// ------------------- Stats Card Component -------------------
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
}> = ({ title, value, icon, bgColor }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    </div>
  </div>
);

// ------------------- Main Component -------------------
const ImportHistoryManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImport, setSelectedImport] = useState<ImportRecord | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "pending" | "cancelled"
  >("all");

  const handleViewImport = (importRecord: ImportRecord) => {
    setSelectedImport(importRecord);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns: ColumnDef<ImportRecord>[] = [
    { accessorKey: "id", header: "Mã đơn hàng" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
        const quantity = getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span>{quantity}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
        const amount = getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "importDate",
      header: "Ngày nhập",
      cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
        const date = getValue() as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{date}</span>
          </div>
        );
      },
    },
    { accessorKey: "createdBy", header: "Người nhận" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }: CellContext<ImportRecord, unknown>) => {
        const status = getValue() as ImportRecord["status"];
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              status === "completed"
                ? "bg-green-100 text-green-800"
                : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {status === "completed"
              ? "Hoàn thành"
              : status === "pending"
                ? "Đang xử lý"
                : "Đã hủy"}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Chi tiết",
      cell: ({ row }: CellContext<ImportRecord, unknown>) => (
        <button
          onClick={() => handleViewImport(row.original)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      ),
    },
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Lịch sử nhập hàng
          </h1>
          <Button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
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

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Hiển thị {mockImportRecords.length} đơn nhập hàng
          </div>
          <select
            value={statusFilter}
            onChange={e =>
              setStatusFilter(
                e.target.value as "all" | "completed" | "pending" | "cancelled"
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="completed">Hoàn thành</option>
            <option value="pending">Đang xử lý</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <DataTable<ImportRecord, unknown>
          columns={columns}
          data={mockImportRecords}
          currentPage={currentPage}
          totalPages={Math.ceil(mockImportRecords.length / 10)}
          onPageChange={setCurrentPage}
          title=""
          showGlobalFilter={true}
          globalFilterFn={globalFilterFn}
          globalFilterPlaceholder="Tìm kiếm lịch sử nhập hàng..."
        />

        <ImportDetailModal
          importRecord={selectedImport}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedImport(null);
          }}
        />
      </div>
    </div>
  );
};

export default ImportHistoryManagement;
