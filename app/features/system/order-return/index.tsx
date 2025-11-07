import { useState, useMemo, useCallback, useEffect } from "react";
import { Package, Repeat2 } from "lucide-react";

// Data will be loaded from redux (product-return service)

// ============= Components =============
import StatsCard from "./components/stats-card";
import ReturnFilter from "./components/return-filter";
import ReturnTable from "./components/return-table";
import AddReturnDialog from "./components/add-return-dialog";
import type { MinimalProductReturnRequest } from "./components/add-return-dialog";
import ViewReturnDialog from "./components/view-return-dialog";
import ApproveReturnDialog from "./components/approve-return-dialog";
import RejectReturnDialog from "./components/reject-return-dialog";
import type { Filters, Return, ReturnStatus } from "./types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { ProductReturnResponse } from "~/services/product-return";
import { fetchProductReturnList } from "~/redux/slices/product-return";
import {
  approveProductReturn,
  rejectProductReturn,
} from "~/services/product-return";
import { createProductReturnV2 } from "~/services/product-return";
import type { AxiosError } from "axios";
import { toast } from "sonner";

// ============= Main Component =============
export default function OrderReturn() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useAppSelector(
    state => state.productReturn
  );

  useEffect(() => {
    dispatch(fetchProductReturnList());
  }, [dispatch]);

  // returns used by UI are mapped to local `Return` type
  const [returns, setReturns] = useState<Return[]>([]);

  // map ProductReturnResponse -> UI Return
  const mapPR = (pr: ProductReturnResponse): Return => {
    const type: Return["type"] = pr.returnType === 2 ? "exchange" : "return";
    const lowerStatus = (pr.statusName || "").toLowerCase();
    let status: ReturnStatus = "processing";
    if (
      lowerStatus.includes("pending") ||
      lowerStatus.includes("chờ") ||
      lowerStatus.includes("draft")
    )
      status = "pending";
    else if (
      lowerStatus.includes("approved") ||
      lowerStatus.includes("đồng ý") ||
      lowerStatus.includes("approved")
    )
      status = "approved";
    else if (
      lowerStatus.includes("reject") ||
      lowerStatus.includes("hủy") ||
      lowerStatus.includes("rejected")
    )
      status = "rejected";

    return {
      id: String(pr.returnId ?? pr.returnId),
      orderItemId: pr.orderItemId,
      orderId: String(pr.orderDto?.orderId ?? ""),
      type,
      customer: { name: pr.userOrderDto?.fullName ?? "", phone: "" },
      product: {
        name: pr.productName ?? "",
        sku: pr.returnProductVariantId ? String(pr.returnProductVariantId) : "",
        price: pr.returnAmount ?? pr.orderDto?.totalAmount ?? 0,
        image: pr.productImageUrl ?? "",
      },
      reason: pr.returnReason ?? "",
      description: pr.returnProductName ?? "",
      status,
      requestDate: pr.createdAt ?? "",
      quantity: 1,
    };
  };

  // whenever product-return data updates, map into UI shape
  useEffect(() => {
    if (Array.isArray(data) && data.length > 0) {
      setReturns(data.map(mapPR));
    } else {
      setReturns([]);
    }
  }, [data]);

  const [filters, setFilters] = useState<Filters>({
    status: "all",
    dateFrom: "",
    dateTo: "",
    productSearch: "",
    customerSearch: "",
    phoneSearch: "",
  });

  // Dialog states
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Stats calculation
  const stats = useMemo(
    () => [
      {
        label: "Tổng phiếu",
        value: returns.length,
        icon: Package,
        color: "bg-blue-100 text-blue-600",
      },
      {
        label: "Đổi hàng",
        value: returns.filter(r => r.type === "exchange").length,
        icon: Repeat2,
        color: "bg-purple-100 text-purple-600",
      },
      {
        label: "Trả hàng",
        value: returns.filter(r => r.type === "return").length,
        icon: Package,
        color: "bg-indigo-100 text-indigo-600",
      },
    ],
    [returns]
  );

  // Filter logic
  const filteredReturns = useMemo(() => {
    return returns.filter(r => {
      if (filters.status !== "all" && r.status !== filters.status) return false;
      if (
        filters.dateFrom &&
        new Date(r.requestDate) < new Date(filters.dateFrom)
      )
        return false;
      if (filters.dateTo && new Date(r.requestDate) > new Date(filters.dateTo))
        return false;
      if (filters.productSearch) {
        const keyword = filters.productSearch.toLowerCase().trim();
        if (
          !r.product.name.toLowerCase().includes(keyword) &&
          !r.product.sku.toLowerCase().includes(keyword)
        )
          return false;
      }
      if (filters.customerSearch) {
        const keyword = filters.customerSearch.toLowerCase().trim();
        if (!r.customer.name.toLowerCase().includes(keyword)) return false;
      }
      if (filters.phoneSearch) {
        const keyword = filters.phoneSearch.trim();
        if (!r.customer.phone.includes(keyword)) return false;
      }
      return true;
    });
  }, [returns, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredReturns.length / pageSize);
  const paginatedReturns = filteredReturns.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Handlers
  const handleView = useCallback((ret: Return) => {
    setSelectedReturn(ret);
    setIsViewOpen(true);
  }, []);

  const handleApprove = useCallback((ret: Return) => {
    // open approve confirmation dialog for this return
    setSelectedReturn(ret);
    console.log(ret);
    setIsApproveOpen(true);
  }, []);

  const handleReject = useCallback((ret: Return) => {
    // open reject confirmation dialog for this return
    setSelectedReturn(ret);
    setIsRejectOpen(true);
  }, []);

  const handlePrint = useCallback((ret: Return) => {
    console.log("Print:", ret);
    // TODO: Implement print functionality
  }, []);

  const handleAddReturn = useCallback(
    async (payload: MinimalProductReturnRequest) => {
      console.log("==> Gọi handleAddReturn");
      try {
        const response = await createProductReturnV2(payload);
        // createProductReturnV2 trả về ProductReturnResponse trực tiếp, không có isSuccess/message
        toast.success("Tạo phiếu đổi/trả thành công");
        dispatch(fetchProductReturnList());
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Tạo phiếu đổi/trả thất bại"
        );
      } finally {
        setIsAddOpen(false);
      }
    },
    [dispatch]
  );

  const handleConfirmApprove = useCallback(async () => {
    if (!selectedReturn) {
      setIsApproveOpen(false);
      return;
    }

    try {
      // call API to approve the product return
      const res = await approveProductReturn(Number(selectedReturn.id));
      if (!res) {
        throw new Error("Huỷ duyệt đơn đổi/trả thất bại");
      }
      // optimistically update local state
      setReturns(prev =>
        prev.map(r =>
          r.id === selectedReturn.id
            ? { ...r, status: "approved" as ReturnStatus }
            : r
        )
      );

      // refresh list from server to keep in sync
      dispatch(fetchProductReturnList());
      toast.success("Duyệt đơn đổi / trả thành công");
    } catch (err) {
      const ex = err as AxiosError;

      console.error("Failed to approve return", ex.message);
      toast.error("Duyệt đơn đổi / trả thất bại");
    } finally {
      setIsApproveOpen(false);
    }
  }, [selectedReturn, dispatch]);

  const handleConfirmReject = useCallback(async () => {
    if (!selectedReturn) {
      setIsRejectOpen(false);
      return;
    }

    try {
      // call API to cancel/reject the product return
      const res = await rejectProductReturn(Number(selectedReturn.id));
      if (!res) {
        throw new Error("Huỷ duyệt đơn đổi/trả thất bại");
      }
      // optimistically update local state
      setReturns(prev =>
        prev.map(r =>
          r.id === selectedReturn.id
            ? { ...r, status: "rejected" as ReturnStatus }
            : r
        )
      );

      // refresh list from server to keep in sync
      toast.success("Huỷ duyệt đơn đổi/trả thành công");
      dispatch(fetchProductReturnList());
    } catch (err) {
      const ex = err as AxiosError;
      toast.error("Failed to reject/cancel return: " + ex.message);
    } finally {
      setIsRejectOpen(false);
    }
  }, [selectedReturn, dispatch]);

  const handleReloadReturns = useCallback(() => {
    // TODO: Fetch from API
    console.log("Reload returns list");
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">
          Quản lý đổi/trả hàng
        </h3>
        <AddReturnDialog
          open={isAddOpen}
          setIsOpen={setIsAddOpen}
          onAdded={handleAddReturn}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Filter */}
      <ReturnFilter filters={filters} setFilters={setFilters} />

      {/* Table */}
      <ReturnTable
        data={paginatedReturns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Dialogs */}
      {selectedReturn && (
        <>
          <ViewReturnDialog
            open={isViewOpen}
            setIsOpen={setIsViewOpen}
            returnData={selectedReturn}
          />
          <ApproveReturnDialog
            open={isApproveOpen}
            setIsOpen={setIsApproveOpen}
            returnData={selectedReturn}
            onConfirm={handleConfirmApprove}
          />
          <RejectReturnDialog
            open={isRejectOpen}
            setIsOpen={setIsRejectOpen}
            returnData={selectedReturn}
            onConfirm={handleConfirmReject}
          />
        </>
      )}
    </div>
  );
}
