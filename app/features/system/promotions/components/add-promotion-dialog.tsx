import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useState, useEffect } from "react";

interface AddPromotionDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onAdd: (promotion: any) => void; // Thay thế `any` bằng kiểu dữ liệu cụ thể nếu có
}

const initialForm = {
  promotionCode: "",
  discountType: "",
  promotionValue: "",
  promotionMaxValue: "",
  promotionMinOrder: "",
  promotionStartDate: new Date(),
  promotionEndDate: new Date(),
  promotionUsageLimit: "",
};

export default function AddPromotionDialog({
  open,
  setIsOpen,
  onAdd,
}: AddPromotionDialogProps) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setForm(initialForm);
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[600px] max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm mã khuyến mãi</DialogTitle>
          <DialogDescription>
            Thêm mã khuyến mãi mới vào hệ thống
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionCode"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Mã khuyến mãi
            </label>
            <Input
              type="text"
              id="promotionCode"
              placeholder="Nhập mã khuyến mãi"
              className="col-span-3 text-sm"
              value={form.promotionCode}
              onChange={(e) =>
                setForm({ ...form, promotionCode: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label className="col-span-1 flex items-center justify-end text-sm font-medium">
              Loại giảm giá
            </label>
            <div className="col-span-3">
              <Select
                value={form.discountType}
                onValueChange={(value) =>
                  setForm({ ...form, discountType: value })
                }
              >
                <SelectTrigger className="w-full text-sm cursor-pointer">
                  <SelectValue placeholder="Chọn loại giảm giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Loại giảm giá</SelectLabel>
                    <SelectItem value="percentage">Phần trăm (%)</SelectItem>
                    <SelectItem value="amount">Số tiền</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionValue"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Giá trị
            </label>
            <Input
              type="text"
              id="promotionValue"
              placeholder="Nhập giá trị giảm"
              className="col-span-3 text-sm"
              value={form.promotionValue}
              onChange={(e) =>
                setForm({ ...form, promotionValue: e.target.value })
              }
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionMaxValue"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Giảm tối đa
            </label>
            <Input
              type="text"
              id="promotionMaxValue"
              placeholder="Nhập giá trị giảm tối đa"
              className="col-span-3 text-sm"
              value={form.promotionMaxValue}
              onChange={(e) =>
                setForm({ ...form, promotionMaxValue: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionMinOrder"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Đơn tối thiểu
            </label>
            <Input
              type="text"
              id="promotionMinOrder"
              placeholder="Nhập giá trị đơn tối thiểu"
              className="col-span-3 text-sm"
              value={form.promotionMinOrder}
              onChange={(e) =>
                setForm({ ...form, promotionMinOrder: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionStartDate"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Ngày bắt đầu
            </label>
            <div className="col-span-3">
              <DatePicker
                value={form.promotionStartDate}
                onChange={(date) =>
                  setForm({ ...form, promotionStartDate: date })
                }
                placeholder="Chọn ngày bắt đầu"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionEndDate"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Ngày kết thúc
            </label>
            <div className="col-span-3">
              <DatePicker
                value={form.promotionEndDate}
                onChange={(date) =>
                  setForm({ ...form, promotionEndDate: date })
                }
                placeholder="Chọn ngày kết thúc"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <label
              htmlFor="promotionUsageLimit"
              className="col-span-1 flex items-center justify-end text-sm font-medium"
            >
              Giới hạn sử dụng
            </label>
            <Input
              type="number"
              id="promotionUsageLimit"
              placeholder="Nhập giới hạn sử dụng"
              className="col-span-3 text-sm"
              value={form.promotionUsageLimit}
              onChange={(e) =>
                setForm({ ...form, promotionUsageLimit: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-[#3770EC] text-white cursor-pointer"
            >
              Thêm khuyến mãi
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
