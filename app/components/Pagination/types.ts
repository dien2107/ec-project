export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  onPageChange: (page: number) => void;
};
