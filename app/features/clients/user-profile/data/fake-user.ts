import type { OrderItem } from "~/features/clients/user-profile/types/user";

export const mockUserData = {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
};

export const mockOrders: OrderItem[] = [
  {
    id: "ORD-2025-001",
    status: "Chờ xác nhận",
    date: "10/08/2025",
    total: 350000,
    items: [
      {
        id: "1-1",
        name: "Áo thun form rộng Unisex",
        price: 150000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
        variant: "Trắng / L",
      },
      {
        id: "1-2",
        name: "Quần jeans slim fit",
        price: 200000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop",
        variant: "Xanh / 30",
      },
    ],
  },
  {
    id: "ORD-2025-002",
    status: "Đang giao",
    date: "08/08/2025",
    total: 550000,
    items: [
      {
        id: "2-1",
        name: "Giày sneaker thời trang",
        price: 550000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
        variant: "Trắng / 40",
      },
    ],
  },
  {
    id: "ORD-2025-003",
    status: "Đã giao",
    date: "05/08/2025",
    total: 420000,
    items: [
      {
        id: "3-1",
        name: "Balo laptop chống nước",
        price: 220000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      },
      {
        id: "3-2",
        name: "Mũ lưỡi trai",
        price: 100000,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
        variant: "Đen / Free size",
      },
    ],
  },
  {
    id: "ORD-2025-004",
    status: "Đã hủy",
    date: "03/08/2025",
    total: 180000,
    items: [
      {
        id: "4-1",
        name: "Mũ bucket họa tiết vintage",
        price: 180000,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=300&fit=crop",
        variant: "Kẻ sọc / Free size",
      },
    ],
  },
];
