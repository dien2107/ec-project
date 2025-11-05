import React, { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  selectedCount: number;
  discountError?: string;
  appliedDiscount?: any;
  discountCode: string;
  onDiscountChange: (code: string) => void;
  onApplyDiscount: () => void;
  onCheckout: () => void;
  hasOutOfStockItems?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  shippingFee,
  total,
  selectedCount,
  discountError,
  appliedDiscount,
  discountCode,
  onDiscountChange,
  onApplyDiscount,
  onCheckout,
  hasOutOfStockItems = false,
}) => {
  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + "₫";

  const formatted = useMemo(
    () => ({
      subtotal: formatPrice(subtotal),
      discount: formatPrice(discount),
      shippingFee: shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee),
      total: formatPrice(total),
    }),
    [subtotal, discount, shippingFee, total]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border sticky top-4">
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h2>

        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Mã giảm giá"
            value={discountCode}
            onChange={e => onDiscountChange(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            className="px-4 bg-gray-800 text-white hover:bg-gray-700"
            onClick={onApplyDiscount}
          >
            Áp dụng
          </Button>
        </div>

        <div className="space-y-3 py-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatted.subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>Giảm giá (10%)</span>
              <span>-{formatted.discount}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-red-500">{formatted.total}</span>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-3"
          disabled={selectedCount === 0 || hasOutOfStockItems}
          onClick={onCheckout}
        >
          Đến trang thanh toán
        </Button>

        {hasOutOfStockItems && (
          <p className="text-xs text-red-500 text-center mt-2">
            Một số sản phẩm đã hết hàng hoặc không đủ số lượng
          </p>
        )}

        {selectedCount > 0 && !hasOutOfStockItems && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Đã chọn {selectedCount} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
