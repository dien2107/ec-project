import { X, Send, PackageOpen, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import type { OrderItem } from "~/features/clients/user-profile/types/user";
import { createProductReturnV2 } from "~/services/product-return";

export default function ReturnForm({
  order,
  onClose,
}: {
  order: OrderItem;
  onClose: () => void;
}) {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [returnType, setReturnType] = useState<"return" | "exchange" | "">("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedItem = order.items.find(
    item => item.orderItemId === selectedProductId
  );
  console.log(order);

  // Kiểm tra có sản phẩm nào có thể đổi/trả không
  const availableItems = order.items.filter(item => !item.return);
  const hasAvailableItems = availableItems.length > 0;

  const handleSubmit = useCallback(async () => {
    if (!selectedProductId) {
      toast.error("Vui lòng chọn sản phẩm cần đổi/trả");
      return;
    }

    // Kiểm tra sản phẩm đã được xử lý đổi/trả chưa
    const selectedItem = order.items.find(
      item => item.orderItemId === selectedProductId
    );
    if (selectedItem?.return === true) {
      toast.error("Sản phẩm này đã được xử lý đổi/trả rồi");
      return;
    }

    if (!returnType) {
      toast.error("Vui lòng chọn loại yêu cầu");
      return;
    }
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do đổi/trả");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        orderItemId: selectedProductId,
        returnType: returnType === "return" ? 1 : 2, // 1 = trả hàng, 2 = đổi hàng
        returnReason: reason.trim(),
      };
      console.log(payload);

      await createProductReturnV2(payload);
      toast.success("Gửi yêu cầu đổi/trả hàng thành công!");
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi gửi yêu cầu!");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedProductId, returnType, reason, onClose]);
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto scrollbar-custom">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative p-6 border-b bg-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Đổi / Trả hàng
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Gửi yêu cầu đổi hoặc trả sản phẩm của bạn
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto scrollbar-custom flex-1">
            {/* Product Selection */}
            <div className="mb-6">
              <label className="text-gray-900 mb-2 font-medium block">
                Chọn sản phẩm cần đổi/trả
              </label>

              {!hasAvailableItems && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                  <p className="text-orange-800 text-sm">
                    Tất cả sản phẩm trong đơn hàng này đã được xử lý đổi/trả.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {order.items.map(item => {
                  const isReturned = item.return === true;
                  const isDisabled = isReturned;

                  return (
                    <div
                      key={item.orderItemId}
                      onClick={() => {
                        if (isDisabled) return;
                        console.log(`item.orderItemId: ${item.orderItemId}`);
                        setSelectedProductId(item.orderItemId);
                      }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        isDisabled
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                          : selectedProductId === item.orderItemId
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 cursor-pointer"
                            : "border-gray-300 hover:border-blue-300 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className={`w-16 h-16 rounded-md object-cover border flex-shrink-0 ${
                            isDisabled ? "grayscale" : ""
                          }`}
                        />
                        {isReturned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
                            <span className="text-white text-xs font-bold">
                              Đã xử lý
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium line-clamp-2 ${
                            isDisabled ? "text-gray-500" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.size} • Số lượng: {item.quantity}
                        </p>
                        {isReturned && (
                          <p className="text-xs text-orange-600 font-medium mt-1">
                            Sản phẩm đã được xử lý đổi/trả
                          </p>
                        )}
                      </div>
                      {!isDisabled && (
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedProductId === item.orderItemId
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedProductId === item.orderItemId && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Type Select */}
            <div className="mb-6">
              <label className="text-gray-900 mb-2 font-medium block">
                Loại yêu cầu
              </label>
              <select
                value={returnType}
                onChange={e =>
                  setReturnType(e.target.value as "return" | "exchange" | "")
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">-- Chọn loại yêu cầu --</option>
                <option value="return">Trả hàng</option>
                <option value="exchange">Đổi hàng</option>
              </select>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="text-gray-900 mb-2 font-medium block">
                Lý do
              </label>
              <textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Vui lòng mô tả lý do đổi/trả..."
                className="w-full h-28 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1.5 text-right">
                {reason.length}/500 ký tự
              </p>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !hasAvailableItems}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 transition-colors"
              >
                {isSubmitting ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="none"
                      d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8z"
                    />
                  </svg>
                ) : returnType === "exchange" ? (
                  <RefreshCw className="h-5 w-5" />
                ) : (
                  <PackageOpen className="h-5 w-5" />
                )}
                <span>
                  {isSubmitting
                    ? "Đang gửi..."
                    : returnType === "exchange"
                      ? "Gửi yêu cầu đổi hàng"
                      : "Gửi yêu cầu trả hàng"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
