import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import DataTable from "../components/data-table";
import type { Product } from "../../../types/product/product";
import { getColumns } from "./columns/review";
import type { Review } from "./types/review";
import { fetchReviewListData } from "~/redux/slices/reviews";
import type { RootState } from "~/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import ReviewDetail from "./components/review-detail";
import ReviewFilter from "./components/review-filter";
import type { Status } from "~/types/status";
import { ENTITY_TYPE } from "~/constants/entity-types";
import SkeletonTable from "../../../components/ui/skeleton-table";

export default function ReviewDialog({
  open,
  setIsOpen,
  selectedProduct,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedProduct: Product | null;
}) {
  const dispatch = useAppDispatch();
  const { reviewList, isLoading } = useAppSelector(
    (state: RootState) => state.reviewList
  );
  const { statuses } = useAppSelector((state: RootState) => state.statuses);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [filters, setFilters] = useState({
    statusName: undefined as string | undefined,
    search: undefined as string | undefined,
    rating: undefined as number | undefined,
  });
  const [metaStatus, setMetaStatus] = useState<Status[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    if (statuses && statuses.length > 0) {
      const reviewStatuses = statuses.filter(
        (s) => s.entityType === ENTITY_TYPE.REVIEW
      );
      setMetaStatus(reviewStatuses);
    }
  }, [statuses]);

  useEffect(() => {
    if (selectedProduct?.productId) {
      dispatch(
        fetchReviewListData({
          ProductId: selectedProduct.productId,
          StatusName: filters.statusName,
          Search: filters.search,
          Rating: filters.rating,
          PageNumber: currentPage,
          PageSize: pageSize,
        })
      );
    }
  }, [open, selectedProduct?.productId, filters, currentPage, dispatch]);

  const columns = useMemo(
    () => getColumns(selectedReview, setSelectedReview),
    [selectedReview, setSelectedReview]
  );

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <form>
        <DialogContent className="min-w-[92vw] max-w-[92vw] min-h-[94vh] max-h-[94vh] px-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold px-4">
              Quản lý đánh giá
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 h-[80vh]">
            <div className="col-span-2 flex flex-col h-full pl-4">
              <ReviewFilter
                filters={filters}
                setFilters={setFilters}
                meta={{ statuses: metaStatus }}
              />
              <div className="flex-1 overflow-y-auto mt-2">
                {isLoading ? (
                  <SkeletonTable />
                ) : (
                  <DataTable
                    className="shadow-none border-none"
                    columns={columns}
                    data={reviewList?.data?.items.flat() ?? []}
                    currentPage={currentPage}
                    totalPages={reviewList?.data?.totalPages ?? 1}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            </div>
            <div className="col-span-1 h-full flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-start h-full pt-12">
                  <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></span>
                  <span className="mt-4 text-gray-500 text-lg">
                    Đang tải chi tiết đánh giá...
                  </span>
                </div>
              ) : (
                <ReviewDetail
                  selectedProduct={selectedProduct}
                  selectedReview={selectedReview}
                  onHideReview={() => {
                    if (!selectedProduct) return;
                    dispatch(
                      fetchReviewListData({
                        ProductId: selectedProduct.productId,
                        StatusName: filters.statusName,
                        Search: filters.search,
                        Rating: filters.rating,
                        PageNumber: currentPage,
                        PageSize: pageSize,
                      })
                    );
                    setSelectedReview(null);
                  }}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
