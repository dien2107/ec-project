import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchOrderListData } from "~/redux/slices/orders";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import DataTable from "../components/data-table";
import ViewOrderDetailDialog from "./components/view-order-detail-dialog";
import OrderFilter from "./components/order-filter";
import SkeletonFilter from "../../../components/ui/skeleton-filter";
import SkeletonHeader from "../../../components/ui/skeleton-header";
import SkeletonTable from "../../../components/ui/skeleton-table";
import { getColumns, type Order as SliceOrder } from "./types";

export default function Orders() {
  const dispatch = useAppDispatch();
  const { orderList, isLoading } = useAppSelector(state => state.orderList);

  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    Search: "",
    StatusName: "",
  });

  const [selectedOrder, setSelectedOrder] = useState<SliceOrder | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = useCallback((order: SliceOrder) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  }, []);
  console.log(orderList);
  // Load orders when filters or pagination changes
  useEffect(() => {
    dispatch(
      fetchOrderListData({
        PageNumber: currentPage,
        PageSize: PAGE_SIZE,
        Search: filters.Search || undefined,
        StatusName: filters.StatusName || undefined,
      })
    );
  }, [dispatch, currentPage, filters.Search, filters.StatusName]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (updater: (prev: typeof filters) => typeof filters) => {
      setFilters(updater);
      setCurrentPage(1);
    },
    []
  );

  const data = orderList?.data?.items.flat() ?? [];
  const totalPages = orderList?.data?.totalPages ?? 1;
  const columns = useMemo(() => getColumns(handleView), [handleView]);
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

        {/* Filter */}
        {isLoading || !orderList?.data ? (
          <SkeletonFilter />
        ) : (
          <div className="flex items-center justify-between mb-4">
            <OrderFilter filters={filters} setFilters={handleFilterChange} />
          </div>
        )}

        {/* DataTable */}
        {isLoading || !orderList?.data ? (
          <SkeletonTable />
        ) : (
          <DataTable
            columns={columns}
            data={data}
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
