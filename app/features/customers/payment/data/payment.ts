import type { CartItem } from "~/features/customers/payment/types/payment";

export const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Áo thun nam cổ tròn basic",
    price: 199000,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    size: "M",
    color: "Trắng",
  },
  {
    id: "2",
    name: "Quần jean nam slim fit",
    price: 499000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    size: "32",
    color: "Xanh đậm",
  },
  {
    id: "3",
    name: "Giày thể thao nam",
    price: 899000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    size: "42",
    color: "Đen",
  },
  {
    id: "4",
    name: "Áo khoác dù nam",
    price: 659000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    size: "L",
    color: "Xám",
  },
  {
    id: "5",
    name: "Túi đeo chéo thời trang",
    price: 299000,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop",
    size: "One size",
    color: "Đen",
  },
];

export const mockSelectedItems: string[] = ["1", "2", "3"];
