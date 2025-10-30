"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
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
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  SupplierSelect,
  ProductSearchList,
  SelectedProductsTable,
  SummaryPanel,
  ProductDetailPanel,
} from "./shared";
import type {
  EditImportOrderDialogProps,
  ImportOrderFormData,
  SelectedProduct,
} from "../types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import {
  getPurchaseOrderById,
  updatePurchaseOrder,
} from "~/services/purchase-order";
import { fetchStatuses } from "~/redux/slices/statuses";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { fetchProductListData } from "~/redux/slices/products";
import { fetchProductVariants } from "~/redux/slices/product-variants";
import { useDebounce } from "~/hooks/use-debounce";

export function EditImportOrderModal({
  open,
  order,
  onClose,
  onSave,
}: EditImportOrderDialogProps) {
  const dispatch = useAppDispatch();
  const { productList, isLoading: isProductListLoading } = useAppSelector(
    (s) => s.productList ?? {}
  );
  const productVariantsState = useAppSelector((s) => s.productVariantList);
  const requestedProductIdsRef = useRef<Set<number>>(new Set());
  const { supplierList, isLoading: isSupplierListLoading } = useAppSelector(
    (s) => s.SupplierList ?? {}
  );

  // Chỉ giữ lại các trường cần thiết
  const [formData, setFormData] = useState<
    Pick<ImportOrderFormData, "supplier" | "orderDate" | "status">
  >({
    supplier: "",
    orderDate: new Date().toISOString().split("T")[0],
    status: "pending",
  });

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<SelectedProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [activeStatusId, setActiveStatusId] = useState<{
    supplier?: number;
    product?: number;
  }>({});
  const [isLoadingOrder, setIsLoadingOrder] = useState<boolean>(false);

  const [variantPickerProductId, setVariantPickerProductId] = useState<
    number | null
  >(null);
  const [pickerSelectedIds, setPickerSelectedIds] = useState<number[]>([]);

  const normalizeItems = <T,>(items: unknown): T[] => {
    if (!items) return [];
    if (Array.isArray(items)) return items.flat() as T[];
    return [items as T];
  };

  // Tính tổng như AddImportOrderModal
  const totalQty = useMemo(
    () => selectedProducts.reduce((s, v) => s + v.importQuantity, 0),
    [selectedProducts]
  );

  const totalAmt = useMemo(
    () => selectedProducts.reduce((s, v) => s + (v.totalPrice ?? 0), 0),
    [selectedProducts]
  );

  useEffect(() => {
    if (!order) return;
    const loadOrder = async () => {
      setIsLoadingOrder(true);
      try {
        const dto = await getPurchaseOrderById(String(order.purchaseOrderId));
        console.info("loaded purchase order dto:", dto);
        const supplier = dto?.data.supplierId || dto?.supplier || "";
        const rawItems =
          dto?.items ??
          dto?.data?.items ??
          dto?.payload?.data?.items ??
          dto?.data ??
          dto?.items ??
          [];
        const itemsArr = normalizeItems<any>(rawItems);
        const mapped: any[] = itemsArr.map((it: any) => ({
          id: it.productVariantId ?? it.purchaseOrderItemId ?? it.id,
          productId: it.productId ?? undefined,
          productVariantId:
            it.productVariantId ??
            it.variantId ??
            it.purchaseOrderItemId ??
            undefined,
          code:
            it.sku ??
            it.code ??
            String(it.productVariantId ?? it.purchaseOrderItemId ?? ""),
          name: it.productName ?? it.name ?? "",
          importQuantity: it.quantity ?? it.importQuantity ?? 0,
          importPrice: it.unitPrice ?? it.importPrice ?? 0,
          profitMargin: it.profitPercentage ?? it.profitMargin ?? 0,
          suggestedPrice: it.unitPrice * (1 + it.profitPercentage / 100),
          totalPrice: it.totalPrice ?? (it.quantity ?? 0) * (it.unitPrice ?? 0),
          price: it.unitPrice ?? 0,
          imageUrl: it.imageUrl ?? it.image ?? undefined,
          purchaseOrderItemId:
            it.purchaseOrderItemId ?? it.purchaseOrderItemId ?? undefined,
          sku: it.sku ?? it.code ?? undefined,
        }));

        const status =
          dto.status ||
          (dto.statusName ? dto.statusName.toLowerCase() : "received");
        setFormData({
          supplier: supplier,
          orderDate: dto?.orderDate
            ? dto.orderDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
          status: (status as any) || "received",
        });
        setSelectedProducts(mapped as SelectedProduct[]);
      } catch (err) {
        console.error("Failed to load purchase order:", err);
        alert("Không thể tải chi tiết đơn hàng");
      } finally {
        setIsLoadingOrder(false);
      }
    };
    loadOrder();
  }, [order]);

  useEffect(() => {
    if (!open) return;
    const fetch = async () => {
      try {
        const [supStatuses, prodStatuses] = await Promise.all([
          dispatch(
            fetchStatuses({ entityType: ENTITY_TYPE.SUPPLIER })
          ).unwrap(),
          dispatch(fetchStatuses({ entityType: ENTITY_TYPE.PRODUCT })).unwrap(),
        ]);
        setActiveStatusId({
          supplier: supStatuses.find((s: any) => s.name === "Active")?.statusId,
          product: prodStatuses.find(
            (s: any) => s.name === "Active" || s.name === "OutOfStock"
          )?.statusId,
        });
      } catch (err) {
        console.error("Failed to fetch statuses:", err);
      }
    };
    fetch();
  }, [open, dispatch]);

  useEffect(() => {
    if (!activeStatusId.supplier) return;
    const fetchAllSuppliers = async () => {
      let page = 1;
      let res: any;
      try {
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
      } catch (err) {
        // ignore
      }
    };
    fetchAllSuppliers();
  }, [dispatch, activeStatusId.supplier]);

  useEffect(() => {
    if (!activeStatusId.product) return;
    const fetchAllProducts = async () => {
      let page = 1;
      let res: any;
      try {
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
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchAllProducts();
  }, [dispatch, debouncedSearchTerm, activeStatusId.product]);
  useEffect(() => {
    if (!selectedProducts.length) return;

    const productsArr = normalizeItems<any>(productList?.data?.items ?? []);
    let needsUpdate = false;
    const newSelectedProducts = selectedProducts.map((sp: any) => {
      if (sp.imageUrl) return sp;

      const vid = sp.productVariantId ?? sp.id;
      for (const prod of productsArr) {
        const productId = prod.productId ?? prod.id;
        if (!productId) continue;

        const variants = productVariantsState.variantsByProductId?.[productId];
        if (variants) {
          const variant = variants.find((v: any) => v.productVariantId === vid);
          if (variant) {
            needsUpdate = true;
            return {
              ...sp,
              imageUrl: prod.primaryImage?.imageUrl,
              name: sp.name || prod.name,
              code: sp.code || variant.sku,
            };
          }
        } else {
          const requested = requestedProductIdsRef.current;
          if (!requested.has(productId)) {
            requested.add(productId);
            dispatch(fetchProductVariants(productId));
          }
        }
      }
      return sp;
    });

    if (needsUpdate) {
      setSelectedProducts(newSelectedProducts);
    }
  }, [productList, productVariantsState, selectedProducts.length, dispatch]);

  const products: any[] = normalizeItems(productList?.data?.items ?? []);

  const filteredProducts: any[] = products.filter((product: any) => {
    const name = (product.name ?? product.productName ?? "")
      .toString()
      .toLowerCase();
    const code = (product.code ?? product.productId ?? "")
      .toString()
      .toLowerCase();
    const matchesSearch =
      name.includes(debouncedSearchTerm.toLowerCase()) ||
      code.includes(debouncedSearchTerm.toLowerCase());
    const pid = product.productId ?? product.id;
    const notSelected = !selectedProducts.find(
      (sp) => (sp as any).productId === pid
    );
    return matchesSearch && notSelected;
  });

  const openVariantPicker = (product: any) => {
    const productId = product.productId ?? product.id;
    setVariantPickerProductId(productId);
    setPickerSelectedIds([]);
    dispatch(fetchProductVariants(productId));
  };

  const closeVariantPicker = () => {
    setVariantPickerProductId(null);
    setPickerSelectedIds([]);
  };

  const confirmPicker = () => {
    if (!variantPickerProductId) return;
    const product = products.find(
      (p) => (p.productId ?? p.id) === variantPickerProductId
    );
    if (!product) return;

    const variants =
      productVariantsState.variantsByProductId?.[variantPickerProductId] ?? [];
    const toAdd: any[] = variants
      .filter((v: any) => pickerSelectedIds.includes(v.productVariantId))
      .map((v: any) => {
        const importPrice = Math.round(
          (product.price ?? product.retailPrice ?? 0) * 0.7
        );
        const importQuantity = 1;
        const totalPrice = importPrice * importQuantity;

        return {
          productId: product.productId ?? product.id,
          productVariantId: v.productVariantId,
          code: v.sku ?? "",
          name: product.name ?? product.productName,
          importQuantity,
          importPrice,
          profitMargin: 30,
          suggestedPrice: importPrice * 1.3,
          totalPrice,
          price: product.price ?? product.retailPrice ?? 0,
          imageUrl: v.primaryImage?.imageUrl ?? product.primaryImage?.imageUrl,
          currentStock: v.stockQuantity ?? 0,
        };
      });

    setSelectedProducts((prev) => [...prev, ...toAdd]);
    closeVariantPicker();
  };

  const removeProduct = (productId: number): void => {
    setSelectedProducts((prev) =>
      prev.filter(
        (p) => ((p as any).productVariantId ?? (p as any).id) !== productId
      )
    );
    if (
      ((selectedProductDetail as any)?.productVariantId ??
        (selectedProductDetail as any)?.id) === productId
    ) {
      setSelectedProductDetail(null);
    }
  };

  const updateProduct = (
    id: number,
    field: keyof Omit<
      SelectedProduct,
      "productId" | "productVariantId" | "name" | "code" | "imageUrl"
    >,
    value: number
  ): void => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (((p as any).productVariantId ?? (p as any).id) !== id) return p;

        const upd: any = { ...p, [field]: value };

        if (field === "importPrice" || field === "profitMargin") {
          const price = field === "importPrice" ? value : upd.importPrice;
          const margin = field === "profitMargin" ? value : upd.profitMargin;
          upd.suggestedPrice = price * (1 + margin / 100);
        }

        if (field === "importQuantity" || field === "importPrice") {
          upd.totalPrice = upd.importPrice * upd.importQuantity;
        }

        return upd;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier) {
      alert("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }
    const submit = async () => {
      if (!order) return;
      const suppliersArr = normalizeItems(supplierList?.data?.items ?? []);
      const selectedSupplier = suppliersArr.find(
        (s: any) => s.supplierId === formData.supplier
      );
      if (!selectedSupplier) return alert("Vui lòng chọn nhà cung cấp hợp lệ");

      const payload: any = {
        supplierId: (selectedSupplier as any).supplierId,
        orderDate: new Date(formData.orderDate).toISOString(),
        items: selectedProducts.map((p: any) => ({
          purchaseOrderItemId: p.purchaseOrderItemId ?? null,
          productVariantId: p.productVariantId ?? p.id,
          sku: p.sku ?? p.code ?? "",
          quantity: p.importQuantity,
          unitPrice: p.importPrice,
          totalPrice: p.totalPrice ?? p.importPrice * p.importQuantity,
          profitPercentage: p.profitMargin,
          isPushed: p.isPushed ?? false,
        })),
      };
      try {
        await updatePurchaseOrder(String(order.purchaseOrderId), payload);
        alert("Cập nhật đơn thành công");
        onSave({
          ...order,
          supplier: formData.supplier,
          products: selectedProducts,
          totalQuantity: totalQty,
          totalAmount: totalAmt,
          orderDate: formData.orderDate,
          status: formData.status as any,
        } as any);
        onClose();
      } catch (err: any) {
        console.error(err);
        const message = err?.response?.data?.message || "Cập nhật thất bại";
        alert(message);
      }
    };
    submit();
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickerProduct = variantPickerProductId
    ? (products.find((p) => (p.productId ?? p.id) === variantPickerProductId) ??
      null)
    : null;
  console.log("Hello:", productVariantsState.variantsByProductId);
  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Sửa Đơn Nhập Hàng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đơn nhập hàng từ nhà cung cấp
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto scrollbar-custom">
            <div className="grid grid-cols-3 gap-6 p-6 h-full">
              <div className="col-span-2 overflow-y-auto pr-2 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <SupplierSelect
                      suppliers={normalizeItems(
                        supplierList?.data?.items ?? []
                      )}
                      value={formData.supplier}
                      onChange={(v) => handleChange("supplier", v)}
                      isLoading={isSupplierListLoading}
                      showDate={false}
                    />
                  </div>
                  <div>
                    <div>
                      <Label htmlFor="orderDate">Ngày đặt hàng</Label>
                      <Input
                        id="orderDate"
                        type="date"
                        value={formData.orderDate}
                        onChange={(e) =>
                          handleChange("orderDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <ProductSearchList
                  products={filteredProducts}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isLoading={isProductListLoading}
                  onAdd={openVariantPicker}
                />

                <SelectedProductsTable
                  selected={selectedProducts}
                  onRemove={removeProduct}
                  onUpdate={updateProduct}
                  onSelect={(p) => setSelectedProductDetail(p)}
                />
              </div>

              <div className="overflow-y-auto space-y-6">
                <SummaryPanel
                  selected={selectedProducts}
                  totals={{ quantity: totalQty, amount: totalAmt }}
                />
                <ProductDetailPanel
                  item={selectedProductDetail}
                  onClose={() => setSelectedProductDetail(null)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="text-sm text-gray-600">
              * Vui lòng điền đầy đủ thông tin bắt buộc
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button onClick={handleSubmit}>Lưu thay đổi</Button>
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
                  productVariantsState.variantsByProductId?.[
                   (variantPickerProductId ?? 0) as number
                  ] ?? []
                ).map((v: any) => (
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
                        {typeof v.color === "object" ? v.color?.name : v.color}
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
