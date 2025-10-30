import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { createSize } from "~/services/sizes";

interface AddSizeDialogProps {
  onAdded: () => void;
}

type SizeForm = {
  name: string;
};

export default function AddSizeDialog({ onAdded }: AddSizeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SizeForm>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleSubmitClick = async (data: SizeForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());

      const res = await createSize(formData);
      console.log("API res:", res);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm kích thước thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm kích thước!");
      }
    } catch (error: any) {
      console.error("Error creating size:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm kích thước!";
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
          Thêm kích thước
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[480px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Thêm kích thước</DialogTitle>
          <DialogDescription>
            Nhập tên kích thước mới để thêm vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên kích thước */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên kích thước</label>
            <Input
              type="text"
              placeholder="VD: S, M, L, XL..."
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
                  Thêm kích thước
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
