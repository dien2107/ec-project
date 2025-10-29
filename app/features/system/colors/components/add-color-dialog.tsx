import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { CreateColorData } from "../types";

interface AddColorDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onAdd: (color: CreateColorData & { id: string }) => void;
}

const initialForm: CreateColorData = {
  name: "",
  hexCode: "",
  // description: "",
  status: "active",
};

export default function AddColorDialog({
  open,
  setIsOpen,
  onAdd,
}: AddColorDialogProps) {
  const [form, setForm] = useState<CreateColorData>(initialForm);

  React.useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.hexCode) {
      onAdd({
        ...form,
        id: `CLR-${Date.now().toString().slice(-3)}`,
      });
      setForm(initialForm);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm màu sắc</DialogTitle>
          <DialogDescription>Thêm màu sắc mới vào hệ thống</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên màu</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nhập tên màu"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hexCode">Mã màu</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-12 h-10 border border-input rounded-md cursor-pointer"
                  value={form.hexCode || "#000000"}
                  onChange={(e) =>
                    setForm({ ...form, hexCode: e.target.value })
                  }
                />
                <Input
                  id="hexCode"
                  className="flex-1 font-mono text-sm"
                  value={form.hexCode}
                  onChange={(e) =>
                    setForm({ ...form, hexCode: e.target.value })
                  }
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Nhập mô tả màu sắc"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select
              value={form.status}
              onValueChange={(value: "active" | "inactive") =>
                setForm({ ...form, status: value })
              }
            >
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit">Thêm màu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
