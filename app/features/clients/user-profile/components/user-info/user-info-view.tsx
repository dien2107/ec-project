import React from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { UserInfoViewProps } from "../../types/user-profile.types";

// Helper function để get badge styles dựa trên trạng thái
const getStatusBadgeStyle = (isActive: boolean) => ({
  variant: (isActive ? "default" : "destructive") as "default" | "destructive",
  className: isActive
    ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
    : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
});

const getVerifyBadgeStyle = (isVerified: boolean) => ({
  variant: (isVerified ? "default" : "secondary") as "default" | "secondary",
  className: isVerified
    ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
});

export default function UserInfoView({
  username,
  full_name,
  email,
  phone,
  is_active,
  is_verify,
  created_at,
  onEdit,
}: UserInfoViewProps) {
  const statusStyle = getStatusBadgeStyle(is_active || false);
  const verifyStyle = getVerifyBadgeStyle(is_verify || false);

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl shadow-sm border p-6 min-h-[70vh]">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Thông tin cá nhân
          </h2>
          <div className="text-sm text-gray-500">
            Tên đăng nhập: <span className="font-medium">{username}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left: details */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-40 text-gray-500 text-sm">Họ và tên</div>
                <div className="flex-1 font-medium">{full_name}</div>
              </div>

              <div className="flex items-center">
                <div className="w-40 text-gray-500 text-sm">Email</div>
                <div className="flex-1 font-medium">{email}</div>
              </div>

              <div className="flex items-center">
                <div className="w-40 text-gray-500 text-sm">Số điện thoại</div>
                <div className="flex-1 font-medium">{phone}</div>
              </div>

              <div className="flex items-center">
                <div className="w-40 text-gray-500 text-sm">Trạng thái</div>
                <div className="flex gap-2">
                  <Badge
                    variant={statusStyle.variant}
                    className={statusStyle.className}
                  >
                    {is_active ? "Hoạt động" : "Bị khóa"}
                  </Badge>
                  <Badge
                    variant={verifyStyle.variant}
                    className={verifyStyle.className}
                  >
                    {is_verify ? "Đã xác minh" : "Chưa xác minh"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-40 text-gray-500 text-sm">
                  Ngày tạo tài khoản
                </div>
                <div className="flex-1 font-medium">
                  {created_at
                    ? new Date(created_at).toLocaleDateString("vi-VN")
                    : "Không có thông tin"}
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={onEdit} className="bg-blue-600  text-white">
                  Chỉnh sửa thông tin
                </Button>
              </div>
            </div>
          </div>

          {/* Right: avatar panel */}
          <div className="flex flex-col items-center border-l pl-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {/* Placeholder avatar - in future replace with actual img */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-300"
              >
                <path
                  d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z"
                  fill="currentColor"
                />
                <path
                  d="M4 20c0-4 4-6 8-6s8 2 8 6v1H4v-1z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="mt-4">
              <Button variant="outline">Chọn Ảnh</Button>
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
