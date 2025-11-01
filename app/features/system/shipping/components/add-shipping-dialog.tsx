import React, { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { Ship } from "~/types/ship";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { useAppSelector } from "~/redux/store";
import { createShipping } from "~/services/ships";
import type { ShippingFormData } from "../types/shipping-form-data";

export default function AddShippingDialog({
  onAdded,
}: {
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
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

  useEffect(() => {
    if (open) {
      const defaults = {
        corpName: "",
        description: "",
        baseCost: 0,
        estimatedDays: 1,
      };
      reset(defaults);
      setIsLoading(false);
    }
  }, [open, reset, setValue, inactiveStatus]);

  const onSubmit = async (data: ShippingFormData) => {
    try {
      setIsLoading(true);
      const valid = await trigger();
      if (!valid) return;

      await createShipping(data);
      toast.success("Thêm phương thức vận chuyển thành công!");
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Thêm phương thức vận chuyển
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm phương thức vận chuyển mới</DialogTitle>
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
              placeholder="Nhập mô tả về phương thức vận chuyển"
              rows={3}
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            {!isLoading && (
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
            )}
            <Button type="submit" variant="add" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Đang thêm...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm phương thức
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
