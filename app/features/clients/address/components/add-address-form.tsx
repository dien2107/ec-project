import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import Select from "react-select";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import type { AddressFormData } from "../types/address";
import type { Province } from "~/types/address/province";
import type { Ward } from "~/types/address/ward";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchProvinces } from "~/redux/slices/provinces";
import { createAddress, getWardsByProvinceId } from "~/services/addresses";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

const mergedSelectStyles = {
  ...reactSelectStyles,
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
    position: "absolute",
  }),
  menuPortal: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};

const AddAddressForm = ({ onAdded }: { onAdded: () => void }) => {
  const dispatch = useAppDispatch();
  const { provinces } = useAppSelector((state) => state.provinces);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(fetchProvinces());
    }
  }, [dispatch]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      recipientName: "",
      phone: "",
      streetAddress: "",
      provinceId: null,
      wardId: null,
      isDefault: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        recipientName: "",
        phone: "",
        streetAddress: "",
        provinceId: null,
        wardId: null,
        isDefault: false,
      });
    }
  }, [open, reset]);

  // Use react-hook-form state instead of a separate local formData state
  const provinceId = watch("provinceId");
  const wardId = watch("wardId");

  const provinceOptions = (provinces ?? []).map((p: Province) => ({
    label: p.name,
    value: p.id,
  }));

  const { data: wards = [], isLoading: wardsLoading } = useQuery({
    queryKey: ["wards", provinceId],
    queryFn: () =>
      provinceId ? getWardsByProvinceId(provinceId) : Promise.resolve([]),
    enabled: !!provinceId,
  });

  const wardOptions = (wards.data ?? []).map((w: any) => ({
    label: w.name,
    value: w.wardId ?? w.id,
  }));

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);

      const isValid = await trigger();
      if (!isValid) return;

      await createAddress(1, data);
      toast.success("Thêm địa chỉ thành công!");
      onAdded();
      setOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm địa chỉ!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          // onClick={handleAdd}
          className="ml-auto bg-[#3770EC] text-white cursor-pointer"
        >
          <Plus />
          Thêm địa chỉ
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Recipient name and phone number */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Họ và tên</Label>
                <Input
                  id="recipientName"
                  {...register("recipientName", {
                    required: "Vui lòng nhập tên người nhận hàng",
                    minLength: {
                      value: 3,
                      message: "Tên người nhận phải có ít nhất 3 ký tự",
                    },
                    maxLength: {
                      value: 255,
                      message: "Tên người nhận không được vượt quá 255 ký tự",
                    },
                  })}
                  placeholder="Nhập họ và tên"
                />
                {errors.recipientName && (
                  <p className="text-sm text-red-500">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  {...register("phone", {
                    required: "Vui lòng nhập số điện thoại",
                    pattern: {
                      value: /^(0|\+84)\d{9}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                    maxLength: {
                      value: 12,
                      message: "Số điện thoại không hợp lệ",
                    },
                  })}
                  placeholder="Nhập số điện thoại"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            {/* Select combobox province and ward */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Tỉnh/Thành phố</Label>
                <Controller
                  control={control}
                  name="provinceId"
                  rules={{ required: "Vui lòng chọn tỉnh/thành phố" }}
                  render={({ field }) => (
                    <Select
                      id="city"
                      name="city"
                      isSearchable={true}
                      options={provinceOptions}
                      value={
                        provinceOptions.find((p) => p.value === field.value) ||
                        null
                      }
                      onChange={(val) => {
                        field.onChange(val ? val.value : null);
                        // clear ward selection when province changes
                        setValue("wardId", null);
                      }}
                      placeholder="Chọn Tỉnh/TP"
                      classNamePrefix="react-select"
                      styles={mergedSelectStyles}
                      closeMenuOnSelect={true}
                      blurInputOnSelect={true}
                    />
                  )}
                />
                {errors.provinceId && (
                  <p className="text-sm text-red-500">
                    {errors.provinceId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Controller
                  control={control}
                  name="wardId"
                  rules={{ required: "Vui lòng chọn phường/xã" }}
                  render={({ field }) => (
                    <Select
                      id="ward"
                      name="ward"
                      isSearchable={true}
                      isDisabled={!provinceId || wardsLoading}
                      options={wardOptions}
                      value={
                        wardOptions.find((w: any) => w.value === field.value) ||
                        null
                      }
                      onChange={(val) => field.onChange(val ? val.value : null)}
                      placeholder={`${wardsLoading ? "Đang tải..." : "Chọn Phường/Xã"}`}
                      classNamePrefix="react-select"
                      styles={mergedSelectStyles}
                    />
                  )}
                />
                {errors.wardId && (
                  <p className="text-sm text-red-500">
                    {errors.wardId.message}
                  </p>
                )}
              </div>
            </div>
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ cụ thể </Label>
              <Input
                id="streetAddress"
                {...register("streetAddress", {
                  required: "Vui lòng nhập địa chỉ cụ thể",
                  minLength: {
                    value: 6,
                    message: "Địa chỉ cụ thể phải có ít nhất 6 ký tự",
                  },
                  maxLength: {
                    value: 255,
                    message: "Địa chỉ cụ thể không được vượt quá 255 ký tự",
                  },
                })}
                placeholder="Nhập địa chỉ cụ thể"
              />
              {errors.streetAddress && (
                <p className="text-sm text-red-500">
                  {errors.streetAddress.message}
                </p>
              )}
            </div>
            {/* Checkbox set default address */}
            <div className="flex items-center gap-2 pt-2">
              <Input
                id="isDefault"
                type="checkbox"
                {...register("isDefault")}
                className="size-4 accent-blue-600 cursor-pointer"
              />
              <Label
                htmlFor="isDefault"
                className="text-sm font-medium cursor-pointer"
              >
                Đặt làm địa chỉ mặc định
              </Label>
            </div>
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-[#3770EC] text-white cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang thêm...
                  </>
                ) : (
                  <>
                    <Plus />
                    Thêm địa chỉ
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddAddressForm;
