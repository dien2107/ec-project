import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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

import { Plus } from "lucide-react";

export default function AddProductDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-auto bg-[#3770EC] text-white cursor-pointer">
          <Plus />
          Thêm sản phẩm
        </Button>
      </DialogTrigger>
      <form>
        <DialogContent className="min-w-[600px] max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-4">
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
            <div className="flex items-center gap-4">
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
                      <SelectItem value="ao-thun">Áo thun</SelectItem>
                      <SelectItem value="quan-jeans">Quần jeans</SelectItem>
                      <SelectItem value="ao-so-mi">Áo sơ mi</SelectItem>
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
            <div className="flex items-center gap-4 ">
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
            <div>
              <label htmlFor="productImage" className="text-sm font-medium">
                URL ảnh
              </label>
              <Input type="text" id="productImage" placeholder="Nhập URL ảnh" />
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
