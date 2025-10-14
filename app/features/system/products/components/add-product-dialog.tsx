import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { useAppSelector } from "~/redux/store";
import { createProduct } from "~/services/products";
import { Plus, Loader2 } from "lucide-react";
import type { Category, Material, Color, ProductGroup } from "../types/product";

export default function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [imageError, setImageError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Định nghĩa hàm onDrop
  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0] || null);
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      materialId: null as number | null,
      categoryId: null as number | null,
      productGroupId: null as number | null,
      colorId: null as number | null,
      fileImage: File,
    },
  });

  const { meta } = useAppSelector((state) => state.productMeta);

  const categories: Category[] = meta?.data?.categories || [];
  const materials: Material[] = meta?.data?.materials || [];
  const productGroups: ProductGroup[] = meta?.data?.productGroups || [];
  const colors: Color[] = meta?.data?.colors || [];

  // Truyền onDrop vào useDropzone
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  // Khi mở form thì reset file
  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      setImageError("");
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (selectedFile) {
      setImageError("");
    }
  }, [selectedFile]);

  const handleSubmitClick = async (data: any) => {
    try {
      setIsLoading(true);

      const isValid = await trigger();
      if (!isValid) return;

      if (!selectedFile) {
        setImageError("Vui lòng chọn ảnh sản phẩm!");
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("Name", data.name);
      formData.append("Slug", data.slug);
      formData.append("ColorId", data.colorId ? data.colorId.toString() : "");
      formData.append(
        "MaterialId",
        data.materialId ? data.materialId.toString() : ""
      );
      formData.append(
        "CategoryId",
        data.categoryId ? data.categoryId.toString() : ""
      );
      formData.append(
        "ProductGroupId",
        data.productGroupId ? data.productGroupId.toString() : ""
      );
      formData.append("FileImage", selectedFile);

      const response = await createProduct(formData);
      if (response) {
        toast.success("Thêm sản phẩm thành công!");
        setOpen(false);
      }
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi thêm sản phẩm!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-[#3770EC] text-white cursor-pointer">
          <Plus />
          Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[640px] max-w-[800px] max-h-[96vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full flex flex-col px-2 overflow-y-auto scrollbar-custom">
          <form
            onSubmit={handleSubmit(handleSubmitClick)}
            className="flex flex-col flex-1 h-full"
          >
            <div className="flex flex-col gap-4 py-4 flex-1">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="productName" className="text-sm font-medium">
                    Tên sản phẩm
                  </label>
                  <Input
                    type="text"
                    id="productName"
                    placeholder="Nhập tên sản phẩm"
                    className="mt-1"
                    disabled={isLoading}
                    {...register("name", {
                      required: "Tên sản phẩm không được để trống",
                      minLength: {
                        value: 3,
                        message: "Tên sản phẩm phải có ít nhất 3 ký tự",
                      },
                    })}
                  />
                  {errors.name && (
                    <span className="text-red-500 text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="flex-1 ">
                  <div className="mb-1">
                    <label
                      htmlFor="productPrice"
                      className="text-sm font-medium"
                    >
                      Thể loại
                    </label>
                  </div>
                  <Controller
                    name="categoryId"
                    control={control}
                    rules={{ required: "Vui lòng chọn thể loại sản phẩm" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          options={categories.map((cat) => ({
                            value: cat.categoryId,
                            label: cat.name,
                          }))}
                          placeholder="Chọn thể loại"
                          isSearchable
                          isDisabled={isLoading}
                          styles={reactSelectStyles}
                          classNamePrefix="scrollbar-custom"
                          onChange={(option) =>
                            field.onChange(option?.value ?? null)
                          }
                          value={
                            categories
                              .map((cat) => ({
                                value: cat.categoryId,
                                label: cat.name,
                              }))
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

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label htmlFor="slug" className="text-sm font-medium">
                    Slug
                  </label>
                  <Input
                    type="text"
                    id="slug"
                    placeholder="Slug-san-pham"
                    className="mt-1"
                    disabled={isLoading}
                    {...register("slug", {
                      required: "Slug không được để trống",
                      pattern: {
                        value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                        message: "Slug chỉ chứa chữ thường, số, dấu gạch ngang",
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
                  <div className="mb-1">
                    <label
                      htmlFor="productPrice"
                      className="text-sm font-medium"
                    >
                      Chất liệu
                    </label>
                  </div>
                  <Controller
                    name="materialId"
                    control={control}
                    rules={{ required: "Vui lòng chọn chất liệu" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          options={materials.map((mat) => ({
                            value: mat.materialId,
                            label: mat.name,
                          }))}
                          placeholder="Chọn chất liệu"
                          isDisabled={isLoading}
                          isSearchable
                          styles={reactSelectStyles}
                          onChange={(option) =>
                            field.onChange(option?.value ?? null)
                          }
                          value={
                            materials
                              .map((mat) => ({
                                value: mat.materialId,
                                label: mat.name,
                              }))
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
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1">
                    <label
                      htmlFor="productPrice"
                      className="text-sm font-medium"
                    >
                      Màu sắc
                    </label>
                  </div>
                  <Controller
                    name="colorId"
                    control={control}
                    rules={{ required: "Vui lòng chọn màu sắc" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          options={colors.map((color) => ({
                            value: color.colorId,
                            label: color.name,
                          }))}
                          styles={reactSelectStyles}
                          isDisabled={isLoading}
                          placeholder="Chọn màu sắc"
                          isSearchable
                          onChange={(option) =>
                            field.onChange(option?.value ?? null)
                          }
                          value={
                            colors
                              .map((color) => ({
                                value: color.colorId,
                                label: color.name,
                              }))
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
                <div className="flex-1">
                  <div className="mb-1">
                    <label
                      htmlFor="productPrice"
                      className="text-sm font-medium"
                    >
                      Chọn nhóm sản phẩm
                    </label>
                  </div>
                  <Controller
                    name="productGroupId"
                    control={control}
                    rules={{ required: "Vui lòng chọn nhóm sản phẩm" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          {...field}
                          options={productGroups.map((group) => ({
                            value: group.productGroupId,
                            label: group.name,
                          }))}
                          styles={reactSelectStyles}
                          isDisabled={isLoading}
                          placeholder="Chọn nhóm sản phẩm"
                          isSearchable
                          onChange={(option) =>
                            field.onChange(option?.value ?? null)
                          }
                          value={
                            productGroups
                              .map((group) => ({
                                value: group.productGroupId,
                                label: group.name,
                              }))
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
              <div className="flex flex-col items-start gap-1">
                <section className="flex-1 w-full">
                  <label className="text-sm font-medium mb-2 block">
                    Ảnh sản phẩm
                  </label>
                  <div
                    {...getRootProps()}
                    className={`border-dashed min-h-60 border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
      ${selectedFile ? "border-gray-500 bg-blue-50" : "border-gray-300 bg-transparent hover:border-blue-400"}
    `}
                  >
                    <input {...getInputProps()} disabled={isLoading} />
                    <p className="text-gray-500 mb-2">
                      Kéo thả hoặc bấm vào đây để chọn ảnh
                    </p>
                    {selectedFile && (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                        className="w-36 h-36 object-cover rounded shadow mt-2"
                      />
                    )}
                  </div>
                </section>
                <div>
                  {imageError && (
                    <span className="text-red-500 text-xs mt-2">
                      {imageError}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
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
                    Thêm sản phẩm
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
