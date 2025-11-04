import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
} from "~/redux/slices/cartSlice";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import OrderSummary from "./components/order-summary";
import type { CartItemData } from "./types";
import { fetchDiscountListData } from "~/redux/slices/discount";

export default function ShoppingCart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux states
  const { user } = useAppSelector(state => state.auth);
  const cartItems = useAppSelector(state => state.cart.items);
  const isLoading = useAppSelector(state => state.cart.isLoading);
  const { discountList, isLoading: isDiscountLoading } = useAppSelector(
    (state: RootState) => state.discountList
  );
  // Local UI state
  const [localItems, setLocalItems] = useState<CartItemData[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<ReturnType<
    typeof findDiscountByCode
  > | null>(null);
  const [discountError, setDiscountError] = useState("");

  // Khi user đăng nhập -> tải giỏ hàng
  useEffect(() => {
    if (user?.data?.userId) {
      dispatch(fetchCart(user.data.userId));
    }
  }, [user, dispatch]);
  useEffect(() => {
    dispatch(
      fetchDiscountListData({
        StatusName: "Active",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log(discountList);
  }, [discountList]);

  // Đồng bộ Redux → local state (để quản lý chọn/bỏ chọn)
  useEffect(() => {
    setLocalItems(prev => {
      const prevMap = new Map(prev.map(p => [p.id, p.selected]));

      return cartItems.map(ci => {
        const id = String(ci.productVariantId);
        return {
          id,
          variantId: ci.productVariantId,
          name: ci.productName,
          image: ci.productImageUrl,
          size: ci.size,
          color: ci.color,
          price: ci.price,
          quantity: ci.quantity,
          selected: prevMap.has(id) ? (prevMap.get(id) as boolean) : true,
        } as CartItemData;
      });
    });
  }, [cartItems]);
  const findDiscountByCode = (code: string) => {
    if (!discountList?.data) return null;
    return discountList.data.items
      .flat()
      .find(d => d.code.toLowerCase() === code.trim().toLowerCase());
  };
  // Tính toán tổng giá trị
  const selectedItems = useMemo(
    () => localItems.filter(i => i.selected),
    [localItems]
  );
  const selectedCount = selectedItems.length;
  const isAllSelected =
    localItems.length > 0 && selectedItems.length === localItems.length;

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [selectedItems]
  );

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;

    if (appliedDiscount.discountType === "fixed") {
      return Math.min(
        appliedDiscount.discountValue,
        appliedDiscount.maxDiscountAmount
      );
    }
    if (appliedDiscount.discountType === "percentage") {
      const amount = (subtotal * appliedDiscount.discountValue) / 100;
      return Math.min(amount, appliedDiscount.maxDiscountAmount);
    }

    return 0;
  }, [appliedDiscount, subtotal]);

  const total = subtotal - discountAmount;
  const shippingFee = 0;

  // Áp dụng mã giảm giá
  const handleApplyDiscount = () => {
    const discount = findDiscountByCode(discountCode);
    if (!discount) {
      setAppliedDiscount(null);
      setDiscountError("Mã giảm giá không hợp lệ");
      toast.error("Mã giảm giá không hợp lệ");
      return;
    }

    if (subtotal < discount.minOrderAmount) {
      setAppliedDiscount(null);
      setDiscountError(
        `Đơn hàng tối thiểu ${discount.minOrderAmount.toLocaleString()}₫`
      );
      toast.error(
        `Đơn hàng phải từ ${discount.minOrderAmount.toLocaleString()}₫`
      );
      return;
    }

    setAppliedDiscount(discount);
    setDiscountError("");
    toast.success(`Áp dụng mã ${discount.code} thành công 🎉`);
  };

  // Chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    setLocalItems(prev => prev.map(i => ({ ...i, selected: checked })));
  };

  // Chọn từng item
  const handleSelectItem = (id: string, checked: boolean) => {
    setLocalItems(prev =>
      prev.map(i => (i.id === id ? { ...i, selected: checked } : i))
    );
  };

  // Cập nhật số lượng
  const handleQuantityChange = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = localItems.find(i => i.id === id);
    if (!item || !user?.data?.userId) return;

    setLocalItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity: newQuantity } : i))
    );

    await dispatch(
      updateCartItem({
        userId: user.data.userId,
        variantId: item.variantId,
        quantity: newQuantity,
        price: item.price,
      })
    );

    // Refresh lại giỏ hàng sau khi cập nhật
    dispatch(fetchCart(user.data.userId));
  };

  // Xóa 1 sản phẩm
  const handleRemoveItem = async (id: string) => {
    const item = localItems.find(i => i.id === id);
    if (!item || !user?.data?.userId) return;

    await dispatch(
      deleteCartItem({
        userId: user.data.userId,
        variantId: item.variantId,
      })
    );

    // Cập nhật lại local
    setLocalItems(prev => prev.filter(i => i.id !== id));
  };

  // Xóa tất cả item đã chọn
  const handleClearSelected = async () => {
    if (!user?.data?.userId) return;

    for (const i of selectedItems) {
      await dispatch(
        deleteCartItem({
          userId: user.data.userId,
          variantId: i.variantId,
        })
      );
    }

    setLocalItems(prev => prev.filter(i => !i.selected));
    dispatch(fetchCart(user.data.userId));
  };

  // Thanh toán
  const handleCheckout = () => {
    navigate("/payments", { state: { appliedDiscount, selectedItems } });
    // console.log(`appliedDiscount: ${appliedDiscount}`);
    // console.log(`selectedItems: ${JSON.stringify(selectedItems)}`);
  };

  // Hiển thị khi đang tải
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  // Giao diện chính
  return (
    <div className="max-w-[1280px] mx-auto p-4 md:p-6 mt-10 mb-20">
      <h1 className="text-xl font-bold mb-6">Giỏ hàng</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <CartHeader
              itemsCount={localItems.length}
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
