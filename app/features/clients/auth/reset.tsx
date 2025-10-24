import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { resetPassword } from "~/services/auth";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router";

interface ResetFormData {
  Password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || ""; 
  const username = searchParams.get("username") || "User"; 
  const avatarUrl = searchParams.get("avatar") || ""; 

  const [formData, setFormData] = useState<ResetFormData>({
    Password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<ResetFormData>>({});

  const handleInputChange = (field: keyof ResetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ResetFormData> = {};

    if (!formData.Password) {
      newErrors.Password = "Mật khẩu mới không được để trống";
    } else if (formData.Password.length < 6) {
      newErrors.Password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.confirmPassword !== formData.Password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword({ token, Password: formData.Password });
      toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err: any) {
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-white">
      <div className="w-full max-w-md">
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
          .input-focus:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}</style>

        {/* Avatar & Username Section */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="relative inline-block mb-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-md border-4 border-gray-100">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{username}</h2>
          <p className="text-sm text-gray-500">Đặt lại mật khẩu của bạn</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fadeIn">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Tạo Mật Khẩu Mới
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={(e) =>
                    handleInputChange("Password", e.target.value)
                  }
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg text-sm transition-all input-focus ${
                    errors.Password ? "border-red-400" : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.Password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-lg text-sm transition-all input-focus ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : "border-gray-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Xác nhận đổi mật khẩu
                </>
              )}
            </button>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          </form>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Mật khẩu của bạn sẽ được mã hóa an toàn
          </p>
        </div>
      </div>
    </div>
  );
}
