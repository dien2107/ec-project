import React from "react";
import { Eye } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  currentStock: number;
  maxStock: number;
  minStock: number;
  status: "in_stock" | "out_of_stock";
  lastUpdated: string;
  unitPrice: number;
  totalValue: number;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  bgColor: string;
}
export interface StockUpdateModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (productId: string, newStock: number) => void;
}
export const useInventoryStats = (products: Product[]) => {
  const totalProducts = products.length;
  const outOfStockProducts = products.filter(
    p => p.status === "out_of_stock"
  ).length;

  return {
    totalProducts,
    outOfStockProducts,
  };
};
