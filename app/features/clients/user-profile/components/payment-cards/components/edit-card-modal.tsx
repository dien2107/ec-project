import React, { useState, useEffect } from "react";
import type { PaymentCard } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface EditCardModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  card: PaymentCard | null;
  onSave: (card: PaymentCard) => void;
}

export default function EditCardModal({
  open,
  setIsOpen,
  card,
  onSave,
}: EditCardModalProps) {
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
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật phương thức thanh toán</DialogTitle>
          <DialogDescription>Cập nhật thông tin thẻ của bạn</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Số thẻ</Label>
            <Input
              id="cardNumber"
              value={form.cardNumber}
              onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardHolder">Tên chủ thẻ</Label>
            <Input
              id="cardHolder"
              value={form.cardHolder}
              onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
              placeholder="NGUYEN VAN A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Ngày hết hạn</Label>
              <Input
                id="expiry"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={form.cvv}
                onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                placeholder="123"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Lưu thẻ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
