import type { Supplier } from "../types";

export const mockSuppliers: Supplier[] = [
  {
    id: "NCC001",
    name: "Công ty TNHH Thời Trang ABC",
    contact: "Nguyễn Văn A\ncontact@abc-fashion.com\n0123456787",
    info: "123 Đường Nguyễn Huệ, Q1, TP.HCM",
    productCount: 45,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "NCC002",
    name: "Xưởng May Xuân Hà",
    contact: "Yến Thị B\nyen@xuankha.com\n0987654321",
    info: "456 Đường Lê Lợi, Q3, TP.HCM",
    productCount: 23,
    status: "active",
    createdAt: "2024-01-19",
  },
  {
    id: "NCC003",
    name: "Fashion Import Ltd",
    contact: "John Smith\njohn@fashionimport.com\n0123456789",
    info: "789 Fashion Street, District 7, HCMC",
    productCount: 67,
    status: "inactive",
    createdAt: "2024-01-05",
  },
];
