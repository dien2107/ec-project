"use client";

import { useState, useMemo } from "react";
import {
  Package,
  Repeat2,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  Printer,
  ChevronUp,
} from "lucide-react";
import DataTable from "~/features/system/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

// Mock order data for lookup
const mockOrders = [
  { orderId: "ORD1001", customer: { name: "Nguyễn Văn A", phone: "0901234567" }, product: { name: "Áo sơ mi nam", sku: "SM001", price: 350000, image: "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg" } },
  { orderId: "ORD1002", customer: { name: "Trần Thị B", phone: "0907654321" }, product: { name: "Giày sneaker", sku: "SN002", price: 1200000, image: "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg" } },
  { orderId: "ORD1003", customer: { name: "Lê Văn C", phone: "0912345678" }, product: { name: "Quần jeans", sku: "JN003", price: 800000, image: "https://example.com/jeans.jpg" } },
];

type Return = {
  id: string;
  orderId: string;
  type: "exchange" | "return";
  customer: { name: string; phone: string };
  product: { name: string; sku: string; price: number; image: string };
  reason: string;
  description: string;
  status: "pending" | "processing" | "approved" | "rejected";
  requestDate: string;
  quantity: number;
};

const returns: Return[] = [
  {
    id: "RT001",
    orderId: "ORD1001",
    type: "return",
    customer: { name: "Nguyễn Văn A", phone: "0901234567" },
    product: {
      name: "Áo sơ mi nam",
      sku: "SM001",
      price: 350000,
      image:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg",
    },
    reason: "Sai kích thước",
    description: "Áo quá chật so với size đặt",
    status: "pending",
    requestDate: "2025-08-25",
    quantity: 2,
  },
  {
    id: "RT002",
    orderId: "ORD1002",
    type: "exchange",
    customer: { name: "Trần Thị B", phone: "0907654321" },
    product: {
      name: "Giày sneaker",
      sku: "SN002",
      price: 1200000,
      image:
        "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg",
    },
    reason: "Sản phẩm lỗi",
    description: "Đế giày bị bong keo",
    status: "approved",
    requestDate: "2025-08-28",
    quantity: 1,
  },
];

