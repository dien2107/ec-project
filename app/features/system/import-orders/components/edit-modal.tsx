'use client';
import React, { useState, useEffect } from "react";
import { X, Search, Plus, Trash2, Package, TrendingUp } from "lucide-react";
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
import type { EditImportOrderDialogProps, ImportOrderFormData, Product, SelectedProduct,Supplier } from "../types";

const mockSuppliers: Supplier[] = [
  { id: 1, name: "Nhà cung cấp A", phone: "0901234567" },
  { id: 2, name: "Nhà cung cấp B", phone: "0912345678" },
  { id: 3, name: "Nhà cung cấp C", phone: "0923456789" },
];
const mockProducts: Product[] = [
  { id: 1, code: "SP001", name: "Áo thun nam basic", category: "Áo", currentStock: 45, price: 150000, image: "🎽" },
  { id: 2, code: "SP002", name: "Quần jean nam slim fit", category: "Quần", currentStock: 30, price: 350000, image: "👖" },
  { id: 3, code: "SP003", name: "Áo sơ mi nữ", category: "Áo", currentStock: 25, price: 200000, image: "👔" },
  { id: 4, code: "SP004", name: "Váy đầm công sở", category: "Váy", currentStock: 15, price: 450000, image: "👗" },
  { id: 5, code: "SP005", name: "Áo khoác hoodie", category: "Áo", currentStock: 20, price: 280000, image: "🧥" },
  { id: 6, code: "SP006", name: "Quần short thể thao", category: "Quần", currentStock: 35, price: 120000, image: "🩳" },
];

