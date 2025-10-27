import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOrderListData } from "~/redux/slices/orders";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import DataTable from "../components/data-table";
import ViewOrderDetailDialog from "./components/view-order-detail-dialog";
import SkeletonFilter from "../../../components/ui/skeleton-filter";
import SkeletonHeader from "../../../components/ui/skeleton-header";
import SkeletonTable from "../../../components/ui/skeleton-table";
import { getColumns, type Order as SliceOrder } from "./types";

export default function Orders() {
  const dispatch = useAppDispatch();
  const { orderList, isLoading } = useAppSelector(state => state.orderList);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [selectedOrder, setSelectedOrder] = useState<SliceOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = useCallback((order: SliceOrder) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  }, []);

  useEffect(() => {
    dispatch(fetchOrderListData());
  }, [dispatch, currentPage]);

  const data = orderList?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.length ?? 0) / pageSize));
  const columns = getColumns(handleView);
  return (
    <>
      <div className="container">
        {/* Header */}
        {isLoading || !orderList?.data ? (
          <SkeletonHeader />
        ) : (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">Quản lý đơn hàng</h3>
          </div>
        )}

        {/* DataTable */}
        {isLoading || !orderList?.data ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={orderList?.data}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* View order detail dialog */}
      <ViewOrderDetailDialog
        order={selectedOrder}
        open={isViewOpen}
        setIsOpen={setIsViewOpen}
      />
    </>
  );
}
