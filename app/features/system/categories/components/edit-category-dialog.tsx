import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { Loader2, Save, X } from "lucide-react";

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

import { useAppSelector } from "~/redux/store";
import { getCategoryHierarchy, updateCategory } from "~/services/categories";
import type { CategoryDetailDto } from "~/types/product/category";

type CategoryForm = {
  name: string;
  slug: string;
  description?: string;
  parentId: string;
  fileImage: File | null;
  statusId: number | null;
};

export default function EditCategoryDialog({
  open,
  setIsOpen,
  selectedCategory,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedCategory: CategoryDetailDto | null;
  onUpdated: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageError, setImageError] = useState("");
  const [isImageDeleted, setIsImageDeleted] = useState(false); // 🆕 Theo dõi trạng thái xóa ảnh

  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  // 🧩 Load parent categories
  useEffect(() => {
    if (open) loadParentCategories();
  }, [open]);

  const loadParentCategories = async () => {
    try {
      const res = await getCategoryHierarchy();
      if (res?.isSuccess && Array.isArray(res.data)) {
        setCategories(
          res.data.map((c: any) => ({ id: c.categoryId, name: c.name }))
        );
      } else setCategories([]);
    } catch {
      setCategories([]);
    }
  };

  const defaultValues: CategoryForm = {
    name: selectedCategory?.name ?? "",
    slug: selectedCategory?.slug ?? "",
    description: selectedCategory?.description ?? "",
    parentId: selectedCategory?.parentId?.toString() ?? "",
    fileImage: null,
    statusId: selectedCategory?.status?.statusId ?? null,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<CategoryForm>({
    defaultValues,
  });

  // 🧠 Reset form khi mở
  useEffect(() => {
    if (open && selectedCategory) {
      reset(defaultValues);
      setPreviewUrl(selectedCategory.sizeDetail ?? "");
      setSelectedFile(null);
      setImageError("");
      setIsImageDeleted(false);

      // Khóa trường thể loại cha nếu là ID 1 hoặc 2
      if (
        selectedCategory.categoryId === 1 ||
        selectedCategory.categoryId === 2
      ) {
        setValue("parentId", ""); // Hoặc đặt giá trị mặc định khác
        trigger(); // Xác nhận lại trạng thái để cập nhật giao diện
      }
    }
  }, [open, selectedCategory, reset]);

  // 🧩 Slug auto
  const nameValue = watch("name");
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

  // 🧩 Dropzone xử lý ảnh
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Ảnh không được vượt quá 5MB");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setValue("fileImage", file);
    setImageError("");
    setIsImageDeleted(false); // 🆕 Reset flag khi upload ảnh mới
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setValue("fileImage", null);
    setIsImageDeleted(true); // 🆕 Đánh dấu là người dùng muốn xóa ảnh
  };

  // 🧩 Submit cập nhật
  const handleSubmitClick = async (data: CategoryForm) => {
    try {
      setIsLoading(true);
      const isValid = await trigger();
      if (!isValid) return;

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (data.description) formData.append("description", data.description);
      if (data.parentId) formData.append("parentId", data.parentId);
      if (data.statusId) formData.append("statusId", data.statusId.toString());

      // 🆕 Logic xử lý ảnh
      if (selectedFile) {
        // Trường hợp 1: Upload ảnh mới
        formData.append("fileImage", selectedFile);
      } else if (isImageDeleted) {
        // Trường hợp 2: Xóa ảnh (gửi flag hoặc empty string)
        formData.append("removeImage", "true"); // Hoặc BE có thể nhận "deleteImage": "true"
      }
      // Trường hợp 3: Không làm gì (giữ ảnh cũ) -> không gửi field fileImage

      // console.group("📦 [EditCategoryDialog] FormData gửi lên:");
      // for (const [key, value] of formData.entries()) {
      //   if (value instanceof File) console.log(`${key}: (File) ${value.name}`);
      //   else console.log(`${key}:`, value);
      // }
      // console.groupEnd();

      const res = await updateCategory(selectedCategory!.categoryId, formData);

      if (res?.isSuccess) {
        toast.success("Cập nhật thể loại thành công!");
        onUpdated();
        setIsOpen(false);
      } else toast.error(res?.message || "Không thể cập nhật thể loại!");
    } catch (error: any) {
      console.error("❌ Lỗi cập nhật thể loại:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật thể loại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const statuses =
    statusesData["Category"]?.map((s) => ({
      value: s.statusId,
      label: s.displayName || s.name,
    })) ?? [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cập nhật thể loại</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin thể loại</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClick)}
          className="flex flex-col gap-4 py-1"
        >
          {/* Tên thể loại */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Tên thể loại
            </label>
            <Input
              placeholder="Nhập tên thể loại"
              disabled={isLoading}
              {...register("name", { required: "Vui lòng nhập tên thể loại" })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Slug + Parent */}
          <div className="flex gap-4">
            <div className="flex-2">
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                placeholder="slug-tu-dong-tao"
                disabled={isLoading}
                {...register("slug", {
                  required: "Vui lòng nhập slug",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "Slug không hợp lệ",
                  },
                })}
              />
              {errors.slug && (
                <span className="text-red-500 text-xs">
                  {errors.slug.message}
                </span>
              )}
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Thể loại cha
              </label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => {
                  // 🧩 Loại bỏ chính danh mục hiện tại khỏi danh sách chọn cha
                  const parentOptions = categories
                    .filter((c) => c.id !== selectedCategory?.categoryId) // ❌ Không cho chọn chính nó
                    .map((c) => ({ value: c.id.toString(), label: c.name }));

                  return (
                    <Select
                      {...field}
                      options={parentOptions}
                      placeholder="Chọn thể loại cha"
                      styles={reactSelectStyles}
                      isDisabled={
                        isLoading ||
                        selectedCategory?.categoryId === 1 ||
                        selectedCategory?.categoryId === 2
                      }
                      onChange={(opt) => field.onChange(opt?.value ?? "")}
                      value={
                        parentOptions.find(
                          (opt) => opt.value === field.value
                        ) || null
                      }
                    />
                  );
                }}
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              rows={3}
              placeholder="Nhập mô tả"
              disabled={isLoading}
              {...register("description")}
            />
          </div>

          {/* Dropzone Upload */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Ảnh thể loại
            </label>
            <div
              {...getRootProps()}
              className={`border-dashed min-h-48 border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                previewUrl
                  ? "border-gray-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
            >
              <input {...getInputProps()} disabled={isLoading} />
              {!previewUrl ? (
                <p className="text-gray-500">
                  Kéo thả hoặc bấm để chọn ảnh (không bắt buộc)
                </p>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
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

          {/* Trạng thái */}
          <div>
            <label className="text-sm font-medium mb-1 block">Trạng thái</label>
            <Controller
              name="statusId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={statuses}
                  placeholder="Chọn trạng thái"
                  styles={reactSelectStyles}
                  isDisabled={
                    isLoading ||
                    isStatusesLoading ||
                    selectedCategory?.categoryId === 1 ||
                    selectedCategory?.categoryId === 2
                  }
                  onChange={(opt) => field.onChange(opt?.value ?? null)}
                  value={
                    statuses.find((opt) => opt.value === field.value) || null
                  }
                />
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
