import * as React from "react";

export type PaymentCard = {
  id: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  brand: "Visa" | "MasterCard" | "JCB" | "AMEX";
  isDefault: boolean;
  cvv: string;
};