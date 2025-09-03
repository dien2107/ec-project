import type { Category } from "../types";

// ------------------- Mock data -------------------
export const mockCategories: Category[] = [
  {
    id: "CAT001",
    name: "Áo nam",
    description: "Các loại áo dành cho nam giới",
    productCount: 45,
    status: "active",
    createdDate: "15/01/2024",
  },
  {
    id: "CAT002",
    name: "Quần nữ",
    description: "Các loại quần dành cho nữ giới",
    productCount: 32,
    status: "active",
    createdDate: "10/01/2024",
  },
  {
    id: "CAT003",
    name: "Giày trẻ em",
    description: "Giày dép cho trẻ em",
    productCount: 18,
    status: "inactive",
    createdDate: "05/01/2024",
  },
  {
    id: "CAT004",
    name: "Phụ kiện",
    description: "Các phụ kiện thời trang",
    productCount: 67,
    status: "active",
    createdDate: "20/12/2023",
  },
  {
    id: "CAT005",
    name: "Túi xách",
    description: "Túi xách và balo",
    productCount: 23,
    status: "active",
    createdDate: "12/12/2023",
  },
];
