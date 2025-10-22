import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import StarRatingRow from "./star-rating-row";
import TabsReview from "./tabs-review";
import type { ProductDetail } from "~/types/product/product";
import { renderStars } from "~/libs/renderStars";

export default function TabsInfo({ product }: { product: ProductDetail }) {
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
            Đánh giá ({product.reviewCount || 0})
          </TabsTrigger>
        </TabsList>
        <span className="border-b border-gray-200"></span>
        <TabsContent value="product">
          <div className="pt-4 mb-4">
            <h1 className="font-medium mb-2">Thông tin sản phẩm</h1>
            <ul className="list-disc ml-5">
              <li className="mb-1 text-md">
                Tên sản phẩm:{" "}
                <span className="text-gray-700">{product.name}</span>
              </li>
              <li className="mb-1 text-md">
                Chất liệu:{" "}
                <span className="text-gray-700">{product.material.name}</span>
              </li>
              <li className="mb-1 text-md">
                Màu sắc:{" "}
                <span className="text-gray-700">{product.color.name}</span>
              </li>
              <li className="mb-1 text-md">
                Kích thước:{" "}
                <span className="text-gray-700">
                  {product.productVariants
                    .map((productVariant) => productVariant.size.name)
                    .join(", ")}
                </span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 ">
            {/* Left: overview */}
            <div className="md:col-span-1 self-start">
              <div className="sticky top-24 p-6 border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-black">
                    {product.rating?.toFixed?.(1) ?? "0.0"}
                  </span>
                  <div className="flex">{renderStars(product.rating ?? 0)}</div>
                </div>
                <div className="mb-4">
                  <span className="text-sm text-gray-500">
                    {product.reviewCount ?? 0} đánh giá •{" "}
                    {product.soldQuantity ?? 0} đã bán
                  </span>
                </div>

                <div className="w-full space-y-2">
                  {([5, 4, 3, 2, 1] as const).map((star) => {
                    const details = product.reviewDetails ?? {};
                    const count = Number(details[star] ?? 0);
                    const value =
                      product.reviewCount > 0
                        ? Math.round((count / product.reviewCount) * 100)
                        : 0;
                    return (
                      <StarRatingRow
                        key={star}
                        stars={star}
                        value={value}
                        count={count}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: reviews list (takes 2 columns on md+) */}
            <div className="md:col-span-2 ml-2">
              <TabsReview product={product} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
