import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Ship } from "~/types/ship";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { useAppSelector } from "~/redux/store";
import type { ShippingFormData } from "../types/shipping-form-data";
import { updateShipping } from "~/services/ships";
interface EditShippingDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  method: Ship;
  onEdited: () => void;
}

export default function EditShippingDialog({
  open,
  setIsOpen,
  method,
  onEdited,
}: EditShippingDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.SHIP] ?? []
  );
  const inactiveStatus = statuses.find((s: any) => s.name === "Inactive");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<ShippingFormData>({
    defaultValues: {
      corpName: "",
      description: "",
      baseCost: 0,
      estimatedDays: 1,
    },
  });

  // reset form when dialog opens or method changes
  useEffect(() => {
    if (open && method) {
      reset({
        corpName: method.corpName ?? "",
        description: method.description ?? "",
        baseCost: method.baseCost ?? 0,
        estimatedDays: method.estimatedDays ?? 1,
      });
    }
    if (!open) {
      reset();
      setIsLoading(false);
    }
  }, [open, method, reset, setValue, inactiveStatus]);

  const onSubmit = async (data: ShippingFormData) => {
    try {
      setIsLoading(true);
      const valid = await trigger();
      if (!valid) {
        setIsLoading(false);
        return;
      }

      await updateShipping(method?.shipId, data);
      toast.success("Cập nhật phương thức vận chuyển thành công!");
      onEdited();
      setIsOpen(false);
    } catch (err: any) {
      toast.error(
        err?.message || "Có lỗi khi cập nhật phương thức vận chuyển!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!method) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa phương thức vận chuyển</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Dòng 1: Đơn vị vận chuyển (full width) */}
          <div className="space-y-2">
            <Label htmlFor="corpName">
              Đơn vị vận chuyển <span className="text-red-500">*</span>
            </Label>
            <Input
              id="corpName"
              placeholder="Nhập tên đơn vị vận chuyển"
              disabled={isLoading}
              {...register("corpName", {
                required: "Tên đơn vị vận chuyển không được để trống",
                minLength: { value: 3, message: "Tên phải có ít nhất 3 ký tự" },
              })}
            />
            {errors.corpName && (
              <span className="text-red-500 text-xs">
                {errors.corpName.message}
              </span>
            )}
          </div>

          {/* Dòng 2: Phí vận chuyển | Thời gian giao hàng */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="baseCost">
                Phí vận chuyển (VNĐ) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="baseCost"
                type="number"
                min={0}
                placeholder="Nhập phí vận chuyển"
                disabled={isLoading}
                {...register("baseCost", {
                  required: "Phí vận chuyển bắt buộc",
                  min: { value: 0, message: "Phí phải >= 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.baseCost && (
                <span className="text-red-500 text-xs">
                  {errors.baseCost.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedDays">
                Thời gian giao hàng (ngày){" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="estimatedDays"
                type="number"
                min={1}
                placeholder="Nhập số ngày giao hàng"
                disabled={isLoading}
                {...register("estimatedDays", {
                  required: "Thời gian giao hàng bắt buộc",
                  min: { value: 1, message: "Phải lớn hơn hoặc bằng 1 ngày" },
                  valueAsNumber: true,
                })}
              />
              {errors.estimatedDays && (
                <span className="text-red-500 text-xs">
                  {errors.estimatedDays.message}
                </span>
              )}
            </div>
          </div>

          {/* Dòng 4: Mô tả (full width) */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              rows={3}
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isLoading}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" variant="edit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Đang lưu...
                </>
              ) : (
                <>Lưu thay đổi</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
