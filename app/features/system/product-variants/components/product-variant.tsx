import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

import { SquarePen, Trash } from "lucide-react";
import type { ProductVariant } from "~/types/product/product-variant";

export default function ProductVariant({
  variant,
  onEdit,
  onDelete,
}: {
  variant: ProductVariant;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="col-span-1">
      <Card className="gap-0 p-3 ">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-xs px-2 py-1 rounded ${
                  variant.status.name === "Active"
                    ? "bg-green-100 text-green-700"
                    : variant.status.name === "Inactive"
                      ? "bg-red-100 text-red-700"
                      : variant.status.name === "Draft"
                        ? "bg-yellow-100 text-yellow-700"
                        : variant.status.name === "OutOfStock"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gray-100 text-gray-500"
                }`}
              >
                {variant.status.displayName}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <Button variant="ghost" className="w-6 h-6" onClick={onEdit}>
                  <SquarePen />
                </Button>
                {variant.status.name === "Draft" && (
                  <Button
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={onDelete}
                  >
                    <Trash stroke="red" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-xs space-y-1">
            <div>
              Size: <span className="font-medium">{variant.size.name}</span>
            </div>
            <div>
              Tồn kho:{" "}
              <span className="font-medium text-green-600">
                {variant.stockQuantity}
              </span>
            </div>
            <div className="text-gray-400 flex justify-between">
              <span>ID: {variant.productVariantId}</span>
              <span>SKU: {variant.sku}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
