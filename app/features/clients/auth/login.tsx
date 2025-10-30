import React, { useState } from "react";
import { useNavigate } from "react-router"; // ← added
import { Eye, EyeOff, User, Lock, LogIn } from "lucide-react";
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
import { loginThunk } from "~/redux/slices/auth";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}
// removed props; this page is standalone route now
export default function LoginPage() {
  const navigate = useNavigate(); // ← use navigate
  const dispatch = useDispatch<any>();
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
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
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập không được để trống";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // dispatch loginThunk; gửi username thay vì email
      const result = await dispatch(
        loginThunk({
          username: formData.username,
          password: formData.password,
          rememberMe: formData.rememberMe,
        })
      ).unwrap();
      toast.success("Đăng nhập thành công");
      navigate("/");
    } catch (err: any) {
      const message =
        err?.response?.data?.message || (typeof err === "string" ? err : "Đăng nhập thất bại");
      toast.error(message);
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  const handleForgot = (e?: React.MouseEvent) => {
    e?.preventDefault();
    navigate("/forgot-password");
  };

  const handleGoRegister = (e?: React.MouseEvent) => {
    e?.preventDefault();
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-gray-600">
            Chào mừng bạn trở lại hệ thống
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Tên đăng nhập</Label>
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
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="••••••••••"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    handleInputChange("rememberMe", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600"
                >
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <a
                href="#"
                onClick={handleForgot}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium cursor-pointer"
              >
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Đăng nhập vào hệ thống
                </div>
              )}
            </Button>

            {/* <div className="text-center">
              <span className="text-sm text-gray-500">HOẶC</span>
            </div> */}

            {/* <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Google")}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Tiếp tục với Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin("Facebook")}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Tiếp tục với Facebook
              </Button>
            </div> */}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={handleGoRegister}
                  className="text-blue-600 hover:text-blue-500 font-medium underline-offset-4 hover:underline"
                >
                  Đăng ký miễn phí →
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Tạo tài khoản chỉ mất 30 giây
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
