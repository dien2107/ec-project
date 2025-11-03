import { useParams } from "react-router";
import ProductImageGallery from "./components/product-image-gallery";
import ProductDetail from "./components/product-detail";
import TabsInfo from "./components/tabs-info";
import ProductRelated from "./components/product-related";
import { dataTagSymbol, useQuery } from "@tanstack/react-query";
import type { Product } from "~/types/product/product";
import { getProductDetailBySlug } from "~/services/products";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Product() {
  const { slug } = useParams<string>();
  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductDetailBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center gap-4 min-h-[80vh]"
        aria-live="polite"
      >
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-700">Đang tải...</span>
      </motion.div>
    );

  if (error || !product)
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-gray-500">
            Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </motion.div>
    );

  return (
    <div className="main-container">
      {/* Product Images + Details Grid */}
      <div className="grid grid-cols-12 gap-8 py-8">
        <motion.div
          className="col-span-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ProductImageGallery images={product.data.productImages ?? []} />
        </motion.div>
        <motion.div
          className="col-span-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ProductDetail product={product.data} />
        </motion.div>
      </div>

      {/* Tabs Info */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <TabsInfo product={product.data} />
      </motion.div>

      {/* Related Products */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <ProductRelated
          categoryId={product.data.category.categoryId}
          productId={product.data.productId}
        />
      </motion.div>
    </div>
  );
}
