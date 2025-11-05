import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import StarRatingRow from "./star-rating-row";
import TabsReview from "./tabs-review";
import type { ProductDetail } from "~/types/product/product";
import { renderStars } from "~/libs/renderStars";

export default function TabsInfo({ product }: { product: ProductDetail }) {
  return (
    <div>
      <Tabs defaultValue="product" className="w-full">
        {/* Tabs Navigation - Scrollable on mobile/tablet, left-aligned on laptop */}
        <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 md:mx-0 md:px-0">
          <TabsList className="bg-transparent inline-flex min-w-max md:w-full md:justify-start">
            <TabsTrigger
              value="product"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-2 sm:py-3 md:py-3 h-9 sm:h-10 md:h-10 px-3 sm:px-4 md:px-4 text-xs sm:text-sm md:text-base text-gray-500 transition-colors duration-200 whitespace-nowrap"
            >
              Mô tả sản phẩm
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-2 sm:py-3 md:py-3 h-9 sm:h-10 md:h-10 px-3 sm:px-4 md:px-4 text-xs sm:text-sm md:text-base text-gray-500 transition-colors duration-200 whitespace-nowrap"
            >
              Vận chuyển & Đổi trả
            </TabsTrigger>
            <TabsTrigger
              value="rating"
              className="data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-b-black data-[state=active]:shadow-none rounded-none cursor-pointer py-2 sm:py-3 md:py-3 h-9 sm:h-10 md:h-10 px-3 sm:px-4 md:px-4 text-xs sm:text-sm md:text-base text-gray-500 transition-colors duration-200 whitespace-nowrap"
            >
              Đánh giá ({product.reviewCount || 0})
            </TabsTrigger>
          </TabsList>
        </div>
        <span className="block border-b border-gray-200"></span>

        {/* Product Info Tab */}
        <TabsContent value="product">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-4 sm:pt-5 md:pt-4 mb-4"
          >
            <h1 className="font-medium text-base sm:text-lg md:text-lg mb-2 sm:mb-3 md:mb-2">
              Thông tin sản phẩm
            </h1>
            <ul className="list-disc ml-4 sm:ml-5 md:ml-5 space-y-1.5 sm:space-y-2 md:space-y-2">
              <li className="text-sm sm:text-base md:text-base">
                Tên sản phẩm:{" "}
                <span className="text-gray-700">{product.name}</span>
              </li>
              <li className="text-sm sm:text-base md:text-base">
                Chất liệu:{" "}
                <span className="text-gray-700">{product.material.name}</span>
              </li>
              <li className="text-sm sm:text-base md:text-base">
                Màu sắc:{" "}
                <span className="text-gray-700">{product.color.name}</span>
              </li>
              <li className="text-sm sm:text-base md:text-base">
                Kích thước:{" "}
                <span className="text-gray-700">
                  {product.productVariants
                    .map((productVariant) => productVariant.size.name)
                    .join(", ")}
                </span>
              </li>
              <li className="text-sm sm:text-base md:text-base">
                Xuất xứ: <span className="text-gray-700">Việt Nam</span>
              </li>
            </ul>
          </motion.div>
        </TabsContent>

        {/* Shipping Tab */}
        <TabsContent value="shipping">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="pt-4 sm:pt-5 md:pt-4 space-y-4 sm:space-y-5 md:space-y-6"
          >
            <div>
              <h3 className="font-medium text-base sm:text-lg md:text-lg mb-2 sm:mb-3 md:mb-3">
                Chính sách vận chuyển
              </h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-base leading-relaxed">
                Giao hàng miễn phí cho đơn hàng từ 300.000₫. Thời gian giao hàng
                từ 2-5 ngày tùy khu vực.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-base sm:text-lg md:text-lg mb-2 sm:mb-3 md:mb-3">
                Chính sách đổi trả
              </h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-base leading-relaxed">
                YAME hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận
                hàng nếu sản phẩm còn nguyên tem mác, chưa qua sử dụng.
              </p>
            </div>
          </motion.div>
        </TabsContent>

        {/* Rating Tab */}
        <TabsContent value="rating">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mt-4 sm:mt-5 md:mt-6">
            {/* Left: Rating Overview */}
            <motion.div
              className="md:col-span-1 self-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="md:sticky md:top-24 p-4 sm:p-5 md:p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2"
                >
                  <span className="text-2xl sm:text-3xl md:text-3xl font-bold text-black">
                    {product.rating?.toFixed?.(1) ?? "0.0"}
                  </span>
                  <div className="flex [&>svg]:w-4 [&>svg]:h-4 sm:[&>svg]:w-5 sm:[&>svg]:h-5 md:[&>svg]:w-5 md:[&>svg]:h-5">
                    {renderStars(product.rating ?? 0)}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mb-3 sm:mb-4 md:mb-4"
                >
                  <span className="text-xs sm:text-sm md:text-sm text-gray-500">
                    {product.reviewCount ?? 0} đánh giá •{" "}
                    {product.soldQuantity ?? 0} đã bán
                  </span>
                </motion.div>

                <div className="w-full space-y-2">
                  {([5, 4, 3, 2, 1] as const).map((star, index) => {
                    const details = product.reviewDetails ?? {};
                    const count = Number(details[star] ?? 0);
                    const value =
                      product.reviewCount > 0
                        ? Math.round((count / product.reviewCount) * 100)
                        : 0;
                    return (
                      <motion.div
                        key={star}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.3 + index * 0.08,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <StarRatingRow
                          stars={star}
                          value={value}
                          count={count}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right: Reviews List */}
            <motion.div
              className="md:col-span-2 md:ml-2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <TabsReview product={product} />
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
