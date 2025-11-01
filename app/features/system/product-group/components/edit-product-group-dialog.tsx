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
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { updateProductGroup } from "~/services/product-groups";
import type { ProductGroupDetailDto } from "../../../../types/product/product-group";

// 🧩 Redux imports
import { useAppSelector } from "~/redux/store";

type ProductGroupForm = {
  name: string;
  statusId: number | null;
};

export default function EditProductGroupDialog({
  open,
  setIsOpen,
  selectedItem,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedItem: ProductGroupDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Lấy danh sách trạng thái từ Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  const defaultValues: ProductGroupForm = {
    name: selectedItem?.name ?? "",
    statusId: selectedItem?.status?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
  } = useForm<ProductGroupForm>({ defaultValues });

  // 🧠 Reset form khi mở dialog hoặc thay đổi selectedItem
  useEffect(() => {
    if (open && selectedItem) {
      reset({
        name: selectedItem.name,
        statusId: selectedItem.status?.statusId ?? null,
      });
    }
  }, [open, selectedItem, reset]);

  const handleSubmitClick = async (data: ProductGroupForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const updateData = {
        name: data.name,
        statusId: data.statusId,
      };

      console.log("Updating product group with data:", updateData);
      const res = await updateProductGroup(
        selectedItem!.productGroupId,
        updateData
      );

      if (res?.isSuccess) {
        toast.success("Cập nhật nhóm sản phẩm thành công!");
        onUpdated();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Không thể cập nhật nhóm sản phẩm!");
      }
    } catch (error: any) {
      console.error("Error updating product group:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật nhóm sản phẩm!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Tạo danh sách trạng thái từ Redux
  const statuses =
    statusesData["ProductGroup"]?.map((s) => ({
      value: s.statusId,
      label: s.displayName || s.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[500px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Cập nhật nhóm sản phẩm</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin nhóm sản phẩm
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên nhóm sản phẩm */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên nhóm sản phẩm
            </label>
            <Input
              type="text"
              placeholder="Nhập tên nhóm sản phẩm"
              disabled={isLoading}
              {...register("name", {
                required: "Vui lòng nhập tên nhóm sản phẩm",
                maxLength: {
                  value: 50,
                  message: "Tên nhóm sản phẩm không được vượt quá 50 ký tự",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
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
