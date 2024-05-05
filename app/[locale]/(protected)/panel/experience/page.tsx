import * as React from 'react';
import TableExperience from '@/components/layout/table/table-experience';
import { Typography } from '@mui/material';


export default function Experience() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Experience
      </Typography>
      <TableExperience
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
