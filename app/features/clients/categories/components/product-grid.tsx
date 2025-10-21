import ProductCard from "~/components/ui/product-card";
import type { Product } from "~/types/product/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return <div className={`text-center py-8 `}>Chưa có sản phẩm</div>;
  }

  return (
    <div className={`grid gap-4  grid-cols-2 md:grid-cols-4`}>
      {products.map((p) => (
        <div key={p.productId} className="w-full">
          <ProductCard
            id={p.productId}
            title={p.name}
            slug={p.slug}
            image={p.primaryImage.imageUrl}
            price={p.sellingPrice}
            oldPrice={p.basePrice}
            discount={p.discountPercentage}
          />
        </div>
      ))}
    </div>
  );
}
