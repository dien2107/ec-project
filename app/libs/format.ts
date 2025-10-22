export const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
