import * as React from 'react';
import TableProjectSkill from '@/components/layout/table/table-project-skill';
import { Button, Typography } from '@mui/material';
import { ResponseProject } from '@/types/project';
import { getAccessToken } from '@/actions/auth/auth-action';
import { getProject } from '@/data/repository/project/project-repository';


export default async function ProjectSkill({
  params,
}: Readonly<{
  params: { id: string, locale: string }
}>) {
  const accessToken = await getAccessToken();
  let data: ResponseProject | null = null
  if (accessToken) {
    data = await getProject(accessToken.value, params.id);
  }

  if (!data || Object.keys(data.data).length === 0) {
    return <div>Not Found</div>
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Project Skill - {data.data.title}
      </Typography>

      <Button
        variant="contained"
        href={`/${params.locale}/panel/project`}
      >
        Back
      </Button>

      <TableProjectSkill
        itemsPerPage={10}
      />
    </>
  );
}
