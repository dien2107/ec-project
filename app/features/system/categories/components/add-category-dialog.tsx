import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Plus, Loader2, X } from "lucide-react";

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
import Select from "react-select";
import { reactSelectStyles } from "~/components/ui/react-select-styles";

type CategoryForm = {
  name: string;
  slug: string;
  description?: string;
  parentId: number | null;
  fileImage: File | null;
};

export default function AddCategoryDialog({
  onAdded,
}: {
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parentId: null,
      fileImage: null,
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug
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

  // Load categories
  const loadParentCategories = async () => {
    try {
      const res = await getCategoryHierarchy();
      if (res?.isSuccess && Array.isArray(res.data)) {
        setCategories(
          res.data.map((c: any) => ({
            id: c.categoryId,
            name: c.name,
          }))
        );
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error loading parent categories:", error);
      setCategories([]);
    }
  };

  // Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setSelectedFile(file);
      setValue("fileImage", file);
      setImageError("");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  // Reset form when open
  useEffect(() => {
    if (open) {
      reset();
      setSelectedFile(null);
      setImageError("");
      loadParentCategories();
    }
  }, [open, reset]);

  const handleSubmitClick = async (data: CategoryForm) => {
    try {
      setIsLoading(true);

      const isValid = await trigger();
      if (!isValid) return;

      if (!data.parentId) {
        toast.error("Vui lòng chọn thể loại cha!");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Slug", data.slug);
      if (data.description) formData.append("Description", data.description);
      formData.append("ParentId", data.parentId.toString());

      if (selectedFile) {
        formData.append("FileImage", selectedFile);
      }

      // 🪵🪵🪵 LOG TOÀN BỘ FORM DATA TRƯỚC KHI GỬI
      console.group("📦 [AddCategoryDialog] FormData gửi lên API:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: (File) ${value.name} - ${value.size} bytes`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      console.groupEnd();
      // 🪵🪵🪵

      const res = await createCategory(formData);
      console.log("📩 Response từ API:", res);

      if (res?.isSuccess) {
        toast.success(res?.message || "Thêm thể loại thành công!");
        onAdded?.();
        setOpen(false);
      } else {
        toast.error(res?.message || "Không thể thêm thể loại!");
      }
    } catch (error: any) {
      console.error("❌ Lỗi khi gọi API tạo thể loại:", error);

      // 🪵 Nếu có response từ server, in ra toàn bộ để xem lỗi
      if (error?.response) {
        console.error("📥 Response data:", error.response.data);
        console.error("📥 Status:", error.response.status);
        console.error("📥 Headers:", error.response.headers);
      }

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        "Có lỗi xảy ra khi thêm thể loại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setValue("fileImage", null);
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

          {/* Slug + Parent */}
          <div className="flex gap-4">
            {/* Slug */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                type="text"
                placeholder="slug-tu-dong-tao"
                disabled={isLoading}
                {...register("slug", {
                  required: "Vui lòng nhập slug",
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

            {/* Parent */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Thể loại cha</label>
              <Controller
                name="parentId"
                control={control}
                rules={{ required: "Vui lòng chọn thể loại cha" }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      options={categories.map((c) => ({
                        value: c.id,
                        label: c.name,
                      }))}
                      styles={reactSelectStyles}
                      placeholder="Chọn thể loại cha"
                      isDisabled={isLoading}
                      onChange={(opt) => field.onChange(opt?.value ?? null)}
                      value={
                        categories
                          .map((c) => ({ value: c.id, label: c.name }))
                          .find((opt) => opt.value === field.value) || null
                      }
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
          </div>

          {/* Image Dropzone */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Ảnh thể loại (tùy chọn)
            </label>
            <div
              {...getRootProps()}
              className={`border-dashed min-h-48 border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${selectedFile
                ? "border-gray-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-400"
                }`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              {!selectedFile ? (
                <p className="text-gray-500">
                  Kéo thả hoặc bấm để chọn ảnh thể loại (không bắt buộc)
                </p>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt={selectedFile.name}
                    className="w-32 h-32 object-cover rounded shadow"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="w-4 h-4 mr-1" /> Xóa ảnh
                  </Button>
                </div>
              )}
            </div>
            {imageError && (
              <span className="text-red-500 text-xs mt-2">{imageError}</span>
            )}
          </div>

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
