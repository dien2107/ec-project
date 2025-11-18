import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import type { Address } from "~/types/address/address";
import AddressSection from "~/features/clients/payment/components/address-section";
import PaymentMethodSection from "~/features/clients/payment/components/payment-method";
import CartSummary from "~/features/clients/payment/components/cart-summary";
import SuccessDialog from "~/features/clients/payment/components/success-dialog";
import { useAppSelector, useAppDispatch } from "~/redux/store";
import { createOrder } from "~/services/order";
import { clearCartAsync } from "~/redux/slices/cartSlice";
import { createPayment, type CreatePaymentPayload } from "~/services/payment";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { fetchShipListData } from "~/redux/slices/ships";
import { fetchStatuses } from "~/redux/slices/statuses";
import type { Ship } from "~/types/ship";
import toast from "react-hot-toast";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank", "cod"]),
});

export default function Payment() {
  const location = useLocation();
  const state = location.state ?? { selectedItems: [], appliedDiscount: null };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Kiểm tra state và redirect nếu không hợp lệ
  useEffect(() => {
    if (
      !state ||
      !("selectedItems" in state) ||
      !Array.isArray(state.selectedItems)
    ) {
      toast.error("Vui lòng chọn sản phẩm từ giỏ hàng!");
      navigate("/cart");
      return;
    }
  }, [state, navigate]);

  //Redux
  const cartItems = useAppSelector(state => state.cart.items);
  const authUser = useAppSelector(state => state.auth.user);
  const userId = authUser?.data?.userId;
  const statuses = useAppSelector(
    state => state.statuses.data?.[ENTITY_TYPE.SHIP] ?? []
  );
  const { shipList } = useAppSelector(state => state.shipList);

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [ship, setShip] = useState<Ship | null>(null);
  const [isShipLoading, setIsShipLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  console.log(state.selectedItems);
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  // Track whether user selected online payment (bank) or direct (cod)
  const paymentMethod = paymentForm.watch("paymentMethod");
  const [isOnlinePayment, setIsOnlinePayment] = useState<boolean>(
    paymentMethod === "bank"
  );

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.SHIP }));
  }, [dispatch]);

  useEffect(() => {
    // Chỉ fetch ship khi đã có statuses
    if (statuses.length > 0) {
      const activeStatus = statuses.find(s => s.name === "Active");
      if (activeStatus) {
        dispatch(
          fetchShipListData({
            statusId: activeStatus.statusId,
            PageSize: 1000,
          })
        );
      }
    }
  }, [dispatch, statuses.length]); // Chỉ phụ thuộc vào length, không phụ thuộc statuses array

  useEffect(() => {
    setIsOnlinePayment(paymentMethod === "bank");
  }, [paymentMethod]);

  useEffect(() => {
    if (shipList?.isSuccess && shipList.data?.items) {
      const items = shipList.data.items.flat();
      if (items.length > 0) {
        setShip(items[0]);
        console.log("Ship loaded:", items[0]);
      } else {
        console.warn("No ship items found");
      }
      setIsShipLoading(false);
    } else if (shipList?.isSuccess === false) {
      console.error("Failed to load ship list");
      setIsShipLoading(false);
    }
  }, [shipList]);

  useEffect(() => {
    if (
      state?.selectedItems &&
      Array.isArray(state.selectedItems) &&
      state.selectedItems.length > 0
    ) {
      setSelectedItems(state.selectedItems.map((item: any) => item.variantId));
    } else {
      setSelectedItems(cartItems.map(item => item.productVariantId));
    }
  }, [state, cartItems]);

  // Tính toán các items được chọn
  const selectedCartItems = useMemo(
    () =>
      cartItems.filter(item => selectedItems.includes(item.productVariantId)),
    [cartItems, selectedItems]
  );

  const subtotal = useMemo(() => {
    return selectedCartItems.reduce((total, item) => {
      // Tìm item data từ state để lấy giá giảm
      const itemData = state?.selectedItems?.find(
        (si: any) => si.variantId === item.productVariantId
      );

      // Sử dụng sellingPrice nếu có discount, nếu không dùng price gốc
      const itemPrice =
        itemData?.discountPercentage && itemData.discountPercentage > 0
          ? itemData.sellingPrice
          : item.price;

      return total + itemPrice * item.quantity;
    }, 0);
  }, [selectedCartItems, state?.selectedItems]);

  // Discount passed from Cart via navigation state
  const appliedDiscount = state?.appliedDiscount ?? null;
  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.discountType === "fixed") {
      return Math.min(
        appliedDiscount.discountValue ?? 0,
        appliedDiscount.maxDiscountAmount ?? Number.POSITIVE_INFINITY
      );
    }
    if (appliedDiscount.discountType === "percentage") {
      const amount = (subtotal * (appliedDiscount.discountValue ?? 0)) / 100;
      return Math.min(amount, appliedDiscount.maxDiscountAmount ?? amount);
    }
    return 0;
  }, [appliedDiscount, subtotal]);

  const shippingFee = useMemo(() => {
    if (!ship) return 0;
    return ship.baseCost ?? 0;
  }, [ship, subtotal]);

  const total = useMemo(
    () => subtotal - discountAmount + shippingFee,
    [subtotal, shippingFee, discountAmount]
  );

  const handleAddAddress = (address: Address) => {
    // add to local addresses list and select it
    setAddresses(prev => [...prev, address]);
    setSelectedAddress(address);
    setSelectedAddressId(address.addressId);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const payload = {
      userId,
      discountId: state?.appliedDiscount
        ? state.appliedDiscount.discountId
        : null,
      shipId: ship ? ship.shipId : null,
      paymentMethod,
      addressInfo: `${selectedAddress.recipientName} - ${selectedAddress.phone} - ${selectedAddress.streetAddress}, ${selectedAddress.province?.name ?? ""}`,
      receivedName: selectedAddress.recipientName,
      phoneNumber: selectedAddress.phone,
      isFreeShip: shippingFee === 0,
      shippingFee,
      items: selectedCartItems.map(i => ({
        productVariantId: Number(i.productVariantId),
        quantity: i.quantity,
      })),
    };

    setIsProcessing(true);

    try {
      // 1️⃣ Tạo đơn hàng trước
      console.log(payload);
      // return;
      const orderResponse = await createOrder(payload);
      console.log(orderResponse);

      if (!orderResponse.isSuccess) {
        toast.error("Không thể tạo đơn hàng!");
        return;
      }

      const orderId = orderResponse.data.orderId;
      toast.success("Tạo đơn hàng thành công!");

      if (isOnlinePayment) {
        const paymentPayload: CreatePaymentPayload = {
          orderId: orderId,
          amount: total,
          description: `ORD${orderId}`,
        };

        const paymentResponse = await createPayment(paymentPayload);

        if (!paymentResponse.isSuccess) {
          toast.error("Không thể tạo đơn thanh toán!");
          return;
        }
        console.log(`${paymentResponse.qrCodeUrl}`);
        navigate("/payment/online", {
          state: {
            paymentInfo: paymentResponse,
            paymentPayload,
          },
        });
        console.log(`paymentPayload: ${paymentPayload}`);
        console.log(`paymentResponse: ${paymentResponse}`);
      } else {
        // 3️⃣ COD (thanh toán khi nhận hàng)
        // Hiển thị dialog trước, xóa cart sau khi user đóng dialog
        setIsSuccessDialogOpen(true);
        // toast.success("Đặt hàng thành công!");
      }

      // 4️⃣ Giỏ hàng đã được xóa ở từng trường hợp riêng
    } catch (err) {
      console.error("Place order failed:", err);
      toast.error("Đặt hàng thất bại!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedCartItems.length === 0) {
    return (
      <div className="main-container py-8">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Không có sản phẩm nào được chọn
          </h2>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại giỏ hàng
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <AddressSection
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
          />

          {/* Cart Items */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Sản phẩm ({selectedCartItems.length})
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4 max-w-[95vw] sm:max-w-full mx-auto">
              {selectedCartItems.map(item => {
                const itemData = state?.selectedItems?.find(
                  (si: any) => si.variantId === item.productVariantId
                );
                const hasDiscount =
                  itemData?.discountPercentage &&
                  itemData.discountPercentage > 0;
                const displayPrice = hasDiscount
                  ? itemData.sellingPrice
                  : item.price;

                return (
                  <div
                    key={String(item.productVariantId)}
                    // make image + info (title, size, color) sit in one row on mobile/tablet,
                    // allow price block to stay at the far right; keep desktop behaviour intact
                    className="flex flex-row flex-wrap items-center gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <img
                      src={
                        typeof item.productImageUrl === "string"
                          ? item.productImageUrl
                          : (item.productImageUrl &&
                              (item.productImageUrl as any).imageUrl) ||
                            ""
                      }
                      alt={item.productName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-1 break-words whitespace-normal leading-tight">
                        {item.productName || "Sản phẩm"}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                        {item.size && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            Size:{" "}
                            {typeof item.size === "string"
                              ? item.size
                              : (item.size as any).name}
                          </span>
                        )}
                        {item.color && (
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            Màu:{" "}
                            {typeof item.color === "string"
                              ? item.color
                              : (item.color as any).name}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Số lượng: {item.quantity}
                      </div>
                    </div>

                    {/* price block: keep compact, push to far right when space allows */}
                    <div className="w-full sm:w-auto text-right flex flex-col justify-between mt-2 sm:mt-0 min-w-[6rem] ml-auto">
                      {hasDiscount ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="font-semibold text-red-600">
                              {displayPrice.toLocaleString("vi-VN")}₫
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {itemData.basePrice.toLocaleString("vi-VN")}₫
                            </span>
                          </div>
                          <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-600 rounded">
                            -{itemData.discountPercentage}%
                          </span>
                          <div className="text-sm text-gray-500 font-medium mt-1">
                            {(displayPrice * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-semibold text-gray-900">
                            {item.price.toLocaleString("vi-VN")}₫
                          </div>
                          <div className="text-sm text-gray-500">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Section */}
          <PaymentMethodSection form={paymentForm} />
        </div>

        {/* Cart Summary - Sticky */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <CartSummary
              subtotal={subtotal}
              discount={discountAmount}
              shippingFee={shippingFee}
              total={total}
              ship={ship}
              disabled={isProcessing || isShipLoading}
              onPlaceOrder={handlePlaceOrder}
            />
            {isShipLoading && (
              <div className="mt-2 text-sm text-gray-500 text-center">
                Đang tải thông tin vận chuyển...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onConfirm={async () => {
          // Xóa giỏ hàng khi user bấm confirm
          if (userId) {
            await dispatch(clearCartAsync(userId));
          }
          navigate("/profile");
        }}
      />
    </div>
  );
}
