import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { fetchProvinces } from "~/redux/slices/provinces";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { createAddress, getWardsByProvinceId } from "~/services/addresses";
import type { Province } from "~/types/address/province";
import type { AddressFormData } from "../types/address";

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

const AddAddressForm = ({
  onAdded,
  onCancel,
  onOpen,
  open: openProp,
  setIsOpen: setIsOpenProp,
  showAddButton = true,
}: {
  onAdded: () => void;
  onCancel?: () => void;
  onOpen?: () => void;
  open?: boolean;
  setIsOpen?: (open: boolean) => void;
  showAddButton?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { provinces } = useAppSelector((state) => state.provinces);
  const [internalOpen, setInternalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const actualOpen = openProp ?? internalOpen;
  const actualSetOpen = setIsOpenProp ?? setInternalOpen;

  const { addresses } = useAppSelector((state) => state.addresses);

  useEffect(() => {
    if (provinces.length === 0) {
      dispatch(fetchProvinces());
    }
  }, [dispatch, provinces.length]);

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
      isDefault: addresses.length === 0 ? true : false,
    },
  });

  useEffect(() => {
    if (actualOpen) {
      reset({
        recipientName: "",
        phone: "",
        streetAddress: "",
        provinceId: null,
        wardId: null,
        isDefault: addresses.length === 0 ? true : false,
      });
    }
  }, [actualOpen, reset]);

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

  // normalize possible shapes returned by getWardsByProvinceId
  // it may return an array or an object like { data: [...] } depending on service implementation
  const wardsList: any[] = Array.isArray(wards)
    ? wards
    : (wards?.data ?? wards?.items ?? []);

  const wardOptions = wardsList.map((w: any) => ({
    label: w.name,
    value: w.wardId ?? w.id,
  }));

  const onSubmit = async (data: AddressFormData) => {
    try {
      setIsLoading(true);

      const isValid = await trigger();
      if (!isValid) return;

      await createAddress(data);
      toast.success("Thêm địa chỉ thành công!");
      onAdded();
      actualSetOpen(false);
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
    <Dialog open={actualOpen} onOpenChange={actualSetOpen}>
      {showAddButton && (
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              if (onOpen) onOpen();
              actualSetOpen(true);
            }}
            className="ml-auto bg-[#3770EC] text-white cursor-pointer"
          >
            <Plus />
            Thêm địa chỉ
          </Button>
        </DialogTrigger>
      )}

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
                      isSearchable
                      options={provinceOptions}
                      value={
                        provinceOptions.find((p) => p.value === field.value) ||
                        null
                      }
                      onChange={(val) => {
                        field.onChange(val ? val.value : null);
                        setValue("wardId", null);
                      }}
                      placeholder="Chọn Tỉnh/TP"
                      classNamePrefix="react-select"
                      styles={mergedSelectStyles}
                      closeMenuOnSelect
                      blurInputOnSelect
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
                      isSearchable
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

            <div className="flex items-center gap-2 pt-2">
              <Input
                id="isDefault"
                type="checkbox"
                {...register("isDefault")}
                disabled={addresses.length === 0}
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
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    actualSetOpen(false);
                  }
                }}
              >
                {onCancel ? "Trở về" : "Hủy"}
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
