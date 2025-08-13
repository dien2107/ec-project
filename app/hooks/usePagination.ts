import { useMemo } from "react";
import type { PaginationBaseProps } from "~/types/pagination.schema";

export function usePagination({
  currentPage,
  totalPages,
  siblingCount = 2,
}: PaginationBaseProps) {
  return useMemo(() => {
    const remainingPages = totalPages - currentPage;

    const prevPages: number[] = Array.from(
      { length: Math.max(0, Math.min(currentPage - 1, siblingCount)) },
      (_, i) => currentPage - Math.min(currentPage - 1, siblingCount) + i
    );

    const nextPages: number[] = Array.from(
      { length: Math.max(0, Math.min(remainingPages, siblingCount)) },
      (_, i) => currentPage + i + 1
    );

    const showFirstEllipsis = currentPage - siblingCount > 2;
    const showLastEllipsis =
      remainingPages > siblingCount &&
      currentPage + siblingCount + 1 !== totalPages;

    return {
      remainingPages,
      prevPages,
      nextPages,
      showFirstEllipsis,
      showLastEllipsis,
    };
  }, [currentPage, totalPages, siblingCount]);
}