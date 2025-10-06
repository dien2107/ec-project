import { useState, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import CartItem from "./components/cart-item";
import type { CartItemData } from "./types";
import { initialCartItems } from "./data";

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState<CartItemData[]>(initialCartItems);
  const [discountCode, setDiscountCode] = useState("");

  const selectedItems = cartItems.filter(item => item.selected);
  const selectedCount = selectedItems.length;
  const isAllSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length;

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const discount = subtotal * 0.1; // 10% discount
  const shippingFee = 0; // Free shipping
  const total = subtotal - discount + shippingFee;

  const handleSelectAll = (checked: boolean) => {
    setCartItems(items => items.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleClearSelected = () => {
    setCartItems(items => items.filter(item => !item.selected));
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-6 mt-10 mb-20">
      <h1 className="text-xl font-bold mb-6">Giỏ hàng</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart Items Section */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    className="border-gray-400"
                  />
                  <span className="text-sm">
                    Chọn tất cả ({cartItems.length})
                  </span>
                </div>

                {/* Nút xóa được đẩy sang phải */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={handleClearSelected}
                  disabled={selectedCount === 0}
                >
                  Xóa
                </Button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="divide-y">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onSelectItem={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={handleRemoveItem}
                />
              ))}

              {cartItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-6xl mb-4">🛒</div>
                  <p>Giỏ hàng của bạn đang trống</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border sticky top-4">
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h2>

              {/* Discount Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Mã giảm giá"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    className="px-4 bg-gray-800 text-white hover:bg-gray-700"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 py-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-red-500">
                    <span>Giảm giá (10%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-500">
                    {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-red-500">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-3"
                disabled={selectedCount === 0}
              >
                Đến trang thanh toán
              </Button>

              {selectedCount > 0 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Đã chọn {selectedCount} sản phẩm
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
