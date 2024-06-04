"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useParams, useSearchParams } from 'next/navigation';
import { validLocale } from '@/lib/locale';
import { getPublicProfileEducations, getPublicProfileExperiences, getPublicProfileProjects, getPublicProfileSkills, getPublicProfileSolutions } from '@/data/repository/public-profile-repository';

export default function DetailProfile() {
  const [dataProjects, setDataProjects] = React.useState({
    data: []
  });
  const [dataSkills, setDataSkills] = React.useState({
    data: []
  });
  const [dataExperiences, setDataExperiences] = React.useState({
    data: []
  });
  const [dataEducations, setDataEducations] = React.useState({
    data: []
  });
  const [dataSolutions, setDataSolutions] = React.useState({
    data: []
  });
  const params = useParams<{ locale: string; }>();
  const locale = validLocale(params.locale);
  const searchParams = useSearchParams();
  const userName = searchParams.get('username') ?? "";
  const page = '1';

  const customParams = {
    offset: page,
    size: 10,
  }

  const fetchData = async () => {
    setDataProjects(await getPublicProfileProjects(String(userName), locale, customParams))
    setDataSkills(await getPublicProfileSkills(String(userName), locale, customParams))
    setDataEducations(await getPublicProfileEducations(String(userName), locale, customParams))
    setDataExperiences(await getPublicProfileExperiences(String(userName), locale, customParams))
    setDataSolutions(await getPublicProfileSolutions(String(userName), locale, customParams))
  }

  React.useEffect(() => {
    if (userName) {
      fetchData();
    }else{
      setDataProjects({
        data: []
      });
      setDataSkills({
        data: []
      });
      setDataEducations({
        data: []
      });
      setDataExperiences({
        data: []
      });
      setDataSolutions({
        data: []
      });
    }
  }, [userName])


  return (
    <Box
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5
        }}
      >
        {
          dataSkills.data.length > 0 &&
          <div className='flex flex-col gap-10 m-14'>
            <Typography>Skill</Typography>
            <code>
              {JSON.stringify(dataSkills.data.slice(0, 10), null, 2)}
            </code>
          </div>
        }
        
        {
          dataExperiences.data.length > 0 &&
          <div className='flex flex-col gap-10 m-14'>
            <Typography>Experience</Typography>
            <code>
              {JSON.stringify(dataExperiences.data.slice(0, 10), null, 2)}
            </code>
          </div>
        }
        
        {
          dataEducations.data.length > 0 &&
          <div className='flex flex-col gap-10 m-14'>
            <Typography>Education</Typography>
            <code>
              {JSON.stringify(dataEducations.data.slice(0, 10), null, 2)}
            </code>
          </div>
        }

        {
          dataProjects.data.length > 0 &&
          <div className='flex flex-col gap-10 m-14'>
            <Typography>Project</Typography>
            <code>
              {JSON.stringify(dataProjects.data.slice(0, 10), null, 2)}
            </code>
          </div>
        }
        
        {
          dataSolutions.data.length > 0 &&
          <div className='flex flex-col gap-10 m-14'>
            <Typography>Solution</Typography>
            <code>
              {JSON.stringify(dataSolutions.data.slice(0, 10), null, 2)}
            </code>
          </div>
        }
      <Typography>Only show 10 each data</Typography>
      </Container>
    </Box>
  );
}
