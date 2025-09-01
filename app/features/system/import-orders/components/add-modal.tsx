
import * as React from "react";
import type { ImportOrder } from "../types";
import { mockSuppliers } from "../../suppliers/data/mockSuppliers";

interface AddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (order: ImportOrder) => void;
}

const initialForm: ImportOrder = {
  id: "",
  supplier: "",
  quantity: 0,
  total: 0,
  status: "pending",
  orderDate: "",
  expectedDate: "",
};

export function AddImportOrderModal({ open, onClose, onAdd }: AddModalProps) {
  const [form, setForm] = React.useState<ImportOrder>(initialForm);

  React.useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-4">Tạo đơn nhập hàng</h4>
        <div className="space-y-3">
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.supplier}
            onChange={e => setForm({ ...form, supplier: e.target.value })}
          >
            <option value="">Chọn nhà cung cấp</option>
            {mockSuppliers.map(sup => (
              <option key={sup.id} value={sup.name}>{sup.name}</option>
            ))}
          </select>
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.quantity}
            type="number"
            onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
            placeholder="Số lượng"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.total}
            type="number"
            onChange={e => setForm({ ...form, total: Number(e.target.value) })}
            placeholder="Tổng tiền"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.orderDate}
            onChange={e => setForm({ ...form, orderDate: e.target.value })}
            placeholder="Ngày đặt"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.expectedDate}
            onChange={e => setForm({ ...form, expectedDate: e.target.value })}
            placeholder="Ngày dự kiến"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Huỷ</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => onAdd(form)}>Tạo mới</button>
        </div>
      </div>
    </div>
  );
}
