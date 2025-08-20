import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function CartSummary({
  subtotal,
  shippingFee,
  total,
  onPlaceOrder,
  disabled,
}: {
  subtotal: number;
  shippingFee: number;
  total: number;
  onPlaceOrder: () => void;
  disabled: boolean;
}) {
  return (
    <div className="border rounded-md p-6 sticky top-6">
      <h2 className="font-bold text-lg mb-4">Tóm tắt đơn hàng</h2>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span>{subtotal.toLocaleString()}₫</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}₫`}
          </span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-bold mb-6">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}₫</span>
      </div>
      <Button
        className="w-full bg-black text-white py-2 rounded"
        disabled={disabled}
        onClick={onPlaceOrder}
      >
        {disabled ? "Đang xử lý..." : "Đặt hàng"}
      </Button>
    </div>
  );
}
