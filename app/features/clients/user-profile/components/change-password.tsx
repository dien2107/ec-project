"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// Types
interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ShowPassword {
  old: boolean;
  new: boolean;
  confirm: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
}

const ChangePassword = () => {
  const [form, setForm] = useState<FormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<ShowPassword>({
    old: false,
    new: false,
    confirm: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Password validation logic
  const validatePassword = useCallback((password: string): ValidationResult => {
    const errors: string[] = [];
    let strength: "weak" | "medium" | "strong" = "weak";

    if (password.length < 8) {
      errors.push("Ít nhất 8 ký tự");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Ít nhất 1 chữ thường");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Ít nhất 1 chữ hoa");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Ít nhất 1 số");
    }
    if (!/(?=.*[!@#$%^&*])/.test(password)) {
      errors.push("Ít nhất 1 ký tự đặc biệt");
    }

    const validConditions = 5 - errors.length;
    if (validConditions >= 4) strength = "strong";
    else if (validConditions >= 3) strength = "medium";

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    };
  }, []);

  const passwordValidation = useMemo(
    () => validatePassword(form.newPassword),
    [form.newPassword, validatePassword]
  );

  const isFormValid = useMemo(() => {
    return (
      form.oldPassword.length > 0 &&
      passwordValidation.isValid &&
      form.newPassword === form.confirmPassword &&
      form.newPassword !== form.oldPassword
    );
  }, [form, passwordValidation]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));

      if (name === "newPassword" && !showValidation) {
        setShowValidation(true);
      }
    },
    [showValidation]
  );

  const togglePasswordVisibility = useCallback((field: keyof ShowPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success handling
      alert("Mật khẩu đã được cập nhật thành công!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowValidation(false);
    } catch (error) {
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "strong":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  const getStrengthWidth = (strength: string) => {
    switch (strength) {
      case "strong":
        return "w-full";
      case "medium":
        return "w-2/3";
      default:
        return "w-1/3";
    }
  };

  return (
    <div className="w-full  min-h-[70vh] ">
      <div className="w-full ">
        {/* Simple Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-black mb-1">
              Đổi mật khẩu
            </h1>
            <p className="text-gray-500 text-sm">
              Cập nhật mật khẩu để bảo vệ tài khoản
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label
                htmlFor="oldPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword.old ? "text" : "password"}
                  id="oldPassword"
                  name="oldPassword"
                  value={form.oldPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md text-gray-900 placeholder-gray-400"
                />
                <Button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu mới"
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all duration-200"
                />
                <Button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>

              {showValidation && form.newPassword && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      Độ mạnh mật khẩu:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordValidation.strength === "strong"
                          ? "text-green-600"
                          : passwordValidation.strength === "medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {passwordValidation.strength === "strong"
                        ? "Mạnh"
                        : passwordValidation.strength === "medium"
                          ? "Trung bình"
                          : "Yếu"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordValidation.strength)} ${getStrengthWidth(passwordValidation.strength)}`}
                    ></div>
                  </div>

                  {/* Validation Messages */}
                  {passwordValidation.errors.length > 0 && (
                    <div className="space-y-1">
                      {passwordValidation.errors.map((error, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-red-600"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-900"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Xác nhận mật khẩu mới"
                  required
                  className={`w-full pl-10 pr-10 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    form.confirmPassword &&
                    form.newPassword !== form.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : form.confirmPassword &&
                          form.newPassword === form.confirmPassword
                        ? "border-green-500 focus:ring-green-500"
                        : "border-gray-200 focus:border-black/10"
                  }`}
                />
                <Button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </Button>
              </div>

              {form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    Mật khẩu xác nhận không khớp
                  </div>
                )}

              {form.newPassword &&
                form.oldPassword &&
                form.newPassword === form.oldPassword && (
                  <div className="flex items-center gap-2 text-xs text-yellow-400">
                    <Info className="w-3 h-3" />
                    Mật khẩu mới phải khác mật khẩu hiện tại
                  </div>
                )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              onClick={handleSubmit}
              className={`w-full mt-4 py-2 rounded-md font-semibold text-black transition-all duration-200 ${
                isFormValid && !isSubmitting
                  ? "bg-black text-white hover:shadow-md"
                  : "bg-gray-200 cursor-not-allowed text-gray-400"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang cập nhật...
                </div>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </Button>
          </form>

          {/* Security Tips */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              Mẹo bảo mật
            </h2>
            <ul className="space-y-2 text-sm text-gray-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Sử dụng mật khẩu tối thiểu 8 ký tự
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Không sử dụng lại mật khẩu cũ hoặc mật khẩu dễ đoán
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
