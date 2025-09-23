import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { UserInfoEditProps } from "../../types/user-profile.types";

export default function UserInfoEdit({ 
  username,
  full_name, 
  email, 
  phone, 
  onChange, 
  onSave, 
  onClose,
  open 
}: UserInfoEditProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cá nhân của bạn. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name">Họ và tên</Label>
            <Input
              id="full_name"
              name="full_name"
              value={full_name}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
