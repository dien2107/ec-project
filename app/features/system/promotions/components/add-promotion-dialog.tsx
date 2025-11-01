import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Select from "react-select";

import { createDiscount } from "~/services/discounts";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { reactSelectStyles } from "~/components/ui/react-select-styles";

interface AddPromotionDialogProps {
  onAdded: () => void;
}

type PromotionForm = {
  promotionCode: string;
  discountType: string;
  promotionValue: string;
  promotionMaxValue: string;
  promotionMinOrder: string;
  promotionUsageLimit: string;
};

const discountTypeOptions = [
  { value: "percentage", label: "Phần trăm (%)" },
  { value: "fixed", label: "Số tiền" },
];

export default function AddPromotionDialog({
  onAdded,
}: AddPromotionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PromotionForm>({
    defaultValues: {
      promotionCode: "",
      discountType: "percentage",
      promotionValue: "",
      promotionMaxValue: "",
      promotionMinOrder: "",
      promotionUsageLimit: "",
    },
  });

  // Watch for validation and auto-fill
  const promotionMinOrder = watch("promotionMinOrder");
  const discountType = watch("discountType");
  const promotionValue = watch("promotionValue");
  const promotionMaxValue = watch("promotionMaxValue");

  // Reset promotionValue and promotionMaxValue when discountType changes
  useEffect(() => {
    if (discountType) {
      setValue("promotionValue", "");
      setValue("promotionMaxValue", "");
    }
  }, [discountType, setValue]);

  // Auto-fill MaxDiscountAmount when type is fixed and promotionValue changes
  useEffect(() => {
    if (discountType === "fixed" && promotionValue) {
      setValue("promotionMaxValue", promotionValue);
    }
  }, [promotionValue, setValue]);

  // Re-validate promotionMaxValue when promotionMinOrder changes
  useEffect(() => {
    if (promotionMaxValue) {
      trigger("promotionMaxValue");
    }
  }, [promotionMinOrder, trigger, promotionMaxValue]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      reset({
        promotionCode: "",
        discountType: "percentage",
        promotionValue: "",
        promotionMaxValue: "",
        promotionMinOrder: "",
        promotionUsageLimit: "",
      });
    }
  }, [open, reset]);

  const handleSubmitClick = async (data: PromotionForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("Code", data.promotionCode);
      formData.append("DiscountType", data.discountType);
      formData.append("DiscountValue", data.promotionValue);

      if (data.promotionMaxValue) {
        formData.append("MaxDiscountAmount", data.promotionMaxValue);
      }

      if (data.promotionMinOrder) {
        formData.append("MinOrderAmount", data.promotionMinOrder);
      } else {
        formData.append("MinOrderAmount", "0");
      }

      if (data.promotionUsageLimit && data.promotionUsageLimit.trim() !== "") {
        formData.append("UsageLimit", data.promotionUsageLimit);
      }

      console.log("Creating promotion with data:", data);
      const res = await createDiscount(formData);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm mã khuyến mãi thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm mã khuyến mãi!");
      }
    } catch (error: any) {
      console.error("Error creating promotion:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm mã khuyến mãi!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-[#3770EC] text-white cursor-pointer">
          <Plus />
          Thêm mã khuyến mãi
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm mã khuyến mãi</DialogTitle>
          <DialogDescription>
            Thêm mã khuyến mãi mới vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Mã khuyến mãi */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Mã khuyến mãi</label>
            <Input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              disabled={isLoading}
              {...register("promotionCode", {
                required: "Vui lòng nhập mã khuyến mãi",
                maxLength: {
                  value: 50,
                  message: "Tối đa 50 ký tự",
                },
              })}
            />
            {errors.promotionCode && (
              <span className="text-red-500 text-xs">
                {errors.promotionCode.message}
              </span>
            )}
          </div>

          {/* Loại giảm giá */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Loại giảm giá</label>
            <Controller
              name="discountType"
              control={control}
              rules={{ required: "Vui lòng chọn loại giảm giá" }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={discountTypeOptions}
                    placeholder="Chọn loại giảm giá"
                    isSearchable={false}
                    styles={reactSelectStyles}
                    isDisabled={isLoading}
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    value={
                      discountTypeOptions.find(
                        (opt) => opt.value === field.value
                      ) || null
                    }
                  />
                  {fieldState.error && (
                    <span className="text-red-500 text-xs">
                      {fieldState.error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>

          {/* Giá trị khuyến mãi */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Giá trị khuyến mãi</label>
            <Input
              type="number"
              step="0.01"
              placeholder={
                discountType === "percentage"
                  ? "Nhập giá trị từ 0-100"
                  : "Nhập giá trị giảm"
              }
              disabled={isLoading}
              {...register("promotionValue", {
                required: "Vui lòng nhập giá trị khuyến mãi",
                min: {
                  value: 0,
                  message: "Giá trị khuyến mãi phải lớn hơn hoặc bằng 0",
                },
                validate: (value) => {
                  if (!value || !discountType) return true;
                  const numValue = parseFloat(value);
                  if (discountType === "percentage") {
                    if (numValue > 100) {
                      return "Giá trị phần trăm không được vượt quá 100";
                    }
                  }
                  return true;
                },
              })}
            />
            {errors.promotionValue && (
              <span className="text-red-500 text-xs">
                {errors.promotionValue.message}
              </span>
            )}
          </div>

          {/* Giảm tối đa */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Giá trị giảm tối đa</label>
            <Input
              type="number"
              step="0.01"
              placeholder={
                discountType === "fixed"
                  ? "Tự động điền bằng giá trị khuyến mãi"
                  : "Nhập giá trị giảm tối đa (tùy chọn)"
              }
              disabled={isLoading || discountType === "fixed"}
              {...register("promotionMaxValue", {
                required: "Vui lòng nhập giá trị giảm tối đa",
                min: {
                  value: 0,
                  message: "Giá trị giảm tối đa phải lớn hơn hoặc bằng 0",
                },
                validate: (value) => {
                  if (!value) return true;
                  const maxValue = parseFloat(value);
                  const minOrder = parseFloat(promotionMinOrder || "0");
                  if (minOrder > 0 && maxValue > minOrder) {
                    return "Giá trị giảm tối đa phải nhỏ hơn hoặc bằng giá trị đơn hàng tối thiểu";
                  }
                  return true;
                },
              })}
            />
            {errors.promotionMaxValue && (
              <span className="text-red-500 text-xs">
                {errors.promotionMaxValue.message}
              </span>
            )}
          </div>

          {/* Đơn tối thiểu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Giá trị đơn hàng tối thiểu
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="Nhập giá trị đơn tối thiểu"
              disabled={isLoading}
              {...register("promotionMinOrder", {
                required: "Vui lòng nhập giá trị đơn hàng tối thiểu",
                min: {
                  value: 0,
                  message:
                    "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0",
                },
                validate: (value) => {
                  if (!value || !promotionMaxValue) return true;
                  const minOrder = parseFloat(value);
                  const maxDiscount = parseFloat(promotionMaxValue);
                  if (minOrder < maxDiscount) {
                    return "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng giá trị giảm tối đa";
                  }
                  return true;
                },
              })}
            />
            {errors.promotionMinOrder && (
              <span className="text-red-500 text-xs">
                {errors.promotionMinOrder.message}
              </span>
            )}
          </div>

          {/* Giới hạn sử dụng */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Giới hạn sử dụng</label>
            <Input
              type="number"
              placeholder="Nhập giới hạn sử dụng (tùy chọn, để trống nếu không giới hạn)"
              disabled={isLoading}
              {...register("promotionUsageLimit", {
                min: {
                  value: 1,
                  message: "Giới hạn sử dụng phải lớn hơn 0",
                },
              })}
            />
            {errors.promotionUsageLimit && (
              <span className="text-red-500 text-xs">
                {errors.promotionUsageLimit.message}
              </span>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4">
            {!isLoading && (
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
            )}
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
                  Thêm khuyến mãi
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
