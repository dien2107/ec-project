"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  Plus,
  Trash2,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type {
  AddImportOrderModalProps,
  Supplier,
  Product,
  SelectedProduct,
  ImportOrderAdd,
} from "../types";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { fetchProductListData } from "~/redux/slices/products";
import { fetchSupplierListData } from "~/redux/slices/suppliers";
import { useDebounce } from "~/hooks/use-debounce";

export function AddImportOrderModal({
  open,
  onClose,
  onAdd,
}: AddImportOrderModalProps) {
  const dispatch = useAppDispatch();
  const {
    statuses,
    isLoading: isStatusesLoading,
    isError: statusesError,
  } = useAppSelector((state) => state.statuses);
  const {
    productList,
    isLoading: isProductListLoading,
    isError: productListError,
  } = useAppSelector((state) => state.productList);
  const {
    supplierList,
    isLoading: isSupplierListLoading,
    isError: supplierListError,
  } = useAppSelector((state) => state.SupplierList);

  const [supplier, setSupplier] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<SelectedProduct | null>(null);
  const [orderDate, setOrderDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [expectedDate, setExpectedDate] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [activeStatusId, setActiveStatusId] = useState<{
    supplier: number | undefined;
    product: number | undefined;
  }>({
    supplier: undefined,
    product: undefined,
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch statuses và xác định active statusId khi modal mở
  useEffect(() => {
    if (open) {
      // Fetch danh sách trạng thái
      dispatch(fetchStatuses()).then((result) => {
        if (fetchStatuses.fulfilled.match(result)) {
          const supplierActiveStatus = result.payload.find(
            (status) =>
              status.entityType === ENTITY_TYPE.SUPPLIER &&
              status.name === "Active"
          );
          const productActiveStatus = result.payload.find(
            (status) =>
              status.entityType === ENTITY_TYPE.PRODUCT &&
              (status.name === "Active" || status.name === "OutOfStock")
          );
          setActiveStatusId({
            supplier: supplierActiveStatus?.statusId,
            product: productActiveStatus?.statusId,
          });
        }
      });

      // Reset form
      setSupplier("");
      setSearchTerm("");
      setSelectedProducts([]);
      setSelectedProductDetail(null);
      setOrderDate(new Date().toISOString().split("T")[0]);
      setExpectedDate("");
      setNote("");
    }
  }, [open, dispatch]);

  // Fetch all pages of suppliers (only once when activeStatusId.supplier is set)
  useEffect(() => {
    const fetchAllSuppliers = async () => {
      if (activeStatusId.supplier !== undefined) {
        let allSuppliers: Supplier[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const result = await dispatch(
            fetchSupplierListData({
              Name: "",
              StatusId: activeStatusId.supplier,
              PageNumber: page,
              PageSize: 1000,
            })
          );
          if (fetchSupplierListData.fulfilled.match(result)) {
            const { items, totalPages: pages } = result.payload.data;
            allSuppliers = [...allSuppliers, ...(items || [])];
            totalPages = pages || 1;
            page++;
          } else {
            break;
          }
        } while (page <= totalPages);
      }
    };

    if (activeStatusId.supplier !== undefined) {
      fetchAllSuppliers();
    }
  }, [dispatch, activeStatusId.supplier]);

  // Fetch all pages of products (when debouncedSearchTerm or activeStatusId.product changes)
  useEffect(() => {
    const fetchAllProducts = async () => {
      if (activeStatusId.product !== undefined) {
        let allProducts: Product[] = [];
        let page = 1;
        let totalPages = 1;

        do {
          const result = await dispatch(
            fetchProductListData({
              Search: debouncedSearchTerm,
              //StatusId: activeStatusId.product,
              StatusName: 'Active',
              PageNumber: page,
              PageSize: 1000,
            })
          );
          if (fetchProductListData.fulfilled.match(result)) {
            const { items, totalPages: pages } = result.payload.data;
            allProducts = [...allProducts, ...(items || [])];
            totalPages = pages || 1;
            page++;
          } else {
            break;
          }
        } while (page <= totalPages);
      }
    };

    if (activeStatusId.product !== undefined) {
      fetchAllProducts();
    }
  }, [dispatch, debouncedSearchTerm, activeStatusId.product]);

  // Lọc sản phẩm chỉ dựa trên selectedProducts
  const filteredProducts = useMemo(() => {
    const items = productList?.data?.items || [];
    return items.filter(
      (product) => !selectedProducts.find((sp) => sp.id === product.productId)
    );
  }, [productList, selectedProducts]);

  const addProduct = (product: Product): void => {
    const importQuantity = 1;
    const importPrice = 0; // Initialize to 0, user will input manually
    const profitMargin = 0; // Default to 0
    const suggestedPrice = 0; // Initialize to 0, will be calculated after importPrice is set
    const totalPrice = 0; // Initialize to 0, will be calculated after importPrice is set

    const newProduct: SelectedProduct = {
      ...product,
      id: product.productId,
      importQuantity,
      importPrice,
      profitMargin,
      suggestedPrice,
      totalPrice,
      code: product.productId.toString(), // Use productId as code
    };

    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const removeProduct = (productId: number): void => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    if (selectedProductDetail?.id === productId) {
      setSelectedProductDetail(null);
    }
  };

  const updateProduct = (
    productId: number,
    field: keyof SelectedProduct,
    value: number
  ): void => {
    setSelectedProducts(
      selectedProducts.map((p) => {
        if (p.id === productId) {
          const updated: SelectedProduct = { ...p, [field]: value };

          if (field === "importPrice" || field === "profitMargin") {
            const price = field === "importPrice" ? value : updated.importPrice;
            const margin =
              field === "profitMargin" ? value : updated.profitMargin;
            updated.suggestedPrice = price * (1 + margin / 100);
          }

          if (field === "importQuantity" || field === "importPrice") {
            const price = field === "importPrice" ? value : updated.importPrice;
            const quantity =
              field === "importQuantity" ? value : updated.importQuantity;
            updated.totalPrice = price * quantity;
          }

          return updated;
        }
        return p;
      })
    );
  };

  const getTotalAmount = (): number => {
    return selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0);
  };

  const getTotalQuantity = (): number => {
    return selectedProducts.reduce((sum, p) => sum + p.importQuantity, 0);
  };

  const handleSubmit = (): void => {
    if (!supplier) {
      alert("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }
    if (!expectedDate) {
      alert("Vui lòng chọn ngày dự kiến nhận hàng!");
      return;
    }
    // Check if any product has importPrice = 0
    if (selectedProducts.some((p) => p.importPrice === 0)) {
      alert("Vui lòng nhập giá nhập cho tất cả sản phẩm!");
      return;
    }

    const orderData: ImportOrderAdd = {
      supplier,
      products: selectedProducts,
      totalQuantity: getTotalQuantity(),
      totalAmount: getTotalAmount(),
      orderDate,
      expectedDate,
      note,
      status: "pending",
    };

    onAdd(orderData);
    onClose();
  };

  // Hiển thị lỗi nếu có
  if (statusesError || supplierListError || productListError) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Tạo Đơn Nhập Hàng</DialogTitle>
            <DialogDescription>
              Quản lý nhập hàng từ nhà cung cấp
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-red-500">
              Có lỗi xảy ra khi tải dữ liệu!
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col scrollbar-custom">
        <DialogHeader>
          <DialogTitle>Tạo Đơn Nhập Hàng</DialogTitle>
          <DialogDescription>
            Quản lý nhập hàng từ nhà cung cấp
          </DialogDescription>
        </DialogHeader>

        {/* Body with Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-3 gap-6 p-6 h-full">
            {/* Left Column - Supplier & Product Selection (Scrollable) */}
            <div className="col-span-2 overflow-y-auto pr-2 space-y-6">
              {/* Supplier Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Package className="text-blue-600" size={20} />
                  Thông tin đơn hàng
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier">Nhà cung cấp *</Label>
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn nhà cung cấp" />
                      </SelectTrigger>
                      <SelectContent>
                        {isSupplierListLoading ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                          </div>
                        ) : (
                          (supplierList?.data?.items || []).map((s) => (
                            <SelectItem key={s.supplierId} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="orderDate">Ngày đặt hàng</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                    />
                  </div>
                  {/* <div>
                    <Label htmlFor="expectedDate">Ngày dự kiến nhận *</Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      value={expectedDate}
                      onChange={(e) => setExpectedDate(e.target.value)}
                    />
                  </div> */}
                </div>
              </div>

              {/* Product Search */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  Chọn sản phẩm nhập
                </h3>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <Input
                      placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg scrollbar-custom">
                  {isProductListLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-sm text-gray-600 mt-2">
                        Đang tải sản phẩm...
                      </p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Không tìm thấy sản phẩm
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.productId}
                          className="p-3 hover:bg-gray-50 flex items-center justify-between group transition"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-3xl">
                              {product?.primaryImage?.imageUrl ? (
                                <img
                                  src={product.primaryImage.imageUrl}
                                  alt={
                                    product.primaryImage.altText ||
                                    "Ảnh sản phẩm"
                                  }
                                  className="w-16 h-16 object-cover rounded-md"
                                />
                              ) : (
                                "📦"
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500 flex gap-4">
                                <span>Mã: {product.productId}</span>
                                <span>
                                  Tồn kho: {product.currentStock || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => addProduct(product)}
                          >
                            <Plus size={16} />
                            Thêm
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Products Table */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">
                  Sản phẩm đã chọn ({selectedProducts.length})
                </h3>
                {selectedProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                    Chưa có sản phẩm nào được chọn
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Sản phẩm
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            SL nhập
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Giá nhập
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            % LN
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Giá bán đề xuất
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Thành tiền
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedProducts.map((product) => (
                          <tr
                            key={product.id}
                            onClick={() => setSelectedProductDetail(product)}
                            className={`hover:bg-blue-50 cursor-pointer transition ${selectedProductDetail?.id === product.id ? "bg-blue-50" : ""}`}
                          >
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <div className="text-3xl">
                                  {product?.primaryImage?.imageUrl ? (
                                    <img
                                      src={product.primaryImage.imageUrl}
                                      alt={
                                        product.primaryImage.altText ||
                                        "Ảnh sản phẩm"
                                      }
                                      className="w-16 h-16 object-cover rounded-md"
                                    />
                                  ) : (
                                    "📦"
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {product.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {product.code}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <Input
                                type="number"
                                value={product.importQuantity}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "importQuantity",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                min="1"
                                className="w-20 text-center"
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Input
                                type="number"
                                value={product.importPrice}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "importPrice",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                className="w-28 text-right"
                                placeholder="Nhập giá nhập"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <Input
                                type="number"
                                value={product.profitMargin}
                                onChange={(e) =>
                                  updateProduct(
                                    product.id,
                                    "profitMargin",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                max="1000"
                                className="w-16 text-center"
                                placeholder="%"
                              />
                            </td>
                            <td className="px-3 py-3 text-right font-medium text-green-600">
                              {Math.round(
                                product.suggestedPrice
                              ).toLocaleString("vi-VN")}
                              đ
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-blue-600">
                              {Math.round(product.totalPrice).toLocaleString(
                                "vi-VN"
                              )}
                              đ
                            </td>
                            <td className="px-3 py-3 text-center">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeProduct(product.id);
                                }}
                              >
                                <Trash2 size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Summary & Product Detail (Fixed Position) */}
            <div className="overflow-y-auto space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-4 text-blue-900 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Tổng quan đơn hàng
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Tổng sản phẩm:</span>
                    <span className="font-bold text-lg text-blue-900">
                      {selectedProducts.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Tổng số lượng:</span>
                    <span className="font-bold text-lg text-blue-900">
                      {getTotalQuantity()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-white rounded-lg px-3 mt-4">
                    <span className="text-gray-700 font-medium">
                      Tổng tiền:
                    </span>
                    <span className="font-bold text-2xl text-blue-600">
                      {Math.round(getTotalAmount()).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Detail */}
              {selectedProductDetail && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Chi tiết sản phẩm
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedProductDetail(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl flex items-center justify-center">
                        {selectedProductDetail?.primaryImage?.imageUrl ? (
                          <img
                            src={selectedProductDetail.primaryImage.imageUrl}
                            alt={
                              selectedProductDetail.primaryImage.altText ||
                              "Ảnh sản phẩm"
                            }
                            className="w-16 h-16 object-cover rounded-md"
                          />
                        ) : (
                          "📦"
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tên sản phẩm:</span>
                        <span className="font-medium text-right">
                          {selectedProductDetail.name}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Mã sản phẩm:</span>
                        <span className="font-medium">
                          {selectedProductDetail.code}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tồn kho hiện tại:</span>
                        <span className="font-medium text-orange-600">
                          {selectedProductDetail.currentStock || 0}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Giá bán:</span>
                        <span className="font-medium text-blue-600">
                          {selectedProductDetail.basePrice.toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg mt-4">
                        <div className="text-xs text-gray-600 mb-1">
                          Thông tin nhập hàng
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Số lượng nhập:</span>
                          <span className="font-bold">
                            {selectedProductDetail.importQuantity}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Giá nhập:</span>
                          <span className="font-bold">
                            {Math.round(
                              selectedProductDetail.importPrice
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>% Lợi nhuận:</span>
                          <span className="font-bold text-green-600">
                            {selectedProductDetail.profitMargin}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Giá bán đề xuất:</span>
                          <span className="font-medium text-orange-600">
                            {Math.round(
                              selectedProductDetail.suggestedPrice
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-blue-200 mt-2">
                          <span>Thành tiền nhập:</span>
                          <span className="font-bold text-lg text-blue-600">
                            {Math.round(
                              selectedProductDetail.totalPrice
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="text-sm text-gray-600">
            * Vui lòng điền đầy đủ thông tin bắt buộc
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit}>Tạo đơn nhập hàng</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
