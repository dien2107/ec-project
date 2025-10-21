import { NavLink } from "react-router";
import { useMemo } from "react";

type ProductCard = {
  id: number;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
};

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function ProductCard({
  id,
  title,
  slug,
  price,
  oldPrice,
  discount,
  image,
}: ProductCard) {
  const formattedPrice = useMemo(() => formatVND(price), [price]);
  const formattedOldPrice = useMemo(() => formatVND(oldPrice), [oldPrice]);

  return (
    <NavLink
      to={`/products/${slug}`}
      className="block relative overflow-hidden rounded-md group"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        {discount && (
          <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-[#d93333] rounded-md text-white font-semibold text-xs hover:bg-black transition-colors duration-200">
            -{discount}%
          </div>
        )}
      </div>

      <div className="pt-3">
        <h3 className="text-[16px] font-medium leading-tight line-clamp-2 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {discount && (
            <span className="line-through text-xs text-gray-500">
              {formattedOldPrice}
            </span>
          )}
          <span className="text-sm font-semibold">{formattedPrice}</span>
        </div>
      </div>
    </NavLink>
  );
}
