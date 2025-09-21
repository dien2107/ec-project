
import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { categories } from "../data/categories";

export default function CategoryList() {

  return (
    <section className="max-w-6xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Danh Mục Sản Phẩm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Card key={cat.id} className="overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer group">
            <div className="relative">
              <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-center text-xl font-semibold text-gray-800">{cat.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
