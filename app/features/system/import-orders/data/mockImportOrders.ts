import type { ImportOrder } from "../types";

export const mockImportOrders: ImportOrder[] = [
  {
    id: "IMP-2024-001",
    supplier: "Công ty TNHH Thời Trang ABC",
    quantity: 45,
    total: 15000000,
    status: "pending",
    orderDate: "2024-01-15",
    expectedDate: "2024-01-25",
  },
  {
    id: "IMP-2024-002",
    supplier: "Xưởng May Xuân Hà",
    quantity: 23,
    total: 8500000,
    status: "approved",
    orderDate: "2024-01-10",
    expectedDate: "2024-01-20",
  },
  {
    id: "IMP-2024-003",
    supplier: "Fashion Import Ltd",
    quantity: 67,
    total: 25000000,
    status: "received",
    orderDate: "2024-01-05",
    expectedDate: "2024-01-15",
  },
];
