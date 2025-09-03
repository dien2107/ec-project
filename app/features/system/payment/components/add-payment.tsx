import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
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
import { type PaymentMethod } from "../types";

interface AddPaymentMethodDialogProps {
  onSave: (methodData: Partial<PaymentMethod>) => void;
}

export default function AddPaymentMethodDialog({
  onSave,
}: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "bank_transfer" as PaymentMethod["type"],
    description: "",
    provider: "",
    accountInfo: "",
    transactionFee: 0,
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
    setFormData({
      name: "",
      type: "bank_transfer",
      description: "",
      provider: "",
      accountInfo: "",
      transactionFee: 0,
      status: "active",
    });
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#3770EC] text-white hover:bg-[#3770EC]/90">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phương thức thanh toán
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm phương thức thanh toán mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên phương thức *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  placeholder="Ví dụ: Chuyển khoản Vietcombank"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Loại phương thức *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: PaymentMethod["type"]) =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      Chuyển khoản ngân hàng
                    </SelectItem>
                    <SelectItem value="e_wallet">Ví điện tử</SelectItem>
                    <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Mô tả chi tiết về phương thức thanh toán"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="provider">Nhà cung cấp *</Label>
                <Input
                  id="provider"
                  value={formData.provider}
                  onChange={e => handleInputChange("provider", e.target.value)}
                  placeholder="Ví dụ: Vietcombank, MoMo, Visa"
                  required
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="transactionFee">Phí giao dịch (%)</Label>
                <Input
                  id="transactionFee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.transactionFee}
                  onChange={e =>
                    handleInputChange(
                      "transactionFee",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0.0"
                />
              </div> */}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="accountInfo">Thông tin tài khoản</Label>
              <Input
                id="accountInfo"
                value={formData.accountInfo}
                onChange={e => handleInputChange("accountInfo", e.target.value)}
                placeholder="Số tài khoản, số điện thoại hoặc thông tin gateway"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  handleInputChange("status", value)
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#3770EC] hover:bg-[#3770EC]/90"
            >
              Thêm mới
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
