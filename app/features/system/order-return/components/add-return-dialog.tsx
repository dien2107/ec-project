// components/add-return-dialog.tsx
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Plus } from "lucide-react";

// Minimal payload expected by backend/UI
export type MinimalProductReturnRequest = {
  orderItemId: number;
  returnType: number;
  returnReason: string;
  returnAmount?: number | null;
  returnProductVariantId?: number | null;
};

interface AddReturnDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onAdded: (payload: MinimalProductReturnRequest) => void;
}

export default function AddReturnDialog({
  open,
  setIsOpen,
  onAdded,
}: AddReturnDialogProps) {
  const [payload, setPayload] = useState<Partial<MinimalProductReturnRequest>>({
    // default to 1 = đổi (exchange)
    returnType: 1,
    returnAmount: null,
    orderItemId: 0,
    returnProductVariantId: null,
    returnReason: "",
  });

  const handleSubmit = () => {
    if (
      payload.orderItemId == null ||
      payload.returnType == null ||
      !payload.returnReason
    ) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    onAdded(payload as MinimalProductReturnRequest);
    setIsOpen(false);

    // reset
    setPayload({
      returnType: 0,
      returnAmount: 0,
      orderItemId: 0,
      returnProductVariantId: 0,
      returnReason: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Thêm phiếu đổi/trả
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Thêm phiếu đổi/trả (nhập thông tin chính)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="orderItemId">Order Item ID (orderItemId)</Label>
            <Input
              id="orderItemId"
              type="number"
              value={payload.orderItemId ?? 0}
              onChange={e =>
                setPayload({ ...payload, orderItemId: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnType">Return Type</Label>
            <Select
              value={String(payload.returnType ?? 1)}
              onValueChange={value =>
                setPayload({ ...payload, returnType: Number(value) })
              }
            >
              <SelectTrigger id="returnType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Đổi hàng</SelectItem>
                <SelectItem value="2">Trả hàng</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">1 = Đổi hàng, 2 = Trả hàng</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnReason">Lý do (returnReason)</Label>
            <Input
              id="returnReason"
              value={payload.returnReason ?? ""}
              onChange={e =>
                setPayload({ ...payload, returnReason: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnAmount">
              Số tiền hoàn/giá trị (returnAmount)
            </Label>
            <Input
              id="returnAmount"
              type="number"
              value={payload.returnAmount ?? 0}
              onChange={e =>
                setPayload({ ...payload, returnAmount: Number(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnProductVariantId">
              Variant ID (returnProductVariantId)
            </Label>
            <Input
              id="returnProductVariantId"
              type="number"
              value={payload.returnProductVariantId ?? 0}
              onChange={e =>
                setPayload({
                  ...payload,
                  returnProductVariantId: Number(e.target.value),
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
