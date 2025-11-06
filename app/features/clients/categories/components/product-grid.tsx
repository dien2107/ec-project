import { motion } from "framer-motion";
import ProductCard from "~/components/ui/product-card";
import type { Product } from "~/types/product/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-gray-600">
        Chưa có sản phẩm
      </div>
    );
  }

  return (
    <div className="grid gap-x-3 gap-y-12 sm:gap-x-4 sm:gap-y-16 md:gap-y-20 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p, index) => {
        const imageUrl = p.primaryImage?.imageUrl || "/placeholder-product.png";

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
              outOfStock={p.outOfStock}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
