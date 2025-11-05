import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { fetchReviewListData } from "~/redux/slices/reviews";
import { fetchStatuses } from "~/redux/slices/statuses";
import type { RootState } from "~/redux/store";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { Product } from "../../../types/product/product";
import DataTable from "../components/data-table";
import { getColumns } from "./columns/review";
import ReviewDetail from "./components/review-detail";
import ReviewFilter from "./components/review-filter";
import type { Review } from "./types/review";

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
  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.REVIEW] ?? []
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [filters, setFilters] = useState({
    statusName: undefined as string | undefined,
    search: undefined as string | undefined,
    rating: undefined as number | undefined,
  });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedReview(null);
    }
  }, [open, setSelectedReview]);

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.REVIEW }));
  }, [dispatch]);

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
                meta={{ statuses }}
              />
              <div className="flex-1 overflow-y-auto mt-2">
                <DataTable
                  className="shadow-none border-none"
                  columns={columns}
                  data={reviewList?.data?.items.flat() ?? []}
                  currentPage={currentPage}
                  totalPages={reviewList?.data?.totalPages ?? 1}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            </div>
            <div className="col-span-1 h-full flex flex-col">
              {selectedReview ? (
                <ReviewDetail
                  selectedProduct={selectedProduct}
                  selectedReview={selectedReview}
                  onToggledReview={() => {
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
              ) : (
                <div className="flex flex-col items-center justify-start h-full pt-12">
                  <span className="mt-4 text-gray-500 text-md">
                    Chưa chọn đánh giá
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );
}
