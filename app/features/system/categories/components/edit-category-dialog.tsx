import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import toast from "react-hot-toast";
import { Loader2, Save, Upload, X } from "lucide-react";

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
import { getCategoryHierarchy, updateCategory } from "~/services/categories";
import type { CategoryDetailDto } from "~/types/product/category";

type CategoryForm = {
  name: string;
  slug: string;
  description?: string;
  parentId: string;
  sizeDetail?: File | null;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // 🧠 Lấy danh sách trạng thái từ Redux
  const { data: statusesData, isLoading: isStatusesLoading } = useAppSelector(
    (state) => state.statuses
  );

  // 🧩 Load parent categories khi mở
  useEffect(() => {
    if (open) {
      loadParentCategories();
    }
  }, [open]);

  const loadParentCategories = async () => {
    try {
      const res = await getCategoryHierarchy();
      if (res?.isSuccess && Array.isArray(res.data)) {
        const mapped = res.data.map((c: any) => ({
          id: c.categoryId,
          name: c.name,
        }));
        setCategories(mapped);
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
    sizeDetail: null,
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

  // 🧠 Reset form khi mở dialog hoặc thay đổi selectedCategory
  useEffect(() => {
    if (open && selectedCategory) {
      reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description ?? "",
        parentId: selectedCategory.parentId?.toString() ?? "",
        sizeDetail: null,
        statusId: selectedCategory.status?.statusId ?? null,
      });
      setImagePreview(selectedCategory.sizeDetail ?? "");
      setImageFile(null);
    }
  }, [open, selectedCategory, reset]);

  // 🧩 Slug tự động theo tên
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

  // 🧩 Chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

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
      if (imageFile) formData.append("sizeDetail", imageFile);
      if (data.statusId) formData.append("statusId", data.statusId.toString());

      console.log("Updating category with data:", data);
      const res = await updateCategory(selectedCategory!.categoryId, formData);

      if (res?.isSuccess) {
        toast.success("Cập nhật thể loại thành công!");
        onUpdated();
        setIsOpen(false);
      } else {
        toast.error(res?.message || "Không thể cập nhật thể loại!");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      const message =
        error?.response?.data?.message ||
        "Có lỗi xảy ra khi cập nhật thể loại!";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Tạo danh sách trạng thái từ Redux
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
          <DialogDescription>Cập nhật thông tin thể loại</DialogDescription>
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
              {...register("name", {
                required: "Vui lòng nhập tên thể loại",
                maxLength: {
                  value: 100,
                  message: "Tên thể loại không được vượt quá 100 ký tự",
                },
              })}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Slug and Parent */}
          <div className="flex gap-4">
            {/* Slug */}
            <div className="flex-2">
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input
                placeholder="slug-tu-dong-tao"
                disabled={isLoading}
                {...register("slug", {
                  required: "Vui lòng nhập slug",
                  pattern: {
                    value: /^[a-z0-9-]+$/,
                    message: "Slug chỉ chứa chữ thường, số và dấu -",
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
              <label className="text-sm font-medium mb-1 block">
                Thể loại cha
              </label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categories.map((c) => ({
                      value: c.id.toString(),
                      label: c.name,
                    }))}
                    placeholder="Chọn thể loại cha"
                    isClearable
                    isSearchable={false}
                    styles={reactSelectStyles}
                    isDisabled={isLoading}
                    onChange={(opt) => field.onChange(opt?.value ?? "")}
                    value={
                      categories
                        .map((c) => ({
                          value: c.id.toString(),
                          label: c.name,
                        }))
                        .find((opt) => opt.value === field.value) || null
                    }
                  />
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-1 block">Mô tả</label>
            <Textarea
              rows={3}
              placeholder="Nhập mô tả (tùy chọn)"
              disabled={isLoading}
              {...register("description", {
                maxLength: {
                  value: 255,
                  message: "Mô tả không được vượt quá 255 ký tự",
                },
              })}
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Image upload and Status */}
          <div className="flex gap-4">
            {/* Image upload */}
            <div className="flex-2">
              <label className="text-sm font-medium mb-1 block">
                Ảnh chi tiết kích thước
              </label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("categoryImageInput")?.click()
                  }
                  disabled={isLoading}
                >
                  <Upload size={16} />
                  Chọn ảnh
                </Button>
                <input
                  id="categoryImageInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                {imageFile && (
                  <span className="text-sm text-gray-600">
                    {imageFile.name}
                  </span>
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
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0"
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Trạng thái
              </label>
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
                      isDisabled={isLoading || isStatusesLoading}
                      value={
                        statuses.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(option) =>
                        field.onChange(option?.value ?? null)
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
