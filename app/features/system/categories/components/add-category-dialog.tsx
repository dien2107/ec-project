import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Loader2, Upload, X } from "lucide-react";
import toast from "react-hot-toast";

import { createCategory, getCategoryHierarchy } from "~/services/categories";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface AddCategoryDialogProps {
  onAdded: () => void;
}

type CategoryForm = {
  name: string;
  slug: string;
  description?: string;
  parentId: string;
};

export default function AddCategoryDialog({ onAdded }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<
    { id: number; name: string; slug?: string }[]
  >([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: "",
    },
  });

  const nameValue = watch("name");
  const parentValue = watch("parentId");

  // Auto-generate slug from name
  useEffect(() => {
    if (nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [nameValue, setValue]);

  // Reset form when opening
  useEffect(() => {
    if (open) {
      reset();
      setImageFile(null);
      setImagePreview("");
      setTouched(false);
      loadParentCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Load categories (API returns flat list)
  const loadParentCategories = async () => {
    try {
      const res = await getCategoryHierarchy();
      if (res?.isSuccess && Array.isArray(res.data)) {
        const mapped = res.data.map((c: any) => ({
          id: c.categoryId,
          name: c.name,
          slug: c.slug,
        }));
        setCategories(mapped);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading parent categories:", error);
      setCategories([]);
    }
  };

  // Image handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // Submit
  const handleSubmitClick = async (data: CategoryForm) => {
    try {
      setIsLoading(true);
      setTouched(true);

      // Frontend validation for required parentId
      if (!data.parentId) {
        toast.error("Vui lòng chọn thể loại cha (Parent).");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (data.description) formData.append("description", data.description);
      formData.append("parentId", data.parentId);
      if (imageFile) formData.append("sizeDetail", imageFile);

      const res = await createCategory(formData);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm thể loại thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm thể loại!");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm thể loại!";
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
          Thêm thể loại
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm thể loại</DialogTitle>
          <DialogDescription>Thêm thể loại mới vào hệ thống</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tên thể loại</label>
            <Input
              type="text"
              placeholder="Nhập tên thể loại"
              disabled={isLoading}
              {...register("name", {
                required: "Vui lòng nhập tên thể loại",
                maxLength: { value: 100, message: "Tối đa 100 ký tự" },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Slug</label>
            <Input
              type="text"
              placeholder="slug-tu-dong-tao"
              disabled={isLoading}
              {...register("slug", {
                required: "Vui lòng nhập slug",
                maxLength: { value: 100, message: "Tối đa 100 ký tự" },
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: "Slug chỉ chứa chữ thường, số và dấu gạch ngang",
                },
              })}
            />
            {errors.slug && (
              <span className="text-red-500 text-xs">
                {errors.slug.message}
              </span>
            )}
          </div>

          {/* Parent select — BẮT BUỘC */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Thể loại cha</label>

            <Select
              value={parentValue ?? ""}
              disabled={isLoading}
              onValueChange={(value) => {
                setValue("parentId", value);
                setTouched(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thể loại cha" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="0" disabled>
                    Không có thể loại
                  </SelectItem>
                ) : (
                  categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Show error only after user touched the field or submitted */}
            {touched && !parentValue && (
              <span className="text-red-500 text-xs">
                Vui lòng chọn thể loại cha
              </span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả thể loại (tùy chọn)"
              rows={3}
              disabled={isLoading}
              {...register("description", {
                maxLength: { value: 255, message: "Tối đa 255 ký tự" },
              })}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Ảnh chi tiết kích thước
            </label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => document.getElementById("imageInput")?.click()}
                className="flex items-center gap-2"
              >
                <Upload size={16} />
                Chọn ảnh
              </Button>
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              {imageFile && (
                <span className="text-sm text-gray-600">{imageFile.name}</span>
              )}
            </div>
            {imagePreview && (
              <div className="relative w-32 h-32 mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                >
                  <X size={14} />
                </Button>
              </div>
            )}
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
                  Thêm thể loại
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
