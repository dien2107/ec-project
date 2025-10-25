import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { forgotPassword } from "~/services/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { getCurrentUser } from "~/services/auth";
import { resetPassword } from "~/services/auth";
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ email: string }>({ email: "" });
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({
    type: null,
    text: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ email: e.target.value });
    if (message.type === "error") {
      setMessage({ type: null, text: "" });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const email = formData.email.trim();

    if (!email || !validateEmail(email)) {
      setMessage({
        type: "error",
        text: "✗ Vui lòng nhập địa chỉ email hợp lệ.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword({ email });
      const successText =
        "Đã gửi mật khẩu mới về mail bạn. Vui lòng kiểm tra mail và đăng nhập.";
      toast.success(successText);
      setMessage({ type: "success", text: successText });
      setFormData({ email: "" });
      navigate("/login");
    } catch (err: any) {
      const errText =
        err?.response?.data?.message ||
        err?.message ||
        "Gửi yêu cầu thất bại. Vui lòng thử lại.";
      toast.error(errText);
      setMessage({ type: "error", text: errText });
      console.error("Forgot password failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => navigate("/login");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{
        background: "#f8f9fa",
      }}
    >
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md animate-slideIn border border-gray-100">
        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.5s ease-out;
          }
          .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          .btn-hover:active {
            transform: translateY(0);
          }
          .input-focus:focus {
            outline: none;
            border-color: #374151;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
          }
        `}</style>

        {/* Icon */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full text-5xl mb-4"
            style={{
              background: "#1f2937",
              color: "#ffffff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            🔒
          </div>
        </div>

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Quên Mật Khẩu?
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8 leading-relaxed">
          Đừng lo lắng! Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn
          hướng dẫn để đặt lại mật khẩu.
        </p>

        {/* Messages */}
        {message.type === "success" && (
          <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-lg mb-5 text-sm">
            {message.text}
          </div>
        )}
        {message.type === "error" && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-5 text-sm">
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-800 font-medium text-sm mb-2"
            >
              Địa chỉ Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl text-base transition-all input-focus"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 text-white font-semibold rounded-xl text-base transition-all btn-hover"
            style={{
              background: "#1f2937",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Đang gửi..." : "Gửi Liên Kết Đặt Lại"}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-5">
          <button
            onClick={goBack}
            className="text-sm font-medium transition-colors"
            style={{ color: "#374151" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#1f2937")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
          >
            ← Quay lại Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
