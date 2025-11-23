import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Upload,
  X,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  KeyRound,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchCurrentUser } from "~/redux/slices/auth";
import {
  updateUserById,
  uploadUserAvatar,
  deleteUserAvatar,
  changeUserPassword,
} from "~/services/customers";
import toast from "react-hot-toast";

const getStatusBadgeStyle = (id: number) => {
  switch (id) {
    case 1:
      return {
        variant: "default" as const,
        className:
          "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
      };
    case 2:
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
      };
    case 3:
      return {
        variant: "secondary" as const,
        className:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
      };
    default:
      return {
        variant: "secondary" as const,
        className:
          "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200",
      };
  }
};

const getVerifyBadgeStyle = (isVerified: boolean) => ({
  variant: (isVerified ? "default" : "secondary") as "default" | "secondary",
  className: isVerified
    ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
});

interface PasswordFormData {
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

export default function UserInformationDetail() {
  const dispatch = useAppDispatch();
  const load = useAppSelector((state) => state.auth.user);
  const user = load?.data ?? null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<ShowPassword>({
    old: false,
    new: false,
    confirm: false,
  });

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Load user data
  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Chỉ hỗ trợ định dạng .JPEG, .PNG");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Dung lượng file tối đa 1 MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("FileImage", file);

      await uploadUserAvatar(formData);
      toast.success("Tải ảnh đại diện thành công!");
      await dispatch(fetchCurrentUser());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.imageUrl || user.imageUrl === "/logo-icon.png") {
      toast.error("Không có ảnh để xóa");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserAvatar();
      toast.success("Xóa ảnh đại diện thành công!");
      await dispatch(fetchCurrentUser());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Xóa ảnh thất bại!");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload = {
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl || "",
      fullName: form.fullName,
      phone: form.phone,
      gender: form.gender,
      dateOfBirth: form.dateOfBirth,
      isVerified: user.isVerified,
      statusId: user.status.statusId,
      roleIds: (user.roles || []).map((role: any) => role.roleId),
    };

