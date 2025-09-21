import React from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { UserInfoViewProps } from "../../types/user-profile.types";

// Helper function để get badge styles dựa trên trạng thái
const getStatusBadgeStyle = (isActive: boolean) => ({
  variant: (isActive ? "default" : "destructive") as "default" | "destructive",
  className: isActive 
    ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" 
    : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
});

const getVerifyBadgeStyle = (isVerified: boolean) => ({
  variant: (isVerified ? "default" : "secondary") as "default" | "secondary",
  className: isVerified 
    ? "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200" 
    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
});

export default function UserInfoView({ 
  username, 
  full_name, 
  email, 
  phone, 
  is_active, 
  is_verify, 
  created_at,
  onEdit 
}: UserInfoViewProps) {
  const statusStyle = getStatusBadgeStyle(is_active || false);
  const verifyStyle = getVerifyBadgeStyle(is_verify || false);

  return (
    <div className="flex-1">
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
            <Button
              variant="outline" 
              size="sm"
              onClick={onEdit}
            >
              Chỉnh sửa thông tin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-sm mb-1">Tên đăng nhập:</div>
              <div className="font-medium">{username}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Họ và tên:</div>
              <div className="font-medium">{full_name}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Email:</div>
              <div className="font-medium">{email}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Số điện thoại:</div>
              <div className="font-medium">{phone}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Trạng thái tài khoản:</div>
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
            <div>
              <div className="text-gray-500 text-sm mb-1">Ngày tạo tài khoản:</div>
              <div className="font-medium">
                {created_at ? new Date(created_at).toLocaleDateString('vi-VN') : 'Không có thông tin'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
