import { useState, useCallback } from "react";

import { Button } from "~/components/ui/button";

import { Minus, Plus, ShoppingCart, CircleCheck, Star } from "lucide-react";
import Rating from "react-rating";

import type { SelectedProductProps } from "../types";

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

const SIZES = [
  { id: 1, name: "S" },
  { id: 2, name: "M" },
  { id: 3, name: "L" },
  { id: 4, name: "XL" },
];
const COLORS = [
  { id: 1, name: "black", hex_code: "#000000" },
  { id: 2, name: "red", hex_code: "#FF0000" },
  { id: 3, name: "blue", hex_code: "#0000FF" },
  { id: 4, name: "green", hex_code: "#00FF00" },
];
const MAX_VALUE = 2;

export default function ProductDetail() {
  const [selected, setSelected] = useState<SelectedProductProps>({
    sizeId: null,
    colorId: null,
    quantity: 1,
  });

  console.log(selected);

  const handleSizeSelect = (sizeId: number) => {
    setSelected((prev) => ({ ...prev, sizeId }));
  };

  const handleColorSelect = (colorId: number) => {
    setSelected((prev) => ({ ...prev, colorId }));
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
          <h1 className="text-2xl font-bold mb-2">
            Áo Thun Cổ Tròn Tay Ngắn Seventy Seven 13 Đen
          </h1>
          <div className="flex justify-start items-center gap-4 mb-4">
            <div className="inline-flex justify-start items-center gap-2 border-r border-gray-200 pr-4">
              <span className="font-medium text-md border-b border-black">
                4.5
              </span>
              <div className="rating-wrapper">
                <Rating
                  initialRating={4.5}
                  emptySymbol={<Star size={16} stroke="gold" />}
                  fullSymbol={<Star size={16} fill="gold" stroke="gold" />}
                  readonly
                />
              </div>
            </div>
            <div className="inline-flex justify-start items-center gap-2 border-r border-gray-200 pr-4">
              <span className="flex items-center gap-2">
                <span className="font-medium text-md border-b border-black">
                  156
                </span>{" "}
                <span className="font-normal text-gray-500">đánh giá</span>
              </span>
            </div>
            <div className="inline-flex justify-start items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="font-medium text-md">943</span>{" "}
                <span className="font-normal text-gray-500">đã bán</span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <span className="text-xl font-bold">{formatVND(157000)}</span>
          <span className="text-gray-500 line-through">
            {formatVND(250000)}
          </span>
          <div className="inline-flex px-2.5 py-0.5 text-xs font-semibold transition-colors bg-[#d93333] rounded-md text-white focus:outline-none focus:ring-2">
            -26%
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <h1 className="font-medium mb-2">Kích thước</h1>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <Button
              key={size.id}
              variant={selected.sizeId === size.id ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer border-gray-300 hover:border-gray-400 transition-colors"
              onClick={() => handleSizeSelect(size.id)}
            >
              {size.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h1 className="font-medium mb-2">Màu sắc</h1>
        <div className="flex gap-2">
          {COLORS.map((color) => (
            <div
              key={color.id}
              className="w-8 h-8 rounded-full cursor-pointer relative"
              style={{ backgroundColor: color.hex_code }}
              onClick={() => handleColorSelect(color.id)}
            >
              {selected.colorId === color.id && (
                <>
                  <div
                    className="absolute inset-0 bg-black rounded-full"
                    style={{ opacity: 0.5 }}
                  ></div>
                  <CircleCheck className="w-4 h-4 text-white absolute inset-0 m-auto" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <h1 className="font-medium mb-2">Số lượng</h1>
        <div className="flex items-center justify-start gap-2">
          <div className="inline-flex items-center border rounded-md w-fit">
            <Button
              disabled={selected.quantity == 1}
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
              disabled={selected.quantity == MAX_VALUE}
              variant="ghost"
              className="cursor-pointer"
              onClick={() =>
                handleQuantityChange(selected?.quantity + 1, MAX_VALUE)
              }
            >
              <Plus />
            </Button>
          </div>
          <span className="text-gray-500">(Chỉ còn {MAX_VALUE} sản phẩm)</span>
        </div>
      </div>
      <div>
        <Button className="h-[44px] !px-8 cursor-pointer">
          <ShoppingCart />
          <span>Thêm vào giỏ hàng</span>
        </Button>
      </div>
    </div>
  );
}
