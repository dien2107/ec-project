import { useQuery } from "@tanstack/react-query";
import ProductCard from "~/components/ui/product-card";
import { getProductCatelog } from "~/services/products";
import { Loader2 } from "lucide-react";
import type { Product } from "~/types/product/product";

export default function ProductRelated({
  categorySlug,
}: {
  categorySlug?: string;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["related", categorySlug],
    queryFn: () =>
      getProductCatelog(categorySlug!, {
        pageNumber: 1,
        pageSize: 10,
      } as any),
    enabled: !!categorySlug,
  });

  console.log(data);

  if (isLoading)
    return (
      <div
        className="flex items-center justify-center gap-4 min-h-[80vh] animate-pulse"
        aria-live="polite"
      >
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="text-gray-700">Đang tải sản phẩm liên quan...</span>
      </div>
    );
  if (isError || !data)
    return <div>Lỗi hoặc không tìm thấy sản phẩm liên quan</div>;

  return (
    <div className="py-8">
      <h2 className="text-xl font-bold mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-5 gap-x-4 gap-y-12">
        {data.data.items.map((p: Product) => {
          return (
            <ProductCard
              id={p.productId}
              title={p.name}
              slug={p.slug}
              image={p.primaryImage.imageUrl}
              price={p.sellingPrice}
              oldPrice={p.basePrice}
              discount={p.discountPercentage}
            />
          );
        })}
      </div>
    </div>
  );
}
