import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

export default function UserInformationDetail() {
  return (
    <div className="h-full w-full my-4 rounded-md border border-solid border-gray-200 bg-white px-4 py-6">
      <h1 className="text-center text-lg font-bold uppercase">
        Chào mừng đến với thông tin tài khoản
      </h1>
      <p className="text-center">
        Quản lý thông tin cá nhân, cập nhật hồ sơ và thiết lập tài khoản của bạn
        tại đây.
      </p>
      <div className="mt-6 overflow-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2">
            <span className="mb-5 block border-b-2 border-solid border-gray-200 pb-[2px] text-lg font-bold">
              <h2>Thông tin cá nhân</h2>
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1">
                  <label htmlFor="id" className="mb-1 block text-sm">
                    <strong>Mã ID</strong>
                  </label>
                  <Input type="text" id="id" readOnly disabled />
                </div>
                <div className="col-span-3">
                  <label htmlFor="fullname" className="mb-1 block text-sm">
                    <strong>Họ và tên</strong>
                  </label>
                  <Input type="text" id="fullname" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="mb-1 block text-sm">
                    <strong>Giới tính</strong>
                  </label>
                  <Select>
                    <SelectTrigger
                      id="gender"
                      className="w-full rounded-md border p-2 text-sm"
                    >
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent className="z-10 w-full rounded-md border border-gray-300 bg-white shadow-lg">
                      <SelectItem value="MALE" className="w-full flex-1">
                        Nam
                      </SelectItem>
                      <SelectItem value="FEMALE" className="w-full flex-1">
                        Nữ
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="date_of_birth" className="mb-1 block text-sm">
                    <strong>Ngày sinh</strong>
                  </label>
                  <Input
                    type="date"
                    className="block w-full text-sm"
                    id="date_of_birth"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm">
                  <strong>Email</strong>
                </label>
                <Input
                  type="email"
                  className="block w-full text-sm"
                  id="email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm">
                  <strong>Số điện thoại</strong>
                </label>
                <Input
                  type="text"
                  className="block w-full text-sm"
                  id="phone"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="address" className="mb-1 block text-sm">
                  <strong>Địa chỉ</strong>
                </label>
                <Input type="text" className="block w-full" id="address" />
              </div>
            </div>

            <span className="mb-5 mt-8 block border-b-2 border-solid border-gray-200 pb-[2px] text-lg font-bold">
              <h2>Thông tin tài khoản</h2>
            </span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="mb-1 block text-sm">
                  <strong>Tên tài khoản</strong>
                </label>
                <Input
                  type="text"
                  className="block w-full"
                  id="username"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm">
                  <strong>Mật khẩu (Để trống để giữ nguyên)</strong>
                </label>
                <Input type="text" className="block w-full" id="password" />
              </div>
            </div>

            <div className="mt-6 flex w-full justify-end items-center gap-2">
              <Button className="rounded-md border bg-white px-4 py-2 text-black transition hover:bg-gray-100">
                Reset
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="edit">Thay đổi</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Xác nhận thay đổi thông tin cá nhân
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Vui lòng kiểm tra lại thông tin trước khi xác nhận.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Thoát</AlertDialogCancel>
                    <AlertDialogAction>Xác nhận</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="flex flex-col items-center border-l pl-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden">
              <img
                src={"/logo-icon.png"}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-gray-400 text-center mt-3">
              Dung lượng file tối đa 1 MB
              <br />
              Định dạng: .JPEG, .PNG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
