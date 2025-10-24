import { useParams } from "react-router";
import ProductImageGallery from "./components/product-image-gallery";
import ProductDetail from "./components/product-detail";
import TabsInfo from "./components/tabs-info";
import ProductRelated from "./components/product-related";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "~/types/product/product";
import { getProductDetailBySlug } from "~/services/products";
import { Loader2 } from "lucide-react";

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
      <div
        className="flex items-center justify-center gap-4 min-h-[80vh] animate-pulse"
        aria-live="polite"
      >
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-700">Đang tải...</span>
      </div>
    );
  if (error || !product) return <div>Lỗi hoặc không tìm thấy</div>;

  return (
    <div className="main-container">
      <div className="grid grid-cols-12 gap-8 py-8">
        <div className="col-span-6">
          <ProductImageGallery images={product.data.productImages ?? []} />
        </div>
        <div className="col-span-6">
          <ProductDetail product={product.data} />
        </div>
      </div>
      <TabsInfo product={product.data} />
      <ProductRelated categorySlug={product.data.category.slug} />
    </div>
  );
}
