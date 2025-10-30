import type { Status } from "~/types/status";

export type Size = {
  sizeId: number;
  name: string;
};

export interface SizeDetailDto {
  sizeId: number;
  name: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}
