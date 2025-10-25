import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";
import {
  mockCartItems,
  mockSelectedItems,
} from "~/features/clients/payment/data/payment";
import type { CartItem } from "~/features/clients/payment/types/payment";
import type { Address } from "~/types/address/address";
import AddressSection from "~/features/clients/payment/components/address-section";
import PaymentMethodSection from "~/features/clients/payment/components/payment-method";
import CartSummary from "~/features/clients/payment/components/cart-summary";
import SuccessDialog from "~/features/clients/payment/components/success-dialog";

const paymentSchema = z.object({
  paymentMethod: z.enum(["bank", "cod"]),
});

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "cod",
    },
  });

  useEffect(() => {
    setCartItems(mockCartItems);
    setSelectedItems(mockSelectedItems);
  }, [state, navigate]);

  const subtotal = useMemo(
    () =>
      cartItems
        .filter((item) => selectedItems.includes(item.id))
        .reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems, selectedItems]
  );

  const shippingFee = subtotal >= 300000 ? 0 : 30000;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
    // const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    // if (!selectedAddress) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessDialogOpen(true);
    }, 1500);
  };

  return (
    <div className="main-container py-8">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <AddressSection
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
          />
          <div className="border rounded-md p-6 space-y-4">
            {cartItems
              .filter((item) => selectedItems.includes(item.id))
              .map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.name}</h3>
                    <div className="text-sm text-gray-500">
                      <span>Size: {item.size}</span> |{" "}
                      <span>Màu: {item.color}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.price.toLocaleString()}₫
                    </div>
                    <div className="text-sm text-gray-500">
                      x{item.quantity}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <PaymentMethodSection form={paymentForm} />
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            disabled={isProcessing}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
      </div>

      <SuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={setIsSuccessDialogOpen}
        onConfirm={() => navigate("/")}
      />
    </div>
  );
}
