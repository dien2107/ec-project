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
import type { EditImportOrderDialogProps, ImportOrderFormData } from "../types";

export function EditImportOrderModal({ open, order, onClose, onSave }: EditImportOrderDialogProps) {
  const [formData, setFormData] = useState<ImportOrderFormData>({
    supplier: "",
    quantity: 0,
    total: 0,
    status: "pending",
    orderDate: "",
    expectedDate: "",
  });

  useEffect(() => {
    if (order) {
      setFormData({
        supplier: order.supplier,
        quantity: order.quantity,
        total: order.total,
        status: order.status,
        orderDate: order.orderDate,
        expectedDate: order.expectedDate,
      });
    }
  }, [order]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (order) {
      onSave({
        ...order,
        ...formData,
      });
      onClose();
    }
  };

  const handleChange = (field: keyof ImportOrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sửa đơn nhập hàng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin đơn nhập hàng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Nhà cung cấp *</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
                placeholder="Nhập tên nhà cung cấp"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value: "pending" | "approved" | "received") => handleChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="received">Đã nhận</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                placeholder="Nhập số lượng"
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Tổng tiền *</Label>
              <Input
                id="total"
                type="number"
                value={formData.total}
                onChange={(e) => handleChange("total", Number(e.target.value))}
                placeholder="Nhập tổng tiền"
                required
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate">Ngày đặt *</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => handleChange("orderDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedDate">Ngày dự kiến *</Label>
              <Input
                id="expectedDate"
                type="date"
                value={formData.expectedDate}
                onChange={(e) => handleChange("expectedDate", e.target.value)}
                required
              />
            </div>
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
