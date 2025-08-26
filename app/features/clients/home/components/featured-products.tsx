import React from "react";
import { fakeProducts } from "../data/products";

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + "₫";
}

export default function FeaturedProducts() {
  return (
    <section className="max-w-6xl mx-auto py-12">
      <h2 className="text-2xl font-bold mb-8">Sản Phẩm Nổi Bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {fakeProducts.slice(0, 4).map((p) => (
          <div key={p.id} className="rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer">
            <img src={p.image} alt={p.title} className="w-full h-56 object-cover" />
            <div className="p-4">
              <div className="font-semibold">{p.title}</div>
              <div className={p.oldPrice ? "text-red-500 font-bold" : "text-black font-bold"}>
                {formatPrice(p.price)}
                {p.oldPrice && <span className="line-through text-gray-400 text-sm ml-2">{formatPrice(p.oldPrice)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
