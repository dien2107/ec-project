import { NavLink } from "react-router";
import { useMemo } from "react";
import { formatVND } from "~/libs";

type ProductCard = {
  id: number;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
};

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
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-[#d93333] rounded-md text-white font-semibold text-xs hover:bg-black transition-colors duration-200">
            -{discount}%
          </div>
        )}
      </div>

      <div className="pt-3">
        {/* Tiêu đề sản phẩm */}
        <h3 className="text-sm font-light leading-tight line-clamp-2 mb-1 text-gray-800 group-hover:text-black transition-colors">
          {title}
        </h3>

        {/* Giá */}
        <div className="flex items-center gap-2">
          {discount > 0 && (
            <span className="line-through text-xs text-gray-400">
              {formattedOldPrice}
            </span>
          )}
          <span
            className={`text-sm font-medium ${
              discount > 0 ? "text-[#d93333]" : "text-gray-900"
            }`}
          >
            {formattedPrice}
          </span>
        </div>
      </div>
    </NavLink>
  );
}
