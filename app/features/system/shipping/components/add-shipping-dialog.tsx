import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface AddShippingDialogProps {
  onSave: (data: Partial<ShippingMethod>) => void;
}

export default function AddShippingDialog({ onSave }: AddShippingDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<ShippingMethod>>({
    corpName: "",
    description: "",
    baseCost: 0,
    estimatedDays: 3,
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
    setFormData({
      corpName: "",
      description: "",
      baseCost: 0,
      estimatedDays: 3,
      status: "active",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phương thức vận chuyển
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm phương thức vận chuyển mới</DialogTitle>
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
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Thêm phương thức
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
