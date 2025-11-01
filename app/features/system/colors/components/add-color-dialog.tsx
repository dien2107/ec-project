import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createColor } from "~/services/colors";
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

interface AddColorDialogProps {
  onAdded: () => void;
}

type ColorForm = {
  name: string;
  displayName: string;
  hexCode: string;
};

export default function AddColorDialog({ onAdded }: AddColorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ColorForm>({
    defaultValues: {
      name: "",
      displayName: "",
      hexCode: "#000000",
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const colorValue = event.target.value;
    setValue("hexCode", colorValue); // Cập nhật giá trị hexCode trong form
  };

  const handleSubmitClick = async (data: ColorForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("displayName", data.displayName);
      formData.append("hexCode", data.hexCode);

      const res = await createColor(formData);
      console.log("API res:", res);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm màu sắc thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm màu sắc!");
      }
    } catch (error: any) {
      console.error("Error creating color:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm màu sắc!";

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
          Thêm màu sắc
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[480px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Thêm màu sắc</DialogTitle>
          <DialogDescription>Thêm màu sắc mới vào hệ thống</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên màu (Tiếng anh) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên màu sắc</label>
            <Input
              type="text"
              placeholder="vd: red, blue"
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

          {/* Tên hiển thị (Tiếng Việt) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên hiển thị</label>
            <Input
              type="text"
              placeholder="vd: Đỏ tươi, Xanh dương"
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

          {/* Mã màu (Hex) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Mã màu (Hex)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                onChange={handleColorChange} // Thêm handler ở đây
              />
              <Input
                type="text"
                placeholder="#000000"
                className="flex-1"
                disabled={isLoading}
                {...register("hexCode", {
                  required: "Vui lòng nhập mã màu hex",
                  maxLength: {
                    value: 7,
                    message: "Mã màu hex không hợp lệ",
                  },
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

          {/* Footer buttons */}
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
                  Thêm màu
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
