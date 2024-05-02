import * as React from 'react';
import TableCompany from '@/components/layout/table/table-company';
import { Typography } from '@mui/material';


export default function Company() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Company
      </Typography>
      <TableCompany
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
