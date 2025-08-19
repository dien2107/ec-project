
export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface UserOrder {
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

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: UserAddress[];
  orders: UserOrder[];
}

export const mockUserData: UserProfile = {
  id: "user123",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0912345678",
  addresses: [
    {
      id: "addr1",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "123 Đường Lê Lợi",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: "addr2",
      fullName: "Nguyễn Văn A",
      phone: "0912345678",
      address: "456 Đường Nguyễn Huệ",
      district: "Quận 1",
      city: "TP. Hồ Chí Minh",
      isDefault: false,
    }
  ],
  orders: [
    {
      id: "ord1",
      orderNumber: "DH-001234",
      date: "2025-05-01",
      totalAmount: 850000,
      status: "delivered",
      items: [
        {
          productId: "prod1",
          productName: "Áo thun basic",
          quantity: 2,
          price: 250000,
          imageUrl: "/placeholder.svg",
        },
        {
          productId: "prod2",
          productName: "Quần jean nam",
          quantity: 1,
          price: 350000,
          imageUrl: "/placeholder.svg",
        }
      ]
    },
    {
      id: "ord2",
      orderNumber: "DH-001235",
      date: "2025-05-05",
      totalAmount: 520000,
      status: "processing",
      items: [
        {
          productId: "prod3",
          productName: "Áo khoác denim",
          quantity: 1,
          price: 520000,
          imageUrl: "/placeholder.svg",
        }
      ]
    },
    {
      id: "ord3",
      orderNumber: "DH-001236",
      date: "2025-05-08",
      totalAmount: 680000,
      status: "canceled",
      items: [
        {
          productId: "prod4",
          productName: "Giày thể thao",
          quantity: 1,
          price: 680000,
          imageUrl: "/placeholder.svg",
        }
      ]
    }
  ]
};