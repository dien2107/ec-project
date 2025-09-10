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

const eWalletSchema = z.object({
  name: z.string().min(1, "Tên ví điện tử là bắt buộc"),
  ownerName: z.string().min(1, "Tên chủ ví là bắt buộc"),
  identifier: z.string().min(1, "Số điện thoại/ID ví là bắt buộc"),
});

type EWalletFormValues = z.infer<typeof eWalletSchema>;

const walletOptions = [
  "MoMo",
  "ZaloPay",
  "ShopeePay",
  "ViettelPay",
  "VNPay",
  "PayPal",
  "GrabPay",
];

interface EWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingWallet?: any;
  onSave: (data: EWalletFormValues) => void;
  onCancel: () => void;
}

export const EWalletModal: React.FC<EWalletModalProps> = ({
  open,
  onOpenChange,
  editingWallet,
  onSave,
  onCancel,
}) => {
  const form = useForm<EWalletFormValues>({
    resolver: zodResolver(eWalletSchema),
    defaultValues: editingWallet || {
      name: "",
      ownerName: "",
      identifier: "",
    },
  });

  React.useEffect(() => {
    if (editingWallet) {
      form.reset(editingWallet);
    } else {
      form.reset({
        name: "",
        ownerName: "",
        identifier: "",
      });
    }
  }, [editingWallet, form]);

  const onSubmit = (data: EWalletFormValues) => {
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
            {editingWallet ? "Chỉnh sửa ví điện tử" : "Thêm ví điện tử mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại ví điện tử</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ví điện tử" />
                      </SelectTrigger>
                      <SelectContent>
                        {walletOptions.map(wallet => (
                          <SelectItem key={wallet} value={wallet}>
                            {wallet}
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
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên chủ ví</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên chủ ví" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại/ID ví</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập số điện thoại hoặc ID ví"
                    />
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
                {editingWallet ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