    try {
      await updateUserById(user.userId, payload);
      toast.success("Cập nhật thông tin thành công!");
      await dispatch(fetchCurrentUser());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleReset = () => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        gender: user.gender || "",
      });
    }
  };

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
    () => validatePassword(passwordForm.newPassword),
    [passwordForm.newPassword, validatePassword]
  );

  const isPasswordFormValid = useMemo(() => {
    return (
      passwordForm.oldPassword.length > 0 &&
      passwordValidation.isValid &&
      passwordForm.newPassword === passwordForm.confirmPassword &&
      passwordForm.newPassword !== passwordForm.oldPassword
    );
  }, [passwordForm, passwordValidation]);

  const handlePasswordInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setPasswordForm((prev) => ({ ...prev, [name]: value }));

      if (name === "newPassword" && !showValidation) {
        setShowValidation(true);
      }
    },
    [showValidation]
  );

  const togglePasswordVisibility = useCallback((field: keyof ShowPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordFormValid) return;

    setIsSubmittingPassword(true);

    try {
      const formData = new FormData();
      formData.append("userId", String(user?.userId));
      formData.append("oldPassword", passwordForm.oldPassword);
      formData.append("newPassword", passwordForm.newPassword);
      formData.append("confirmPassword", passwordForm.confirmPassword);
      await changeUserPassword(formData);
      toast.success("Mật khẩu đã được cập nhật thành công!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowValidation(false);
      setIsChangePasswordOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
    } finally {
      setIsSubmittingPassword(false);
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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-gray-500">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  const statusStyle = getStatusBadgeStyle(user.status?.statusId);
  const verifyStyle = getVerifyBadgeStyle(user.isVerified);

  return (
    <div className="h-full w-full my-4 rounded-md border border-solid border-gray-200 bg-white px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Thông tin tài khoản</h1>
          <p className="text-sm text-gray-500">
            Quản lý thông tin cá nhân và cài đặt bảo mật
          </p>
        </div>
        <Button
          onClick={() => setIsChangePasswordOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <KeyRound className="w-4 h-4" />
          Đổi mật khẩu
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Thông tin cá nhân */}
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-200 pb-2 mb-4">
                Thông tin cá nhân
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mã ID
                    </label>
                    <Input value={user.userId} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Họ và tên
                    </label>
                    <Input
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Giới tính
                    </label>
                    <Select
                      value={form.gender}
                      onValueChange={(value) =>
                        setForm({ ...form, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Nam</SelectItem>
                        <SelectItem value="Female">Nữ</SelectItem>
                        <SelectItem value="Other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <Input value={user.email} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Số điện thoại
                    </label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin tài khoản */}
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-200 pb-2 mb-4">
                Thông tin tài khoản
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tên đăng nhập
                    </label>
                    <Input value={user.username} readOnly disabled />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Trạng thái
                    </label>
                    <div className="flex gap-2 items-center h-10">
                      <Badge
                        variant={statusStyle.variant}
                        className={statusStyle.className}
                      >
                        {user.status?.displayName ?? "Không xác định"}
                      </Badge>
                      <Badge
                        variant={verifyStyle.variant}
                        className={verifyStyle.className}
                      >
                        {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" variant="edit">
                Lưu thay đổi
              </Button>
            </div>
          </div>

          {/* Avatar section */}
          <div className="flex flex-col items-center border-l pl-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-visible group">
              <img
                src={user.imageUrl || "/logo-icon.png"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              {/* Delete button */}
              {user.imageUrl && user.imageUrl !== "/logo-icon.png" && (
                <button
                  onClick={handleDeleteAvatar}
                  disabled={isDeleting}
                  className="absolute top-1 -right-1 w-6 h-6 flex items-center justify-center bg-gray-500 text-white rounded-full shadow-xl hover:bg-red-600 hover:scale-110 transition-all border-2 border-white disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  title="Xóa ảnh đại diện"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              variant="outline"
              size="sm"
              className="mt-3 gap-2"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? "Đang tải..." : "Tải ảnh lên"}
            </Button>

            <div className="text-xs text-gray-400 text-center mt-3">
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </div>
          </div>
        </div>
      </form>

      {/* Change Password Dialog */}
      <Dialog
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <KeyRound className="w-5 h-5" />
              Đổi mật khẩu
            </DialogTitle>
            <DialogDescription>
              Cập nhật mật khẩu để bảo vệ tài khoản của bạn
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 py-4">
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
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                  className="w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("old")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                  value={passwordForm.newPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Nhập mật khẩu mới"
                  required
                  className="w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {showValidation && passwordForm.newPassword && (
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
                className="block text-sm font-medium text-gray-700"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  placeholder="Xác nhận mật khẩu mới"
                  required
                  className={`w-full pl-10 pr-10 ${
                    passwordForm.confirmPassword &&
                    passwordForm.newPassword !== passwordForm.confirmPassword
                      ? "border-red-500"
                      : passwordForm.confirmPassword &&
                          passwordForm.newPassword ===
                            passwordForm.confirmPassword
                        ? "border-green-500"
                        : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {passwordForm.confirmPassword &&
                passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" />
                    Mật khẩu xác nhận không khớp
                  </div>
                )}

              {passwordForm.newPassword &&
                passwordForm.oldPassword &&
                passwordForm.newPassword === passwordForm.oldPassword && (
                  <div className="flex items-center gap-2 text-xs text-yellow-600">
                    <Info className="w-3 h-3" />
                    Mật khẩu mới phải khác mật khẩu hiện tại
                  </div>
                )}
            </div>

            {/* Security Tips */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Mẹo bảo mật
              </h3>
              <ul className="space-y-1 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Sử dụng mật khẩu tối thiểu 8 ký tự
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Không sử dụng lại mật khẩu cũ
                </li>
              </ul>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setShowValidation(false);
                }}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!isPasswordFormValid || isSubmittingPassword}
                className={
                  isPasswordFormValid && !isSubmittingPassword
                    ? "bg-black text-white"
                    : "bg-gray-200 cursor-not-allowed text-gray-400"
                }
              >
                {isSubmittingPassword ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
