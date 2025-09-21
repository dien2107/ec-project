import type { PaymentCard } from "../types";

export const mockPaymentCards: PaymentCard[] = [
  {
    id: "CARD-001",
    cardHolder: "NGUYEN VAN A",
    cardNumber: "4111 1111 1111 1111",
    expiry: "12/25",
    brand: "Visa",
    isDefault: true,
    cvv: "123",
  },
  {
    id: "CARD-002",
    cardHolder: "NGUYEN VAN A",
    cardNumber: "5555 5555 5555 5555",
    expiry: "09/25",
    brand: "MasterCard",
    isDefault: false,
    cvv: "456",
  },
];