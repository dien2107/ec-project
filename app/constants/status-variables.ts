export const STATUS_VARIABLE = {
  Active: "Active",
  Inactive: "Inactive",
  Lock: "Lock",
  Pending: "Pending",
  Approved: "Approved",
  Draft: "Draft",
  Handled: "Handled",
  Ignored: "Ignored",
  Rejected: "Rejected",
  Shipped: "Shipped",
  Delivered: "Delivered",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Processing: "Processing",
} as const;

export type StatusValue =
  (typeof STATUS_VARIABLE)[keyof typeof STATUS_VARIABLE];
