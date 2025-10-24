import { EllipsisVertical, ThumbsUp } from "lucide-react";
import { useRef, useState } from "react";
import { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { DialogOverlay } from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { renderStars } from "~/libs/renderStars";
import type { Review } from "~/types/review";
import { formatDate } from "~/libs";

const IMAGES = [
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mc6cvummrbsaa1.webp",
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mclrdyvpibot8d.webp",
];

export default function CardReview({ review }: { review: Review }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const swiperRef = useRef<SwiperClass | null>(null);

  const handleThumbnailClick = (idx: number) => {
    if (activeIndex == idx) {
      setActiveIndex(-1);
    } else {
      setActiveIndex(idx);
    }
    swiperRef.current?.slideTo(idx);
  };

  return (
    <div className="border-b-2 border-gray-200 pb-4 mb-4">
      <div className="px-6 flex items-start justify-start">
        <div className="w-12">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/logo-icon.png" alt="Avatar" />
          </Avatar>
        </div>
        <div className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium">{review.username}</h3>
                <span className="text-xs text-gray-400">
                  {review.isEdited
                    ? formatDate(review.updatedAt) + " (Đã chỉnh sửa)"
                    : formatDate(review.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-lg font-bold text-black">4.8</span>
                <div className="flex">{renderStars(4.8, 5, 16)}</div>
              </div>
            </div>
            <span className="text-xs text-gray-400 mb-2">
              Phân loại: {review.orderItem.productVariant.color.name} -{" "}
              {review.orderItem.productVariant.size.name}
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">{review.comment}</p>
            <div className="flex gap-2">
              {review.reviewImages.map((image, idx) => (
                <div
                  className={`w-16 h-16 overflow-hidden ${activeIndex === idx ? "border-3 border-black" : ""}`}
                >
                  <img
                    key={image.reviewImageId}
                    src={image.imageUrl}
                    alt="Review Image"
                    onClick={() => handleThumbnailClick(idx)}
                    className={`w-full h-full object-cover bg-gray-200 transition-all duration-400 ${activeIndex === idx ? "scale-120 cursor-zoom-out" : "cursor-zoom-in"}`}
                  />
                </div>
              ))}
            </div>
            {activeIndex >= 0 && (
              <div className="mt-2 max-h-[500px] aspect-[9/16]">
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {review.reviewImages.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={img.imageUrl} className="w-full h-full object-fit " />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between mt-3 pt-2 ">
            <div className="flex items-center justify-start gap-4">
              <Button variant="ghost" className="cursor-pointer text-gray-400">
                <ThumbsUp size={16} /> <span className="text-xs">0</span>
              </Button>
              <span className="text-xs text-gray-400">
                Đánh giá này có hữu ích không?
              </span>
            </div>
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="cursor-pointer text-gray-400"
                  onClick={() => setOpen(!open)}
                >
                  <EllipsisVertical />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Báo cáo</p>
              </TooltipContent>
            </Tooltip>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
