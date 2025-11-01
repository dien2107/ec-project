import type { Status } from "~/types/status";

export type ShippingFilterProps = {
  filters: {
    statusId?: number | undefined;
    corpName?: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      statusId?: number | undefined;
      corpName?: string;
    }>
  >;
  meta: Status[];
};
