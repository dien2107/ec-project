import type { Status } from "~/types/status";
export type Color = {
  colorId: number;
  name: string;
};

export type ColorDetailDto = {
  colorId: number;
  displayName: string;
  name: string;
  hexCode: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
};
