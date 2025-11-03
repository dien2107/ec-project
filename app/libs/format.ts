export const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export const formatDate = (date: string | Date | undefined) => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
