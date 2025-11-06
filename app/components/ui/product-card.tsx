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
  outOfStock?: boolean;
};

export default function ProductCard({
  id,
  title,
  slug,
  price,
  oldPrice,
  discount,
  image,
  outOfStock,
}: ProductCard) {
  const formattedPrice = useMemo(() => formatVND(price), [price]);
  const formattedOldPrice = useMemo(() => formatVND(oldPrice), [oldPrice]);

  return (
    <NavLink
      to={`/products/${slug}`}
      className="block relative overflow-hidden rounded-md group hover:no-underline"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`object-cover w-full h-full transition-transform duration-300 ease-in-out ${
            outOfStock ? "filter grayscale opacity-70" : "group-hover:scale-110"
          }`}
          loading="lazy"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-[#d93333] rounded-md text-white font-semibold text-xs hover:bg-black transition-colors duration-200">
            -{discount}%
          </div>
        )}

        {/* Out of stock overlay (UI only) */}
        {outOfStock && (
          <>
            {/* subtle dim layer over image */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            {/* centered red badge */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <span className="inline-block bg-red-600 text-white text-sm sm:text-base font-semibold px-4 py-2 rounded-md shadow-lg">
                HẾT HÀNG
              </span>
            </div>
          </>
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
