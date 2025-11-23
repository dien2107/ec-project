"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
  SupplierSelect,
  ProductSearchList,
  SelectedProductsTable,
  SummaryPanel,
  ProductDetailPanel,
} from "./shared";

import type {
  AddImportOrderModalProps,
  Supplier,
  SelectedVariant,
} from "../types";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { fetchProductListData } from "~/redux/slices/products";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import { useDebounce } from "~/hooks/use-debounce";
import type { Product } from "~/types/product/product";
import { fetchProductVariants } from "~/redux/slices/product-variants";
export function AddImportOrderModal({
  open,
  onClose,
  onAdd,
}: AddImportOrderModalProps) {
  const dispatch = useAppDispatch();
  const isStatusesLoading = useAppSelector((state) => state.statuses.isLoading);
  const statusesError = useAppSelector((state) => state.statuses.isError);
  const {
    productList,
    isLoading: isProductListLoading,
    isError: productListError,
  } = useAppSelector((s) => s.productList);
  const {
    supplierList,
    isLoading: isSupplierListLoading,
    isError: supplierListError,
  } = useAppSelector((s) => s.SupplierList);
  const productVariantsState = useAppSelector((s) => s.productVariantList);
  const [supplier, setSupplier] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariant[]>(
    []
  );
  const [selectedVariantDetail, setSelectedVariantDetail] =
    useState<SelectedVariant | null>(null);

  const [variantPickerProductId, setVariantPickerProductId] = useState<
    number | null
  >(null);
  const [pickerSelectedIds, setPickerSelectedIds] = useState<number[]>([]);

  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [activeStatusId, setActiveStatusId] = useState<{
    supplier: number | undefined;
    product: number | undefined;
  }>({ supplier: undefined, product: undefined });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const normalizeItems = <T,>(items: unknown): T[] => {
    if (!items) return [];
    if (Array.isArray(items)) {
      return items.flat() as T[];
    }
    return [items as T];
  };

  const suppliers = useMemo(
    () => normalizeItems<Supplier>(supplierList?.data?.items),
    [supplierList]
  );
  const products = useMemo(
    () => normalizeItems<Product>(productList?.data?.items),
    [productList]
  );

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      const [sup, prod] = await Promise.all([
        dispatch(fetchStatuses({ entityType: ENTITY_TYPE.SUPPLIER })).unwrap(),
        dispatch(fetchStatuses({ entityType: ENTITY_TYPE.PRODUCT })).unwrap(),
      ]);
      setActiveStatusId({
        supplier: sup.statuses.find((s: any) => s.name === "Active")?.statusId,
        product: prod.statuses.find(
          (s: any) => s.name === "Active" || s.name === "OutOfStock"
        )?.statusId,
      });
    };
    fetch();
    setSupplier("");
    setSearchTerm("");
    setSelectedVariants([]);
    setSelectedVariantDetail(null);
    setOrderDate(new Date().toISOString().split("T")[0]);
    setVariantPickerProductId(null);
    setPickerSelectedIds([]);
  }, [open, dispatch]);

  useEffect(() => {
    if (!activeStatusId.supplier) return;
    const fetchAll = async () => {
      let page = 1;
      let res: any;
      do {
        res = await dispatch(
          fetchSupplierListData({
            Name: "",
            StatusId: activeStatusId.supplier!,
            PageNumber: page,
            PageSize: 1000,
          })
        );
        if (!fetchSupplierListData.fulfilled.match(res)) break;
        page++;
      } while (page <= (res.payload.data.totalPages ?? 1));
    };
    fetchAll();
  }, [dispatch, activeStatusId.supplier]);

  useEffect(() => {
    if (!activeStatusId.product) return;
    const fetchAll = async () => {
      let page = 1;
      let res: any;
      do {
        res = await dispatch(
          fetchProductListData({
            Search: debouncedSearchTerm,
            StatusName: "Active",
            PageNumber: page,
            PageSize: 1000,
          })
        );
        if (!fetchProductListData.fulfilled.match(res)) break;
        page++;
      } while (page <= (res.payload.data.totalPages ?? 1));
    };
    fetchAll();
  }, [dispatch, debouncedSearchTerm, activeStatusId.product]);

  const openVariantPicker = (product: Product) => {
    setVariantPickerProductId(product.productId);
    setPickerSelectedIds([]);
    dispatch(fetchProductVariants(product.productId));
  };

  const closeVariantPicker = () => {
    setVariantPickerProductId(null);
    setPickerSelectedIds([]);
  };

  const confirmPicker = () => {
    if (!variantPickerProductId) return;
    const product = products.find(
      (p) => p.productId === variantPickerProductId
    );
    if (!product) return;

    const variants =
      productVariantsState.variantsByProductId?.[variantPickerProductId] ?? [];

    // Tìm giá đã có của product (nếu đã có variant nào của product này)
    const existingVariant = selectedVariants.find(
      (v) => v.productId === variantPickerProductId
    );
    const basePrice = existingVariant?.productBasePrice ?? 0;
    const profitMargin = existingVariant?.profitMargin ?? 0;

    const toAdd: SelectedVariant[] = variants
      .filter((v: any) => pickerSelectedIds.includes(v.productVariantId))
      .map((v: any) => ({
        productId: product.productId,
        productName: product.name,
        productCode: product.productId.toString(),
        productVariantId: v.productVariantId,
        sku: v.sku ?? "",
        size:
          typeof v.size === "object" ? (v.size?.name ?? "") : (v.size ?? ""),
        color:
          typeof v.color === "object" ? (v.color?.name ?? "") : (v.color ?? ""),
        imageUrl: v.primaryImage?.imageUrl ?? product.primaryImage?.imageUrl,
        currentStock: v.stockQuantity ?? 0,
        importQuantity: 1,
        productBasePrice: basePrice, // Apply existing price if available
        profitMargin: profitMargin,
        suggestedPrice: basePrice * (1 + profitMargin / 100),
        totalPrice: basePrice * 1,
      }));

    setSelectedVariants((prev) => [...prev, ...toAdd]);
    closeVariantPicker();
  };

  const removeVariant = (id: number) => {
    setSelectedVariants((prev) =>
      prev.filter((v) => v.productVariantId !== id)
    );
    if (selectedVariantDetail?.productVariantId === id)
      setSelectedVariantDetail(null);
  };

  const updateVariant = (
    id: number,
    field: keyof Omit<
      SelectedVariant,
      | "productId"
      | "productName"
      | "productCode"
      | "productVariantId"
      | "sku"
      | "size"
      | "color"
      | "imageUrl"
      | "currentStock"
    >,
    value: number
  ) => {
    setSelectedVariants((prev) =>
      prev.map((v) => {
        if (v.productVariantId !== id) return v;
        const upd: any = { ...v, [field]: value };

        if (field === "productBasePrice" || field === "profitMargin") {
          const price =
            field === "productBasePrice" ? value : upd.productBasePrice;
          const margin = field === "profitMargin" ? value : upd.profitMargin;
          upd.suggestedPrice = price * (1 + margin / 100);
        }
        if (field === "importQuantity" || field === "productBasePrice") {
          upd.totalPrice = upd.productBasePrice * upd.importQuantity;
        }
        return upd as SelectedVariant;
      })
    );
  };

  const totalQty = useMemo(
    () => selectedVariants.reduce((s, v) => s + v.importQuantity, 0),
    [selectedVariants]
  );
  const totalAmt = useMemo(
    () => selectedVariants.reduce((s, v) => s + v.totalPrice, 0),
    [selectedVariants]
  );

  const handleSubmit = () => {
    if (!supplier) return alert("Chọn nhà cung cấp!");
    if (selectedVariants.length === 0) return alert("Chọn ít nhất 1 biến thể!");
    if (selectedVariants.some((v) => v.productBasePrice === 0))
      return alert("Nhập giá nhập cho sản phẩm!");
    const now = new Date();
    const selectedSupplier = suppliers.find(
      (s) => (s as any).supplierId === supplier
    );
    if (!selectedSupplier) return alert("Không tìm thấy nhà cung cấp!");
    const payload = {
      supplierId: (selectedSupplier as any).supplierId,
      orderDate: now.toISOString(),
      items: selectedVariants.map((v) => ({
        productVariantId: v.productVariantId,
        quantity: v.importQuantity,
        unitPrice: v.productBasePrice, // Use product base price
        profitPercentage: v.profitMargin,
        isPushed: false,
      })),
    };

    onAdd(payload);
    onClose();
  };
  if (statusesError || supplierListError || productListError) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Tạo Đơn Nhập Hàng</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center text-red-500">
            Có lỗi khi tải dữ liệu!
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const pickerProduct = variantPickerProductId
    ? (products.find((p) => p.productId === variantPickerProductId) ?? null)
    : null;
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col scrollbar-custom">
          <DialogHeader>
            <DialogTitle>Tạo Đơn Nhập Hàng</DialogTitle>
            <DialogDescription>
              Quản lý nhập hàng từ nhà cung cấp
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-6 p-6 h-full">
              <div className="col-span-2 overflow-y-auto pr-2 space-y-6">
                <SupplierSelect
                  suppliers={suppliers}
                  value={supplier}
                  onChange={setSupplier}
                  isLoading={isSupplierListLoading}
                  showDate={true}
                  orderDate={orderDate}
                  onOrderDateChange={setOrderDate}
                />
                <ProductSearchList
                  products={products}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isLoading={isProductListLoading}
                  onAdd={openVariantPicker}
                />
                <SelectedProductsTable
                  selected={selectedVariants}
                  onRemove={removeVariant}
                  onUpdate={updateVariant}
                  onSelect={(p) => setSelectedVariantDetail(p)}
                />
              </div>

              {/* ---------- RIGHT ---------- */}
              <div className="overflow-y-auto space-y-6">
                <SummaryPanel
                  selected={selectedVariants}
                  totals={{ quantity: totalQty, amount: totalAmt }}
                />
                <ProductDetailPanel
                  item={selectedVariantDetail}
                  onClose={() => setSelectedVariantDetail(null)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button variant="add" onClick={handleSubmit}>
                Tạo đơn
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {pickerProduct && (
        <Dialog
          open={!!variantPickerProductId}
          onOpenChange={closeVariantPicker}
        >
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Chọn biến thể cho: {pickerProduct.name}</DialogTitle>
            </DialogHeader>

            {variantPickerProductId != null &&
            productVariantsState.isLoadingByProductId?.[
              variantPickerProductId
            ] ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Đang tải biến thể...
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(
                  (variantPickerProductId != null
                    ? productVariantsState.variantsByProductId?.[
                        variantPickerProductId
                      ]
                    : []) ?? []
                )
                  .filter(
                    (v: any) =>
                      !selectedVariants.some(
                        (sv) => sv.productVariantId === v.productVariantId
                      )
                  )
                  .map((v: any) => (
                    <label
                      key={v.productVariantId}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={pickerSelectedIds.includes(v.productVariantId)}
                        onChange={() => {
                          setPickerSelectedIds((prev) =>
                            prev.includes(v.productVariantId)
                              ? prev.filter((i) => i !== v.productVariantId)
                              : [...prev, v.productVariantId]
                          );
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {v.sku}{" "}
                          {typeof v.size === "object" ? v.size?.name : v.size}{" "}
                          {typeof v.color === "object"
                            ? v.color?.name
                            : v.color}
                        </div>
                        <div className="text-xs text-gray-500">
                          Tồn: {v.stockQuantity ?? 0}
                        </div>
                      </div>
                    </label>
                  ))}
              </div>
            )}

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={closeVariantPicker}>
                Hủy
              </Button>
              <Button
                onClick={confirmPicker}
                disabled={pickerSelectedIds.length === 0}
              >
                Chọn ({pickerSelectedIds.length})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
