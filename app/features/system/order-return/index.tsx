import { useState } from "react"
import {
  Package,
  RotateCcw,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Calendar,
  User,
} from "lucide-react"
import DataTable from "~/features/system/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"

type Return = {
  id: string
  orderId: string
  customer: { name: string; phone: string }
  product: { name: string; sku: string; price: number; image: string }
  reason: string
  description: string
  status: "pending" | "processing" | "approved" | "rejected"
  requestDate: string
}

const returns: Return[] = [
  {
    id: "RT001",
    orderId: "ORD1001",
    customer: { name: "Nguyễn Văn A", phone: "0901234567" },
    product: {
      name: "Áo sơ mi nam",
      sku: "SM001",
      price: 350000,
      image: "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg",
    },
    reason: "Sai kích thước",
    description: "Áo quá chật so với size đặt",
    status: "pending",
    requestDate: "2025-08-25",
  },
  {
    id: "RT002",
    orderId: "ORD1002",
    customer: { name: "Trần Thị B", phone: "0907654321" },
    product: {
      name: "Giày sneaker",
      sku: "SN002",
      price: 1200000,
      image: "https://cdn2.yame.vn/pimg/ao-thun-co-tron-tay-ngan-vai-ca-sau-4-chieu-tham-hut-bieu-tuong-dang-rong-on-gian-seventy-seven-13-0023217/6862ecfb-5b3f-eb00-434a-001c69b589e0.jpg",
    },
    reason: "Sản phẩm lỗi",
    description: "Đế giày bị bong keo",
    status: "approved",
    requestDate: "2025-08-28",
  },
]

// 🛠️ Helper
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("vi-VN")

// 🛠️ Cột DataTable
const returnColumns: ColumnDef<Return>[] = [
  {
    accessorKey: "id",
    header: "Mã đơn trả",
    cell: ({ row }) => (
      <div>
        <div className="font-semibold text-slate-800">{row.original.id}</div>
        <div className="text-sm text-slate-500">{row.original.orderId}</div>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-medium text-slate-800">{row.original.customer.name}</div>
          <div className="text-sm text-slate-500">{row.original.customer.phone}</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: "Sản phẩm",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.product.image}
          alt={row.original.product.name}
          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
        />
        <div>
          <div className="font-medium text-slate-800 max-w-xs truncate">
            {row.original.product.name}
          </div>
          <div className="text-sm text-slate-500">{row.original.product.sku}</div>
          <div className="text-sm font-medium text-green-600">
            {formatCurrency(row.original.product.price)}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Lý do",
    cell: ({ row }) => (
      <div className="max-w-xs">
        <div className="font-medium text-slate-800">{row.original.reason}</div>
        <div className="text-sm text-slate-500 truncate">{row.original.description}</div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status
      const statusConfig = {
        pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
        processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800" },
        approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
        rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
      } as const
      return (
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status].color}`}
        >
          {statusConfig[status].label}
        </div>
      )
    },
  },
  {
    accessorKey: "requestDate",
    header: "Ngày yêu cầu",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-slate-600">
        <Calendar className="w-4 h-4" />
        {formatDate(row.original.requestDate)}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => (
      <div className="flex justify-center items-center gap-2">
        <Button
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
          title="Xem chi tiết"
          onClick={() => alert(`Xem chi tiết đơn trả: ${row.original.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
]

// 🛠️ Component chính
export default function OrderReturn() {
  const [statusFilter, setStatusFilter] = useState("all")

  const stats = [
    {
      label: "Tổng đơn trả",
      value: returns.length,
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Đang xử lý",
      value: returns.filter((r) => r.status === "processing").length,
      icon: RotateCcw,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Đã duyệt",
      value: returns.filter((r) => r.status === "approved").length,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Từ chối",
      value: returns.filter((r) => r.status === "rejected").length,
      icon: XCircle,
      color: "bg-red-100 text-red-600",
    },
  ]

  const filteredReturns =
    statusFilter === "all"
      ? returns
      : returns.filter((r) => r.status === statusFilter)

  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
      
      {/* Filter buttons */}
      <div className="flex gap-3 flex-wrap">
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

      {/* DataTable */}
      <DataTable
        columns={returnColumns}
        data={filteredReturns}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        title="Danh sách đổi trả hàng"
        showGlobalFilter
        globalFilterPlaceholder="Tìm kiếm đơn trả..."
      />
    </div>
  )
}
