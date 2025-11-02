import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { reactSelectStyles } from "~/components/ui/react-select-styles";

import { useAppSelector } from "~/redux/store";
import { updateDiscount } from "~/services/discounts";
import type { DiscountDetailDto } from "~/types/discounts";

type DiscountForm = {
  code: string;
  description?: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  startAt: string;
  endAt: string;
  statusId: number | null;
};

export default function EditPromotionDialog({
  open,
  setIsOpen,
  selectedPromotion,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedPromotion: DiscountDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  const defaultValues: DiscountForm = {
    code: selectedPromotion?.code ?? "",
    description: selectedPromotion?.description ?? "",
    discountType: selectedPromotion?.discountType ?? "percentage",
    discountValue: selectedPromotion?.discountValue ?? 0,
    minOrderAmount: selectedPromotion?.minOrderAmount ?? 0,
    maxDiscountAmount: selectedPromotion?.maxDiscountAmount ?? undefined,
    usageLimit: selectedPromotion?.usageLimit ?? undefined,
    startAt: selectedPromotion?.startAt
      ? new Date(selectedPromotion.startAt).toISOString().split("T")[0]
      : "",
    endAt: selectedPromotion?.endAt
      ? new Date(selectedPromotion.endAt).toISOString().split("T")[0]
      : "",
    statusId: selectedPromotion?.status?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<DiscountForm>({ defaultValues });

  const discountType = watch("discountType");
  const discountValue = watch("discountValue");
  const minOrderAmount = watch("minOrderAmount");
  const maxDiscountAmount = watch("maxDiscountAmount");

  // 🧠 Reset form khi mở
  useEffect(() => {
    if (open && selectedPromotion) {
      reset({
        code: selectedPromotion.code,
        description: selectedPromotion.description ?? "",
        discountType: selectedPromotion.discountType,
        discountValue: selectedPromotion.discountValue,
        minOrderAmount: selectedPromotion.minOrderAmount,
        maxDiscountAmount: selectedPromotion.maxDiscountAmount ?? undefined,
        usageLimit: selectedPromotion.usageLimit ?? undefined,
        startAt: selectedPromotion.startAt
          ? new Date(selectedPromotion.startAt).toISOString().split("T")[0]
          : "",
        endAt: selectedPromotion.endAt
          ? new Date(selectedPromotion.endAt).toISOString().split("T")[0]
          : "",
        statusId: selectedPromotion.status?.statusId ?? null,
      });
    }
  }, [open, selectedPromotion, reset]);

  // 🆕 Tự động set maxDiscountAmount = discountValue nếu discountType = fixed
  useEffect(() => {
    if (discountType === "fixed" && discountValue) {
      setValue("maxDiscountAmount", discountValue);
      // Re-validate các trường liên quan
      trigger(["maxDiscountAmount", "minOrderAmount"]);
    }
  }, [discountType, discountValue, setValue, trigger]);

  // 🆕 Re-validate khi minOrderAmount thay đổi
  useEffect(() => {
    if (maxDiscountAmount) {
      trigger("maxDiscountAmount");
    }
  }, [minOrderAmount, maxDiscountAmount, trigger]);

  // 🆕 Re-validate khi maxDiscountAmount thay đổi
  useEffect(() => {
    if (minOrderAmount) {
      trigger("minOrderAmount");
    }
  }, [maxDiscountAmount, minOrderAmount, trigger]);

  const handleSubmitClick = async (data: DiscountForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const updateData = {
        code: data.code,
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        usageLimit: data.usageLimit,
        startAt: data.startAt,
        endAt: data.endAt,
        statusId: data.statusId,
      };

      const res = await updateDiscount(
        selectedPromotion!.discountId,
        updateData
      );

      if (res?.isSuccess) {
        await onUpdated();
        setIsOpen(false);
        toast.success("Cập nhật mã khuyến mãi thành công!");
      } else {
        toast.error(res?.message || "Không thể cập nhật mã khuyến mãi!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi cập nhật mã khuyến mãi:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật mã khuyến mãi!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const statuses =
    statusesData["Discount"]?.map((s) => ({
      value: s.statusId,
      label: s.displayName || s.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật mã khuyến mãi</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin mã khuyến mãi
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Mã khuyến mãi */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Mã khuyến mãi
            </label>
            <Input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              disabled={isLoading || (selectedPromotion?.usedCount ?? 0) > 0}
              {...register("code", {
                required: "Vui lòng nhập mã khuyến mãi",
                maxLength: { value: 50, message: "Tối đa 50 ký tự" },
              })}
            />
            {errors.code && (
              <span className="text-red-500 text-xs">
                {errors.code.message}
              </span>
            )}
            {(selectedPromotion?.usedCount ?? 0) > 0 && (
              <span className="text-gray-500 text-xs">
                Mã khuyến mãi đã được sử dụng, không thể thay đổi.
              </span>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              rows={3}
              placeholder="Nhập mô tả (nếu có)"
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          {/* Đơn tối thiểu */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Giá trị đơn tối thiểu
            </label>
            <Input
              type="number"
              step="1"
              disabled={isLoading}
              {...register("minOrderAmount", {
                required: "Vui lòng nhập giá trị đơn tối thiểu",
                min: { value: 0, message: "Phải >= 0" },
                validate: (value) => {
                  const max = watch("maxDiscountAmount");
                  if (max && Number(value) < Number(max)) {
                    return "Giá trị đơn tối thiểu phải >= giá trị giảm tối đa";
                  }
                  return true;
                },
              })}
            />
            {errors.minOrderAmount && (
              <span className="text-red-500 text-xs">
                {errors.minOrderAmount.message}
              </span>
            )}
          </div>

          {/* Loại giảm giá */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Loại giảm giá
            </label>
            <Controller
              name="discountType"
              control={control}
              rules={{ required: "Vui lòng chọn loại giảm giá" }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={[
                      { value: "percentage", label: "Phần trăm (%)" },
                      { value: "fixed", label: "Số tiền" },
                    ]}
                    placeholder="Chọn loại giảm giá"
                    isSearchable={false}
                    styles={reactSelectStyles}
                    onChange={(option) => field.onChange(option?.value ?? "")}
                    value={
                      [
                        { value: "percentage", label: "Phần trăm (%)" },
                        { value: "fixed", label: "Số tiền" },
                      ].find((opt) => opt.value === field.value) || null
                    }
                    isDisabled={isLoading}
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
          <div>
            <label className="text-sm font-medium mb-1 block">
              Giá trị khuyến mãi
            </label>
            <Input
              type="number"
              step="1"
              placeholder={
                discountType === "percentage" ? "Nhập 0-100" : "Nhập số tiền"
              }
              disabled={isLoading}
              {...register("discountValue", {
                required: "Vui lòng nhập giá trị khuyến mãi",
                min: { value: 0, message: "Giá trị phải >= 0" },
                validate: (value) => {
                  if (discountType === "percentage" && Number(value) > 100) {
                    return "Phần trăm không vượt quá 100";
                  }
                  return true;
                },
              })}
            />
            {errors.discountValue && (
              <span className="text-red-500 text-xs">
                {errors.discountValue.message}
              </span>
            )}
          </div>

          {/* Giá trị giảm tối đa */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Giá trị giảm tối đa
            </label>
            <Input
              type="number"
              step="1"
              placeholder={
                discountType === "fixed"
                  ? "Tự động = giá trị khuyến mãi"
                  : "Nhập giá trị tối đa"
              }
              disabled={isLoading || discountType === "fixed"}
              {...register("maxDiscountAmount", {
                required: "Vui lòng nhập giá trị giảm tối đa",
                min: { value: 0, message: "Phải >= 0" },
                validate: (value) => {
                  const minOrder = watch("minOrderAmount");
                  if (value && minOrder && Number(value) > Number(minOrder)) {
                    return "Giá trị giảm tối đa phải <= giá trị đơn tối thiểu";
                  }
                  return true;
                },
              })}
            />
            {errors.maxDiscountAmount && (
              <span className="text-red-500 text-xs">
                {errors.maxDiscountAmount.message}
              </span>
            )}
          </div>

          {/* Ngày bắt đầu và ngày kết thúc */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-1 w-[48%]">
              <label className="text-sm font-medium">Ngày bắt đầu</label>
              <Input
                type="date"
                disabled={isLoading}
                {...register("startAt", {
                  required: "Vui lòng chọn ngày bắt đầu",
                })}
              />
              {errors.startAt && (
                <span className="text-red-500 text-xs">
                  {errors.startAt.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1 w-[48%]">
              <label className="text-sm font-medium">Ngày kết thúc</label>
              <Input
                type="date"
                disabled={isLoading}
                {...register("endAt", {
                  required: "Vui lòng chọn ngày kết thúc",
                  validate: (value) => {
                    if (!value) return "Vui lòng chọn ngày kết thúc";
                    const endDate = new Date(value);
                    const startDate = new Date(watch("startAt"));
                    if (endDate < startDate) {
                      return "Ngày kết thúc phải >= ngày bắt đầu";
                    }
                    return true;
                  },
                })}
              />
              {errors.endAt && (
                <span className="text-red-500 text-xs">
                  {errors.endAt.message}
                </span>
              )}
            </div>
          </div>

          {/* Giới hạn sử dụng */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Giới hạn sử dụng
            </label>
            <Input
              type="number"
              disabled={isLoading}
              placeholder="Để trống nếu không giới hạn"
              {...register("usageLimit", {
                min: { value: 1, message: "Phải >= 1" },
                validate: (value) => {
                  if (!value) return true;
                  const usedCount = selectedPromotion?.usedCount ?? 0;
                  if (usedCount > 0 && Number(value) < usedCount) {
                    return `Giới hạn phải >= ${usedCount} (đã sử dụng)`;
                  }
                  return true;
                },
              })}
            />
            {errors.usageLimit && (
              <span className="text-red-500 text-xs">
                {errors.usageLimit.message}
              </span>
            )}
            {(selectedPromotion?.usedCount ?? 0) > 0 && (
              <span className="text-gray-500 text-xs">
                Đã sử dụng: {selectedPromotion?.usedCount} lần
              </span>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="text-sm font-medium mb-1 block">Trạng thái</label>
            <Controller
              name="statusId"
              control={control}
              rules={{ required: "Vui lòng chọn trạng thái" }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    options={statuses}
                    placeholder={
                      isStatusesLoading ? "Đang tải..." : "Chọn trạng thái"
                    }
                    isSearchable={false}
                    styles={reactSelectStyles}
                    onChange={(option) => field.onChange(option?.value ?? null)}
                    value={
                      statuses.find((opt) => opt.value === field.value) || null
                    }
                    isDisabled={isLoading || isStatusesLoading}
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

          {/* Footer */}
          <DialogFooter className="mt-4">
            {!isLoading && (
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
            )}
            <Button
              type="submit"
              className="bg-[#3770EC] text-white flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
