import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Size, UpdateSizeData } from "../types";

interface EditSizeDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  size: Size | null;
  onSave: (size: Size) => void;
}

export default function EditSizeDialog({ open, setIsOpen, size, onSave }: EditSizeDialogProps) {
  const [form, setForm] = useState<UpdateSizeData>({
    id: "",
    name: "",
    code: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (open && size) {
      setForm(size);
    }
  }, [open, size]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.code) {
      onSave(form as Size);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa kích thước</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin kích thước
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
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}