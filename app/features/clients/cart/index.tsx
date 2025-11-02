import {
  addToCart,
  removeFromCart,
  updateQuantity,
} from "~/redux/slices/cartSliceold";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import OrderSummary from "./components/order-summary";
import { useEffect, useMemo, useState } from "react";
import type { CartItemData } from "./types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { useNavigate } from "react-router";
import { fakeDiscounts } from "./types/fakeDiscountData";
import { toast } from "react-hot-toast";

export const getDiscountByCode = (code: string) => {
  return fakeDiscounts.find(
    d => d.code.toLowerCase() === code.trim().toLowerCase()
  );
};

// Main ShoppingCart Component - DÙNG REDUX
export default function ShoppingCart() {
  // redux
  const cartItems = useAppSelector(state => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [localItems, setLocalItems] = useState<CartItemData[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<null | ReturnType<
    typeof getDiscountByCode
  >>(null);
  const [discountError, setDiscountError] = useState("");

  const handleApplyDiscount = () => {
    const discount = getDiscountByCode(discountCode);

    if (!discount) {
      setAppliedDiscount(null);
      setDiscountError("Mã giảm giá không hợp lệ");
      toast.error("Mã giảm giá không hợp lệ");
      return;
    }

    if (subtotal < discount.min_order_amount) {
      setAppliedDiscount(null);
      setDiscountError(
        `Đơn hàng tối thiểu ${discount.min_order_amount.toLocaleString()}₫`
      );
      toast.error(
        `Đơn hàng phải từ ${discount.min_order_amount.toLocaleString()}₫`
      );
      return;
    }

    // Nếu hợp lệ
    setDiscountError("");
    setAppliedDiscount(discount);
    toast.success(`Áp dụng mã ${discount.code} thành công 🎉`);
  };
  // Sync Redux -> Local state
  useEffect(() => {
    setLocalItems(prev => {
      const prevMap = new Map(prev.map(p => [p.id, p.selected]));

      return cartItems.map(ci => {
        const variant = ci.ProductVariant;
        const variantId = Number(
          variant.productVariantId ?? (variant as any).id
        );
        const id = String(variantId);

        return {
          id,
          variantId,
          name: (variant as any).sku ?? (ci as any).name ?? "Sản phẩm",
          image: String(ci?.image?.imageUrl ?? ci?.image ?? ""),
          size: (variant as any).size?.name ?? "",
          color: (variant as any).color?.name ?? "",
          price: ci.price || 0,
          quantity: ci.quantity || 1,
          selected: prevMap.has(id) ? (prevMap.get(id) as boolean) : true,
        } as CartItemData;
      });
    });
  }, [dispatch, cartItems]);

  const selectedItems = useMemo(
    () => localItems.filter(item => item.selected),
    [localItems]
  );
  const selectedCount = selectedItems.length;
  const isAllSelected =
    localItems.length > 0 && selectedItems.length === localItems.length;

  // total quantity across all cart line items (used for header display)
  const itemsCount = useMemo(
    () => localItems.reduce((sum, it) => sum + (it.quantity || 0), 0),
    [localItems]
  );

  const subtotal = useMemo(() => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [selectedItems]);

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;

    if (appliedDiscount.discount_type === "fixed") {
      return Math.min(
        appliedDiscount.discount_value,
        appliedDiscount.max_discount_amount
      );
    }

    if (appliedDiscount.discount_type === "percentage") {
      const amount = (subtotal * appliedDiscount.discount_value) / 100;
      return Math.min(amount, appliedDiscount.max_discount_amount);
    }

    return 0;
  }, [appliedDiscount, subtotal]);
  const shippingFee = 0;
  const total = subtotal - discountAmount + shippingFee;

  const handleSelectAll = (checked: boolean) => {
    setLocalItems(prev => prev.map(item => ({ ...item, selected: checked })));
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    setLocalItems(prev =>
      prev.map(item => (item.id === id ? { ...item, selected: checked } : item))
    );
  };

  // FIX: Logic tăng giảm số lượng đơn giản hơn
  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = localItems.find(i => i.id === id);
    if (!item) return;

    // Cập nhật local
    setLocalItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );

    // Cập nhật Redux
    dispatch(
      updateQuantity({
        variantId: Number(item.variantId),
        quantity: newQuantity,
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    const item = localItems.find(i => i.id === id);
    if (item) {
      dispatch(removeFromCart(item.variantId));
      setLocalItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleClearSelected = () => {
    selectedItems.forEach(item => {
      dispatch(removeFromCart(item.variantId));
    });
    setLocalItems(prev => prev.filter(item => !item.selected));
  };

  const handleCheckout = () => {
    // Navigate to payment page
    navigate("/payments", { state: { appliedDiscount } });
  };

  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-6 mt-10 mb-20">
      <h1 className="text-xl font-bold mb-6">Giỏ hàng</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <CartHeader
              itemsCount={itemsCount}
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              onClearSelected={handleClearSelected}
              selectedCount={selectedCount}
            />

            <div className="divide-y">
              {localItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onSelect={handleSelectItem}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}

              {localItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <div className="text-6xl mb-4">🛒</div>
                  <p>Giỏ hàng của bạn đang trống</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80">
          <OrderSummary
            subtotal={subtotal}
            discount={discountAmount}
            shippingFee={shippingFee}
            total={total}
            selectedCount={selectedCount}
            onApplyDiscount={handleApplyDiscount}
            appliedDiscount={appliedDiscount}
            discountError={discountError}
            discountCode={discountCode}
            onDiscountChange={setDiscountCode}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