// 🛠️ Helper
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const returnColumns = (
  handleView: (ret: Return) => void,
  handleApprove: (ret: Return) => void,
  handleReject: (ret: Return) => void,
  handlePrint: (ret: Return) => void
): ColumnDef<Return>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <div className="text-center w-[100px]">Mã phiếu</div>;
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="font-semibold text-slate-800">{row.original.id}</div>
        <div className="text-xs text-slate-500">Đơn gốc: {row.original.orderId}</div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return <div className="text-center w-[120px]">Loại</div>;
    },
    cell: ({ row }) => (
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          row.original.type === "exchange"
            ? "bg-blue-100 text-blue-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {row.original.type === "exchange" ? (
          <>
            <Repeat2 className="w-4 h-4 mr-1" /> Đổi hàng
          </>
        ) : (
          <>
            <Package className="w-4 h-4 mr-1" /> Trả hàng
          </>
        )}
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: ({ column }) => {
      return <div className="text-center w-[180px]">Khách hàng</div>;
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="font-medium text-slate-800 text-sm">{row.original.customer.name}</div>
          <div className="text-xs text-slate-500">{row.original.customer.phone}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: ({ column }) => {
      return <div className="text-center w-[250px]">Sản phẩm</div>;
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img
          src={row.original.product.image}
          alt={row.original.product.name}
          className="w-10 h-10 rounded border object-cover"
        />
        <div>
          <div className="font-medium text-sm">{row.original.product.name}</div>
          <div className="text-xs text-slate-500">{row.original.product.sku}</div>
          <div className="text-xs font-medium text-green-600">
            {formatCurrency(row.original.product.price)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return <div className="text-center w-[80px]">Số lượng</div>;
    },
    cell: ({ row }) => (
      <div className="text-center font-medium text-slate-800">
        {row.original.quantity}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div className="text-center w-[120px]">Trạng thái</div>;
    },
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "pending", label: "Chờ xử lý" },
          { value: "processing", label: "Đang xử lý" },
          { value: "approved", label: "Đã duyệt" },
          { value: "rejected", label: "Từ chối" },
        ],
      },
    },
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
        processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
        approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
        rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
      } as const;
      return (
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[status].color}`}
        >
          {statusConfig[status].label}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return <div className="flex justify-center px-4 w-[200px]">Thao tác</div>;
    },
    cell: ({ row }) => {
      const ret = row.original;

      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleView(ret)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-green-600"
            disabled={ret.status !== "pending"}
            onClick={() => handleApprove(ret)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            disabled={ret.status !== "pending"}
            onClick={() => handleReject(ret)}
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600"
            onClick={() => handlePrint(ret)}
          >
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// 🛠️ Component chính
export default function OrderReturn() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [productSearch, setProductSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSuggestions, setOrderSuggestions] = useState<typeof mockOrders>([]);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang

  // 📊 Stats
  const stats = [
    {
      label: "Tổng phiếu",
      value: returns.length,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Đổi hàng",
      value: returns.filter((r) => r.type === "exchange").length,
      icon: Repeat2,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Trả hàng",
      value: returns.filter((r) => r.type === "return").length,
      icon: Package,
      color: "bg-indigo-100 text-indigo-600",
    },
  ];

  // 🔎 Filter logic
  const filteredReturns = useMemo(() => {
    return returns.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (dateFilter.from && new Date(r.requestDate) < new Date(dateFilter.from)) return false;
      if (dateFilter.to && new Date(r.requestDate) > new Date(dateFilter.to)) return false;

      if (productSearch) {
        const keyword = productSearch.toLowerCase().trim();
        if (
          !r.product.name.toLowerCase().includes(keyword) &&
          !r.product.sku.toLowerCase().includes(keyword)
        ) {
          return false;
        }
      }

      if (customerSearch) {
        const keyword = customerSearch.toLowerCase().trim();
        if (!r.customer.name.toLowerCase().includes(keyword)) return false;
      }

      if (phoneSearch) {
        const keyword = phoneSearch.trim();
        if (!r.customer.phone.includes(keyword)) return false;
      }

      return true;
    });
  }, [statusFilter, dateFilter, productSearch, customerSearch, phoneSearch]);

  // 📄 Phân trang
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🛠️ Logic thêm phiếu
  const [newReturn, setNewReturn] = useState<Partial<Return>>({
    id: "",
    orderId: "",
    type: "return",
    customer: { name: "", phone: "" },
    product: { name: "", sku: "", price: 0, image: "" },
    reason: "",
    description: "",
    status: "pending",
    requestDate: "",
    quantity: 1,
  });

  // Handle order ID input change for lookup
  const handleOrderIdChange = (value: string) => {
    setNewReturn({ ...newReturn, orderId: value });
    if (value.trim()) {
      const filteredOrders = mockOrders.filter((order) =>
        order.orderId.toLowerCase().includes(value.toLowerCase())
      );
      setOrderSuggestions(filteredOrders);
    } else {
      setOrderSuggestions([]);
    }
  };

  // Handle selecting an order from suggestions
  const handleSelectOrder = (order: typeof mockOrders[0]) => {
    setNewReturn({
      ...newReturn,
      orderId: order.orderId,
      customer: { name: order.customer.name, phone: order.customer.phone },
      product: {
        name: order.product.name,
        sku: order.product.sku,
        price: order.product.price,
        image: order.product.image,
      },
    });
    setOrderSuggestions([]);
  };

  const handleAddReturn = () => {
    if (
      !newReturn.id ||
      !newReturn.orderId ||
      !newReturn.customer?.name ||
      !newReturn.customer?.phone ||
      !newReturn.product?.name ||
      !newReturn.product?.sku ||
      !newReturn.reason ||
      !newReturn.requestDate
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    const newReturnData: Return = {
      ...newReturn,
      id: newReturn.id,
      orderId: newReturn.orderId,
      type: newReturn.type || "return",
      customer: {
        name: newReturn.customer.name,
        phone: newReturn.customer.phone,
      },
      product: {
        name: newReturn.product.name,
        sku: newReturn.product.sku,
        price: newReturn.product.price || 0,
        image: newReturn.product.image || "",
      },
      reason: newReturn.reason,
      description: newReturn.description || "",
      status: newReturn.status || "pending",
      requestDate: newReturn.requestDate,
      quantity: newReturn.quantity || 1,
    } as Return;

    returns.push(newReturnData); // Thêm vào mảng (tạm thời, nên thay bằng API call)
    setIsModalOpen(false);
    setNewReturn({
      id: "",
      orderId: "",
      type: "return",
      customer: { name: "", phone: "" },
      product: { name: "", sku: "", price: 0, image: "" },
      reason: "",
      description: "",
      status: "pending",
      requestDate: "",
      quantity: 1,
    });
    setOrderSuggestions([]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4"
          >
            <div className={`p-3 rounded-lg ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-slate-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Add Button */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Status buttons */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "processing", "approved", "rejected"].map((status) => (
            <Button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === status
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {status === "all" && "Tất cả"}
              {status === "pending" && "Chờ xử lý"}
              {status === "processing" && "Đang xử lý"}
              {status === "approved" && "Đã duyệt"}
              {status === "rejected" && "Từ chối"}
            </Button>
          ))}
        </div>

        {/* Date filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Từ ngày</span>
          <Input
            type="date"
            value={dateFilter.from}
            onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
            className="w-40"
          />
          <span className="text-sm text-slate-600">Đến ngày</span>
          <Input
            type="date"
            value={dateFilter.to}
            onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
            className="w-40"
          />
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white hover:bg-green-700 ml-auto"
        >
          Thêm phiếu đổi/trả
        </Button>
      </div>

      {/* Search fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="🔎 Tìm theo sản phẩm (tên hoặc SKU)..."
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
        />
        <Input
          type="text"
          placeholder="👤 Tìm theo tên khách hàng..."
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
        />
      </div>

      {/* DataTable */}
      {paginatedReturns.length > 0 ? (
        <DataTable
          columns={returnColumns(
            (ret) => { /* handle view logic here */ },
            (ret) => { /* handle approve logic here */ },
            (ret) => { /* handle reject logic here */ },
            (ret) => { /* handle print logic here */ }
          )}
          data={paginatedReturns}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
          title="Danh sách đổi / trả hàng"
        />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-slate-500">Không tìm thấy phiếu đổi/trả hàng nào phù hợp.</p>
        </div>
      )}

      {/* Modal thêm phiếu */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm phiếu đổi/trả</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700">Mã đơn gốc</label>
              <Input
                value={newReturn.orderId || ""}
                onChange={(e) => handleOrderIdChange(e.target.value)}
                placeholder="Nhập mã đơn gốc (VD: ORD1003)"
                className="w-full"
              />
              {orderSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {orderSuggestions.map((order) => (
                    <div
                      key={order.orderId}
                      className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                      onClick={() => handleSelectOrder(order)}
                    >
                      <div className="font-medium">{order.orderId}</div>
                      <div className="text-sm text-slate-500">{order.customer.name} - {order.product.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Loại</label>
              <Select
                value={newReturn.type || "return"}
                onValueChange={(value) =>
                  setNewReturn({ ...newReturn, type: value as "exchange" | "return" })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="return">Trả hàng</SelectItem>
                  <SelectItem value="exchange">Đổi hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Mã SKU</label>
              <Input
                value={newReturn.product?.sku || ""}
                onChange={(e) =>
                  setNewReturn({
                    ...newReturn,
                    product: {
                      name: newReturn.product?.name ?? "",
                      sku: e.target.value,
                      price: newReturn.product?.price ?? 0,
                      image: newReturn.product?.image ?? "",
                    },
                  })
                }
                placeholder="Nhập mã SKU"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Lý do</label>
              <Input
                value={newReturn.reason || ""}
                onChange={(e) => setNewReturn({ ...newReturn, reason: e.target.value })}
                placeholder="Nhập lý do đổi/trả"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Số lượng</label>
              <Input
                type="number"
                value={newReturn.quantity || 1}
                onChange={(e) =>
                  setNewReturn({ ...newReturn, quantity: Number(e.target.value) })
                }
                placeholder="Nhập số lượng"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Ngày yêu cầu</label>
              <Input
                type="date"
                value={newReturn.requestDate || ""}
                onChange={(e) => setNewReturn({ ...newReturn, requestDate: e.target.value })}
                className="w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddReturn}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}