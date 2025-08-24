import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function EditProductDialog({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <form>
        <DialogContent className="min-w-[600px] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center col-span-2 gap-4">
              <div className="flex-1">
                <label htmlFor="productName" className="text-sm font-medium">
                  Tên sản phẩm
                </label>
                <Input
                  type="text"
                  id="productName"
                  placeholder="Nhập tên sản phẩm"
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input
                  type="text"
                  id="slug"
                  placeholder="Slug-san-pham"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center col-span-2 gap-4">
              <div className="flex-1">
                <label htmlFor="productPrice" className="text-sm font-medium">
                  Danh mục
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Chọn danh mục</SelectLabel>
                      <SelectItem value="apple">Áo thun</SelectItem>
                      <SelectItem value="banana">Quần jeans</SelectItem>
                      <SelectItem value="blueberry">Áo sơ mi</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="productPrice" className="text-sm font-medium">
                  Chất liệu
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Chọn chất liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Chọn chất liệu</SelectLabel>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="denim">Denim</SelectItem>
                      <SelectItem value="polyester">Polyester</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center col-span-2 gap-4 ">
              <div className="flex-1">
                <label
                  htmlFor="productBasePrice"
                  className="text-sm font-medium"
                >
                  Giá cơ bản
                </label>
                <Input
                  type="text"
                  id="productBasePrice"
                  placeholder="Nhập giá cơ bản"
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="productPrice" className="text-sm font-medium">
                  Giá bán
                </label>
                <Input
                  type="text"
                  id="productPrice"
                  placeholder="Nhập giá bán"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center col-span-1">
              <div className="flex-1">
                <label htmlFor="productStatus" className="text-sm font-medium">
                  Trạng thái
                </label>
                <Select>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Chọn trạng thái</SelectLabel>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Không hoạt động</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="col-span-2">
              <div className="flex-1">
                <label htmlFor="productImage" className="text-sm font-medium">
                  URL ảnh
                </label>
                <Input
                  type="text"
                  id="productImage"
                  placeholder="Nhập URL ảnh"
                  className="mt-1"
                />
              </div>
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
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
