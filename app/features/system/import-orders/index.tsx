// ~/features/system/import-orders/index.tsx
import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "~/components/ui/button";
import { Plus, ShoppingCart, History, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import DataTable from "../components/data-table";
import { AddImportOrderModal } from "./components/add-modal";
import { EditImportOrderModal } from "./components/edit-modal";
import { DeleteImportOrderModal } from "./components/delete-modal";
import { ChangeStatusModal } from "./components/change-status-modal";
import { DetailImportOrderModal } from "./components/detail-modal";
import { ImportOrderStats } from "./components/stats-cards";
import { getImportOrderColumns } from "./types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchPurchaseOrderListData } from "~/redux/slices/purchase-orders";
import type { ImportOrder } from "./types";
import {
  createPurchaseOrder,
  getPurchaseOrderStats,
} from "~/services/purchase-order";
import SkeletonTable from "~/components/ui/skeleton-table";
import { ImportOrderFilter } from "./components/import-order-filter";
import toast from "react-hot-toast";

export default function ImportOrders() {
  const dispatch = useAppDispatch();
  const { purchaseOrderList, isLoading } = useAppSelector(
    (state) => state.purchaseOrderList ?? {}
  );
  const items = purchaseOrderList?.data?.items ?? [];
  const totalCount = purchaseOrderList?.data?.totalCount ?? 0;
  const totalPages = purchaseOrderList?.data?.totalPages ?? 1;
  const currentPage = purchaseOrderList?.data?.pageNumber ?? 1;
  const pageSize = purchaseOrderList?.data?.pageSize ?? 10;

  const [pageNumber, setPageNumber] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<ImportOrder | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [stats, setStats] = useState({
    totalOrders: 0,
    draftOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalValue: 0,
    totalProducts: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Lưu filter hiện tại để dùng khi chuyển trang
  const currentFiltersRef = useRef<any>({});

  const handleFilterChange = useCallback(
    (filters: any) => {
      currentFiltersRef.current = filters;
      dispatch(
        fetchPurchaseOrderListData({
          ...filters,
          PageNumber: 1,
          PageSize: pageSize,
        })
      );
      setPageNumber(1);
    },
    [dispatch, pageSize]
  );

  // GỌI LẠI KHI CHUYỂN TRANG
  useEffect(() => {
    if (currentFiltersRef.current) {
      dispatch(
        fetchPurchaseOrderListData({
          ...currentFiltersRef.current,
          PageNumber: pageNumber,
          PageSize: pageSize,
        })
      );
    }
  }, [dispatch, pageNumber, pageSize]);

  // Fetch stats từ API
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await getPurchaseOrderStats();
      if (response.isSuccess) {
        setStats({
          totalOrders: response.data.totalOrders || 0,
          draftOrders: response.data.draftOrders || 0,
          pendingOrders: response.data.pendingOrders || 0,
          completedOrders: response.data.completedOrders || 0,
          totalValue: response.data.totalValue || 0,
          totalProducts: response.data.totalProducts || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Không thể tải thống kê");
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Load stats khi component mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleAdd = async (payload: any) => {
    try {
      await createPurchaseOrder(payload);
      setIsAddOpen(false);
      toast.success("Tạo đơn thành công!");
      // Reload data và stats sau khi tạo thành công
      fetchStats();
      if (currentFiltersRef.current) {
        dispatch(
          fetchPurchaseOrderListData({
            ...currentFiltersRef.current,
            PageNumber: pageNumber,
            PageSize: pageSize,
          })
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Tạo đơn thất bại");
    }
  };

  const handleEdit = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    setIsEditOpen(false);
    setSelectedOrder(null);
    // Reload data và stats sau khi sửa thành công
    fetchStats();
    if (currentFiltersRef.current) {
      dispatch(
        fetchPurchaseOrderListData({
          ...currentFiltersRef.current,
          PageNumber: pageNumber,
          PageSize: pageSize,
        })
      );
    }
  };

  const handleDelete = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteOpen(false);
    setSelectedOrder(null);
    // Reload data và stats sau khi xóa thành công
    fetchStats();
    if (currentFiltersRef.current) {
      dispatch(
        fetchPurchaseOrderListData({
          ...currentFiltersRef.current,
          PageNumber: pageNumber,
          PageSize: pageSize,
        })
      );
    }
  };

  const handleChangeStatus = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsChangeStatusOpen(true);
  };

  const handleChangeStatusConfirm = () => {
    setIsChangeStatusOpen(false);
    setSelectedOrder(null);
    // Refresh data và stats
    fetchStats();
    if (currentFiltersRef.current) {
      dispatch(
        fetchPurchaseOrderListData({
          ...currentFiltersRef.current,
          PageNumber: pageNumber,
          PageSize: pageSize,
        })
      );
    }
  };

  const handleViewDetail = (order: ImportOrder) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const columns = getImportOrderColumns(
    handleEdit,
    handleDelete,
    handleChangeStatus,
    handleViewDetail
  );

  const isInitialLoading = isLoading && !purchaseOrderList?.data;
  const isSearching = isLoading && purchaseOrderList?.data;

  return (
    <div className="container mx-auto p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">Quản lý nhập hàng</h3>
          <p className="text-sm text-gray-500">
            Theo dõi đơn nhập hàng, tồn kho và lịch sử
          </p>
        </div>
        <Button variant="add" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Tạo đơn nhập hàng
        </Button>
      </div>

      {/* STATS CARDS */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <ImportOrderStats {...stats} />
      )}

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        {/* TAB: ĐƠN NHẬP HÀNG */}
        <TabsContent value="orders" className="space-y-4">
          {/* FILTER */}
          <ImportOrderFilter
            onFilterChange={handleFilterChange}
            isLoading={isInitialLoading}
          />

          {/* TABLE */}
          {isInitialLoading ? (
            <SkeletonTable />
          ) : (
            <>
              {isSearching && (
                <div className="text-sm text-blue-600 mb-2">
                  Đang tìm kiếm...
                </div>
              )}
              <DataTable
                columns={columns}
                data={items.flat()}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPageNumber}
              />
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* MODALS */}
      <AddImportOrderModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
      />
      <EditImportOrderModal
        open={isEditOpen}
        order={selectedOrder}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditSave}
      />
      <DeleteImportOrderModal
        open={isDeleteOpen}
        order={selectedOrder}
        onClose={() => setIsDeleteOpen(false)}
        onDelete={handleDeleteConfirm}
      />
      <ChangeStatusModal
        open={isChangeStatusOpen}
        order={selectedOrder}
        onClose={() => setIsChangeStatusOpen(false)}
        onSuccess={handleChangeStatusConfirm}
      />
      <DetailImportOrderModal
        open={isDetailOpen}
        orderId={selectedOrder?.purchaseOrderId ?? null}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
