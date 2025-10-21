import type { Status } from "~/types/status";

export type Size = {
  sizeId: number;
  name: string;
};

export interface SizeDetail {
  sizeId: number;
  name: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}
