import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SortableHeader } from "../../components/data-table";

export type address = {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  street_address: string;
  city: string;
  ward: string;
  district: string;
  is_default: boolean;
};

export type discount = {
  id: number;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
};

export type shipping_method = {
  id: number;
  corp_name: string;
  base_cost: number;
};

export type payment = {
  id: number;
  order_id: number;
  payment_method: "COD" | "BANK_TRANSFER" | "CASH";
};

export type order_item = {
  id: number;
  order_id: number;
  product_variant_id: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Order = {
  id: string;
  address_id: number;
  address: address;
  discount_id: number | null;
  discount: discount | null;
  discount_amount: number;
  total_amount: number;
  is_free_ship: boolean;
  shipped_at: Date | null;
  delivery_at: Date | null;
  status: "pending" | "processing" | "completed" | "cancelled";
  payment: payment;
  shipping_method: shipping_method;
  created_at: Date;
  updated_at: Date;
  items: order_item[];
};
