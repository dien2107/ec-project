import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Eye, X } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import DataTable from "~/features/system/components/data-table";
import { Button } from "~/components/ui/button";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchCustomerListData } from "~/redux/slices/customers";
import { getUserById, updateUserById } from "~/services/customers";
import { fetchStatuses } from "~/redux/slices/statuses";
import { ENTITY_TYPE } from "~/constants/entity-types";
import toast, { Toaster } from "react-hot-toast";
import CustomerFilter from "./components/customer-filter";
import SkeletonHeader from "~/components/ui/skeleton-header";
import SkeletonFilter from "~/components/ui/skeleton-filter";
import SkeletonTable from "~/components/ui/skeleton-table";
import type { Customer, EntityStatus, UpdateCustomerData, Address, Role} from "./types";
// ===== Modal Components =====
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface CustomerDetailModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
  userStatuses: EntityStatus[];
  isStatusesLoading: boolean;
  reloadList: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onClose,
  loading,
  userStatuses,
  isStatusesLoading,
  reloadList,
}) => {
  const [locking, setLocking] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "orders">("personal");
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  useEffect(() => {
    if (customer?.status?.statusId) {
      setSelectedStatus(customer.status.statusId);
    } else {
      setSelectedStatus(null);
    }
  }, [customer]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // helper component to render addresses with "show more"
  const AddressesList: React.FC<{
    addresses?: Address[];
    fallback?: string | undefined;
  }> = ({ addresses, fallback }) => {
    const [showAll, setShowAll] = useState(false);
    const list =
      Array.isArray(addresses) && addresses.length > 0 ? addresses : [];
    if (list.length === 0 && fallback) {
      return <p className="text-gray-900">{fallback}</p>;
    }
    if (list.length === 0)
      return <p className="text-gray-900">Chưa có địa chỉ</p>;

    const shown = showAll ? list : list.slice(0, 3);
    return (
      <div>
        <ul className="space-y-1">
          {shown.map((addr, idx) => (
            <li key={addr.addressId ?? idx} className="text-gray-900">
              {addr.streetAddress ?? addr.recipientName ?? "—"}
              {addr.isDefault && (
                <span className="ml-2 text-xs text-green-600 font-medium">
                  (Mặc định)
                </span>
              )}
              {addr.city || addr.district ? (
                <div className="text-sm text-gray-500">
                  {[addr.ward, addr.district, addr.city]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        {list.length > 3 && (
          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-2 text-blue-600 text-sm hover:underline focus:outline-none"
          >
            {showAll ? "Ẩn bớt" : `Xem thêm (${list.length - 3})`}
          </button>
        )}
      </div>
    );
  };

  const handleChangeStatus = async () => {
    if (!customer || locking || !selectedStatus) return;

    const targetStatus = userStatuses.find(
      (s) => s.statusId === selectedStatus
    );
    if (!targetStatus) {
      toast.error("Không tìm thấy trạng thái hợp lệ.");
      return;
    }

    // ensure statuses loaded
    if (!userStatuses.length) {
      toast.error("Danh sách trạng thái chưa sẵn sàng, vui lòng thử lại.");
      return;
    }

    setLocking(true);
    try {
      const updateData: UpdateCustomerData = {
        username: customer.username ?? "",
        email: customer.email ?? "",
        imageUrl: customer.imageUrl ?? "",
        fullName: customer.fullName ?? "",
        phone: customer.phone ?? "",
        gender: (customer.gender as "Male" | "Female") ?? "Male",
        dateOfBirth: customer.dateOfBirth || null,
        isVerified: customer.isVerified ?? false,
        statusId: targetStatus.statusId,
        roleIds: (customer.roles ?? []).map((r) => r.roleId),
        // IMPORTANT: keep addresses array so backend doesn't lose them
        addresses: customer.addresses ?? [],
      };

      console.log("Updating user with data:", updateData);
      await updateUserById(Number(customer.userId), updateData);
      toast.success(
        `Cập nhật trạng thái "${targetStatus.displayName}" thành công.`
      );

      reloadList();
      onClose();
    } catch (err) {
      console.error("Change status error:", err);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái.");
    } finally {
      setLocking(false);
    }
  };

  const statusColor = (statusName?: string) => {
    switch (statusName?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      case "suspended":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!customer && !loading) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-lg font-semibold">
          Thông tin khách hàng #{customer?.userId}
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b">
        {["personal", "orders"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-5 py-3 font-medium ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab === "personal" ? "Thông tin cá nhân" : "Lịch sử đơn hàng"}
          </button>
        ))}
      </div>

      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {loading ? (
          <div>Đang tải chi tiết...</div>
        ) : activeTab === "personal" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Họ tên
                </label>
                <p className="text-lg font-semibold">
                  {customer?.fullName ?? customer?.username}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Email
                </label>
                <p>{customer?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Ngày tham gia
                </label>
                <p>
                  {customer?.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString("vi-VN")
                    : "-"}
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Địa chỉ
                </label>
                <AddressesList
                  addresses={customer?.addresses}
                  fallback={customer?.address}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Trạng thái hiện tại
                </label>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusColor(customer?.status?.name)}`}
                >
                  {customer?.status?.displayName ??
                    customer?.status?.name ??
                    "-"}
                </span>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Chuyển trạng thái
                </label>
                <select
                  value={selectedStatus ?? ""}
                  onChange={(e) => setSelectedStatus(Number(e.target.value))}
                  className="border rounded-lg px-3 py-2 text-sm w-full"
                >
                  <option value="" disabled>
                    Chọn trạng thái mới
                  </option>
                  {userStatuses.map((s) => (
                    <option key={s.statusId} value={s.statusId}>
                      {s.displayName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Số điện thoại
                </label>
                <p>{customer?.phone ?? "-"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500 block mb-1">
                  Tổng chi tiêu
                </label>
                <p className="font-semibold">
                  {formatCurrency(customer?.totalSpent ?? 0)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {customer?.orders && customer.orders.length > 0 ? (
              customer.orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-4 gap-4 py-2 border-b text-sm"
                >
                  <div>{order.id}</div>
                  <div>{order.date}</div>
                  <div>{formatCurrency(order.amount)}</div>
                  <div>{order.status}</div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Chưa có đơn hàng nào
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end p-5 border-t bg-gray-50">
        <Button
          onClick={handleChangeStatus}
          disabled={locking || loading || isStatusesLoading || !selectedStatus}
          className="px-4 py-2 font-medium flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {locking ? "Đang cập nhật..." : "Cập nhật trạng thái"}
        </Button>
      </div>
    </Modal>
  );
};

// ===== Main Component =====
type FilterValues = {
  Search?: string;
  Phone?: string;
  HasRole?: boolean;
  StatusName?: string | undefined;
};

const CustomerManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 6;

  const { customerList, isLoading: isCustomerLoading } = useAppSelector(
    (state: any) =>
      state.customerList ?? { customerList: null, isLoading: false }
  );
  const { statuses, isLoading: isStatusesLoading } = useAppSelector(
    (state: any) => state.statuses ?? { statuses: null, isLoading: false }
  );

  const userStatuses = useMemo(() => {
    if (Array.isArray(statuses)) return statuses;
    if (Array.isArray(statuses?.data)) return statuses.data;
    return [];
  }, [statuses]);

  // replace previous statusFilter with central filters state
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // memoized reload so we can call it from modal and effect without duplicate dispatches
  const reloadList = useCallback(
    (override?: { PageNumber?: number }) => {
      dispatch(
        fetchCustomerListData({
          PageNumber: override?.PageNumber ?? currentPage,
          PageSize: PAGE_SIZE,
          ...(filters.StatusName ? { StatusName: filters.StatusName } : {}),
          ...(filters.Search ? { Search: filters.Search } : {}),
          ...(filters.Phone ? { Phone: filters.Phone } : {}),
          HasRole: false,
        })
      );
    },
    [dispatch, currentPage, filters, PAGE_SIZE]
  );

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.USER }));
  }, [dispatch]);

  // call reloadList whenever page or filters change (single fetch)
  useEffect(() => {
    reloadList();
  }, [reloadList]);

  const handleFilterChange = React.useCallback((next: FilterValues) => {
    // only update local state here; effect will trigger fetch once
    setFilters(next);
    setCurrentPage(1);
  }, []);

  const data = customerList?.data?.items ?? customerList?.data ?? [];

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "userId", header: "ID" },
    { accessorKey: "fullName", header: "Họ tên" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "SĐT" },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ getValue }) => {
        const status = getValue() as EntityStatus;
        const color =
          status?.name?.toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : status?.name?.toLowerCase() === "inactive"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700";
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}
          >
            {status?.displayName ?? status?.name ?? "-"}
          </span>
        );
      },
    },
    {
      header: "Thao tác",
      cell: ({ row }) => (
        <button
          onClick={() => handleViewCustomer(row.original)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </button>
      ),
    },
  ];

  const handleViewCustomer = async (row: Customer) => {
    if (!row?.userId) return;
    setDetailLoading(true);
    setIsModalOpen(true);
    setSelectedCustomer(null);
    try {
      const data = await getUserById(Number(row.userId));
      const d = data.data ?? data;
      setSelectedCustomer(d);
    } catch {
      setSelectedCustomer(null);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto p-6">
        {/* header + filter: show skeletons while statuses load (not when list fetches) */}
        {isStatusesLoading ? (
          <>
            <SkeletonHeader />
            <SkeletonFilter />
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-2">Quản lý khách hàng</h1>
            <div className="flex items-center justify-between mb-4">
              <CustomerFilter
                initial={filters}
                onChange={handleFilterChange}
                statuses={userStatuses}
                isLoading={isStatusesLoading}
              />
            </div>
          </>
        )}

        {/* table: show skeleton panel while loading */}
        {isCustomerLoading ? (
          <SkeletonTable />
        ) : (
          <DataTable<Customer, unknown>
            columns={columns}
            data={data}
            currentPage={currentPage}
            totalPages={customerList?.data?.totalPages ?? 1}
            onPageChange={setCurrentPage}
            title=""
            showGlobalFilter
            globalFilterPlaceholder="Tìm khách hàng..."
            isLoading={isCustomerLoading}
          />
        )}

        <CustomerDetailModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          loading={detailLoading}
          userStatuses={userStatuses}
          isStatusesLoading={isStatusesLoading}
          reloadList={() => reloadList()}
        />
      </div>
    </div>
  );
};

export default CustomerManagement;
