import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Copy } from "lucide-react";
import { getOrderStatus } from "~/services/payment";
import { toast } from "sonner";

export default function PaymentOnline() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentInfo, paymentPayload } = location.state || {};
  const [isChecking, setIsChecking] = useState(false);
  const orderId = paymentPayload?.orderId;
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  console.log(paymentInfo);
  const checkOrderStatus = async () => {
    if (!orderId || isChecking) return;
    setIsChecking(true);

    try {
      const data = await getOrderStatus(orderId);
      // console.log(data.data);

      if (data.data.isPaid) {
        toast.success("Thanh toán thành công!");
        navigate("/payment/success", {
          state: {
            paymentData: data.data,
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra đơn hàng:", error);
    } finally {
      setIsChecking(false); // ✅ reset cờ sau khi xong
    }
  };
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!orderId) return;

    const interval = setInterval(() => {
      checkOrderStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

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
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      <div className="w-full max-w-5xl bg-white rounded-2xl p-8 shadow-2xl border border-blue-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-blue-500 pb-3 mb-8">
          <h2 className="text-3xl font-bold text-blue-600 tracking-wide">
            💳 Thông Tin Thanh Toán
          </h2>
          <div className="text-blue-600 font-semibold text-xl flex items-center gap-2">
            ⏱ <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* QR Code */}
          <div className="flex flex-col items-center justify-center space-y-5">
            <h3 className="text-lg font-medium text-gray-600 uppercase tracking-wide">
              Quét Mã QR Để Thanh Toán
            </h3>
            <div className="p-3 bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-md transition">
              <img
                src={paymentInfo.data.qrCodeUrl}
                alt="QR Code"
                className="w-64 h-64 rounded-xl object-contain"
              />
            </div>
            <p className="text-sm text-gray-500 italic">
              * Vui lòng quét mã bằng ứng dụng ngân hàng để thanh toán
            </p>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 rounded-2xl p-6 space-y-5 shadow-inner border border-blue-200">
            {/* Bank Header */}
            <div className="flex items-center gap-4 mb-5">
              <img
                src={paymentInfo.data.imageUrl}
                alt="MB Bank"
                className="w-12 h-12 rounded-md border border-blue-200"
              />
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  MB Bank
                </h3>
                <p className="text-gray-500 text-sm">Chuyển Khoản Ngân Hàng</p>
              </div>
            </div>

            {/* Info Details */}
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="text-sm text-gray-500">Chủ Tài Khoản</p>
                <p className="font-semibold text-gray-900 text-lg">
                  {paymentInfo.data.accountName}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Số Tài Khoản</p>
                  <p className="font-semibold text-gray-900 text-lg tracking-wide">
                    {qrData.account}
                  </p>
                </div>
                <Copy
                  className="cursor-pointer text-gray-400 hover:text-blue-600 transition"
                  size={18}
                  onClick={() => handleCopy(qrData.account)}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500">Số Tiền</p>
                <p className="font-semibold text-xl text-blue-600">
                  {paymentPayload.amount.toLocaleString()} VND
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Nội Dung Chuyển Khoản</p>
                  <p className="font-semibold text-gray-900 text-sm bg-white border border-blue-100 px-3 py-1 rounded-md">
                    {`DH${paymentPayload.description}`}
                  </p>
                </div>
                <Copy
                  className="cursor-pointer text-gray-400 hover:text-blue-600 transition"
                  size={18}
                  onClick={() => handleCopy(paymentPayload.description)}
                />
              </div>
            </div>

            <div className="border-t border-blue-200 mt-6 pt-4 text-right">
              <p className="text-lg font-semibold text-gray-800">
                Tổng Tiền:{" "}
                <span className="text-blue-600 text-xl">
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
