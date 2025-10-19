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
import { Loader2 } from "lucide-react";
import { createSupplier } from "~/services/supplier"; // Giả sử API service của bạn ở đây
import toast from "react-hot-toast";

// Cập nhật lại props để có callback onAdded
export interface AddSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onAdded: () => void; // Callback để tải lại danh sách
}

// Cập nhật state để khớp với API payload
interface SupplierApiData {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
}

export default function AddSupplierDialog({ open, setIsOpen, onAdded }: AddSupplierDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SupplierApiData>({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (field: keyof SupplierApiData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    // Reset form khi đóng dialog
    setFormData({
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
    });
    setIsOpen(false);
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const apiFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      apiFormData.append(key, value);
    });

    try {
      const res = await createSupplier(apiFormData);

      if (res?.isSuccess) {
        toast.success(res.message || "Thêm nhà cung cấp thành công!");
        setTimeout(() => {
          onAdded();
        }, 500);

        handleClose();
      } else {
        toast.error(res?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Failed to create supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm nhà cung cấp mới</DialogTitle>
          <DialogDescription>
            Điền các thông tin cần thiết để tạo một nhà cung cấp mới.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Tên nhà cung cấp */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên nhà cung cấp <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ví dụ: Công ty TNHH ABC"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Tên người liên hệ */}
            <div className="space-y-2">
              <Label htmlFor="contactName">Người liên hệ</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
                placeholder="Ví dụ: Anh Nguyễn Văn A"
              />
            </div>
             {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
            
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Ví dụ: contact@company.com"
            />
          </div>

          {/* Địa chỉ */}
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Nhập địa chỉ đầy đủ"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm nhà cung cấp
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

