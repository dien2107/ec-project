import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

import { SquarePen, Trash } from "lucide-react";
import type { ProductVariant } from "../types";

export default function ProductVariant({
  variant,
}: {
  variant: ProductVariant;
}) {
  return (
    <div className="col-span-1">
      <Card className="gap-0 p-3 ">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className='h-4 w-4 border border-gray-200 rounded-full'
                style={{ backgroundColor: variant.code_hex }}
              ></div>
              <span className="font-medium text-sm">{variant.color_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" className="w-6 h-6">
                <SquarePen />
              </Button>
              <Button variant="ghost" className="w-6 h-6">
                <Trash stroke="red" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="text-xs space-y-1">
            <div>
              Size: <span className="font-medium">{variant.size_name}</span>
            </div>
            <div>
              Tồn kho:{" "}
              <span className="font-medium text-green-600">
                {variant.stock_quantity}
              </span>
            </div>
            <div className="text-gray-400">
              ID: {variant.product_variant_id}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
