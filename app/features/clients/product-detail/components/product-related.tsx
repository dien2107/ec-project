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
        className="flex items-center justify-center gap-4 min-h-[80vh]"
        aria-live="polite"
      >
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-700">Đang tải sản phẩm liên quan...</span>
      </motion.div>
    );

  if (isError || !data)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="py-8">
          <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
          <p className="text-center text-black text-lg">
            Lỗi hoặc không tìm thấy sản phẩm liên quan
          </p>
        </div>
      </motion.div>
    );

  return (
    <div className="py-8">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-xl font-bold mb-6"
      >
        Sản phẩm liên quan
      </motion.h2>
      <div className="grid grid-cols-5 gap-x-4 gap-y-12">
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
