import * as React from 'react';
import TableSkill from '@/components/layout/table/table-skill';
import { Typography } from '@mui/material';


export default function Skill() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Skill
      </Typography>
      <TableSkill
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
