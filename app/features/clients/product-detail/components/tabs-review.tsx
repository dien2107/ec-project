import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center gap-4 py-12"
          aria-live="polite"
        >
          <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          <span className="text-gray-700">Đang tải đánh giá...</span>
        </motion.div>
      );

    if (error)
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-center gap-4 py-12"
          aria-live="polite"
        >
          <div className="text-center">
            <p className="text-red-500 text-lg">
              Không thể tải đánh giá. Vui lòng thử lại.
            </p>
          </div>
        </motion.div>
      );

    if (reviewItems.length === 0)
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex items-center justify-center gap-4 py-12"
          aria-live="polite"
        >
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Chưa có đánh giá nào.</p>
            <p className="text-gray-400 text-sm mt-2">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </div>
        </motion.div>
      );

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`${filters.rating}-${pagination.currentPage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ staggerChildren: 0.1 }}
          className="space-y-4"
        >
          {reviewItems.map((review: Review, index: number) => (
            <motion.div
              key={review.reviewId}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <CardReview review={review} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderPagination = () => {
    if (reviewItems.length === 0 || pagination.totalPages <= 1) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8"
      >
        <Pagination
          currentPage={reviews?.data?.pageNumber}
          totalPages={reviews?.data?.totalPages}
          onPageChange={(newPage: number) => {
            setPagination((prev) =>
              prev.currentPage === newPage
                ? prev
                : { ...prev, currentPage: newPage }
            );

            // Smooth scroll to top
            if (mainRef.current) {
              const headerOffset = 184;
              const top =
                mainRef.current.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }}
        />
      </motion.div>
    );
  };

  return (
    <div className="mt-6" ref={mainRef}>
      <Tabs defaultValue="all-stars" onValueChange={handleTabChange}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TabsList
            className="
              flex flex-wrap items-center justify-center
              gap-2 mb-10 bg-transparent text-muted-foreground
              lg:flex-wrap lg:mb-16 lg:gap-3 xl:mb-0
            "
          >
            {/* All reviews */}
            <TabsTrigger
              value="all-stars"
              className="
                inline-flex items-center justify-center
                px-3 py-1 h-9
                text-sm font-medium
                whitespace-nowrap
                rounded-md transition-all
                border border-transparent
                hover:bg-gray-100
                flex-shrink-0
                cursor-pointer
                max-sm:text-xs max-sm:px-2 max-sm:h-7
                data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none
              "
            >
              Tất cả ({product.reviewCount || 0})
            </TabsTrigger>

            {/* Star ratings */}
            {[5, 4, 3, 2, 1].map((star) => (
              <TabsTrigger
                key={star}
                value={`${star}-star`}
                className="
                  inline-flex items-center justify-center
                  px-3 py-1 h-9
                  text-sm font-medium
                  whitespace-nowrap
                  rounded-md transition-all
                  border border-transparent
                  hover:bg-gray-100
                  flex-shrink-0
                  cursor-pointer
                  max-sm:text-xs max-sm:px-2 max-sm:h-7
                  data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none
                "
              >
                {star} sao ({product.reviewDetails?.[star] ?? 0})
              </TabsTrigger>
            ))}

            {/* Has images */}
            <TabsTrigger
              value="has-images"
              className="
                inline-flex items-center justify-center
                px-3 py-1 h-9
                text-sm font-medium
                whitespace-nowrap
                rounded-md transition-all
                border border-transparent
                hover:bg-gray-100
                flex-shrink-0
                cursor-pointer
                max-sm:text-xs max-sm:px-2 max-sm:h-7
                data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-none
              "
            >
              Có hình ảnh ({product.hasImageCount ?? 0})
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <div className="border-b border-gray-200 mb-6"></div>

        <TabsContent value="all-stars" className="mt-0">
          {renderContent()}
          {renderPagination()}
        </TabsContent>

        {[5, 4, 3, 2, 1].map((star) => (
          <TabsContent key={star} value={`${star}-star`} className="mt-0">
            {renderContent()}
            {renderPagination()}
          </TabsContent>
        ))}

        <TabsContent value="has-images" className="mt-0">
          {renderContent()}
          {renderPagination()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
