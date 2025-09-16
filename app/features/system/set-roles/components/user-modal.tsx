"use client";

import React, { useEffect, useState } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface User {
  id?: number;
  name: string;
  email: string;
  roles: string[];
  status: "active" | "inactive" | "banned"; // ✅ Added status property
}

interface UserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<User>({
    id: undefined,
    name: "",
    email: "",
    roles: [],
    status: "active", // ✅ Default status
  });

  useEffect(() => {
    if (user) {
      setForm(user);
    } else {
      setForm({ id: undefined, name: "", email: "", roles: [], status: "active" });
    }
  }, [user]);

  const handleChange = (key: keyof User, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRoleChange = (value: string) => {
    // Thêm vai trò nếu chưa có
    if (!form.roles.includes(value)) {
      setForm((prev) => ({ ...prev, roles: [...prev.roles, value] }));
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    // Xóa vai trò khi nhấn "×"
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.filter((role) => role !== roleToRemove),
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || form.roles.length === 0 || !form.status) {
      alert("Vui lòng nhập đầy đủ thông tin, bao gồm ít nhất một vai trò và trạng thái.");
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>{form.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên nhân viên"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Vai trò</label>
            <Select onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn vai trò..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.roles.map((role, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-700 flex items-center gap-1"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(role)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <Select
              value={form.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng</SelectItem>
                <SelectItem value="banned">Cấm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Lưu
          </Button>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  );
};