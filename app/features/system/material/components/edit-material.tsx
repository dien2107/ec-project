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
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { reactSelectStyles } from "~/components/ui/react-select-styles";

// 🧩 Redux imports
import { useAppSelector } from "~/redux/store";

// 🧩 Service
import { updateMaterial } from "~/services/materials";
import type { MaterialDetailDto } from "~/types/product/material";

type MaterialForm = {
  name: string;
  description: string;
  statusId: number | null;
};

export default function EditMaterialDialog({
  open,
  setIsOpen,
  selectedMaterial,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMaterial: MaterialDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Lấy danh sách trạng thái từ Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  const defaultValues: MaterialForm = {
    name: selectedMaterial?.name ?? "",
    description: selectedMaterial?.description ?? "",
    statusId: selectedMaterial?.status?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
  } = useForm<MaterialForm>({ defaultValues });

  // 🧠 Reset form khi mở dialog hoặc thay đổi selectedMaterial
  useEffect(() => {
    if (open && selectedMaterial) {
      reset({
        name: selectedMaterial.name,
        description: selectedMaterial.description ?? "",
        statusId: selectedMaterial.status?.statusId ?? null,
      });
    }
  }, [open, selectedMaterial, reset]);

  const handleSubmitClick = async (data: MaterialForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const updateData = {
        name: data.name,
        description: data.description,
        statusId: data.statusId,
      };

      console.log("Updating material with data:", updateData);
      const res = await updateMaterial(
        selectedMaterial!.materialId,
        updateData
      );

      if (res?.isSuccess) {
        toast.success("Cập nhật chất liệu thành công!");
        onUpdated();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Không thể cập nhật chất liệu!");
      }
    } catch (error: any) {
      console.error("Error updating material:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật chất liệu!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Tạo danh sách trạng thái từ Redux
  const statuses =
    statusesData["Material"]?.map((s) => ({
      value: s.statusId,
      label: s.displayName || s.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[600px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Cập nhật chất liệu</DialogTitle>
          <DialogDescription>Cập nhật thông tin chất liệu</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên chất liệu */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên chất liệu
            </label>
            <Input
              type="text"
              placeholder="Nhập tên chất liệu"
              disabled={isLoading}
              {...register("name", {
                required: "Vui lòng nhập tên chất liệu",
                maxLength: {
                  value: 100,
                  message: "Tên chất liệu không được vượt quá 100 ký tự",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              rows={3}
              placeholder="Nhập mô tả chất liệu (nếu có)"
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          {/* Trạng thái */}
          <div className="w-[250px]">
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
