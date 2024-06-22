import * as React from 'react';
import { Button, Typography } from '@mui/material';
import { ResponseProject } from '@/types/project/project';
import { getAccessToken } from '@/actions/auth/auth-action';
import { getProject } from '@/data/repository/project/project-repository';
import TableProjectAttachment from '@/components/layout/table/project/table-project-attachment';


export default async function ProjectAttachment({
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
        Project Attachment - {data.data.title}
      </Typography>

      <Button
        variant="contained"
        href={`/${params.locale}/panel/project`}
      >
        Back
      </Button>

      <TableProjectAttachment
        itemsPerPage={10}
        itemsPerPageList={[5, 10, 50, 100]}
      />
    </>
  );
}
