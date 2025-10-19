import { EyeOff, Star, StarHalf, ThumbsUp } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

import toast from "react-hot-toast";
import { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Product } from "~/types/product";
import { hideReviewById } from "~/services/reviews";
import type { Review } from "../types/review";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";

function formatDate(date: string | Date | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ReviewDetail({
  selectedProduct,
  selectedReview,
  onHideReview,
}: {
  selectedProduct: Product | null;
  selectedReview: Review | null;
  onHideReview: () => void;
}) {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const renderStars = useCallback((rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star size={16} key={i} fill="gold" stroke="gold" />);
      } else if (rating + 0.5 >= i) {
        stars.push(<StarHalf size={16} key={i} fill="gold" stroke="gold" />);
      } else {
        stars.push(<Star size={16} key={i} stroke="gold" />);
      }
    }
    return stars;
  }, []);

  const handleThumbnailClick = (idx: number) => {
    setPhotoIndex(idx);
    swiperRef.current?.slideTo(idx);
  };

  const handleHideReview = async (reviewId: number) => {
    try {
      setIsLoading(true);
      await hideReviewById(reviewId);
      toast.success("Đánh giá đã được ẩn thành công!");
      onHideReview();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi ẩn đánh giá!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedReview) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Không có đánh giá nào được chọn
      </div>
    );
  }

  return (
    <div className="col-span-1 mr-4 mt-2 h-full max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-2">Chi tiết đánh giá</h2>
        <div className="inline-block text-sm w-[80px] text-left">
          {selectedReview.status.name === "Approved" ? (
            <div className="bg-green-400 text-white p-1 rounded-lg text-center whitespace-normal break-words">
              Hiển thị
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Ẩn
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-2 px-2 overflow-y-auto scrollbar-custom max-h-[80vh]">
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-400">Sản phẩm</p>
            <p className="text-sm text-gray-400">Đánh giá</p>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{selectedProduct?.name}</p>
              <p className="font-light  text-sm">
                (SKU: {selectedReview.orderItem.productVariant.sku})
              </p>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(selectedReview?.rating)}
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-400">Username</p>
            <p className="text-sm text-gray-400">Ngày đánh giá</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm">{selectedReview.username}</p>
            <p className="text-sm">{formatDate(selectedReview.createdAt)}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-400">Nội dung</p>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <ThumbsUp size={16} />
              12
            </p>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-sm">
            <p className="text-sm ">{selectedReview.comment || ""}</p>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {selectedReview.reviewImages.map((image, idx) => (
            <div className={`w-16 h-16 overflow-hidden`}>
              <img
                key={image.reviewImageId}
                src={image.imageUrl}
                alt="Review Image"
                className="w-full h-full object-cover bg-gray-200 transition-all duration-200 cursor-pointer hover:scale(1.2) hover:border-4 hover:border-black"
                onClick={() => {
                  handleThumbnailClick(idx);
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2">
          {photoIndex >= 0 && (
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setPhotoIndex(swiper.activeIndex)}
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="mySwiper max-h-[300px] aspect-[9/16]"
            >
              {selectedReview.reviewImages.map((img, idx) => (
                <SwiperSlide key={img.reviewImageId}>
                  <img
                    src={img.imageUrl}
                    alt="Review image"
                    className="w-full h-full object-fit "
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
      <div className="mt-4 text-right">
        {selectedReview.status.name === "Approved" && (
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>
                {isLoading ? (
                  <span className="ml-2 flex items-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                    Đang ẩn
                  </span>
                ) : (
                  <>
                    <EyeOff />
                    Ẩn đánh giá
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc muốn ẩn đánh giá này?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Đánh giá sẽ bị ẩn khỏi hệ thống và người dùng sẽ không còn
                  thấy đánh giá này.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  disabled={isLoading}
                  onClick={() => handleHideReview(selectedReview.reviewId)}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      Đang ẩn
                    </span>
                  ) : (
                    "Xác nhận ẩn"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
