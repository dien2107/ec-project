// src/features/user-profile/components/user-info/user-info-view.tsx
import React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

const getStatusBadgeStyle = (id: number) => {
  switch (id) {
    case 1:
      return { variant: "default" as const, className: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" };
    case 2:
      return { variant: "destructive" as const, className: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200" };
    case 3:
      return { variant: "secondary" as const, className: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200" };
    default:
      return { variant: "secondary" as const, className: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200" };
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
  const statusStyle = getStatusBadgeStyle(user.status.statusId);
  const verifyStyle = getVerifyBadgeStyle(user.isVerified);

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
              <div className="w-40 text-gray Burmese-500 text-sm">Họ và tên</div>
              <div className="flex-1 font-medium">{user.fullName || "Không có thông tin"}</div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Email</div>
              <div className="flex-1 font-medium">{user.email}</div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Số điện thoại</div>
              <div className="flex-1 font-medium">{user.phone || "Không có thông tin"}</div>
            </div>

            <div className="flex items-center">
              <div className="w-40 text-gray-500 text-sm">Trạng thái</div>
              <div className="flex gap-2">
                <Badge variant={statusStyle.variant} className={statusStyle.className}>
                  {user.status.displayName ?? "Không xác định"}
                </Badge>
                <Badge variant={verifyStyle.variant} className={verifyStyle.className}>
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
            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
              <img
                src={user.imageUrl || "/logo-icon.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
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