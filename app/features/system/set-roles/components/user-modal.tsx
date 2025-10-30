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
import { X, Check } from "lucide-react";
import type {
  Customer,
  EntityStatus,
  Address,
  UpdateCustomerData,
  createCustomerData,
} from "~/features/system/customers/types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchRoleListData } from "~/redux/slices/roles";
import { AxiosError } from "axios";

interface UserModalProps {
  id?: number | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  id,
  isOpen,
  onClose,
  onSaved,
}) => {
  const dispatch = useAppDispatch();

  const { statuses } = useAppSelector(
    (s: any) => s.statuses ?? { statuses: null }
  );
  const { roleList, isLoading: isRoleLoading } = useAppSelector(
    (state) => state.roleList
  );

  const statusOptions: EntityStatus[] = Array.isArray(statuses)
    ? statuses
    : Array.isArray(statuses?.data)
      ? statuses.data
      : [];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openCombobox, setOpenCombobox] = useState(false);
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

  // Fetch role list
  useEffect(() => {
    if (isOpen && !roleList) {
      dispatch(fetchRoleListData({}));
    }
  }, [isOpen, dispatch, roleList]);

  // Load user data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) {
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
          dateOfBirth: customer.dateOfBirth
            ? customer.dateOfBirth.split("T")[0]
            : null,
          isVerified: !!customer.isVerified,
          statusId:
            customer.status?.statusId ?? statusOptions?.[0]?.statusId ?? 0,
          roleIds: (customer.roles ?? []).map((r) => r.roleId),
          addresses: customer.addresses ?? [],
        });
      } catch (err) {
        if (err instanceof AxiosError) {
          alert(err.response?.data?.message || "Lấy thông tin người dùng thất bại.");
        } else {
          alert("Đã xảy ra lỗi không xác định.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, statusOptions]);

  const handleChange = <K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle role in combobox
  const toggleRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  // Remove role from tag
  const removeRole = (roleId: number) => {
    setForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.filter((id) => id !== roleId),
    }));
  };

  const handleSubmit = async () => {
    if (!form.email || !form.fullName) {
      alert("Vui lòng nhập tên và email.");
      return;
    }

    setSaving(true);
    try {
      const normalizedDate = form.dateOfBirth
        ? new Date(form.dateOfBirth).toISOString()
        : null;

      if (id) {
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
          roleIds: form.roleIds,
          addresses: form.addresses ?? [],
        };
        console.log("update payload", payload);
        await updateUserById(id, payload);
      } else {
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
          roleIds: form.roleIds,
        };
        await postUserData(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
       if (err instanceof AxiosError) {
          alert(err.response?.data?.message || "Lưu người dùng thất bại.");
        } else {
          alert("Đã xảy ra lỗi không xác định.");
        }
    } finally {
      setSaving(false);
    }
  };

  const roles = Array.isArray(roleList?.data)
    ? roleList.data
    : Array.isArray((roleList as any)?.data?.items)
    ? (roleList as any).data.items.flat()
    : [];

  const selectedRoles = (roles as Array<any>).filter((r) =>
    form.roleIds.includes(r.roleId)
  );

  const isEditMode = !!id;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-custom">
        <AlertDialogHeader>
          <DialogTitle>
            {isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {loading ? (
            <div className="text-sm text-gray-500">Đang tải thông tin...</div>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1 font-medium">
                  Họ và tên *
                </label>
                <Input
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Nhập họ tên"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Tên đăng nhập {isEditMode && "(không thể sửa)"}
                </label>
                <Input
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="Username"
                  disabled={isEditMode}
                  className={isEditMode ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Email * {isEditMode && "(không thể sửa)"}
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email"
                  disabled={isEditMode}
                  className={isEditMode ? "bg-gray-50" : ""}
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Số điện thoại
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Số điện thoại"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Giới tính
                </label>
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
                <label className="block text-sm mb-1 font-medium">
                  Ngày sinh
                </label>
                <Input
                  type="date"
                  value={form.dateOfBirth ?? ""}
                  onChange={(e) =>
                    handleChange("dateOfBirth", e.target.value || null)
                  }
                />
              </div>

              <div>
                <label className="block text-sm mb-1 font-medium">
                  Trạng thái
                </label>
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

              {/* === COMBOBOX + TAG (NO SEARCH, MULTI SELECT DROPDOWN) === */}
              <div>
                <label className="block text-sm mb-2 font-medium">
                  Vai trò
                </label>

                <div className="space-y-2">
                  {/* Combobox trigger */}
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full rounded-lg border shadow-sm h-10 px-3 text-left flex items-center justify-between"
                      onClick={() => setOpenCombobox((s) => !s)}
                    >
                      <div className="truncate text-sm text-gray-700">
                        {selectedRoles.length > 0
                          ? selectedRoles.map((r) => r.name).join(", ")
                          : "Chọn vai trò..."}
                      </div>
                      <div className="text-gray-500 text-sm">▾</div>
                    </button>

                    {openCombobox && (
                      <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto scrollbar-custom">
                        {isRoleLoading ? (
                          <div className="p-2 text-sm text-gray-500">
                            Đang tải...
                          </div>
                        ) : roles.length === 0 ? (
                          <div className="p-2 text-sm text-gray-500">
                            Không có vai trò
                          </div>
                        ) : (
                          roles.map((role: { roleId: number; name: string; description?: string }) => {
                            const isSelected = form.roleIds.includes(
                              role.roleId
                            );
                            return (
                              <div
                                key={role.roleId}
                                onClick={() => toggleRole(role.roleId)}
                                className="p-2 flex items-start gap-2 cursor-pointer hover:bg-gray-50"
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center mt-1 ${
                                    isSelected
                                      ? "bg-blue-600 border-blue-600"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">
                                    {role.name}
                                  </div>
                                  {role.description && (
                                    <div className="text-xs text-gray-500">
                                      {role.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {selectedRoles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedRoles.map((role) => (
                        <span
                          key={role.roleId}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {role.name}
                          <button
                            type="button"
                            onClick={() => removeRole(role.roleId)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving || loading}
          >
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
