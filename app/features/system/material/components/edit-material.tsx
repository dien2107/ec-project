import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
// import { Slider } from "~/components/ui/slider";
import { type Material } from "../types";

interface EditMaterialDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  material: Material | null;
  onSave: (materialData: Partial<Material>) => void;
}

export default function EditMaterialDialog({
  open,
  setIsOpen,
  material,
  onSave,
}: EditMaterialDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "cotton" as Material["type"],
    description: "",
    composition: "",
    careInstructions: "",
    durability: 3,
    breathability: 3,
    comfort: 3,
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        type: material.type,
        description: material.description,
        composition: material.composition,
        careInstructions: material.careInstructions,
        durability: material.durability,
        breathability: material.breathability,
        comfort: material.comfort,
        status: material.status,
      });
    }
  }, [material]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa chất liệu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Tên chất liệu *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  placeholder="Ví dụ: Cotton 100%"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Loại chất liệu *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Material["type"]) =>
                    handleInputChange("type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="polyester">Polyester</SelectItem>
                    <SelectItem value="silk">Silk</SelectItem>
                    <SelectItem value="wool">Wool</SelectItem>
                    <SelectItem value="linen">Linen</SelectItem>
                    <SelectItem value="denim">Denim</SelectItem>
                    <SelectItem value="leather">Leather</SelectItem>
                    <SelectItem value="synthetic">Synthetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Mô tả chi tiết về chất liệu"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="composition">Thành phần *</Label>
              <Input
                id="composition"
                value={formData.composition}
                onChange={e => handleInputChange("composition", e.target.value)}
                placeholder="Ví dụ: 100% Cotton hoặc 65% Polyester, 35% Cotton"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="careInstructions">Hướng dẫn chăm sóc</Label>
              <Textarea
                id="careInstructions"
                value={formData.careInstructions}
                onChange={e =>
                  handleInputChange("careInstructions", e.target.value)
                }
                placeholder="Hướng dẫn giặt ủi và bảo quản"
                rows={2}
              />
            </div>

            {/* Rating Sliders */}
            {/* <div className="grid gap-4">
              <div className="grid gap-3">
                <Label>Độ bền: {formData.durability}/5</Label>
                <Slider
                  value={[formData.durability]}
                  onValueChange={([value]) =>
                    handleInputChange("durability", value)
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid gap-3">
                <Label>Độ thoáng khí: {formData.breathability}/5</Label>
                <Slider
                  value={[formData.breathability]}
                  onValueChange={([value]) =>
                    handleInputChange("breathability", value)
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="grid gap-3">
                <Label>Độ thoải mái: {formData.comfort}/5</Label>
                <Slider
                  value={[formData.comfort]}
                  onValueChange={([value]) =>
                    handleInputChange("comfort", value)
                  }
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
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
            <Button
              type="submit"
              className="bg-[#3770EC] hover:bg-[#3770EC]/90"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
