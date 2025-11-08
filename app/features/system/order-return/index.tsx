import { useState, useMemo, useCallback, useEffect } from "react";
import { Package, Repeat2 } from "lucide-react";
import StatsCard from "./components/stats-card";
import ReturnFilter from "./components/return-filter";
import ReturnTable from "./components/return-table";
import ViewReturnDialog from "./components/view-return-dialog";
import ApproveReturnDialog from "./components/approve-return-dialog";
import RejectReturnDialog from "./components/reject-return-dialog";
import type { Filters, Return, ReturnStatus } from "./types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { ProductReturnResponse } from "~/services/product-return";
import { fetchProductReturnList } from "~/redux/slices/product-return";
import {
  approveProductReturn,
  completedProductReturnforExchange,
  completedProductReturnforRefund,
  rejectProductReturn,
} from "~/services/product-return";
import type { AxiosError } from "axios";
import { toast } from "react-hot-toast";
const mapPR = (pr: ProductReturnResponse): Return => {
  const type: Return["type"] = pr.returnType === 2 ? "exchange" : "return";
  const lowerStatus = (pr.statusName || "").toLowerCase();
  let status: ReturnStatus = "pending";

  if (lowerStatus.includes("pending") || lowerStatus.includes("chờ")) {
    status = "pending";
  } else if (
    lowerStatus.includes("approved") ||
    lowerStatus.includes("đồng ý")
  ) {
    status = "approved";
  } else if (lowerStatus.includes("reject") || lowerStatus.includes("hủy")) {
    status = "rejected";
  } else if (
    lowerStatus.includes("completed") ||
    lowerStatus.includes("hoàn thành")
  ) {
    status = "completed";
  }

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
export default function OrderReturn() {
  const dispatch = useAppDispatch();
  const { productReturnList } = useAppSelector(state => state.productReturn);

  const PAGE_SIZE = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    returnType: "all",
    dateFrom: "",
    dateTo: "",
    productSearch: "",
    customerSearch: "",
    phoneSearch: "",
  });

  // Load product returns when filters or pagination changes
  useEffect(() => {
    dispatch(
      fetchProductReturnList({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.productSearch || filters.customerSearch || undefined,
        StatusName: filters.status !== "all" ? filters.status : undefined,
        ReturnType:
          filters.returnType !== "all" ? filters.returnType : undefined,
      })
    );
  }, [
    dispatch,
    currentPage,
    filters.status,
    filters.returnType,
    filters.productSearch,
    filters.customerSearch,
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.status,
    filters.returnType,
    filters.productSearch,
    filters.customerSearch,
  ]);

  // Map API data to UI Return type
  const returns = useMemo(() => {
    const data = productReturnList?.data?.items ?? [];
    return data.map(mapPR);
  }, [productReturnList]);

  // Dialog states
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
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

  // Get pagination info from API response
  const totalPages = productReturnList?.data?.totalPages ?? 1;

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

  const handleCompleteForExchange = useCallback(
    async (ret: Return) => {
      try {
        // TODO: Call API to complete exchange (đã gửi lại cho khách)
        const response = await completedProductReturnforExchange(
          Number(ret.id)
        );
        if (!response.isSuccess)
          throw new Error(response.message || "Lỗi khi hoàn thành đổi hàng");
        console.log("Hoàn thành đổi hàng cho:", ret.id);
        toast.success("Đã hoàn thành đổi hàng - Đã gửi lại cho khách");

        // Refresh list
        dispatch(
          fetchProductReturnList({
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            Search:
              filters.productSearch || filters.customerSearch || undefined,
            StatusName: filters.status !== "all" ? filters.status : undefined,
          })
        );
      } catch (err) {
        const ex = err as AxiosError;
        toast.error("Không thể hoàn thành đổi hàng: " + ex.message);
      }
    },
    [dispatch, currentPage, filters]
  );

  const handleCompleteForReturn = useCallback(
    async (ret: Return) => {
      try {
        // TODO: Call API to complete return (đã hoàn tiền)
        const response = await completedProductReturnforRefund(Number(ret.id));
        if (!response.isSuccess)
          throw new Error(response.message || "Lỗi khi hoàn thành trả hàng");
        console.log("Hoàn thành trả hàng cho:", ret.id);
        toast.success("Đã hoàn thành trả hàng - Đã hoàn tiền cho khách");

        // Refresh list
        dispatch(
          fetchProductReturnList({
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            Search:
              filters.productSearch || filters.customerSearch || undefined,
            StatusName: filters.status !== "all" ? filters.status : undefined,
          })
        );
      } catch (err) {
        const ex = err as AxiosError;
        toast.error("Không thể hoàn thành trả hàng: " + ex.message);
      }
    },
    [dispatch, currentPage, filters]
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
      // refresh list from server to keep in sync
      toast.success("Duyệt đơn đổi / trả thành công");
      dispatch(
        fetchProductReturnList({
          PageNumber: currentPage,
          PageSize: PAGE_SIZE,
          Search: filters.productSearch || filters.customerSearch || undefined,
          StatusName: filters.status !== "all" ? filters.status : undefined,
        })
      );
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
      // refresh list from server to keep in sync
      toast.success("Huỷ duyệt đơn đổi/trả thành công");
      dispatch(
        fetchProductReturnList({
          PageNumber: currentPage,
          PageSize: PAGE_SIZE,
          Search: filters.productSearch || filters.customerSearch || undefined,
          StatusName: filters.status !== "all" ? filters.status : undefined,
        })
      );
    } catch (err) {
      const ex = err as AxiosError;
      toast.error("Failed to reject/cancel return: " + ex.message);
    } finally {
      setIsRejectOpen(false);
    }
  }, [selectedReturn, dispatch]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">
          Quản lý đổi/trả hàng
        </h3>
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
        data={returns}
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
            onCompleteExchange={handleCompleteForExchange}
            onCompleteReturn={handleCompleteForReturn}
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
