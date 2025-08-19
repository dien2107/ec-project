import { useState } from "react";
import { useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Funnel } from "lucide-react";

import ProductCard from "./components/ProductCard";
import Pagination from "~/components/Pagination";

import type { PriceRange, CategoryFilters } from "./types";

export const fakeProducts = [
  {
    id: 1,
    title: "Áo Thun Cổ Tròn Đơn Giản",
    price: 185000,
    oldPrice: 250000,
    discount: 26,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Áo Hoodie Nỉ Bông",
    price: 320000,
    oldPrice: 420000,
    discount: 24,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Áo Polo Nam Thể Thao",
    price: 210000,
    oldPrice: 300000,
    discount: 30,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Áo Sơ Mi Trắng Form Rộng",
    price: 280000,
    oldPrice: 350000,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Áo Khoác Jean Xanh",
    price: 450000,
    oldPrice: 550000,
    discount: 18,
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Áo Sweater Mùa Đông",
    price: 370000,
    oldPrice: 450000,
    discount: 18,
    image:
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Áo Tank Top Thể Thao",
    price: 150000,
    oldPrice: 200000,
    discount: 25,
    image:
      "https://images.unsplash.com/photo-1542060748-10c28b62716b?w=800&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Áo Len Cổ Lọ",
    price: 340000,
    oldPrice: 400000,
    discount: 15,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop",
  },
  {
    id: 9,
    title: "Áo Thun Graphic",
    price: 220000,
    oldPrice: 300000,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1554568218-0f1715e72254?w=800&auto=format&fit=crop",
  },
  {
    id: 10,
    title: "Áo Khoác Phao Nam",
    price: 650000,
    oldPrice: 800000,
    discount: 19,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
  },
  {
    id: 11,
    title: "Áo Hoodie Oversize",
    price: 330000,
    oldPrice: 420000,
    discount: 21,
    image:
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop",
  },
  {
    id: 12,
    title: "Áo Vest Nam Công Sở",
    price: 750000,
    oldPrice: 950000,
    discount: 21,
    image:
      "https://images.unsplash.com/photo-1520975918319-8a4d3d720b81?w=800&auto=format&fit=crop",
  },
  {
    id: 13,
    title: "Áo Sơ Mi Kẻ Caro",
    price: 260000,
    oldPrice: 350000,
    discount: 26,
    image:
      "https://images.unsplash.com/photo-1520974735194-6c79bc01a5e9?w=800&auto=format&fit=crop",
  },
  {
    id: 14,
    title: "Áo Khoác Bomber",
    price: 480000,
    oldPrice: 600000,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop",
  },
  {
    id: 15,
    title: "Áo Hoodie Trơn",
    price: 300000,
    oldPrice: 380000,
    discount: 21,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
  },
  {
    id: 16,
    title: "Áo Thun Basic",
    price: 180000,
    oldPrice: 230000,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop",
  },
  {
    id: 17,
    title: "Áo Gile Len",
    price: 250000,
    oldPrice: 320000,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
  },
  {
    id: 18,
    title: "Áo Khoác Dù",
    price: 400000,
    oldPrice: 500000,
    discount: 20,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
  },
  {
    id: 19,
    title: "Áo Thun Tay Dài",
    price: 210000,
    oldPrice: 270000,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop",
  },
  {
    id: 20,
    title: "Áo Khoác Cardigan",
    price: 350000,
    oldPrice: 450000,
    discount: 22,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop",
  },
];

export default function Categories() {
  const [filters, setFilters] = useState<CategoryFilters>({
    price: null,
    size: null,
    color: null,
  });

  const [hideFilter, setHideFilter] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const productsPerPage = 12;
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(fakeProducts.length / productsPerPage);

  const priceRanges = [
    { label: "Dưới 200.000₫", min: 0, max: 200000 },
    { label: "200.000₫ - 400.000₫", min: 200000, max: 400000 },
    { label: "Trên 400.000₫", min: 400000, max: Infinity },
  ];

  const sizes = ["S", "M", "L", "XL"];

  const colors = [
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border-gray-200 border-2" },
    { name: "Blue", class: "bg-blue-500" },
    { name: "Red", class: "bg-red-500" },
  ];

  const handlePriceChange = (range: PriceRange | null) => {
    setFilters((prev) => ({
      ...prev,
      price: range,
    }));
  };

  const handleSizeChange = (size: string | null) => {
    setFilters((prev) => ({
      ...prev,
      size: size,
    }));
  };

  const handleColorChange = (color: string | null) => {
    setFilters((prev) => ({
      ...prev,
      color: color,
    }));
  };

  const handleChangePage = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", page.toString());
      return prev;
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto p-6 ">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h1 className="font-bold text-2xl">Áo</h1>
        <Button
          variant="outline"
          className="cursor-pointer py-2 px-4 h-10 w-20"
          onClick={() => setHideFilter((prev) => !prev)}
        >
          <Funnel />
          <span className="text-sm">Lọc</span>
        </Button>
      </div>
      <div className="grid grid-cols-12 mt-4 h-[100vh]">
        {/* LEFT SIDE: Filters */}
        <div
          className={`${hideFilter ? "hidden" : ""} col-span-3 py-6 pr-6 flex flex-col gap-6`}
        >
          {/* Price */}
          <div>
            <h3 className="font-medium mb-3">Giá</h3>
            <div className="flex flex-col gap-2">
              {priceRanges.map((range, idx) => (
                <div key={idx}>
                  <Checkbox
                    id={`price-${idx}`}
                    className="mr-2 border-black cursor-pointer"
                    onClick={() => handlePriceChange(range)}
                  />
                  <label htmlFor={`price-${idx}`} className="cursor-pointer">
                    {range.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="font-medium mb-3">Kích thước</h3>
            <div className="flex gap-2 flex-wrap">
              {sizes.map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  className="cursor-pointer h-8 text-sm font-medium"
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <h3 className="font-medium mb-3">Màu sắc</h3>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-6 rounded-full ${color.class} cursor-pointer`}
                  title={color.name}
                  onClick={() => handleColorChange(color.name)}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Products */}
        <div className={`col-span-${hideFilter ? 12 : 9} mt-4 `}>
          <div className="grid grid-cols-4 gap-x-4 gap-y-8">
            {fakeProducts
              .slice(
                (currentPage - 1) * productsPerPage,
                currentPage * productsPerPage
              )
              .map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  discount={product.discount}
                  image={product.image}
                />
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handleChangePage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
