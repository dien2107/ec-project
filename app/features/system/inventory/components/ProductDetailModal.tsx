import React from "react";
import { X, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type { Product } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStock: (product: Product) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  open,
  onOpenChange,
  onUpdateStock,
}) => {
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stockPercentage = (product.currentStock / product.maxStock) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Chi tiết sản phẩm {product.id}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tên sản phẩm
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {product.name}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Thương hiệu
              </label>
              <p className="text-gray-900">{product.brand}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Danh mục
              </label>
              <p className="text-gray-900">{product.category}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Đơn giá
              </label>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(product.unitPrice)}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tồn kho hiện tại
              </label>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {product.currentStock} / {product.maxStock}
                  </span>
                  <span>{stockPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      stockPercentage > 50
                        ? "bg-green-500"
                        : stockPercentage > 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Tổng giá trị tồn kho
              </label>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(product.totalValue)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 block mb-1">
                Cập nhật lần cuối
              </label>
              <p className="text-gray-900">{product.lastUpdated}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={() => onUpdateStock(product)} className="gap-2">
            <Edit className="w-4 h-4" />
            Cập nhật kho
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default ProductDetailModal;
