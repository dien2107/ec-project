import React, { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { register } from "~/services/auth";
// dùng react-hot-toast nếu project có, nếu không thay bằng toast của project
import toast from "react-hot-toast";
import { useNavigate } from "react-router"; // ← added

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  imageUrl: string;
}
interface RegisterPageProps {
  onNavigateToLogin?: () => void;
}
export default function RegisterPage({ onNavigateToLogin }: RegisterPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    imageUrl: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // // Full name validation
    // if (!formData.fullName.trim()) {
    //   newErrors.fullName = "Họ và tên không được để trống";
    // }

    // // Phone validation (optional but if provided, should be valid)
    // if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
    //   newErrors.phone = "Số điện thoại không hợp lệ";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Registering user with data:", formData);
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        image_url: formData.imageUrl,
        phone: formData.phone,
      };

      const resp = await register(payload);

      toast.success(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.",
        { duration: 5000 }
      );

      setTimeout(() => {
        if (typeof onNavigateToLogin === "function") {
          onNavigateToLogin();
        } else {
          window.location.href = "/login";
        }
      }, 2000);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        (typeof err === "string" ? err : "Đăng ký thất bại");
      toast.error(message);
      console.error("Register failed:", err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tạo tài khoản mới để bắt đầu
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">
                Tên đăng nhập <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="nhập tên đăng nhập"
                  className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  placeholder="Nguyễn Văn A"
                  className={`pl-10 ${errors.fullName ? "border-red-500" : ""}`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="0123456789"
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div> */}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                <div className="flex items-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Đăng ký
                </div>
              )}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-blue-600 hover:text-blue-500 font-medium underline-offset-4 hover:underline"
                >
                  Đăng nhập ngay →
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
