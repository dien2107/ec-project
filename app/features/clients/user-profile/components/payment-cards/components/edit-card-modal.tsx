import React, { useState, useEffect } from "react";
import type { PaymentCard } from "../types";

interface EditCardModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  card: PaymentCard | null;
  onSave: (card: PaymentCard) => void;
}

export default function EditCardModal({ open, setIsOpen, card, onSave }: EditCardModalProps) {
  const [form, setForm] = useState<PaymentCard>({
    id: "",
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    brand: "Visa",
    isDefault: false,
    cvv: "",
  });

  useEffect(() => {
    if (open && card) {
      setForm(card);
    }
  }, [open, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.cardNumber && form.cardHolder && form.expiry && form.cvv) {
      onSave(form);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-2">Cập nhật phương thức thanh toán</h4>
        <p className="text-gray-500 mb-4">Cập nhật thông tin thẻ của bạn</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Số thẻ</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={form.cardNumber}
              onChange={e => setForm({ ...form, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên chủ thẻ</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              value={form.cardHolder}
              onChange={e => setForm({ ...form, cardHolder: e.target.value })}
              placeholder="NGUYEN VAN A"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
              <input
                className="w-full border px-3 py-2 rounded-md"
                value={form.expiry}
                onChange={e => setForm({ ...form, expiry: e.target.value })}
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
              <input
                className="w-full border px-3 py-2 rounded-md"
                value={form.cvv}
                onChange={e => setForm({ ...form, cvv: e.target.value })}
                placeholder="123"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={() => setIsOpen(false)}>Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-orange-500 text-white">Lưu thẻ</button>
          </div>
        </form>
      </div>
    </div>
  );
}