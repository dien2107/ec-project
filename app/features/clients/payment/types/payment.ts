export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export type LocationState = {
  cartItems: CartItem[];
  selectedItems: string[];
}