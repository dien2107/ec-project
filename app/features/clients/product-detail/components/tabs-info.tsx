import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import StarRatingRow from "./star-rating-row";
import TabsReview from "./tabs-review";
import { Star, StarHalf } from "lucide-react";

export default function TabsInfo() {
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
    <div>
      <Tabs defaultValue="product" className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger
            value="product"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-3 h-10 text-gray-500 transition-colors duration-200"
          >
            Mô tả sản phẩm
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-3 h-10 text-gray-500 transition-colors duration-200"
          >
            Vận chuyển & Đổi trả
          </TabsTrigger>
          <TabsTrigger
            value="rating"
            className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-3 h-10 text-gray-500 transition-colors duration-200"
          >
            Đánh giá (156)
          </TabsTrigger>
        </TabsList>
        <span className="border-b border-gray-200"></span>
        <TabsContent value="product">
          <div className="pt-4 mb-4">
            <h1 className="font-medium mb-2">Thông tin sản phẩm</h1>
            <ul className="list-disc ml-5">
              <li className="mb-1 text-md">
                Tên sản phẩm: <span className="text-gray-700">Áo thun nam</span>
              </li>
              <li className="mb-1 text-md">
                Chất liệu: <span className="text-gray-700">100% cotton</span>
              </li>
              <li className="mb-1 text-md">
                Màu sắc: <span className="text-gray-700">Đen, Trắng, Xanh</span>
              </li>
              <li className="mb-1 text-md">
                Kích thước: <span className="text-gray-700">S, M, L, XL</span>
              </li>
              <li className="mb-1 text-md">
                Xuất xứ: <span className="text-gray-700">Việt Nam</span>
              </li>
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="pt-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Chính sách vận chuyển</h3>
              <p className="text-gray-700">
                Giao hàng miễn phí cho đơn hàng từ 300.000₫. Thời gian giao hàng
                từ 2-5 ngày tùy khu vực.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Chính sách đổi trả</h3>
              <p className="text-gray-700">
                YAME hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận
                hàng nếu sản phẩm còn nguyên tem mác, chưa qua sử dụng.
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rating">
          <div className="grid grid-cols-2 p-6 border border-gray-200 rounded-lg mt-6 shadow-sm">
            {/* Left content */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-3 mb-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-3xl font-bold text-black">4.8</span>
                  <div className="flex">{renderStars(4.8)}</div>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  156 đánh giá • 943 đã bán
                </span>
              </div>
            </div>

            {/* Right content */}
            <div>
              <StarRatingRow stars={5} value={100} count={"156"} />
              <StarRatingRow stars={4} value={10} count={"2"} />
              <StarRatingRow stars={3} value={0} count={"0"} />
              <StarRatingRow stars={2} value={0} count={"0"} />
              <StarRatingRow stars={1} value={0} count={"0"} />
            </div>
          </div>

          <TabsReview />
        </TabsContent>
      </Tabs>
    </div>
  );
}
