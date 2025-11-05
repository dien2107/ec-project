import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import ProductCard from "~/components/ui/product-card";
import { getTop10RelatedProducts } from "~/services/products";
import { Loader2 } from "lucide-react";
import type { Product } from "~/types/product/product";

export default function ProductRelated({
  categoryId,
  productId,
}: {
  categoryId: number;
  productId: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["related", categoryId, productId],
    queryFn: () => getTop10RelatedProducts(categoryId, productId),
    enabled: !!categoryId && !!productId,
  });

  console.log(data);

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 min-h-[50vh] sm:min-h-[60vh] md:min-h-[80vh] px-4"
        aria-live="polite"
      >
        <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        <span className="text-sm sm:text-base text-gray-700 text-center">
          Đang tải sản phẩm liên quan...
        </span>
      </motion.div>
    );

  if (isError || !data)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4"
      >
        <div className="py-6 sm:py-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
            Sản phẩm liên quan
          </h2>
          <p className="text-center text-black text-sm sm:text-base md:text-lg">
            Lỗi hoặc không tìm thấy sản phẩm liên quan
          </p>
        </div>
      </motion.div>
    );

  return (
    <div className="py-6 sm:py-8 md:py-10">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 md:mb-8"
      >
        Sản phẩm liên quan
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-8 sm:gap-x-4 sm:gap-y-10 md:gap-x-4 md:gap-y-12">
        {data.data.map((p: Product, index: number) => {
          const imageUrl =
            p.primaryImage?.imageUrl || "/placeholder-product.png";

          return (
            <motion.div
              key={p.productId}
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <ProductCard
                id={p.productId}
                title={p.name}
                slug={p.slug}
                image={imageUrl}
                price={p.sellingPrice}
                oldPrice={p.basePrice}
                discount={p.discountPercentage}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
