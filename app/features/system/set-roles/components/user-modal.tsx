"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  getUserById,
  postUserData,
  updateUserById,
} from "~/services/customers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAppSelector } from "~/redux/store";
import type {
  Customer,
  EntityStatus,
  Address,
  UpdateCustomerData,
  createCustomerData,
} from "~/features/system/customers/types";

interface UserModalProps {
  id?: number | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void; // callback used by parent to refresh list
}

export const UserModal: React.FC<UserModalProps> = ({
  id,
  isOpen,
  onClose,
  onSaved,
}) => {
  const { statuses } = useAppSelector(
    (s: any) => s.statuses ?? { statuses: null }
  );

  const statusOptions: EntityStatus[] = Array.isArray(statuses)
    ? statuses
    : Array.isArray(statuses?.data)
    ? statuses.data
    : [];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<
    UpdateCustomerData & { addresses?: Address[] }
  >({
    username: "",
    email: "",
    imageUrl: "",
    fullName: "",
    phone: "",
    gender: "Male",
    dateOfBirth: null,
    isVerified: false,
    statusId: statusOptions?.[0]?.statusId ?? 0,
    roleIds: [],
    addresses: [],
  });

  // load user when editing
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) {
        // reset form for create
        setForm({
          username: "",
          email: "",
          imageUrl: "",
          fullName: "",
          phone: "",
          gender: "Male",
          dateOfBirth: null,
          isVerified: false,
          statusId: statusOptions?.[0]?.statusId ?? 0,
          roleIds: [],
          addresses: [],
        });
        return;
      }
      setLoading(true);
      try {
        const u = await getUserById(id);
        const customer: Customer | null = u.data ?? null;
        if (!mounted || !customer) return;

        setForm({
          username: customer.username ?? "",
          email: customer.email ?? "",
          imageUrl: customer.imageUrl ?? "",
          fullName: customer.fullName ?? "",
          phone: customer.phone ?? "",
          gender: (customer.gender as "Male" | "Female") ?? "Male",
          // ✅ FIX: convert ISO datetime → only YYYY-MM-DD for <input type="date">
          dateOfBirth: customer.dateOfBirth
            ? customer.dateOfBirth.split("T")[0]
            : null,
          isVerified: !!customer.isVerified,
          statusId:
            customer.status?.statusId ??
            statusOptions?.[0]?.statusId ??
            0,
          roleIds: (customer.roles ?? []).map((r) => r.roleId),
          addresses: customer.addresses ?? [],
        });
      } catch (err) {
        console.error("getUserById error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRoleIdsInput = (raw: string) => {
    const arr = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((v) => Number(v))
      .filter((n) => !Number.isNaN(n) && n > 0);
    handleChange("roleIds", arr);
  };

  const roleIdsDisplay = (form.roleIds ?? []).join(", ");

  const handleSubmit = async () => {
    if (!form.email || !form.fullName) {
      alert("Vui lòng nhập tên và email.");
      return;
    }

    setSaving(true);
    try {
      // ✅ convert date back to ISO for API
      const normalizedDate = form.dateOfBirth
        ? new Date(form.dateOfBirth).toISOString()
        : null;

      if (id) {
        // update
        const payload: UpdateCustomerData = {
          username: form.username,
          email: form.email,
          imageUrl: form.imageUrl,
          fullName: form.fullName,
          phone: form.phone,
          gender: form.gender as "Male" | "Female",
          dateOfBirth: normalizedDate,
          isVerified: !!form.isVerified,
          statusId: form.statusId,
          roleIds: form.roleIds ?? [],
          addresses: form.addresses ?? [],
        };
        await updateUserById(id, payload);
      } else {
        // create
        const payload: createCustomerData = {
          username: form.username,
          email: form.email,
          imageUrl: form.imageUrl,
          fullName: form.fullName,
          phone: form.phone,
          gender: form.gender as "Male" | "Female",
          dateOfBirth: normalizedDate,
          isVerified: !!form.isVerified,
          statusId: form.statusId,
          roleIds: form.roleIds ?? [],
        };
        await postUserData(payload);
      }
      onSaved();
    } catch (err) {
      console.error("save user error", err);
      alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>
            {id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {loading ? (
            <div className="text-sm text-gray-500">Đang tải thông tin...</div>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1">Họ và tên</label>
                <Input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Tên đăng nhập</label>
                <Input
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Username"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Số điện thoại</label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Giới tính</label>
                <Select
                  value={form.gender}
                  onValueChange={(v) =>
                    handleChange("gender", v as "Male" | "Female")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">Ngày sinh</label>
                <Input
                  type="date"
                  value={form.dateOfBirth ?? ""}
                  onChange={(e) =>
                    handleChange("dateOfBirth", e.target.value || null)
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Trạng thái</label>
                <Select
                  value={String(form.statusId ?? "")}
                  onValueChange={(v) => handleChange("statusId", Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn trạng thái..." />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.statusId} value={String(s.statusId)}>
                        {s.displayName ?? s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm mb-1">Vai trò (roleIds)</label>
                <Input
                  placeholder="Nhập role ids, phân tách bằng dấu phẩy, ví dụ: 1,2"
                  value={roleIdsDisplay}
                  onChange={(e) => handleRoleIdsInput(e.target.value)}
                />
                <div className="mt-2 text-sm text-gray-600">
                  Nếu muốn hiển thị tên vai trò thay vì id, chỉnh component để
                  lấy danh sách roles từ API.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="verified"
                  type="checkbox"
                  checked={!!form.isVerified}
                  onChange={(e) => handleChange("isVerified", e.target.checked)}
                />
                <label htmlFor="verified" className="text-sm">
                  Đã xác thực
                </label>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={saving || loading}>
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
