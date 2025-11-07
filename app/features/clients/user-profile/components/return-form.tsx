import { X, Send, PackageOpen, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
// import { createReturnRequest } from "~/services/returns"; // bạn sẽ viết API này tương tự createReview

export default function ReturnForm({
  orderItemId,
  productName,
  productImage,
  onClose,
}: {
  orderItemId: number;
  productName: string;
  productImage: string;
  onClose: () => void;
}) {
  const [returnType, setReturnType] = useState<"return" | "exchange" | "">("");
  const [reason, setReason] = useState("");
  const [exchangeProduct, setExchangeProduct] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
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
      const formData = new FormData();
      formData.append("orderItemId", orderItemId.toString());
      formData.append("type", returnType);
      formData.append("reason", reason.trim());
      if (returnType === "exchange" && exchangeProduct.trim()) {
        formData.append("exchangeProduct", exchangeProduct.trim());
      }

      // await createReturnRequest(formData);
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
  }, [orderItemId, returnType, reason, exchangeProduct, onClose]);

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
            {/* Product Info */}
            <div className="flex items-center space-x-3 mb-6 p-4 bg-gray-50 rounded-lg border">
              <img
                src={productImage}
                alt={productName}
                className="w-16 h-16 rounded-md object-cover border"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {productName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Mã sản phẩm: #{orderItemId}
                </p>
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

            {/* Exchange Product */}
            {returnType === "exchange" && (
              <div className="mb-6">
                <label className="text-gray-900 mb-2 font-medium block">
                  Sản phẩm muốn đổi sang
                </label>
                <input
                  type="text"
                  value={exchangeProduct}
                  onChange={e => setExchangeProduct(e.target.value)}
                  placeholder="Nhập tên hoặc mã sản phẩm muốn đổi"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            )}

            {/* Submit */}
            <div className="pt-4 border-t">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
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
