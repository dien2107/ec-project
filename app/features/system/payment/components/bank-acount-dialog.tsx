import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Tên ngân hàng là bắt buộc"),
  accountName: z.string().min(1, "Tên chủ tài khoản là bắt buộc"),
  accountNumber: z.string().min(1, "Số tài khoản là bắt buộc"),
});

type BankAccountFormValues = z.infer<typeof bankAccountSchema>;

const bankOptions = [
  "Vietcombank",
  "Techcombank",
  "VietinBank",
  "BIDV",
  "Agribank",
  "SacomBank",
  "VPBank",
  "TPBank",
  "MBBank",
  "HDBank",
];

interface BankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingBank?: any;
  onSave: (data: BankAccountFormValues) => void;
  onCancel: () => void;
}

export const BankAccountModal: React.FC<BankAccountModalProps> = ({
  open,
  onOpenChange,
  editingBank,
  onSave,
  onCancel,
}) => {
  const form = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: editingBank || {
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
  });

  React.useEffect(() => {
    if (editingBank) {
      form.reset(editingBank);
    } else {
      form.reset({
        bankName: "",
        accountName: "",
        accountNumber: "",
      });
    }
  }, [editingBank, form]);

  const onSubmit = (data: BankAccountFormValues) => {
    onSave(data);
    form.reset();
  };

  const handleCancel = () => {
    onCancel();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingBank
              ? "Chỉnh sửa tài khoản ngân hàng"
              : "Thêm tài khoản ngân hàng mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên ngân hàng</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankOptions.map(bank => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ tài khoản</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên chủ tài khoản" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tài khoản</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập số tài khoản" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button type="submit">
                {editingBank ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
