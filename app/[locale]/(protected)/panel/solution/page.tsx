import * as React from 'react';
import TableSolution from '@/components/layout/table/table-solution';
import { Typography } from '@mui/material';


export default function Solution() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Solution
      </Typography>
      <TableSolution
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
