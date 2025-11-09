import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import { useQueries } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector, type RootState } from "~/redux/store";
import {
  fetchCart,
  updateCartItem,
  deleteCartItem,
} from "~/redux/slices/cartSlice";
import CartHeader from "./components/cart-header";
import CartItem from "./components/cart-item";
import OrderSummary from "./components/order-summary";
import type { CartItemData, AvailableVariant } from "./types";
import { fetchDiscountListData } from "~/redux/slices/discount";
import { getProductDetailBySlug } from "~/services/products";
import type { ProductVariant } from "~/types/product/product-variant";

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
        PageSize: 100,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    console.log(discountList);
  }, [discountList]);

  // Fetch product variants for each cart item using React Query
  // const productQueries = useQueries({
  //   queries: cartItems
  //     .filter(item => item.slug) // Only fetch for items with slug
  //     .map(item => ({
  //       queryKey: ["product", item.slug],
  //       queryFn: () => getProductDetailBySlug(item.slug!),
  //       enabled: !!item.slug,
  //       staleTime: 5 * 60 * 1000, // 5 minutes
  //     })),
  // });
  const queries = useMemo(
    () =>
      cartItems
        .filter(item => !!item.slug)
        .map(item => ({
          queryKey: ["product", item.slug],
          queryFn: () => getProductDetailBySlug(item.slug!),
          enabled: !!item.slug,
          staleTime: 5 * 60 * 1000,
        })),
    [cartItems]
  );

  // ✅ useQueries sẽ rerun mỗi khi queries thay đổi
  const productQueries = useQueries({ queries });
  // Process fetched product data to extract variants using useMemo
  const productVariants = useMemo(() => {
    const variantsMap = new Map<number, AvailableVariant[]>();

    const cartItemsWithSlug = cartItems.filter(item => item.slug);

    cartItemsWithSlug.forEach((cartItem, index) => {
      const queryResult = productQueries[index];
      if (queryResult?.data?.data && queryResult.isSuccess) {
        const product = queryResult.data.data;
        const currentColor = cartItem.color;

        const sameColorVariants = product.productVariants
          .filter(
            (v: ProductVariant) =>
              v.color.name === currentColor && v.status.name === "Active"
          )
          .map((v: ProductVariant) => {
            console.log(v);
            return {
              productVariantId: v.productVariantId,
              sizeId: v.size.sizeId,
              sizeName: v.size.name,
              stockQuantity: v.stockQuantity,
            };
          });
        console.log(
          `sameColorVariants for variantId ${cartItem.productVariantId}:`,
          sameColorVariants
        );
        variantsMap.set(cartItem.productVariantId, sameColorVariants);
      }
    });
    console.log(variantsMap);
    return variantsMap;
  }, [cartItems, ...productQueries.map(q => q.data)]);

  // Extract product pricing info from queries
  const productPricingMap = useMemo(() => {
    const pricingMap = new Map<
      number,
      { basePrice: number; discountPercentage: number; sellingPrice: number }
    >();

    const cartItemsWithSlug = cartItems.filter(item => item.slug);

    cartItemsWithSlug.forEach((cartItem, index) => {
      const queryResult = productQueries[index];
      if (queryResult?.data?.data && queryResult.isSuccess) {
        const product = queryResult.data.data;
        pricingMap.set(cartItem.productVariantId, {
          basePrice: product.basePrice,
          discountPercentage: product.discountPercentage,
          sellingPrice: product.sellingPrice,
        });
      }
    });

    return pricingMap;
  }, [cartItems, ...productQueries.map(q => q.data)]);

  // Đồng bộ Redux → local state (để quản lý chọn/bỏ chọn)
  useEffect(() => {
    setLocalItems(prev => {
      const prevMap = new Map(prev.map(p => [p.id, p.selected]));

      return cartItems.map(ci => {
        const id = String(ci.productVariantId);
        const variants = productVariants.get(ci.productVariantId) || [];
        const pricing = productPricingMap.get(ci.productVariantId);

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
          availableVariants: variants,
          slug: ci.slug,
          productId: ci.productId,
          basePrice: pricing?.basePrice,
          discountPercentage: pricing?.discountPercentage,
          sellingPrice: pricing?.sellingPrice,
        } as CartItemData;
      });
    });
  }, [cartItems, productVariants, productPricingMap]);
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

  // Kiểm tra sản phẩm hết hàng hoặc số lượng không đủ
  const hasOutOfStockItems = useMemo(() => {
    return selectedItems.some(item => {
      const variants = productVariants.get(item.variantId);
      if (!variants || variants.length === 0) return false;

      const currentVariant = variants.find(
        v => v.productVariantId === item.variantId
      );
      if (!currentVariant) return false;

      // Kiểm tra hết hàng hoặc số lượng không đủ
      return (
        currentVariant.stockQuantity === 0 ||
        currentVariant.stockQuantity < item.quantity
      );
    });
  }, [selectedItems, productVariants]);

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

    // Kiểm tra thời gian bắt đầu
    const now = new Date();
    if (discount.startAt) {
      const startDate = new Date(discount.startAt);
      if (now < startDate) {
        setAppliedDiscount(null);
        setDiscountError(
          `Mã giảm giá chưa có hiệu lực. Bắt đầu từ ${startDate.toLocaleDateString("vi-VN")}`
        );
        toast.error("Mã giảm giá chưa có hiệu lực");
        return;
      }
    }

    // Kiểm tra thời gian kết thúc
    if (discount.endAt) {
      const endDate = new Date(discount.endAt);
      if (now > endDate) {
        setAppliedDiscount(null);
        setDiscountError("Mã giảm giá đã hết hạn");
        toast.error("Mã giảm giá đã hết hạn");
        return;
      }
    }

    // Kiểm tra số lượt sử dụng
    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      setAppliedDiscount(null);
      setDiscountError("Mã giảm giá đã hết lượt sử dụng");
      toast.error("Mã giảm giá đã hết lượt sử dụng");
      return;
    }

    // Kiểm tra giá trị đơn hàng tối thiểu
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
        slug: item.slug,
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

  // Thay đổi size (variant)
  const handleSizeChange = async (id: string, newVariantId: number) => {
    const item = localItems.find(i => i.id === id);
    if (!item || !user?.data?.userId) return;

    try {
      // Xóa item cũ
      await dispatch(
        deleteCartItem({
          userId: user.data.userId,
          variantId: item.variantId,
        })
      );

      // Thêm item mới với variant mới
      await dispatch(
        updateCartItem({
          userId: user.data.userId,
          variantId: newVariantId,
          quantity: item.quantity,
          price: item.price,
          slug: item.slug,
        })
      );

      // Refresh lại giỏ hàng
      dispatch(fetchCart(user.data.userId));
    } catch (error) {
      toast.error("Không thể thay đổi kích thước");
    }
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
    if (hasOutOfStockItems) {
      toast.error(
        "Một số sản phẩm đã hết hàng hoặc số lượng không đủ. Vui lòng kiểm tra lại giỏ hàng!"
      );
      return;
    }

    if (selectedCount === 0) {
      toast.error("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    navigate("/payments", { state: { appliedDiscount, selectedItems } });
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
                  onSizeChange={handleSizeChange}
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
            hasOutOfStockItems={hasOutOfStockItems}
          />
        </div>
      </div>
    </div>
  );
}
