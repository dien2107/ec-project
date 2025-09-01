import React, { useState } from "react";
import { Eye, X, Settings2 } from "lucide-react";
import { type ColumnDef, type CellContext } from "@tanstack/react-table";
import DataTable from "~/features/system/components/data-table";
import { Button } from "~/components/ui/button";

// ------------------- Types -------------------
interface Order {
  id: string;
  date: string;
  amount: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  status: "active" | "inactive";
  joinDate: string;
  totalSpent: number;
  address: string;
  orders: Order[];
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

// ------------------- Mock data -------------------
const mockCustomers: Customer[] = [
  {
    id: "KH001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    orderCount: 5,
    status: "active",
    joinDate: "15/12/2024",
    totalSpent: 8500000,
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    orders: [
      { id: "ORD-001", date: "25/04/2025", amount: 1850000, status: "delivered" },
      { id: "ORD-008", date: "10/04/2025", amount: 2300000, status: "delivered" },
    ],
  },
  {
    id: "KH002",
    name: "Trần Thị B",
    email: "tranthib@example.com",
    phone: "0909876543",
    orderCount: 3,
    status: "active",
    joinDate: "20/11/2024",
    totalSpent: 4200000,
    address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    orders: [],
  },
  {
    id: "KH003",
    name: "Lê Văn C",
    email: "levanc@example.com",
    phone: "0903216549",
    orderCount: 7,
    status: "active",
    joinDate: "05/10/2024",
    totalSpent: 12300000,
    address: "789 Đường Điện Biên Phủ, Quận 3, TP.HCM",
    orders: [],
  },
  {
    id: "KH004",
    name: "Phạm Thị D",
    email: "phamthid@example.com",
    phone: "0907654321",
    orderCount: 2,
    status: "inactive",
    joinDate: "12/09/2024",
    totalSpent: 1800000,
    address: "321 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    orders: [],
  },
  {
    id: "KH005",
    name: "Hoàng Văn E",
    email: "hoangvane@example.com",
    phone: "0902468135",
    orderCount: 4,
    status: "active",
    joinDate: "18/08/2024",
    totalSpent: 6700000,
    address: "654 Đường Võ Văn Tần, Quận 3, TP.HCM",
    orders: [],
  },
];

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

// ------------------- Customer Detail Modal -------------------
const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"personal" | "orders">("personal");

  if (!customer) return null;

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
          Thông tin khách hàng {customer.id}
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
          onClick={() => setActiveTab("personal")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "personal"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Thông tin cá nhân
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === "orders"
              ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Lịch sử đơn hàng
        </button>
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {activeTab === "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Họ tên
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {customer.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Email
                </label>
                <p className="text-gray-900">{customer.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Ngày tham gia
                </label>
                <p className="text-gray-900">{customer.joinDate}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Địa chỉ
                </label>
                <p className="text-gray-900">{customer.address}</p>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Trạng thái
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    customer.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {customer.status === "active" ? "Hoạt động" : "Không hoạt động"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Số điện thoại
                </label>
                <p className="text-gray-900">{customer.phone}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tổng chi tiêu
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {formatCurrency(customer.totalSpent)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
              <div>Mã đơn</div>
              <div>Ngày đặt</div>
              <div>Tổng tiền</div>
              <div>Trạng thái</div>
            </div>

            {customer.orders && customer.orders.length > 0 ? (
              customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">{order.id}</div>
                  <div className="text-gray-600">{order.date}</div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(order.amount)}
                  </div>
                  <div>
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Đã giao
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                Chưa có đơn hàng nào
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end p-6 border-t bg-gray-50">
        <Button
          onClick={onClose}
          className="px-4 py-2 border border-gray-500 text-gray-600 hover:bg-gray-200 hover:text-gray-800 font-medium transition-colors flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Khóa tài khoản
        </Button>
      </div>
    </Modal>
  );
};

// ------------------- Main Component -------------------
const CustomerManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Họ tên" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Số điện thoại" },
    { accessorKey: "orderCount", header: "Số đơn hàng" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }: CellContext<Customer, unknown>) => {
        const status = getValue() as Customer["status"];
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status === "active" ? "Hoạt động" : "Không hoạt động"}
          </span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      cell: ({ row }: CellContext<Customer, unknown>) => (
        <button
          onClick={() => handleViewCustomer(row.original)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      ),
    },
  ];

  const globalFilterFn = (row: Customer, _columnId: string, filterValue: string) => {
    const searchableFields: (keyof Customer)[] = ["id", "name", "email", "phone"];
    const matchesSearch = searchableFields.some((field) =>
      String(row[field]).toLowerCase().includes(filterValue.toLowerCase())
    );

    const matchesStatus =
      statusFilter === "all" ? true : row.status === statusFilter;

    return matchesSearch && matchesStatus;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Bộ lọc trạng thái */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Quản lý khách hàng</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>

        <DataTable<Customer, unknown>
          columns={columns}
          data={mockCustomers}
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
          title=""
          showGlobalFilter={true}
          globalFilterFn={globalFilterFn}
          globalFilterPlaceholder="Tìm khách hàng..."
        />

        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
        />
      </div>
    </div>
  );
};

export default CustomerManagement;
