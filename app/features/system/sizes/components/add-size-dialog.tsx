import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { CreateSizeData } from "../types";

interface AddSizeDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onAdd: (size: CreateSizeData & { id: string }) => void;
}

const initialForm: CreateSizeData = {
  name: "",
  code: "",
  description: "",
  status: "active",
};

export default function AddSizeDialog({ open, setIsOpen, onAdd }: AddSizeDialogProps) {
  const [form, setForm] = useState<CreateSizeData>(initialForm);

  React.useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.code) {
      onAdd({
        ...form,
        id: `SIZE-${Date.now().toString().slice(-3)}`,
      });
      setForm(initialForm);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm kích thước</DialogTitle>
          <DialogDescription>
            Thêm kích thước mới vào hệ thống
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên kích thước</Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nhập tên kích thước"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Mã kích thước</Label>
              <Input
                id="code"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="XS, S, M, L..."
                className="font-mono"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Nhập mô tả kích thước"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={form.status} onValueChange={(value: "active" | "inactive") => setForm({ ...form, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Thêm kích thước
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}