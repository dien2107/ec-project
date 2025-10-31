import type { PaymentMethod } from "./payment-method";
import type { Status } from "../status";

export interface PaymentDestination {
  destinationId: number;
  paymentMethodId: number;
  identifier?: string;
  bankName?: string;
  imageUrl?: string;
  accountName?: string;
  status?: Status;
  paymentMethod?: PaymentMethod;
  paymentMethodName?: string;
  createdAt?: string;
  updatedAt?: string;
}
