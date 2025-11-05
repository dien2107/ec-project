import { useState, useEffect, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { Button } from "~/components/ui/button";
import { Loader2, Save } from "lucide-react";
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
import { fetchProductFormMeta } from "~/redux/slices/product-form-meta";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import DropzoneProductImage from "./dropzone-product-image";
import { getAllImagesByProductId } from "~/services/product-images";
import toast from "react-hot-toast";
import { updateProduct } from "~/services/products";
import type { UpdateProduct } from "../types/update-product";
import type { Product } from "../../../../types/product/product";
import type { ProductImage } from "../types/product-image";
import { formatVND } from "~/libs";

export default function EditProductDialog({
  open,
  setIsOpen,
  selectedProduct,
  onUpdated,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  onUpdated: () => void;
}) {
  const dispatch = useAppDispatch();
  const { meta } = useAppSelector((state) => state.productMeta);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    discountPercentage: selectedProduct?.discountPercentage ?? 0,
    colorId: selectedProduct?.color?.colorId ?? null,
    statusId: selectedProduct?.status?.statusId ?? null,
    basePrice: selectedProduct?.basePrice ?? 0,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
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

  const basePrice = watch("basePrice") ?? 0;
  const discount = watch("discountPercentage") ?? 0;
  const sellingPrice = useMemo(() => {
    const base = Number(basePrice) || 0;
    const disc = Number(discount) || 0;
    return base > 0 ? Math.round(base * (1 - disc / 100)) : 0;
  }, [basePrice, discount]);

  const handleSubmitClick = async (data: any) => {
    try {
      setIsLoading(true);

      const isValid = await trigger();
      if (!isValid) return;

      const updateData: UpdateProduct = {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        materialId: data.materialId,
        productGroupId: data.productGroupId,
        discountPercentage: data.discountPercentage,
        colorId: data.colorId,
        statusId: data.statusId,
        basePrice: data.basePrice,
      };

      await updateProduct(selectedProduct!.productId, updateData);
      toast.success("Cập nhật sản phẩm thành công!");
      onUpdated();
      setIsOpen(false);
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
            className="flex flex-col flex-1 h-full"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4 mb-10">
                {/* Dòng 1: Product ID & Trạng thái */}
                <div className="flex items-center gap-4 col-span-2">
                  <div className="flex-1">
                    <label htmlFor="productId" className="text-sm font-medium">
                      Product ID
                    </label>
                    <Input
                      type="text"
                      id="productId"
                      value={
                        selectedProduct?.productId !== undefined
                          ? String(selectedProduct.productId).padStart(3, "0")
                          : ""
                      }
                      disabled
                      className="mt-1 bg-gray-100"
                    />
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
                            isDisabled={isLoading}
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

                {/* Dòng 2: Tên sản phẩm */}
                <div className="col-span-2">
                  <label htmlFor="productName" className="text-sm font-medium">
                    Tên sản phẩm
                  </label>
                  <Input
                    type="text"
                    id="productName"
                    disabled={isLoading}
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

                {/* Dòng 3: Slug */}
                <div className="col-span-2">
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

                {/* Dòng 4: Thể loại & Nhóm SP */}
                <div className="flex items-center gap-4 col-span-2">
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
                            isDisabled={isLoading}
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
                            isDisabled={isLoading}
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

                {/* Dòng 5: Chất liệu & Màu sắc */}
                <div className="flex items-center gap-4 col-span-2">
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
                            isDisabled={isLoading}
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
                            isDisabled={isLoading}
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
                </div>

                {/* Dòng 6: Giá cơ bản, Giảm giá (%), Giá bán */}
                <div className="flex items-center gap-4 col-span-2">
                  {/* Giá cơ bản */}
                  <div className="flex-1">
                    <label htmlFor="basePrice" className="text-sm font-medium">
                      Giá cơ bản
                    </label>
                    <Input
                      type="number"
                      id="basePrice"
                      disabled={isLoading}
                      className="mt-1"
                      placeholder="Nhập giá cơ bản"
                      {...register("basePrice", {
                        required: "Vui lòng nhập giá cơ bản",
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "Giá cơ bản phải lớn hơn hoặc bằng 0",
                        },
                      })}
                    />
                    {errors.basePrice && (
                      <p className="text-xs text-red-500">
                        {errors.basePrice.message}
                      </p>
                    )}
                  </div>

                  {/* Giảm giá (%) */}
                  <div className="flex-1">
                    <label
                      htmlFor="discountPercentage"
                      className="text-sm font-medium"
                    >
                      Giảm giá (%)
                    </label>
                    <Input
                      type="number"
                      id="discountPercentage"
                      disabled={isLoading}
                      className="mt-1"
                      placeholder="Nhập giảm giá"
                      {...register("discountPercentage", {
                        required: "Giảm giá không được để trống",
                        valueAsNumber: true,
                        validate: (value: number) => {
                          if (isNaN(value)) return "Giảm giá không hợp lệ";
                          if (value < 0)
                            return "Giảm giá phải lớn hơn hoặc bằng 0";
                          if (value > 100)
                            return "Giảm giá phải nhỏ hơn hoặc bằng 100";
                          return true;
                        },
                      })}
                    />
                    {errors.discountPercentage && (
                      <p className="text-red-500 text-xs">
                        {errors.discountPercentage.message}
                      </p>
                    )}
                  </div>

                  {/* Giá bán */}
                  <div className="flex-1">
                    <label
                      htmlFor="sellingPrice"
                      className="text-sm font-medium"
                    >
                      Giá bán
                    </label>
                    <Input
                      type="text"
                      id="sellingPrice"
                      value={formatVND(sellingPrice)}
                      disabled
                      className="mt-1 bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Ảnh sản phẩm */}
              <DropzoneProductImage
                selectedProduct={selectedProduct}
                productImages={productImages}
                reloadImages={fetchImages}
              />
            </div>

            <DialogFooter>
              {!isLoading && (
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
              )}
              <Button
                type="submit"
                className="bg-[#3770EC] text-white cursor-pointer flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Đang lưu...
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
