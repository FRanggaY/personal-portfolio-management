import * as React from 'react';
import TableSchool from '@/components/layout/table/table-school';
import { Typography } from '@mui/material';


export default function School() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        School
      </Typography>
      <TableSchool
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
