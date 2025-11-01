import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createMaterial } from "~/services/materials";
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
import { Textarea } from "~/components/ui/textarea";

interface AddMaterialDialogProps {
  onAdded: () => void;
}

type MaterialForm = {
  name: string;
  description: string;
};

export default function AddMaterialDialog({ onAdded }: AddMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaterialForm>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleSubmitClick = async (data: MaterialForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("description", data.description.trim() || "");

      const res = await createMaterial(formData);
      console.log("API res:", res);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm chất liệu thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm chất liệu!");
      }
    } catch (error: any) {
      console.error("Error creating material:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm chất liệu!";
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
          Thêm chất liệu
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[480px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Thêm chất liệu</DialogTitle>
          <DialogDescription>
            Nhập tên chất liệu mới để thêm vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên chất liệu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên chất liệu</label>
            <Input
              type="text"
              placeholder="VD: Cotton, Lụa, Denim..."
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
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              placeholder="Mô tả ngắn gọn về chất liệu (tuỳ chọn)"
              rows={2}
              disabled={isLoading}
              {...register("description")}
            />
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
                  Thêm chất liệu
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
