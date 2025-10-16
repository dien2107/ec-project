import type { Status } from "~/types/status";

export type ReviewFilterProps = {
  filters: {
    statusName: string | undefined;
    search: string | undefined;
    rating: number | undefined;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      statusName: string | undefined;
      search: string | undefined;
      rating: number | undefined;
    }>
  >;
  meta: {
    statuses: Status[];
  };
};
