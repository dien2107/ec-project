import type { CartItemData } from "../types";

export const initialCartItems: CartItemData[] = [
  {
    id: "1",
    name: "Áo phông trắng basic",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzMkg1MlYzNkg0OFY0OEgzMlYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+",
    size: "L",
    color: "Trắng",
    price: 199000,
    quantity: 1,
    selected: true,
  },
  {
    id: "2",
    name: "Quần jean nam slim fit",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRTVFN0VCIi8+CjxwYXRoIGQ9Ik0zMCAzMEg1MFY1MEg0NlY0NkgzNFYzNFoiIGZpbGw9IiMzNzQxNTEiLz4KPC9zdmc+",
    size: "32",
    color: "Xanh đậm",
    price: 499000,
    quantity: 1,
    selected: true,
  },
  {
    id: "3",
    name: "Giày thể thao nữ",
    image:
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRkVFMkU2Ii8+CjxlbGxpcHNlIGN4PSI0MCIgY3k9IjQwIiByeD0iMjAiIHJ5PSIxMCIgZmlsbD0iI0Y5NzMxNiIvPgo8L3N2Zz4=",
    size: "38",
    color: "Hồng",
    price: 850000,
    quantity: 1,
    selected: true,
  },
];
