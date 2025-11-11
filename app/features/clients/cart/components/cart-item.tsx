import React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItemData } from "../types";
import { NavLink } from "react-router";

interface CartItemProps {
  item: CartItemData;
  onSelect: (id: string, checked: boolean) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
  onSizeChange?: (id: string, newVariantId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onSelect,
  onQuantityChange,
  onRemove,
  onSizeChange,
}) => {
  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

  const handleSizeChange = (newVariantId: string) => {
    if (onSizeChange) {
      onSizeChange(item.id, Number(newVariantId));
    }
  };

  // Kiểm tra stock của variant hiện tại
  const currentVariant = item.availableVariants?.find(
    (v) => v.productVariantId === item.variantId
  );
  const isOutOfStock = currentVariant && currentVariant.stockQuantity === 0;
  const isLowStock =
    currentVariant && currentVariant.stockQuantity < item.quantity;

  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden max-w-[95vw] sm:max-w-full mx-auto ${
        isOutOfStock || isLowStock
          ? "border-red-300 bg-red-50/30"
          : "border-gray-100"
      }`}
    >
      {/* Checkbox */}
      <Checkbox
        checked={item.selected}
        onCheckedChange={(checked) => onSelect(item.id, !!checked)}
        className="flex-shrink-0 mt-1"
      />

      {/* Product Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={item.image || "/placeholder.png"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105 block"
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzNkw0MCAyNEw1MiAzNlY1Nkg0MFY0NEgzMlY1NkgyOFYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
          }}
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <NavLink
          to={`/products/${item.slug}`}
          className="block relative overflow-hidden rounded-md group hover:no-underline
          hover:opacity-50 transition"
        >
          <h3 className="font-semibold text-base md:text-lg text-gray-800 break-words whitespace-normal leading-tight">
            {item.name}
          </h3>
        </NavLink>

        <div className="text-sm text-gray-500 mt-1 flex items-center gap-2 flex-wrap">
          {item.availableVariants && item.availableVariants.length > 1 ? (
            <div className="flex items-center gap-1">
              <span>Size:</span>
              <Select
                value={String(item.variantId)}
                onValueChange={handleSizeChange}
              >
                <SelectTrigger className="w-[80px] h-8 text-xs">
                  <SelectValue placeholder={item.size} />
                </SelectTrigger>
                <SelectContent>
                  {item.availableVariants.map((variant) => (
                    <SelectItem
                      key={variant.productVariantId}
                      value={String(variant.productVariantId)}
                      disabled={variant.stockQuantity === 0}
                    >
                      {variant.sizeName}
                      {variant.stockQuantity === 0 && " (Hết hàng)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <span>Size: {item.size}</span>
          )}
          <span className="text-gray-400">|</span>
          <span>Màu: {item.color}</span>
        </div>

        {/* Price Section with discount */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {item.discountPercentage && item.discountPercentage > 0 ? (
            <>
              <span className="font-bold text-red-600 text-sm md:text-base">
                {formatPrice(item.sellingPrice || item.price)}
              </span>
              <span className="text-xs md:text-sm text-gray-400 line-through">
                {formatPrice(item.basePrice || item.price)}
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] md:text-xs font-semibold bg-red-100 text-red-600 rounded">
                -{item.discountPercentage}%
              </span>
            </>
          ) : (
            <span className="font-bold text-gray-800 text-sm md:text-base">
              {formatPrice(item.price)}
            </span>
          )}
        </div>

        {/* Stock warning */}
        {isOutOfStock && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            ⚠️ Sản phẩm đã hết hàng
          </p>
        )}
        {!isOutOfStock && isLowStock && (
          <p className="text-xs text-orange-500 mt-1 font-medium">
            Chỉ còn {currentVariant.stockQuantity} sản phẩm
          </p>
        )}
      </div>

      {/* Quantity controls */}
      <div className="mt-3 sm:mt-0 flex flex-col sm:flex-col items-start sm:items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1 || isOutOfStock}
          >
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            disabled={
              isOutOfStock ||
              (currentVariant
                ? item.quantity >= currentVariant.stockQuantity
                : false)
            }
          >
            <Plus size={14} />
          </Button>
        </div>
        <div className="text-xs text-gray-500">
          Kho: {currentVariant?.stockQuantity || 0}
        </div>
      </div>

      {/* Remove button */}
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-red-500 p-2 self-end sm:self-center"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
};

export default CartItem;
