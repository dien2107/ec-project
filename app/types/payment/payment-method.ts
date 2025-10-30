import type {Status} from "../status";

export type PaymentMethod = {
  paymentMethodId: number;
  methodName?: string;
  methodType?: string;
  status?: Status;
}
