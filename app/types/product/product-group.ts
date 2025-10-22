import type { Status } from "../status";

export interface ProductGroup {
  productGroupId: number;
  name: string;
}

export interface ProductGroupDetail extends ProductGroup {
  description: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
