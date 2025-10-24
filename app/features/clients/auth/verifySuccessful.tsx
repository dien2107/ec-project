import React, { useEffect, useState } from "react";
import { CheckCircle, Home, Loader2, XCircle } from "lucide-react";
import { getAuthVerify } from "~/services/auth";
import { useNavigate, useSearchParams } from "react-router";

export default function VerifySuccessfulPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token xác thực không hợp lệ hoặc đã hết hạn");
        return;
      }

      try {
        const response = await getAuthVerify(token);
        setStatus("success");
        setMessage(
          response?.message || "Xác thực tài khoản thành công! Chào mừng bạn đến với hệ thống."
        );
      } catch (err: any) {
        setStatus("error");
        const errorMsg =
          err?.response?.data?.message ||
          err?.message ||
          "Xác thực thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.";
        setMessage(errorMsg);
        console.error("Verify failed:", err);
      }
    };

    verifyAccount();
  }, [token]);

  const goHome = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white">
      <div className="w-full max-w-lg">
        <style>{`
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-scaleIn {
            animation: scaleIn 0.5s ease-out;
          }
          .animate-bounce-custom {
            animation: bounce 2s ease-in-out infinite;
          }
        `}</style>

        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 text-center animate-scaleIn">
          {/* Loading State */}
          {status === "loading" && (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Đang xác thực...
                </h1>
                <p className="text-gray-500 text-sm">
                  Vui lòng đợi trong giây lát
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg animate-bounce-custom">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  Xác Thực Thành Công! 🎉
                </h1>
                <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                  {message}
                </p>
              </div>

              {/* Confetti Effect (optional decorative elements) */}
              <div className="flex justify-center gap-3 text-4xl opacity-60">
                <span className="animate-bounce">🎊</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>
                  ✨
                </span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                  🎉
                </span>
              </div>

              <button
                onClick={goHome}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Về Trang Chủ
              </button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  Xác Thực Thất Bại
                </h1>
                <p className="text-gray-600 text-base leading-relaxed max-w-md mx-auto">
                  {message}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={goHome}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                >
                  <Home className="w-5 h-5" />
                  Về Trang Chủ
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Đăng Nhập
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Cần hỗ trợ? Liên hệ{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}