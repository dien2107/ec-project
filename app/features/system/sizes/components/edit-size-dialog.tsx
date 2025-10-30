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
import { updateSize } from "~/services/sizes";
import type { SizeDetailDto } from "../../../../types/product/size";

// 🧩 Redux imports
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";

type SizeForm = {
  name: string;
  statusId: number | null;
};

export default function EditSizeDialog({
  open,
  setIsOpen,
  selectedSize,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedSize: SizeDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  // 🧠 Lấy danh sách trạng thái từ Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  // 🧩 Gọi API khi mở dialog
  useEffect(() => {
    if (open) {
      dispatch(fetchStatuses({ entityType: "Size" }));
    }
  }, [open, dispatch]);

  const defaultValues: SizeForm = {
    name: selectedSize?.name ?? "",
    statusId: selectedSize?.status?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
  } = useForm<SizeForm>({ defaultValues });

  // 🧠 Reset form khi mở dialog hoặc thay đổi selectedSize
  useEffect(() => {
    if (open && selectedSize) {
      reset({
        name: selectedSize.name,
        statusId: selectedSize.status?.statusId ?? null,
      });
    }
  }, [open, selectedSize, reset]);

  const handleSubmitClick = async (data: SizeForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const updateData = {
        name: data.name,
        statusId: data.statusId,
      };

      console.log("Updating size with data:", updateData);
      const res = await updateSize(selectedSize!.sizeId, updateData);

      if (res?.isSuccess) {
        toast.success("Cập nhật kích thước thành công!");
        onUpdated();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Không thể cập nhật kích thước!");
      }
    } catch (error: any) {
      console.error("Error updating size:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật kích thước!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Tạo danh sách trạng thái từ Redux
  const statuses =
    statusesData["Size"]?.map((s) => ({
      value: s.statusId,
      label:
        s.name === "Active"
          ? "Hoạt động"
          : s.name === "Inactive"
            ? "Không hoạt động"
            : s.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[500px] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Cập nhật kích thước</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin kích thước sản phẩm
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên kích thước */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên kích thước
            </label>
            <Input
              type="text"
              placeholder="Nhập tên kích thước"
              disabled={isLoading}
              {...register("name", {
                required: "Vui lòng nhập tên kích thước",
                maxLength: {
                  value: 50,
                  message: "Tên kích thước không được vượt quá 50 ký tự",
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
