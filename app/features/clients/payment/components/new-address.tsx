import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Form, FormField, FormItem, FormControl, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import type { Address } from "~/features/clients/payment/types/payment";

const schema = z.object({
  fullName: z.string().min(1, "Họ và tên là bắt buộc"),
  phone: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
  city: z.string().min(1, "Thành phố/Tỉnh là bắt buộc"),
  note: z.string().optional(),
});

export default function NewAddressSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (address: Address) => void;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      note: "",
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] flex flex-col bg-gray-50">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <SheetTitle className="text-xl font-semibold text-gray-800">
            Thêm địa chỉ mới
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              onSubmit({
                id: crypto.randomUUID(),
                fullName: values.fullName,
                phone: values.phone,
                address: values.address,
                city: values.city,
                isDefault: false,
              });
              onOpenChange(false);
            })}
            className="flex flex-col flex-1 space-y-6 p-6"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nguyễn Văn A"
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0912345678"
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Địa chỉ cụ thể</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Đường ABC"
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Thành phố/Tỉnh</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="TP. Hồ Chí Minh"
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Ghi chú (không bắt buộc)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ghi chú thêm (nếu có)"
                      className="border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <SheetFooter className="pt-6">
              <Button
                type="submit"
                className="w-full bg-black text-white rounded-lg py-2.5"
              >
                Lưu địa chỉ
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}