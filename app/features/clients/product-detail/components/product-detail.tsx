import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Minus,
  Plus,
  ShoppingCart,
  CircleCheck,
  Star,
  StarHalf,
} from "lucide-react";

import type { SelectedProductProps } from "../types";
import type { ProductDetail } from "~/types/product/product";
import type { ProductVariant } from "~/types/product/product-variant";
import { NavLink } from "react-router";
import { renderStars, formatVND } from "~/libs";

export default function ProductDetail({ product }: { product: ProductDetail }) {
  const [selected, setSelected] = useState<SelectedProductProps>({
    productVariant: null,
    quantity: 1,
  });
  const variants = product.productVariants ?? [];
  const totalAvailableStock = variants.reduce((s, v) => s + v.stockQuantity, 0);
  const noStock = totalAvailableStock === 0;
  const availableStock = selected.productVariant?.stockQuantity ?? 0;

  const handleSizeSelect = (productVariant: ProductVariant) => {
    setSelected((prev) => ({ ...prev, productVariant }));
  };

  const handleQuantityChange = (quantity: number, max_value?: number) => {
    if (quantity < 1 || (max_value !== undefined && quantity > max_value))
      return;
    setSelected((prev) => ({ ...prev, quantity }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Price */}
      <div>
        <div className="border-b border-gray-200">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex justify-start items-center gap-4 mb-4">
            <div className="inline-flex justify-start items-center gap-2 border-r border-gray-200 pr-4">
              <span className="font-medium text-md border-b border-black">
                {product.rating.toFixed(1)}
              </span>
              <div className="flex items-center gap-3 mb-1">
                <div className="flex">{renderStars(product.rating)}</div>
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-2 border-r border-gray-200 pr-4">
              <span className="flex items-center gap-2">
                <span className="font-medium text-md border-b border-black">
                  {product.reviewCount}
                </span>{" "}
                <span className="font-normal text-gray-500">đánh giá</span>
              </span>
            </div>
            <div className="inline-flex justify-start items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="font-medium text-md">
                  {product.soldQuantity}
                </span>{" "}
                <span className="font-normal text-gray-500">đã bán</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-bold">
            {formatVND(product.sellingPrice)}
          </span>

          {product.discountPercentage && (
            <>
              <span className="text-gray-500 line-through">
                {formatVND(product.basePrice)}
              </span>
              <div className="inline-flex px-2.5 py-0.5 text-xs font-semibold transition-colors bg-[#d93333] rounded-md text-white focus:outline-none focus:ring-2">
                -{product.discountPercentage}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Size */}
      <div>
        <h1 className="font-medium mb-2">Kích thước</h1>
        <div className="flex flex-wrap gap-2">
          {product.productVariants.map((productVariant) => (
            <Button
              key={productVariant.productVariantId}
              variant={
                selected.productVariant?.size.sizeId ===
                productVariant.size.sizeId
                  ? "default"
                  : "outline"
              }
              disabled={productVariant.stockQuantity === 0}
              className="px-4 py-2 cursor-pointer border-gray-300 hover:border-gray-400 transition-colors"
              onClick={() => handleSizeSelect(productVariant)}
            >
              {productVariant.size.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h1 className="font-medium mb-2">Chọn màu khác</h1>
        <div className="flex flex-wrap gap-2">
          {product.relatedProducts.map((p) => (
            <NavLink
              key={p.productId}
              to={`/products/${p.slug}`}
              className={`relative w-16 h-16 rounded-full border-2 transition-all duration-200 flex items-center justify-center overflow-hidden shadow-sm cursor-pointer hover:scale-105 hover:shadow-md hover:border-black`}
            >
              <img
                src={p.primaryImage.imageUrl}
                alt={p.name}
                className="object-cover w-full h-full rounded-full"
              />
            </NavLink>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h1 className="font-medium mb-2">Số lượng</h1>
        <div className="flex items-center justify-start gap-2">
          <div className="inline-flex items-center border rounded-md w-fit">
            <Button
              disabled={
                noStock || selected.quantity == 1 || !selected.productVariant
              }
              variant="ghost"
              className="cursor-pointer"
              onClick={() => handleQuantityChange(selected?.quantity - 1)}
            >
              <Minus />
            </Button>
            <span className="px-4 py-2 border-x border-gray-300">
              {selected?.quantity}
            </span>
            <Button
              disabled={
                noStock ||
                !selected.productVariant ||
                selected.quantity >= availableStock
              }
              variant="ghost"
              className="cursor-pointer"
              onClick={() =>
                handleQuantityChange(selected?.quantity + 1, availableStock)
              }
            >
              <Plus />
            </Button>
          </div>
          {noStock ? (
            <span className="text-gray-500">(Hết hàng)</span>
          ) : selected.productVariant ? (
            <span className="text-gray-500">
              (Chỉ còn {availableStock} sản phẩm)
            </span>
          ) : null}
        </div>
      </div>
      <div>
        <Button
          className="h-[44px] !px-8 cursor-pointer bg-black text-white"
          disabled={noStock || !selected.productVariant}
        >
          <ShoppingCart />
          <span>Thêm vào giỏ hàng</span>
        </Button>
      </div>
    </div>
  );
}
