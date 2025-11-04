import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Truck, CreditCard, Receipt, Info } from "lucide-react";
import type { Ship } from "~/types/ship";

export default function CartSummary({
  subtotal,
  shippingFee,
  total,
  discount = 0,
  onPlaceOrder,
  disabled,
  ship,
}: {
  subtotal: number;
  shippingFee: number;
  total: number;
  discount?: number;
  onPlaceOrder: () => void;
  disabled: boolean;
  ship: Ship | null;
}) {
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm sticky top-6 transition-all duration-300 hover:shadow-md">
      <h2 className="font-semibold text-xl mb-5 text-gray-800">
        Tóm tắt đơn hàng
      </h2>

      {/* Tổng quan giá */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Receipt size={16} />
            Tạm tính
          </span>
          <span className="font-medium text-gray-900">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Truck size={16} />
            Phí vận chuyển
          </span>
          <span
            className={`font-medium ${
              shippingFee === 0 ? "text-green-600" : "text-gray-900"
            }`}
          >
            {shippingFee === 0
              ? "Miễn phí"
              : `${shippingFee.toLocaleString("vi-VN")}₫`}
          </span>
        </div>
      </div>

      {/* Thông tin dịch vụ giao hàng */}
      {ship && (
        <div className="mt-4 bg-gray-50 border rounded-lg p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-800">{ship.corpName}</p>
              <p className="text-xs text-gray-500 mt-1">{ship.description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Dự kiến giao trong{" "}
                <span className="font-medium text-gray-700">
                  {ship.estimatedDays} ngày
                </span>
              </p>
            </div>
            <Info size={16} className="text-gray-400" />
          </div>
        </div>
      )}

      <Separator className="my-5" />

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <span className="">Tạm tính</span>
          <span className="font-medium text-gray-900">
            {subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-red-600">
            <span className="">Giảm giá</span>
            <span className="font-medium">
              -{discount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="">Phí vận chuyển</span>
          <span
            className={`font-medium ${
              shippingFee === 0 ? "text-green-600" : "text-gray-900"
            }`}
          >
            {shippingFee === 0
              ? "Miễn phí"
              : `${shippingFee.toLocaleString("vi-VN")}₫`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 mt-4">
        <span className="text-lg font-semibold text-gray-700">Tổng cộng</span>
        <span className="text-2xl font-bold text-red-600">
          {total.toLocaleString("vi-VN")}₫
        </span>
      </div>

      <Button
        className="w-full py-3 text-base font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
        disabled={disabled}
        onClick={onPlaceOrder}
      >
        {disabled ? (
          <span className="flex items-center justify-center gap-2">
            <CreditCard className="animate-spin" size={16} />
            Đang xử lý...
          </span>
        ) : (
          "Đặt hàng"
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center mt-3">
        Bằng cách đặt hàng, bạn đồng ý với điều khoản mua hàng của chúng tôi.
      </p>
    </div>
  );
}
