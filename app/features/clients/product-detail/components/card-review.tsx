import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Star, ThumbsUp, EllipsisVertical, StarHalf } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IMAGES = [
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mc6cvummrbsaa1.webp",
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mclrdyvpibot8d.webp",
];

export default function CardReview() {
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

  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} fill="gold" stroke="gold" />);
      } else if (rating + 0.5 >= i) {
        stars.push(<StarHalf key={i} fill="gold" stroke="gold" />);
      } else {
        stars.push(<Star key={i} stroke="gold" />);
      }
    }

    return stars;
  };

  return (
    <Card>
      <div className="px-6 flex items-start justify-start">
        <div className="w-10">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium">Hương Ly</h3>
                <span className="text-xs text-gray-400">2025-01-16</span>
              </div>
              <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold text-black">4.8</span>
                  <div className="flex">{renderStars(4.8)}</div>
                </div>
            </div>
            <span className="text-xs text-gray-400 mb-2">
              Phân loại: Trắng - M
            </span>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-3">
              Áo đẹp quá! Form dáng rất đẹp, chất liệu cotton mềm mịn. Mặc rất
              thoải mái và thoáng mát. Màu trắng rất dễ phối đồ. Sẽ ủng hộ shop
              tiếp!
            </p>
            <div className="flex gap-2">
              {IMAGES.map((image, idx) => (
                <div
                  className={`w-16 h-16 overflow-hidden ${activeIndex === idx ? "border-3 border-black" : ""}`}
                >
                  <img
                    key={idx}
                    src={image}
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
                  {IMAGES.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img src={img} className="w-full h-full object-fit " />
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
    </Card>
  );
}
