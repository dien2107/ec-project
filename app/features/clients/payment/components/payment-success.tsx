import { useNavigate, useLocation } from "react-router";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nhận dữ liệu truyền qua navigate, ví dụ navigate("/payment/success", { state: paymentData })
  const { paymentData } = location.state || {};

  const { orderId, amount, paidAt, qrCodeUrl, status } = paymentData;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center animate-fadeIn">
        {/* Dấu tick */}
        <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4 animate-bounce" />

        <h1 className="text-2xl font-bold text-green-600 mb-2">
          🎉 Thanh toán thành công! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
        </p>

        {/* Thông tin chi tiết */}
        <div className="bg-gray-50 rounded-lg p-4 text-left mb-6 space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Mã đơn hàng:</span> #{orderId}
          </p>
          <p>
            <span className="font-semibold">Số tiền:</span>{" "}
            {amount?.toLocaleString("vi-VN")} ₫
          </p>
          <p>
            <span className="font-semibold">Trạng thái:</span>{" "}
            <span className="text-green-600 font-medium">
              {status === "Draft" ? "Đã thanh toán" : status}
            </span>
          </p>
          {paidAt && (
            <p>
              <span className="font-semibold">Thời gian thanh toán:</span>{" "}
              {new Date(paidAt).toLocaleString("vi-VN")}
            </p>
          )}
        </div>

        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 bg-green-600 text-white text-lg rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Về trang cá nhân
        </button>
      </div>
    </div>
  );
}
