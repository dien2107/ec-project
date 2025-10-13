import { useState, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { reactSelectStyles } from "~/components/ui/react-select-styles";
import { fetchProductFormMeta } from "~/redux/slices/products";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import DropzoneProductImage from "./dropzone-product-image";
import type { Product, ProductImage } from "../types";
import { getAllImagesByProductId } from "~/services/product-images";
import toast from "react-hot-toast";

export default function EditProductDialog({
  open,
  setIsOpen,
  selectedProduct,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedProduct: Product | null;
}) {
  const dispatch = useAppDispatch();
  const { meta } = useAppSelector((state) => state.productMeta);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (open && !meta) {
      dispatch(fetchProductFormMeta());
    }
  }, [open, meta, dispatch]);

  const fetchImages = useCallback(async () => {
    if (!selectedProduct?.productId) return;
    try {
      const response = await getAllImagesByProductId(selectedProduct.productId);
      if (response?.isSuccess) {
        setProductImages(response.data ?? []);
      } else {
        setProductImages([]);
        toast.error("Không thể tải ảnh sản phẩm!");
      }
    } catch (error) {
      setProductImages([]);
      toast.error("Lỗi khi tải ảnh sản phẩm!");
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (!open || !selectedProduct?.productId) return;
    fetchImages();
  }, [open, selectedProduct]);

  const defaultValues = {
    name: selectedProduct?.name ?? "",
    slug: selectedProduct?.slug ?? "",
    categoryId: selectedProduct?.category?.categoryId ?? null,
    materialId: selectedProduct?.material?.materialId ?? null,
    productGroupId: selectedProduct?.productGroup?.productGroupId ?? null,
    colorId: selectedProduct?.color?.colorId ?? null,
    statusId: selectedProduct?.status?.statusId ?? null,
    altText: selectedProduct?.primaryImage?.altText ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (open && selectedProduct) {
      reset(defaultValues);
    }
  }, [open, selectedProduct, reset]);

  const handleSubmitClick = async (data: any) => {
    const isValid = await trigger();
    if (!isValid) return;

    // TODO: Gọi API cập nhật sản phẩm ở đây
    // Ví dụ: updateProduct({ ...data, fileImage: selectedFile });
  };

  const categories = meta?.data?.categories || [];
  const materials = meta?.data?.materials || [];
  const productGroups = meta?.data?.productGroups || [];
  const colors = meta?.data?.colors || [];
  const statuses = meta?.data?.statuses || [];

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[80vw] max-w-[80vw] min-h-[80vh] flex flex-col justify-start">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="flex-1 h-full flex flex-col px-2 scrollbar-custom">
          <form
            onSubmit={handleSubmit(handleSubmitClick)}
            className="flex flex-col flex-1 h-full "
          >
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="flex flex-col gap-4 py-4 flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="productId" className="text-sm font-medium">
                      Product ID
                    </label>
                    <Input
                      type="text"
                      id="productId"
                      value={selectedProduct?.productId ?? ""}
                      disabled
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="productName"
                      className="text-sm font-medium"
                    >
                      Tên sản phẩm
                    </label>
                    <Input
                      type="text"
                      id="productName"
                      placeholder="Nhập tên sản phẩm"
                      className="mt-1"
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
                      {...register("slug", {
                        required: "Slug không được để trống",
                        pattern: {
                          value: /^[a-z0-9]+(-[a-z0-9]+)*$/,
                          message:
                            "Slug chỉ chứa chữ thường, số, dấu gạch ngang",
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
                    <label className="text-sm font-medium mb-2 block">
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
                            options={statuses.map((status: any) => ({
                              value: status.statusId,
                              label: status.displayName,
                            }))}
                            styles={reactSelectStyles}
                            placeholder="Chọn trạng thái"
                            isSearchable
                            onChange={(option) =>
                              field.onChange(option?.value ?? null)
                            }
                            value={
                              statuses
                                .map((status: any) => ({
                                  value: status.statusId,
                                  label: status.displayName,
                                }))
                                .find(
                                  (opt: any) => opt.value === field.value
                                ) || null
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
                    <label className="text-sm font-medium mb-2 block">
                      Thể loại
                    </label>
                    <Controller
                      name="categoryId"
                      control={control}
                      rules={{ required: "Vui lòng chọn thể loại sản phẩm" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            options={categories.map((cat: any) => ({
                              value: cat.categoryId,
                              label: cat.name,
                            }))}
                            placeholder="Chọn thể loại"
                            isSearchable
                            styles={reactSelectStyles}
                            onChange={(option) =>
                              field.onChange(option?.value ?? null)
                            }
                            value={
                              categories
                                .map((cat: any) => ({
                                  value: cat.categoryId,
                                  label: cat.name,
                                }))
                                .find(
                                  (opt: any) => opt.value === field.value
                                ) || null
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
                    <label className="text-sm font-medium mb-2 block">
                      Chất liệu
                    </label>
                    <Controller
                      name="materialId"
                      control={control}
                      rules={{ required: "Vui lòng chọn chất liệu" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            options={materials.map((mat: any) => ({
                              value: mat.materialId,
                              label: mat.name,
                            }))}
                            placeholder="Chọn chất liệu"
                            isSearchable
                            styles={reactSelectStyles}
                            onChange={(option) =>
                              field.onChange(option?.value ?? null)
                            }
                            value={
                              materials
                                .map((mat: any) => ({
                                  value: mat.materialId,
                                  label: mat.name,
                                }))
                                .find(
                                  (opt: any) => opt.value === field.value
                                ) || null
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
                    <label className="text-sm font-medium mb-2 block">
                      Màu sắc
                    </label>
                    <Controller
                      name="colorId"
                      control={control}
                      rules={{ required: "Vui lòng chọn màu sắc" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            options={colors.map((color: any) => ({
                              value: color.colorId,
                              label: color.name,
                            }))}
                            styles={reactSelectStyles}
                            placeholder="Chọn màu sắc"
                            isSearchable
                            onChange={(option) =>
                              field.onChange(option?.value ?? null)
                            }
                            value={
                              colors
                                .map((color: any) => ({
                                  value: color.colorId,
                                  label: color.name,
                                }))
                                .find(
                                  (opt: any) => opt.value === field.value
                                ) || null
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
                    <label className="text-sm font-medium mb-2 block">
                      Nhóm sản phẩm
                    </label>
                    <Controller
                      name="productGroupId"
                      control={control}
                      rules={{ required: "Vui lòng chọn nhóm sản phẩm" }}
                      render={({ field, fieldState }) => (
                        <>
                          <Select
                            {...field}
                            options={productGroups.map((group: any) => ({
                              value: group.productGroupId,
                              label: group.name,
                            }))}
                            styles={reactSelectStyles}
                            placeholder="Chọn nhóm sản phẩm"
                            isSearchable
                            onChange={(option) =>
                              field.onChange(option?.value ?? null)
                            }
                            value={
                              productGroups
                                .map((group: any) => ({
                                  value: group.productGroupId,
                                  label: group.name,
                                }))
                                .find(
                                  (opt: any) => opt.value === field.value
                                ) || null
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
              </div>
              <DropzoneProductImage
                selectedProduct={selectedProduct}
                productImages={productImages}
                reloadImages={fetchImages}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Hủy</Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-[#3770EC] text-white cursor-pointer"
              >
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
