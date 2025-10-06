// components/AddressForm.tsx
import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { AddressFormProps } from "../types/address";

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="Nhập họ và tên"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onInputChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Địa chỉ cụ thể *</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onInputChange}
          placeholder="Nhập địa chỉ cụ thể"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="district">Quận/Huyện *</Label>
          <Input
            id="district"
            name="district"
            value={formData.district}
            onChange={onInputChange}
            placeholder="Quận/Huyện"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Tỉnh/Thành phố *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            placeholder="Tỉnh/TP"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={onSubmit}>
          {isEdit ? "Cập nhật" : "Thêm địa chỉ"}
        </Button>
      </div>
    </div>
  );
};
export default AddressForm;
