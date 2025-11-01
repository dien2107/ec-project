import type { Status } from "~/types/status";
export type Discount = {
  discountId: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usedCount: number;
  startAt: Date;
  endAt: Date;
  status: status;
  createdAt: Date;
  updatedAt: Date;
};
