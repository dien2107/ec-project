import { EyeOff, Star, StarHalf, ThumbsUp } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";

import DataTable from "../../components/data-table";

import { getColumns } from "../columns/review";
import type { Product, Review } from "../types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperClass } from "swiper";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const IMAGES = [
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mc6cvummrbsaa1.webp",
  "https://down-vn.img.susercontent.com/file/vn-11134103-7ras8-mclrdyvpibot8d.webp",
];

export default function ReviewDialog({
  open,
  setIsOpen,
  product,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  product: Product | null;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil((product?.reviews?.length ?? 0) / pageSize);

  const paginatedData = (product?.reviews ?? []).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);

  const columns = getColumns(selectedReview, setSelectedReview);

  const renderStars = (rating: number) => {
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
  };

  const handleThumbnailClick = (idx: number) => {
    setPhotoIndex(idx);
    swiperRef.current?.slideTo(idx);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <form>
          <DialogContent className="min-w-[92vw] max-w-[92vw] min-h-[98vh] max-h-[98vh] px-0">
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="w-full h-full col-span-2 overflow-y-auto scrollbar-custom">
                <DataTable
                  className="shadow-none border-none"
                  columns={columns}
                  data={paginatedData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  title={`Đánh giá sản phẩm (${product?.reviews?.length ?? 0})`}
                  filterPlaceholder="Tìm đánh giá..."
                  showFilter
                />
              </div>
              <div className="col-span-1 mr-4 ">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold mb-2">
                    Chi tiết đánh giá
                  </h2>
                  <div className="inline-block text-sm w-[80px] text-left">
                    <div className="bg-green-400 text-white p-1 rounded-lg text-center whitespace-normal break-words">
                      Hiển thị
                    </div>
                    {/* <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
                    Ẩn
                  </div> */}
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-2 px-1 overflow-y-auto scrollbar-custom max-h-[80vh]">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-400">Sản phẩm</p>
                      <p className="text-sm text-gray-400">Đánh giá</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Áo thun ba lỗ</p>
                      <div className="flex items-center gap-1">
                        {renderStars(4)}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-400">Username</p>
                      <p className="text-sm text-gray-400">Ngày đánh giá</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm">nguyenvanA</p>
                      <p className="text-sm">01/05/2025</p>
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
                      <p className="text-sm ">
                        Giày đẹp, đúng kích cỡ và rất thoải mái khi đi. Chất
                        lượng tuyệt vời!
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2">
                    {IMAGES.map((image, idx) => (
                      <div className={`w-16 h-16 overflow-hidden`}>
                        <img
                          key={idx}
                          src={image}
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
                        onSlideChange={(swiper) =>
                          setPhotoIndex(swiper.activeIndex)
                        }
                        pagination={{
                          dynamicBullets: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper max-h-[300px] aspect-[9/16]"
                      >
                        {IMAGES.map((img, idx) => (
                          <SwiperSlide key={idx}>
                            <img
                              src={img}
                              className="w-full h-full object-fit "
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <Button variant="destructive">
                    <EyeOff />
                    Ẩn đánh giá
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
}
