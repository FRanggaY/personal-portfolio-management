import * as React from 'react';
import TableSkillMapping from '@/components/layout/table/table-skill-mapping';
import { Typography } from '@mui/material';


export default function SkillMapping() {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        Skill Mapping
      </Typography>
      <TableSkillMapping
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
