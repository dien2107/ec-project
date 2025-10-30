import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { updateColor } from "~/services/colors";
import type { ColorDetailDto } from "~/types/product/color";

type ColorForm = {
  name: string;
  displayName: string;
  hexCode: string;
  statusId: number | null;
};

export default function EditColorDialog({
  open,
  setIsOpen,
  selectedColor,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedColor: ColorDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const defaultValues: ColorForm = {
    name: selectedColor?.name ?? "",
    displayName: selectedColor?.displayName ?? "",
    hexCode: selectedColor?.hexCode ?? "#000000",
    statusId: selectedColor?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<ColorForm>({
    defaultValues,
  });

  useEffect(() => {
    if (open && selectedColor) {
      reset({
        name: selectedColor.name,
        displayName: selectedColor.displayName,
        hexCode: selectedColor.hexCode,
        statusId: selectedColor.status.statusId,
      });
    }
  }, [open, selectedColor, reset]);

  const handleSubmitClick = async (data: ColorForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const updateData = {
        name: data.name,
        displayName: data.displayName,
        hexCode: data.hexCode,
        statusId: data.statusId,
      };

      const res = await updateColor(selectedColor!.colorId, updateData);

      if (res?.isSuccess) {
        toast.success("Cập nhật màu sắc thành công!");
        onUpdated();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Không thể cập nhật màu sắc!");
      }
    } catch (error: any) {
      console.error("Error updating color:", error);
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật màu sắc!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Trạng thái mẫu (có thể sau này lấy từ API)
  const statuses = [
    { value: 1, label: "Hoạt động" },
    { value: 0, label: "Ngưng hoạt động" },
  ];

  const hexValue = watch("hexCode");

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[600px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Cập nhật màu sắc</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-4"
        >
          {/* Tên màu */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên màu sắc
            </label>
            <Input
              type="text"
              placeholder="Nhập tên màu sắc"
              disabled={isLoading}
              {...register("name", {
                required: "Vui lòng nhập tên màu sắc",
                maxLength: {
                  value: 50,
                  message: "Tên màu sắc không được vượt quá 50 ký tự",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Tên hiển thị */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên hiển thị
            </label>
            <Input
              type="text"
              placeholder="Nhập tên hiển thị"
              disabled={isLoading}
              {...register("displayName", {
                required: "Vui lòng nhập tên hiển thị",
                maxLength: {
                  value: 50,
                  message: "Tên hiển thị không được vượt quá 50 ký tự",
                },
              })}
            />
            {errors.displayName && (
              <span className="text-red-500 text-xs">
                {errors.displayName.message}
              </span>
            )}
          </div>

          {/* Mã màu */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Mã màu (Hex)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                value={hexValue}
                onChange={(e) => setValue("hexCode", e.target.value)}
                disabled={isLoading}
              />
              <Input
                type="text"
                placeholder="#RRGGBB"
                className="flex-1"
                disabled={isLoading}
                {...register("hexCode", {
                  required: "Vui lòng nhập mã màu hex",
                  pattern: {
                    value: /^#[0-9A-Fa-f]{6}$/,
                    message: "Mã màu phải ở dạng #RRGGBB",
                  },
                })}
              />
            </div>
            {errors.hexCode && (
              <span className="text-red-500 text-xs">
                {errors.hexCode.message}
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
                    placeholder="Chọn trạng thái"
                    isSearchable={false}
                    styles={reactSelectStyles}
                    onChange={(option) => field.onChange(option?.value ?? null)}
                    value={
                      statuses.find((opt) => opt.value === field.value) || null
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
