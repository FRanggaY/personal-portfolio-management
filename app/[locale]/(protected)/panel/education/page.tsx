import * as React from 'react';
import TableEducation from '@/components/layout/table/table-education';
import { Typography } from '@mui/material';


export default function Education() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Education
      </Typography>
      <TableEducation
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
