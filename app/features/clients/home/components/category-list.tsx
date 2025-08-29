
import React from "react";
import { categories } from "../data/categories";

export default function CategoryList() {

  return (
    <section className="max-w-6xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Danh Mục Sản Phẩm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl overflow-hidden shadow hover:scale-105 transition cursor-pointer">
            <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover" />
            <div className="text-center py-4 text-xl font-semibold">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
