export type OrderStatus = "Chờ xác nhận" | "Đang giao" | "Đã giao" | "Đã hủy";

export type OrderItem = {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    variant?: string;
  }[];
}

export type UserAddress = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export type UserOrder = {
  id: string;
  orderNumber: string;
  date: string;
  totalAmount: number;
  status: 'processing' | 'delivered' | 'canceled';
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }[];
}

export type UserProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  orders: UserOrder[];
}
