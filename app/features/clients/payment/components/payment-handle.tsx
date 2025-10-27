import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Copy } from "lucide-react";
import { getOrderStatus } from "~/services/payment";
import { toast } from "sonner";

export default function PaymentOnline() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentInfo, paymentPayload } = location.state || {};
  const orderId = paymentPayload?.orderId;

  const [timeLeft, setTimeLeft] = useState(900); // 15 phút = 900 giây

  const checkOrderStatus = async () => {
    if (!orderId) return;
    try {
      const data = await getOrderStatus(orderId);

      if (data.isPaid) {
        toast.success("Thanh toán thành công!");
        navigate("/profile");
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đơn hàng:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!orderId || timeLeft <= 0) return;

    checkOrderStatus();

    const interval = setInterval(() => {
      checkOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, timeLeft]);
  useEffect(() => {
    if (timeLeft === 0) {
      toast.error("Hết thời gian thanh toán!");
      navigate("/payments");
    }
  }, [timeLeft]);

  function parseQrUrl(url: string) {
    const queryString = url.split("?")[1];
    const params = new URLSearchParams(queryString);

    return {
      bank: params.get("bank") || "",
      account: params.get("acc") || "",
      amount: params.get("amount") || "",
      description: params.get("des") || "",
      template: params.get("template") || "",
    };
  }

  if (!paymentPayload || !paymentInfo) {
    return <div>Không có thông tin thanh toán.</div>;
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const qrData = parseQrUrl(paymentInfo.qrCodeUrl || "");
  const qrUrl = paymentInfo.qrCodeUrl;
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-gray-50 text-gray-800">
      <div className="w-full max-w-5xl bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-red-500 pb-2 mb-6">
          <h2 className="text-2xl font-bold text-red-600">
            Thông Tin Thanh Toán
          </h2>
          <div className="text-red-500 font-semibold text-lg">
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* QR Code */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg text-center text-gray-600">
              Quét Mã QR Để Thanh Toán
            </h3>
            <div className="p-2 bg-white rounded-xl border border-gray-300 shadow-sm">
              <img
                src={qrUrl}
                alt="QR Code"
                className="w-64 h-64 rounded-xl object-contain"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-gray-100 rounded-xl p-6 space-y-4 shadow-inner">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png"
                alt="MB Bank"
                className="w-10 h-10"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">MB Bank</h3>
                <p className="text-gray-500 text-sm">Chuyển Khoản Ngân Hàng</p>
              </div>
            </div>

            <div className="space-y-3 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Chủ Tài Khoản</p>
                <p className="font-semibold text-gray-900">Lu Quang Minh</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Số Tài Khoản</p>
                  <p className="font-semibold text-gray-900">
                    {qrData.account}
                  </p>
                </div>
                <Copy
                  className="cursor-pointer text-gray-500 hover:text-red-500"
                  size={18}
                  onClick={() => handleCopy(qrData.account)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Số Tiền</p>
                <p className="font-semibold text-lg text-red-600">
                  {paymentPayload.amount.toLocaleString()} VND
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Nội Dung Chuyển Khoản</p>
                  <p className="font-semibold text-sm break-all text-gray-900">
                    {`DH${paymentPayload.description}`}
                  </p>
                </div>
                <Copy
                  className="cursor-pointer text-gray-500 hover:text-red-500"
                  size={18}
                  onClick={() => handleCopy(paymentPayload.description)}
                />
              </div>
            </div>

            <div className="border-t border-gray-300 mt-6 pt-3">
              <p className="text-lg font-semibold text-gray-800">
                Tổng Tiền:{" "}
                <span className="text-red-600">
                  {paymentPayload.amount.toLocaleString()} VND
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
