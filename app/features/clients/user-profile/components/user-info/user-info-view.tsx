// src/features/user-profile/components/user-info/user-info-view.tsx
import React, { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Upload, X } from "lucide-react";
import { uploadUserAvatar, deleteUserAvatar } from "~/services/customers";
import { useAppDispatch } from "~/redux/store";
import { fetchCurrentUser } from "~/redux/slices/auth";
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

interface UserInfoViewProps {
  user: {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    isVerified: boolean;
    dateOfBirth: string | null;
    imageUrl?: string;
    status: { statusId: number; displayName: string };
    gender: string;
  };
  onEdit: () => void;
}

export default function UserInfoView({ user, onEdit }: UserInfoViewProps) {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusStyle = getStatusBadgeStyle(user.status.statusId);
  const verifyStyle = getVerifyBadgeStyle(user.isVerified);

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
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Dung lượng file tối đa 50 MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("FileImage", file);

      await uploadUserAvatar(formData);
      toast.success("Tải ảnh đại diện thành công!");
      // Reload user data
      await dispatch(fetchCurrentUser());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Tải ảnh thất bại!");
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user.imageUrl || user.imageUrl === "/logo-icon.png") {
      toast.error("Không có ảnh để xóa");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUserAvatar();
      toast.success("Xóa ảnh đại diện thành công!");
      // Reload user data
      await dispatch(fetchCurrentUser());
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Xóa ảnh thất bại!");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[70vh]">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Thông tin cá nhân
          </h2>
          <div className="text-sm text-gray-500 relative right-14">
            Tên đăng nhập: <span className="font-medium">{user.username}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <div className="w-40 text-gray Burmese-500 text-sm">
                Họ và tên
              </div>
              <div className="flex-1 font-medium">
                {user.fullName || "Không có thông tin"}
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Email</div>
              <div className="flex-1 font-medium">{user.email}</div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Số điện thoại</div>
              <div className="flex-1 font-medium">
                {user.phone || "Không có thông tin"}
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Trạng thái</div>
              <div className="flex gap-2">
                <Badge
                  variant={statusStyle.variant}
                  className={statusStyle.className}
                >
                  {user.status.displayName ?? "Không xác định"}
                </Badge>
                <Badge
                  variant={verifyStyle.variant}
                  className={verifyStyle.className}
                >
                  {user.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                </Badge>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Ngày sinh</div>
              <div className="flex-1 font-medium">
                {user.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Không có thông tin"}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Giới tính</div>
              <div className="flex-1 font-medium">
                {user.gender === "Male"
                  ? "Nam"
                  : user.gender === "Female"
                    ? "Nữ"
                    : user.gender === "Other"
                      ? "Khác"
                      : "Không có thông tin"}
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={onEdit} className="bg-blue-600 text-white">
                Chỉnh sửa thông tin
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center border-l pl-6">
            <div className="relative w-32 h-32 rounded-full bg-gray-100 overflow-visible group">
              <img
                src={user.imageUrl || "/logo-icon.png"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              {/* Delete button - Made more visible */}
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
      </div>
    </div>
  );
}
