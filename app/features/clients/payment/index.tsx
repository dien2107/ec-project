import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import type { Address } from "~/features/clients/payment/types/payment";
import AddressSection from "~/features/clients/payment/components/address-section";
import PaymentMethodSection from "~/features/clients/payment/components/payment-method";
import CartSummary from "~/features/clients/payment/components/cart-summary";
import SuccessDialog from "~/features/clients/payment/components/success-dialog";
import { useAppSelector, useAppDispatch } from "~/redux/store";
import { createOrder } from "~/services/order";
import { clearCart } from "~/redux/slices/cartSlice";
import { createPayment, type CreatePaymentPayload } from "~/services/payment";
import toast from "react-hot-toast";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank", "cod"]),
});

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Lấy cartItems từ Redux store
  const cartItems = useAppSelector(state => state.cart.items);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường ABC",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

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
    setIsOnlinePayment(paymentMethod === "bank");
  }, [paymentMethod]);

  useEffect(() => {
    // Lấy selectedItems từ location state hoặc chọn tất cả items
    if (state?.selectedItems) {
      setSelectedItems(state.selectedItems);
    } else {
      // Mặc định chọn tất cả items
      setSelectedItems(
        cartItems.map(item =>
          String(
            item.ProductVariant.productVariantId ??
              (item.ProductVariant as any).id
          )
        )
      );
    }
  }, [state, cartItems]);

  // Tính toán các items được chọn
  const selectedCartItems = useMemo(
    () =>
      cartItems.filter(item =>
        selectedItems.includes(
          String(
            item.ProductVariant.productVariantId ??
              (item.ProductVariant as any).id
          )
        )
      ),
    [cartItems, selectedItems]
  );

  const subtotal = useMemo(
    () =>
      selectedCartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [selectedCartItems]
  );

  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handleAddAddress = (address: Address) => {
    setAddresses(prev => [...prev, address]);
    setSelectedAddressId(address.id);
  };

  const dispatch = useAppDispatch();

  const handlePlaceOrder = async () => {
    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const payload = {
      userId: 3,
      discountId: null,
      shipId: null,
      paymentMethod,
      addressInfo: `${selectedAddress.fullName} - ${selectedAddress.phone} - ${selectedAddress.address}, ${selectedAddress.city}`,
      isFreeShip: shippingFee === 0,
      shippingFee,
      items: selectedCartItems.map(i => ({
        productVariantId: Number(
          i.ProductVariant.productVariantId ?? (i.ProductVariant as any).id
        ),
        quantity: i.quantity,
      })),
    };

    setIsProcessing(true);

    try {
      // 1️⃣ Tạo đơn hàng trước
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
          description: orderId + "",
        };

        const paymentResponse = await createPayment(paymentPayload);
        console.log(paymentResponse);
        if (!paymentResponse.data.isSuccess) {
          toast.error("Không thể tạo đơn thanh toán!");
          return;
        }

        setInterval(() => {
          navigate("/payment/online", {
            state: {
              paymentInfo: paymentResponse.data,
              paymentPayload,
            },
          });
        }, 5000);
      } else {
        // 3️⃣ COD (thanh toán khi nhận hàng)
        toast.success("Đặt hàng thành công!");
        setIsSuccessDialogOpen(true);
      }

      // 4️⃣ Xóa giỏ hàng sau khi hoàn tất
      dispatch(clearCart());
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
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddAddress={handleAddAddress}
          />

          {/* Cart Items */}
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Sản phẩm ({selectedCartItems.length})
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {selectedCartItems.map(item => (
                <div
                  key={String(
                    item.ProductVariant.productVariantId ??
                      (item.ProductVariant as any).id
                  )}
                  className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                >
                  <img
                    src={
                      typeof item.image === "string"
                        ? item.image
                        : (item.image && (item.image as any).imageUrl) || ""
                    }
                    alt={
                      (item.ProductVariant as any).product?.name || "Product"
                    }
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-1 truncate">
                      {(item.ProductVariant as any).product?.name || "Sản phẩm"}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                      {item.ProductVariant.size && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          Size:{" "}
                          {typeof item.ProductVariant.size === "string"
                            ? item.ProductVariant.size
                            : (item.ProductVariant.size as any).name}
                        </span>
                      )}
                      {item.ProductVariant.color && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          Màu:{" "}
                          {typeof item.ProductVariant.color === "string"
                            ? item.ProductVariant.color
                            : (item.ProductVariant.color as any).name}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Số lượng: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div className="font-semibold text-gray-900">
                      {item.price.toLocaleString("vi-VN")}₫
                    </div>
                    <div className="text-sm text-gray-500">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                </div>
              ))}
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
              shippingFee={shippingFee}
              total={total}
              disabled={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      <SuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onConfirm={() => navigate("/")}
      />
    </div>
  );
}
