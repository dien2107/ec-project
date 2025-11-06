import type { paymentDto, User } from "~/features/system/orders/types";

export type OrderStatus =
  | "Chờ xác nhận"
  | "Đã xác nhận"
  | "Đang xử lý"
  | "Đang giao"
  | "Đã giao"
  | "Đã hủy";

export type OrderItem = {
  id: number;
  status: OrderStatus;
  date: string;
  total: number;
  address: string;
  user: User;
  items: {
    orderItemId: number;
    productVariantId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
  }[];
  payment: paymentDto | null;
};

export type UserAddress = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
};

export type UserOrder = {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  status: "processing" | "delivered" | "canceled";
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
};

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  orders: UserOrder[];
};
