import * as React from 'react';
import TableProject from '@/components/layout/table/table-project';
import { Typography } from '@mui/material';


export default function Project() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Project
      </Typography>
      <TableProject
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
