import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { NavLink } from "react-router";
import { formatVND, renderStars } from "~/libs";
// 🧩 Dùng slice thật, không dùng cartSliceold
import { updateCartItem } from "~/redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { ProductDetail } from "~/types/product/product";
import type { ProductVariant } from "~/types/product/product-variant";
import type { SelectedProductProps } from "../types";
import { toast } from "react-hot-toast";

export default function ProductDetail({
  product,
  slug,
}: {
  product: ProductDetail;
  slug: string | undefined;
}) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth); // 🧩 Lấy userId từ Redux
  const [selected, setSelected] = useState<SelectedProductProps>({
    productVariant: null,
    quantity: 1,
    price: product.sellingPrice,
    image: product.primaryImage,
  });
  const variants = product.productVariants ?? [];
  const totalAvailableStock = variants.reduce((s, v) => s + v.stockQuantity, 0);
  const noStock = totalAvailableStock === 0;
  const availableStock = selected.productVariant?.stockQuantity ?? 0;

  const handleSizeSelect = (productVariant: ProductVariant) => {
    setSelected(prev => ({ ...prev, productVariant }));
  };

  const handleQuantityChange = (quantity: number, max_value?: number) => {
    if (quantity < 1 || (max_value !== undefined && quantity > max_value))
      return;
    setSelected(prev => ({ ...prev, quantity }));
  };

  // 🧩 Hàm thêm vào giỏ hàng (đã dùng API thật)
  const handleAddToCart = async () => {
    if (!user?.data?.userId) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    if (!selected.productVariant) {
      toast.error("Vui lòng chọn kích thước sản phẩm");
      return;
    }

    try {
      await dispatch(
        updateCartItem({
          userId: user.data.userId,
          variantId: selected.productVariant.productVariantId,
          quantity: selected.quantity,
          price: selected.price,
          slug,
        })
      ).unwrap();
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error("Thêm sản phẩm thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      {/* Title & Price */}
      <div>
        <div className="border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight">
            {product.name}
          </h1>
          {/* Rating, Reviews, Sold - Luôn nằm 1 hàng */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            {/* Rating */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 border-r border-gray-200 pr-2 sm:pr-4">
              <span className="font-medium text-xs sm:text-sm border-b border-black">
                {product.rating.toFixed(1)}
              </span>
              <div className="flex [&>svg]:w-3 [&>svg]:h-3 sm:[&>svg]:w-3.5 sm:[&>svg]:h-3.5">
                {renderStars(product.rating)}
              </div>
            </div>

            {/* Reviews */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5 border-r border-gray-200 pr-2 sm:pr-4">
              <span className="font-medium text-xs sm:text-sm border-b border-black">
                {product.reviewCount}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                đánh giá
              </span>
            </div>

            {/* Sold */}
            <div className="inline-flex items-center gap-1 sm:gap-1.5">
              <span className="font-medium text-xs sm:text-sm">
                {product.soldQuantity}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                đã bán
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
            {formatVND(product.sellingPrice)}
          </span>

          {product.discountPercentage && (
            <>
              <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through">
                {formatVND(product.basePrice)}
              </span>
              <div className="inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-semibold transition-colors bg-[#d93333] rounded-md text-white focus:outline-none focus:ring-2">
                -{product.discountPercentage}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Size */}
      <div>
        <h1 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
          Kích thước
        </h1>
        <div className="flex flex-wrap gap-2">
          {product.productVariants.map(productVariant => (
            <Button
              key={productVariant.productVariantId}
              variant={
                selected.productVariant?.size.sizeId ===
                productVariant.size.sizeId
                  ? "primary"
                  : "outline"
              }
              disabled={productVariant.stockQuantity === 0}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm cursor-pointer border-gray-300 hover:border-gray-400 transition-colors min-w-[44px]"
              onClick={() => handleSizeSelect(productVariant)}
            >
              {productVariant.size.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h1 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
          Chọn màu khác
        </h1>
        <div className="flex flex-wrap gap-2">
          {product.relatedProducts.map(p => {
            const imageUrl =
              p.primaryImage?.imageUrl || "/placeholder-product.jpg";

            return (
              <NavLink
                key={p.productId}
                to={`/products/${p.slug}`}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 transition-all duration-200 flex items-center justify-center overflow-hidden shadow-sm cursor-pointer hover:scale-105 hover:shadow-md hover:border-black`}
              >
                <img
                  src={imageUrl}
                  alt={p.name}
                  className="object-cover w-full h-full rounded-full"
                />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h1 className="font-medium text-sm sm:text-base mb-2 sm:mb-3">
          Số lượng
        </h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start gap-2 sm:gap-3">
          <div className="inline-flex items-center border rounded-md w-fit">
            <Button
              disabled={
                noStock || selected.quantity == 1 || !selected.productVariant
              }
              variant="ghost"
              className="cursor-pointer h-9 w-9 sm:h-10 sm:w-10 p-0"
              onClick={() => handleQuantityChange(selected?.quantity - 1)}
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <span className="px-3 py-2 sm:px-4 sm:py-2 border-x border-gray-300 text-sm sm:text-base font-medium min-w-[50px] sm:min-w-[60px] text-center">
              {selected?.quantity}
            </span>
            <Button
              disabled={
                noStock ||
                !selected.productVariant ||
                selected.quantity >= availableStock
              }
              variant="ghost"
              className="cursor-pointer h-9 w-9 sm:h-10 sm:w-10 p-0"
              onClick={() =>
                handleQuantityChange(selected?.quantity + 1, availableStock)
              }
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
          {noStock ? (
            <span className="text-xs sm:text-sm text-red-500 font-medium">
              (Hết hàng)
            </span>
          ) : selected.productVariant ? (
            <span className="text-xs sm:text-sm text-gray-500">
              (Chỉ còn {availableStock} sản phẩm)
            </span>
          ) : null}
        </div>
      </div>

      {/* 🛒 Add to cart */}
      <div className="pt-2 sm:pt-4">
        <Button
          className="w-full sm:w-auto h-11 sm:h-12 md:h-[44px] !px-6 sm:!px-8 text-sm sm:text-base cursor-pointer bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          disabled={noStock || !selected.productVariant}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Thêm vào giỏ hàng</span>
        </Button>
      </div>
    </div>
  );
}
