import React, { useState, useEffect } from "react";
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
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { updateSupplier, getSupplierById } from "~/services/supplier";

interface SupplierEditFormData {
  supplierId: number;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  statusId: number;
}

interface EditSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  supplierId: number | null;
  onUpdated: () => void;
}

const statusList = [
  { statusId: 73, displayName: "Đang hợp tác" },
  { statusId: 74, displayName: "Ngừng hợp tác" },
  { statusId: 75, displayName: "Đình chỉ hợp tác" },
  { statusId: 76, displayName: "Đang trong quá trình phát triển" },
];

export default function EditSupplierDialog({
  open,
  setIsOpen,
  supplierId,
  onUpdated,
}: EditSupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierEditFormData>({
    supplierId: 0,
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    statusId: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Lấy dữ liệu khi mở dialog
  useEffect(() => {
    if (!open || !supplierId) return;

    setIsLoading(true);
    getSupplierById(supplierId)
      .then((res) => {
        const supplier = res.data;
        setFormData({
          supplierId,
          name: supplier.name,
          contactName: supplier.contactName,
          email: supplier.email,
          phone: supplier.phone,
          address: supplier.address,
          statusId: supplier.statusId,
        });
      })
      .catch(() => {
        toast.error("Không thể tải thông tin nhà cung cấp");
        setIsOpen(false);
      })
      .finally(() => setIsLoading(false));
  }, [open, supplierId, setIsOpen]);

  const handleChange = (field: keyof SupplierEditFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) return;

    setIsSaving(true);
    try {
      await updateSupplier(supplierId, formData as any);
      toast.success("Cập nhật thông tin nhà cung cấp thành công!");
      onUpdated();
      setIsOpen(false);
    } catch {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sửa nhà cung cấp</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin và trạng thái của nhà cung cấp.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <p className="text-center py-8">Đang tải dữ liệu...</p>
        ) : (
          <form onSubmit={handleSaveChanges} className="space-y-4">
            {/* Trạng thái */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.statusId?.toString() ?? ""}
                onValueChange={(value) =>
                  handleChange("statusId", Number(value))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusList.map((status) => (
                    <SelectItem
                      key={status.statusId}
                      value={status.statusId.toString()}
                    >
                      {status.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Thông tin cơ bản */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên nhà cung cấp *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Tên người liên hệ</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => handleChange("contactName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
