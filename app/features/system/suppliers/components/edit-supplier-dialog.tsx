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
import type { EditSupplierDialogProps, SupplierFormData } from "../types/index";

export default function EditSupplierDialog({ open, setIsOpen, supplier }: EditSupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact: "",
    info: "",
    status: "active",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        info: supplier.info,
        status: supplier.status,
      });
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement edit supplier logic
    console.log("Updating supplier:", formData);
    setIsOpen(false);
  };

  const handleChange = (field: keyof SupplierFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sửa nhà cung cấp</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhà cung cấp trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên nhà cung cấp *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nhập tên nhà cung cấp"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Thông tin liên hệ</Label>
            <Textarea
              id="contact"
              value={formData.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
              placeholder="Tên liên hệ, email, số điện thoại (mỗi thông tin một dòng)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="info">Thông tin bổ sung</Label>
            <Textarea
              id="info"
              value={formData.info}
              onChange={(e) => handleChange("info", e.target.value)}
              placeholder="Địa chỉ, ghi chú khác"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
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
