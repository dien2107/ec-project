"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { ImportOrder } from "../types";
import { STATUS_TRANSITIONS, statusMap } from "../types";
import { updateStatusPurchaseOrder } from "~/services/purchase-order";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchStatuses } from "~/redux/slices/statuses";
import { ENTITY_TYPE } from "~/constants/entity-types";
import toast from "react-hot-toast";

interface ChangeStatusModalProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ChangeStatusModal({
  open,
  order,
  onClose,
  onSuccess,
}: ChangeStatusModalProps) {
  const dispatch = useAppDispatch();
  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.PURCHASE_ORDER] ?? []
  );
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      dispatch(fetchStatuses({ entityType: ENTITY_TYPE.PURCHASE_ORDER }));
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (order && statuses.length > 0) {
      // Lấy trạng thái tiếp theo có thể chuyển
      const currentStatus = order.status?.name || order.statusName || "Draft";
      const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] || [];

      if (allowedNextStatuses.length > 0) {
        const nextStatusName = allowedNextStatuses[0];
        const nextStatus = statuses.find((s) => s.name === nextStatusName);
        if (nextStatus) {
          setSelectedStatusId(nextStatus.statusId);
        }
      }
    }
  }, [order, statuses]);

  if (!order) return null;

  const currentStatus = order.status?.name || order.statusName || "Draft";
  const allowedNextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
  const availableStatuses = statuses.filter((s) =>
    allowedNextStatuses.includes(s.name)
  );

  const handleSubmit = async () => {
    if (!selectedStatusId) {
      toast.error("Vui lòng chọn trạng thái!");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStatusPurchaseOrder(
        String(order.purchaseOrderId),
        selectedStatusId
      );
      toast.success("Cập nhật trạng thái thành công!");
      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Cập nhật trạng thái thất bại";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đổi trạng thái đơn hàng</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái cho đơn hàng #{order.purchaseOrderId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Trạng thái hiện tại</Label>
            <div className="p-3 bg-gray-50 rounded-md">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusMap[currentStatus]?.className || "bg-gray-100 text-gray-800"}`}
              >
                {statusMap[currentStatus]?.label || order.statusName}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStatus">Trạng thái mới *</Label>
            {availableStatuses.length === 0 ? (
              <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-md">
                Không có trạng thái tiếp theo để chuyển
              </div>
            ) : (
              <Select
                value={selectedStatusId?.toString() || ""}
                onValueChange={(value) => setSelectedStatusId(Number(value))}
              >
                <SelectTrigger id="newStatus">
                  <SelectValue placeholder="Chọn trạng thái mới" />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((status) => (
                    <SelectItem
                      key={status.statusId}
                      value={status.statusId.toString()}
                    >
                      {statusMap[status.name]?.label || status.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="text-sm text-gray-500 p-3 bg-blue-50 rounded-md">
            <strong>Lưu ý:</strong> Trạng thái sẽ được chuyển theo đúng quy
            trình:
            <div className="mt-2 text-xs">
              Bản nháp → Đang chờ → Đã duyệt → Đã đặt hàng → Đã nhận → Hoàn
              thành
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !selectedStatusId ||
              availableStatuses.length === 0 ||
              isSubmitting
            }
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