export function EditImportOrderModal({ open, order, onClose, onSave }: EditImportOrderDialogProps) {
  const [formData, setFormData] = useState<ImportOrderFormData>({
    supplier: "",
    quantity: 0,
    total: 0,
    status: "pending",
    orderDate: "",
    expectedDate: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedProductDetail, setSelectedProductDetail] = useState<SelectedProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  useEffect(() => {
    if (order) {
      setFormData({
        supplier: order.supplier || "",
        quantity: order.totalQuantity || 0,
        total: order.totalAmount || 0,
        status: order.status || "pending",
        orderDate: order.orderDate || new Date().toISOString().split('T')[0],
        expectedDate: order.expectedDate || "",
      });
      setSelectedProducts(order.products || []);
    }
  }, [order]);

  const categories: string[] = ["all", ...new Set(mockProducts.map(p => p.category))];

  const filteredProducts: Product[] = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const notSelected = !selectedProducts.find(sp => sp.id === product.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  const addProduct = (product: Product): void => {
    const newProduct: SelectedProduct = {
      ...product,
      importQuantity: 1,
      importPrice: product.price * 0.7,
      profitMargin: 30,
      suggestedPrice: product.price,
      totalPrice: product.price * 0.7,
    };
    setSelectedProducts([...selectedProducts, newProduct]);
    updateFormData();
  };

  const removeProduct = (productId: number): void => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    if (selectedProductDetail?.id === productId) {
      setSelectedProductDetail(null);
    }
    updateFormData();
  };

  const updateProduct = (productId: number, field: keyof SelectedProduct, value: number): void => {
    setSelectedProducts(selectedProducts.map(p => {
      if (p.id === productId) {
        const updated: SelectedProduct = { ...p, [field]: value };

        if (field === 'importPrice' || field === 'profitMargin') {
          const price = field === 'importPrice' ? value : updated.importPrice;
          const margin = field === 'profitMargin' ? value : updated.profitMargin;
          updated.suggestedPrice = price * (1 + margin / 100);
        }

        if (field === 'importQuantity' || field === 'importPrice') {
          const price = field === 'importPrice' ? value : updated.importPrice;
          const quantity = field === 'importQuantity' ? value : updated.importQuantity;
          updated.totalPrice = price * quantity;
        }

        return updated;
      }
      return p;
    }));
    updateFormData();
  };

  const updateFormData = () => {
    setFormData(prev => ({
      ...prev,
      quantity: selectedProducts.reduce((sum, p) => sum + p.importQuantity, 0),
      total: selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0),
    }));
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
    if (!formData.expectedDate) {
      alert("Vui lòng chọn ngày dự kiến nhận hàng!");
      return;
    }

    if (order) {
      onSave({
        ...order,
        supplier: formData.supplier,
        products: selectedProducts,
        totalQuantity: formData.quantity,
        totalAmount: formData.total,
        orderDate: formData.orderDate,
        expectedDate: formData.expectedDate,
        status: formData.status,
      });
      onClose();
    }
  };

  const handleChange = (field: keyof ImportOrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1400px] max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Sửa Đơn Nhập Hàng</DialogTitle>
          <DialogDescription>Cập nhật thông tin đơn nhập hàng từ nhà cung cấp</DialogDescription>
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
                    <Select
                      value={formData.supplier}
                      onValueChange={(value) => handleChange("supplier", value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn nhà cung cấp" />
                      </SelectTrigger>
                      <SelectContent>
                         {mockSuppliers.map(s => (
                                                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                                                ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="orderDate">Ngày đặt hàng</Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => handleChange("orderDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedDate">Ngày dự kiến nhận *</Label>
                    <Input
                      id="expectedDate"
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => handleChange("expectedDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="received">Đã nhận</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Product Search */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-4">Chọn sản phẩm nhập</h3>
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === "all" ? "Tất cả danh mục" : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      Không tìm thấy sản phẩm
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredProducts.map(product => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-50 flex items-center justify-between group transition"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="text-3xl">{product.image}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 flex gap-4">
                                <span>Mã: {product.code}</span>
                                <span>Tồn kho: {product.currentStock}</span>
                                <span className="text-blue-600 font-medium">
                                  {product.price.toLocaleString('vi-VN')}đ
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700"
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
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sản phẩm</th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SL nhập</th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá nhập</th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">% LN</th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Giá bán đề xuất</th>
                          <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Thành tiền</th>
                          <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedProducts.map(product => (
                          <tr
                            key={product.id}
                            onClick={() => setSelectedProductDetail(product)}
                            className={`hover:bg-blue-50 cursor-pointer transition ${selectedProductDetail?.id === product.id ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{product.image}</span>
                                <div>
                                  <div className="font-medium text-sm">{product.name}</div>
                                  <div className="text-xs text-gray-500">{product.code}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <Input
                                type="number"
                                value={product.importQuantity}
                                onChange={(e) => updateProduct(product.id, 'importQuantity', parseInt(e.target.value) || 0)}
                                onClick={(e) => e.stopPropagation()}
                                min="1"
                                className="w-20 text-center"
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <Input
                                type="number"
                                value={product.importPrice}
                                onChange={(e) => updateProduct(product.id, 'importPrice', parseFloat(e.target.value) || 0)}
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                className="w-28 text-right"
                              />
                            </td>
                            <td className="px-3 py-3">
                              <Input
                                type="number"
                                value={product.profitMargin}
                                onChange={(e) => updateProduct(product.id, 'profitMargin', parseFloat(e.target.value) || 0)}
                                onClick={(e) => e.stopPropagation()}
                                min="0"
                                max="1000"
                                className="w-16 text-center"
                              />
                            </td>
                            <td className="px-3 py-3 text-right font-medium text-green-600">
                              {Math.round(product.suggestedPrice).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-3 py-3 text-right font-bold text-blue-600">
                              {Math.round(product.totalPrice).toLocaleString('vi-VN')}đ
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
                    <span className="font-bold text-lg text-blue-900">{selectedProducts.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-700">Tổng số lượng:</span>
                    <span className="font-bold text-lg text-blue-900">{formData.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-white rounded-lg px-3 mt-4">
                    <span className="text-gray-700 font-medium">Tổng tiền:</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {Math.round(formData.total).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Detail */}
              {selectedProductDetail && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg text-gray-900">Chi tiết sản phẩm</h3>
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
                      <div className="text-6xl mb-2">{selectedProductDetail.image}</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tên sản phẩm:</span>
                        <span className="font-medium text-right">{selectedProductDetail.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Mã sản phẩm:</span>
                        <span className="font-medium">{selectedProductDetail.code}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Danh mục:</span>
                        <span className="font-medium">{selectedProductDetail.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Tồn kho hiện tại:</span>
                        <span className="font-medium text-orange-600">{selectedProductDetail.currentStock}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Giá bán:</span>
                        <span className="font-medium text-blue-600">
                          {selectedProductDetail.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg mt-4">
                        <div className="text-xs text-gray-600 mb-1">Thông tin nhập hàng</div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Số lượng nhập:</span>
                          <span className="font-bold">{selectedProductDetail.importQuantity}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Giá nhập:</span>
                          <span className="font-bold">{Math.round(selectedProductDetail.importPrice).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>% Lợi nhuận:</span>
                          <span className="font-bold text-green-600">{selectedProductDetail.profitMargin}%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Giá bán đề xuất:</span>
                          <span className="font-medium text-orange-600">{Math.round(selectedProductDetail.suggestedPrice).toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-blue-200 mt-2">
                          <span>Thành tiền nhập:</span>
                          <span className="font-bold text-lg text-blue-600">
                            {Math.round(selectedProductDetail.totalPrice).toLocaleString('vi-VN')}đ
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
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              Lưu thay đổi
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}