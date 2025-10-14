import React, { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type ShippingMethod } from "../types";

interface EditShippingDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  method: ShippingMethod | null;
  onSave: (data: Partial<ShippingMethod>) => void;
}

export default function EditShippingDialog({
  open,
  setIsOpen,
  method,
  onSave,
}: EditShippingDialogProps) {
  const [formData, setFormData] = useState<Partial<ShippingMethod>>({
    corpName: "",
    description: "",
    baseCost: 0,
    estimatedDays: 3,
    status: "active",
  });

  useEffect(() => {
    if (method) {
      setFormData({
        corpName: method.corpName,
        description: method.description,
        baseCost: method.baseCost,
        estimatedDays: method.estimatedDays,
        status: method.status,
      });
    }
  }, [method]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  if (!method) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phương thức vận chuyển</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="corpName">
                Đơn vị vận chuyển <span className="text-red-500">*</span>
              </Label>
              <Input
                id="corpName"
                value={formData.corpName}
                onChange={e =>
                  setFormData({ ...formData, corpName: e.target.value })
                }
                placeholder="Nhập tên đơn vị vận chuyển"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseCost">
                Phí vận chuyển (VNĐ) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="baseCost"
                type="number"
                min="0"
                value={formData.baseCost}
                onChange={e =>
                  setFormData({
                    ...formData,
                    baseCost: Number(e.target.value),
                  })
                }
                placeholder="Nhập phí vận chuyển"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDays">
                Thời gian giao hàng (ngày){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estimatedDays"
                type="number"
                min="1"
                value={formData.estimatedDays}
                onChange={e =>
                  setFormData({
                    ...formData,
                    estimatedDays: Number(e.target.value),
                  })
                }
                placeholder="Nhập số ngày giao hàng"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={value =>
                  setFormData({
                    ...formData,
                    status: value as "active" | "inactive",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Nhập mô tả về phương thức vận chuyển"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
