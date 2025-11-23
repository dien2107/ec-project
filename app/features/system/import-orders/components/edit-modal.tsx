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
  cancelPurchaseOrder,
} from "~/services/purchase-order";
import { fetchStatuses } from "~/redux/slices/statuses";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { fetchProductListData } from "~/redux/slices/products";
import { fetchProductVariants } from "~/redux/slices/product-variants";
import { useDebounce } from "~/hooks/use-debounce";
import toast from "react-hot-toast";

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
  const [isCancelling, setIsCancelling] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string>("");

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
          productBasePrice: it.unitPrice ?? it.importPrice ?? 0, // Use productBasePrice
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

        // Lưu status hiện tại
        setCurrentStatus(
          dto?.data?.status?.name || dto?.status?.name || "Draft"
        );

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
          supplier: supStatuses.statuses.find((s: any) => s.name === "Active")
            ?.statusId,
          product: prodStatuses.statuses.find(
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

    // Tìm giá đã có của product (nếu đã có variant nào của product này)
    const existingVariant = selectedProducts.find(
      (v: any) => (v.productId ?? v.id) === variantPickerProductId
    );
    const basePrice =
      existingVariant?.productBasePrice ??
      Math.round((product.price ?? product.retailPrice ?? 0) * 0.7);
    const profitMargin = existingVariant?.profitMargin ?? 30;

    const toAdd: any[] = variants
      .filter((v: any) => pickerSelectedIds.includes(v.productVariantId))
      .map((v: any) => {
        const importQuantity = 1;
        const totalPrice = basePrice * importQuantity;

        return {
          productId: product.productId ?? product.id,
          productVariantId: v.productVariantId,
          code: v.sku ?? "",
          name: product.name ?? product.productName,
          importQuantity,
          productBasePrice: basePrice, // Apply existing price
          profitMargin: profitMargin,
          suggestedPrice: basePrice * (1 + profitMargin / 100),
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

        if (field === "productBasePrice" || field === "profitMargin") {
          const price =
            field === "productBasePrice" ? value : upd.productBasePrice;
          const margin = field === "profitMargin" ? value : upd.profitMargin;
          upd.suggestedPrice = price * (1 + margin / 100);
        }

        if (field === "importQuantity" || field === "productBasePrice") {
          upd.totalPrice = upd.productBasePrice * upd.importQuantity;
        }

        return upd;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier) {
      toast.error("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }
    const submit = async () => {
      if (!order) return;
      const suppliersArr = normalizeItems(supplierList?.data?.items ?? []);
      const selectedSupplier = suppliersArr.find(
        (s: any) => s.supplierId === formData.supplier
      );
      if (!selectedSupplier) {
        toast.error("Vui lòng chọn nhà cung cấp hợp lệ");
        return;
      }

      const payload: any = {
        supplierId: (selectedSupplier as any).supplierId,
        orderDate: new Date(formData.orderDate).toISOString(),
      };

      // Chỉ gửi items khi ở trạng thái Draft (có quyền sửa products)
      if (canEditProducts) {
        payload.items = selectedProducts.map((p: any) => ({
          purchaseOrderItemId: p.purchaseOrderItemId ?? null,
          productVariantId: p.productVariantId ?? p.id,
          sku: p.sku ?? p.code ?? "",
          quantity: p.importQuantity,
          unitPrice: p.productBasePrice, // Use productBasePrice
          totalPrice: p.totalPrice ?? p.productBasePrice * p.importQuantity,
          profitPercentage: p.profitMargin,
          isPushed: p.isPushed ?? false,
        }));
      }
      // Ở trạng thái Pending, không gửi items để backend cho phép sửa supplier/date

      try {
        await updatePurchaseOrder(String(order.purchaseOrderId), payload);
        toast.success("Cập nhật đơn thành công");
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
        toast.error(message);
      }
    };
    submit();
  };

  const handleCancel = async () => {
    if (!order) return;

    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác."
    );

    if (!confirmed) return;

    setIsCancelling(true);
    try {
      await cancelPurchaseOrder(String(order.purchaseOrderId));
      toast.success("Đã hủy đơn hàng thành công");
      onSave({
        ...order,
        status: { ...order.status, name: "Cancelled" },
      } as any);
      onClose();
    } catch (err: any) {
      console.error(err);
      const message = err?.response?.data?.message || "Hủy đơn thất bại";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
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

  // Xác định quyền chỉnh sửa dựa trên status
  const canEditProducts = currentStatus === "Draft";
  const canEditBasicInfo =
    currentStatus === "Draft" || currentStatus === "Pending";
  const canCancel = currentStatus === "Pending";

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Sửa Đơn Nhập Hàng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin đơn nhập hàng từ nhà cung cấp
              {!canEditProducts && (
                <span className="block mt-2 text-yellow-600 text-sm">
                  ⚠️ Đơn hàng ở trạng thái{" "}
                  {currentStatus == "Pending"
                    ? "đang chờ duyêt"
                    : currentStatus}{" "}
                  - Không thể chỉnh sửa danh sách sản phẩm
                </span>
              )}
              {!canEditBasicInfo && (
                <span className="block mt-2 text-red-600 text-sm">
                  🔒 Đơn hàng đã bị khóa - Không thể chỉnh sửa
                </span>
              )}
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
                        disabled={!canEditBasicInfo}
                      />
                    </div>
                  </div>
                </div>

                {canEditProducts && (
                  <ProductSearchList
                    products={filteredProducts}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isLoading={isProductListLoading}
                    onAdd={openVariantPicker}
                  />
                )}

                <SelectedProductsTable
                  selected={selectedProducts}
                  onRemove={canEditProducts ? removeProduct : () => {}}
                  onUpdate={canEditProducts ? updateProduct : () => {}}
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
            <div className="flex items-center justify-between w-full">
              <div className="text-sm text-gray-600">
                {!canEditBasicInfo && "🔒 Đơn hàng đã bị khóa"}
                {canEditBasicInfo &&
                  !canEditProducts &&
                  "⚠️ Chỉ có thể sửa thông tin cơ bản"}
              </div>
              <div className="flex gap-3">
                {canCancel && (
                  <Button
                    variant="destructive"
                    onClick={handleCancel}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Đang hủy..." : "Hủy đơn"}
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Đóng
                </Button>
                {canEditBasicInfo && (
                  <Button variant="add" onClick={handleSubmit}>
                    Lưu thay đổi
                  </Button>
                )}
              </div>
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
                )
                  .filter(
                    (v: any) =>
                      !selectedProducts.some(
                        (sp: any) =>
                          (sp.productVariantId ?? sp.id) === v.productVariantId
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
