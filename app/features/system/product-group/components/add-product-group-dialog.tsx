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
import { createProductGroup } from "~/services/product-groups";

interface AddProductGroupDialogProps {
  onAdded: () => void;
}

type ProductGroupForm = {
  name: string;
};

export default function AddProductGroupDialog({
  onAdded,
}: AddProductGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductGroupForm>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const handleSubmitClick = async (data: ProductGroupForm) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("name", data.name.trim());

      const res = await createProductGroup(formData);
      console.log("API res:", res);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm nhóm sản phẩm thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm nhóm sản phẩm!");
      }
    } catch (error: any) {
      console.error("Error creating product group:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm nhóm sản phẩm!";
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
          Thêm nhóm sản phẩm
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[480px] max-h-[90vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Thêm nhóm sản phẩm</DialogTitle>
          <DialogDescription>
            Nhập tên nhóm sản phẩm mới để thêm vào hệ thống
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên nhóm sản phẩm */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên nhóm sản phẩm</label>
            <Input
              type="text"
              placeholder="VD: Áo thun, quần jeans..."
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
                  Thêm nhóm sản phẩm
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
