import React, { useState } from "react";
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
import type { AddSupplierDialogProps, SupplierFormData } from "../types/index";

export default function AddSupplierDialog({ open, setIsOpen }: AddSupplierDialogProps) {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    contact: "",
    info: "",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add supplier logic
    console.log("Adding supplier:", formData);
    setIsOpen(false);
    // Reset form
    setFormData({
      name: "",
      contact: "",
      info: "",
      status: "active",
    });
  };

  const handleChange = (field: keyof SupplierFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm nhà cung cấp</DialogTitle>
          <DialogDescription>
            Điền thông tin để thêm nhà cung cấp mới vào hệ thống.
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
              Thêm nhà cung cấp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
