// src/features/user-profile/components/user-info/user-info-edit.tsx
import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { updateUserById } from "~/services/customers";
import { useAppDispatch } from "~/redux/store";
import { fetchCurrentUser } from "~/redux/slices/auth";
import toast from "react-hot-toast";

interface UserInfoEditProps {
  user: {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string | null;
    imageUrl?: string;
    isVerified: boolean;
    status: {
      displayName: string;
      entityType: string;
      name: string;
      statusId: number;
    };
    roles: number[];
    gender: string;
  };
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserInfoEdit({
  user,
  open,
  onClose,
  onSuccess,
}: UserInfoEditProps) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    if (open && user) {
      setForm({
        fullName: user.fullName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
      });
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      roleIds: user.roles,
    };

    try {
      await updateUserById(user.userId, payload);
      toast.success("Cập nhật thông tin thành công!");
      // Reload user data
      await dispatch(fetchCurrentUser());
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
          <DialogDescription>
            Chỉnh sửa Họ và tên, Số điện thoại, Ngày sinh, Giới tính.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Giới tính</Label>
            <Select
              value={form.gender}
              onValueChange={(value) => setForm({ ...form, gender: value })}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button variant="add" type="submit">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
