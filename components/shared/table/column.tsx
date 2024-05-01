import { handleSort } from "@/lib/sorting";
import { TableCell, TableSortLabel } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export const SortableColumn = ({ columnKey, label, sortBy, sortOrder, router, searchParams }: { columnKey: string, label: string, sortBy: string, sortOrder: string, router: ReturnType<typeof useRouter>, searchParams: ReturnType<typeof useSearchParams> }) => (
  <TableCell align="left">
    <TableSortLabel
      active={sortBy === columnKey}
      direction={sortBy === columnKey ? sortOrder as 'asc' | 'desc' : undefined}
      onClick={() => handleSort(
        router, 
        columnKey,
        sortBy,
        sortOrder,
        searchParams,
      )}
    >
      {label}
    </TableSortLabel>
  </TableCell>
);
