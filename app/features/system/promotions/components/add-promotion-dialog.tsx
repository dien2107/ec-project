import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DatePicker } from "~/components/ui/date-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export default function AddPromotionDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-[#3770EC] text-white cursor-pointer">
          <Plus />
          Thêm mã khuyến mãi
        </Button>
      </DialogTrigger>
      <form>
        <DialogContent className="min-w-[600px] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm mã khuyến mãi</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mb-4">
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
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <label className="col-span-1 flex items-center justify-end text-sm font-medium">
                Loại giảm giá
              </label>
              <div className="col-span-3">
                <Select>
                  <SelectTrigger className="w-full text-sm cursor-pointer">
                    <SelectValue placeholder="Chọn danh mục" />
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
                  value={new Date()}
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
                  value={new Date()}
                  placeholder="Chọn ngày bắt đầu"
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
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#3770EC] text-white cursor-pointer"
            >
              Thêm sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
