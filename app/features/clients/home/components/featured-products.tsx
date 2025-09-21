import React from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
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
          <Card key={p.id} className="overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer group">
            <div className="relative">
              <img src={p.image} alt={p.title} className="w-full h-56 object-cover group-hover:opacity-90 transition-opacity" />
              {p.oldPrice && (
                <Badge variant="destructive" className="absolute top-2 right-2">
                  Sale
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{p.title}</h3>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${p.oldPrice ? "text-red-500" : "text-gray-900"}`}>
                  {formatPrice(p.price)}
                </span>
                {p.oldPrice && (
                  <span className="line-through text-gray-400 text-sm">
                    {formatPrice(p.oldPrice)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
