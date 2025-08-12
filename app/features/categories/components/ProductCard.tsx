import { NavLink } from "react-router";

import type { ProductCard } from "../types";

export default function ProductCard({
  id,
  title,
  price,
  oldPrice,
  discount,
  image,
}: ProductCard) {
  const formatVND = (amount: number) => {
    return Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <NavLink
      to={`/chi-tiet-san-pham/${id}`}
      className="block relative overflow-hidden rounded-md group"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={image}
          alt={`${title}'s Image`}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
        <div className="px-2.5 py-0.5 absolute top-2 right-2 bg-[#d93333] rounded-md text-white font-semibold text-xs hover:bg-black transition-colors duration-200">
          -{discount}%
        </div>
      </div>
      <div className="pt-3">
        <h3 className="text-[16px] font-medium leading-tight line-clamp-2 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatVND(price)}</span>
          <span className="line-through text-xs text-gray-500">
            {formatVND(oldPrice)}
          </span>
        </div>
      </div>
    </NavLink>
  );
}
