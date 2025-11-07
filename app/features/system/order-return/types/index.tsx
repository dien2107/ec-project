// ============= Types =============
export type ReturnType = "exchange" | "return";
export type ReturnStatus =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "draft";

export type Customer = {
  name: string;
  phone: string;
};

export type Product = {
  name: string;
  sku: string;
  price: number;
  image: string;
};

export type Order = {
  orderId: string;
  customer: Customer;
  product: Product;
};

export type Return = {
  id: string;
  orderId: string;
  orderItemId: number;
  type: ReturnType;
  customer: Customer;
  product: Product;
  reason: string;
  description: string;
  status: ReturnStatus;
  requestDate: string;
  quantity: number;
};

export type Filters = {
  status: string;
  dateFrom: string;
  dateTo: string;
  productSearch: string;
  customerSearch: string;
  phoneSearch: string;
};
