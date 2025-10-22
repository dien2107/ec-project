import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Pagination from "~/components/common/pagination";
import { getReviewsByProductId } from "~/services/reviews";
import { STATUS_VARIABLE } from "~/constants/status-variables";

import CardReview from "./card-review";

import type { ProductDetail } from "~/types/product/product";
import type { FilterState } from "../types/review-filter-props";
import type { Review } from "~/types/review";

export default function TabsReview({ product }: { product: ProductDetail }) {
  const mainRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    statusName: STATUS_VARIABLE.Approved,
    rating: "all",
    // pageNumber: 1,
    // pageSize: 5,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    pageSize: 5,
  });

  const productId = product?.productId;
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", productId, filters.rating, pagination.currentPage],
    queryFn: () =>
      getReviewsByProductId(productId!, {
        ...filters,
        pageNumber: pagination.currentPage,
        pageSize: pagination.pageSize,
      }),
    enabled: !!productId,
  });

  console.log(reviews);
  console.log(filters);
  const handleTabChange = (value: string) => {
    let newRating;
    if (value === "all-stars") newRating = "all";
    else if (value === "has-images") newRating = "has-images";
    else newRating = value.split("-")[0];
    setFilters((prev) => ({ ...prev, rating: newRating }));
  };

  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters]);

  useEffect(() => {
    if (reviews?.data) {
      const { totalPages, totalCount, pageNumber } = reviews.data;
      setPagination((prev) => ({
        ...prev,
        totalPages,
        totalCount,
        currentPage: pageNumber,
      }));
    }
  }, [reviews]);

  const reviewItems = reviews?.data?.items ?? [];

  const renderContent = () => {
    if (isLoading)
      return (
        <div
          className="flex items-center justify-center gap-4 py-6"
          aria-live="polite"
        >
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="text-gray-700">Đang tải đánh giá...</span>
        </div>
      );
    if (error)
      return (
        <div
          className="flex items-center justify-center gap-4 py-6"
          aria-live="polite"
        >
          <p className="text-red-500">
            Không thể tải đánh giá. Vui lòng thử lại.
          </p>
        </div>
      );
    if (reviewItems.length === 0)
      return (
        <div
          className="flex items-center justify-center gap-4 py-6"
          aria-live="polite"
        >
          <p className="text-gray-500">Chưa có đánh giá nào.</p>
        </div>
      );

    return (
      <div>
        {reviewItems.map((review: Review) => (
          <CardReview key={review.reviewId} review={review} />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (reviewItems.length === 0) return null;

    return (
      <div className="mt-4">
        <Pagination
          currentPage={reviews?.data?.pageNumber}
          totalPages={reviews?.data?.totalPages}
          onPageChange={(newPage: number) => {
            setPagination((prev) =>
              prev.currentPage === newPage
                ? prev
                : { ...prev, currentPage: newPage }
            );

            // Scroll to top
            const headerOffset = 184;
            const el = mainRef.current!;
            const top =
              el.getBoundingClientRect().top + window.scrollY - headerOffset;
            window.scrollTo({ top, behavior: "smooth" });
          }}
        />
      </div>
    );
  };

  return (
    <div className="mt-6" ref={mainRef}>
      <Tabs defaultValue="all-stars" onValueChange={handleTabChange}>
        <TabsList className="bg-transparent gap-1">
          {/* All reviews */}
          <TabsTrigger
            value="all-stars"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            Tất cả ({product.reviewCount || 0})
          </TabsTrigger>

          {/* Star ratings */}
          {[5, 4, 3, 2, 1].map((star) => (
            <TabsTrigger
              key={star}
              value={`${star}-star`}
              className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
            >
              {star} sao ({product.reviewDetails?.[star] ?? 0})
            </TabsTrigger>
          ))}

          {/* Has images */}
          <TabsTrigger
            value="has-images"
            className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none rounded-md cursor-pointer px-3 h-9 transition-colors duration-200"
          >
            Có hình ảnh ({product.hasImageCount ?? 0})
          </TabsTrigger>
        </TabsList>
        <span className="border-b border-gray-200 mb-6"></span>

        <TabsContent value="all-stars">
          {renderContent()}
          {renderPagination()}
        </TabsContent>

        {[5, 4, 3, 2, 1].map((star) => (
          <TabsContent key={star} value={`${star}-star`}>
            {renderContent()}
            {renderPagination()}
          </TabsContent>
        ))}

        <TabsContent value="has-images">
          {renderContent()}
          {renderPagination()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
