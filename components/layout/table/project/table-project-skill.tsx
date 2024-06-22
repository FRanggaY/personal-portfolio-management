"use client";

import React, { useEffect, useState } from 'react';
import { Button, Tooltip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputLabel, FormControl, Select, MenuItem, FormGroup, FormControlLabel, Switch, Box, Typography } from '@mui/material';
import { getProjectResource } from '@/data/repository/project/project-repository';
import { TableDataNotFound, TableLoading } from '../../../shared/table/table';
import DeleteIcon from '@mui/icons-material/Delete';
import { ModalConfirmation } from '@/components/shared/modal/modal';
import { toast } from 'sonner';
import { ResponseGeneralDynamicResource } from '@/types/general';
import { getAccessToken } from '@/actions/auth/auth-action';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { deleteProjectSkill, getProjectSkills } from '@/data/repository/project/project-skill-repository';
import { ProjectSkill, ResponseProjectSkills } from '@/types/project/project-skill';
import { ResponseSkills, Skill } from '@/types/skill/skill';
import { getSkills } from '@/data/repository/skill/skill-repository';
import { addProjectSkill, editProjectSkill } from '@/actions/project/project-skill-action';
import { makeid } from '@/lib/general';


const TableProjectSkill = ({ itemsPerPage }: { itemsPerPage: number }) => {
  const [dataProjectSkills, setDataProjectSkills] = useState<ProjectSkill[] | []>([]);
  const [dataProjectSkillTemps, setDataProjectSkillTemps] = useState<ProjectSkill[] | []>([]);
  const [resource, setResource] = useState<ResponseGeneralDynamicResource | null>(null);
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState({
    id: {},
    skill_id: '',
    show: false,
  });
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ locale: string, id: string; }>();
  const sortBy = searchParams.get('sort_by') ?? "skill_id";
  const sortOrder = searchParams.get('sort_order') ?? "asc";

  const fetchProjectSkills = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const projectSkillsData: ResponseProjectSkills = await getProjectSkills(accessToken.value, {
          project_id: params.id,
          sort_by: sortBy,
          sort_order: sortOrder,
        })
        setDataProjectSkills(projectSkillsData.data);
        setDataProjectSkillTemps(projectSkillsData.data);
      }
    } catch (error) {
      console.error("Error fetching project skills:", error);
    } finally {
      // reset
      setLoading(false);
    }
  };

  const fetchSkillsBatch = async (offset: number, size: number) => {
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data: ResponseSkills = await getSkills(accessToken.value, { offset, size });
        return data;
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      throw error; // Propagate the error to the caller
    }
  };

  const fetchSkills = async (offset: number, size: number) => {
    setLoading(true);
    try {
      const skillsBatch = [];
      let currentOffset = offset;
      while (true) {
        const skillsData = await fetchSkillsBatch(currentOffset, size);
        if (skillsData) {
          skillsBatch.push(skillsData.data);
          if (skillsData.meta.offset < size) {
            // Break the loop if fetched skills are less than requested size
            break;
          }
        } else {
          break;
        }
        currentOffset += size; // Increment offset for the next batch
      }
      const allSkills = skillsBatch.flat(); // Flatten the array of batches
      if (allSkills != null) {
        setSkills(allSkills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResource = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const resourceData: ResponseGeneralDynamicResource = await getProjectResource(accessToken.value);
        setResource(resourceData);
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    } finally {
      // reset
      setLoading(false);
    }
  };

  const handleDeleteProjectSkill = async () => {
    setLoading(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        const data = await deleteProjectSkill(accessToken.value, params.id, isModalConfirmDelete.skill_id)
        if (data == 'SUCCESS') {
          toast.success('project skill deleted successfully');
          fetchProjectSkills();

          const params = new URLSearchParams(searchParams);
          params.set("page", String(1));
          const updatedSearch = `?${params.toString()}`;
          const newPath = `${window.location.pathname}${updatedSearch}`;
          router.replace(newPath);
        } else if (data != 'NOT_FOUND') {
          toast.error(data);
        }
        handleRemoveFields(isModalConfirmDelete.id);
      }
      // reset
      setIsModalConfirmDelete({
        id: '',
        skill_id: '',
        show: false,
      })
      setLoading(false);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error('project deleted failed');
    }
  }

  useEffect(() => {
    fetchResource();
    fetchProjectSkills();
    fetchSkills(1, 10);
  }, [])

  const handleChangeInput = (index: any, event: any) => {
    const values: any = [...dataProjectSkills];
    values[index]['skill']['id'] = event.target.value;
    setDataProjectSkills(values);
  };

  const handleChangeInputSwitch = (index: any, event: any) => {
    const values: any = [...dataProjectSkills];
    values[index]['is_active'] = event.target.checked;
    setDataProjectSkills(values);
  };

  const handleRemoveFields = (index: any) => {
    const values: any = [...dataProjectSkills];
    values.splice(index, 1);
    setDataProjectSkills(values);
  };

  const handleAddFields = () => {
    setDataProjectSkills([...dataProjectSkills, {
      id: makeid(18),
      skill: {
        id: '',
        name: '',
        category: '',
        image_url: '',
        logo_url: '',
      },
      project: {
        id: params.id,
        title: '',
      },
      is_active: false,
    }]);
  };

  const handleSubmit = async () => {
    if (dataProjectSkillTemps.length != dataProjectSkills.length) {
      // filter only new data
      const newData = dataProjectSkills.filter(
        (dataProjectSkill) =>
          !dataProjectSkillTemps.some(
            (temp) =>
              temp.project.id === dataProjectSkill.project.id &&
              temp.skill.id === dataProjectSkill.skill.id
          )
      );
      // create project skill
      await Promise.all(
        newData.map(async (dataProjectSkill) => {
          const formData = new FormData();
          formData.append('project_id', `${dataProjectSkill.project.id}`);
          formData.append('skill_id', `${dataProjectSkill.skill.id}`);
          formData.append('is_active', `${dataProjectSkill.is_active}`);

          const message = await addProjectSkill(formData);
          if (message === 'SUCCESS') {
            toast.success('skill assign successfully');
          } else {
            toast.error(message);
          }
        })
      );
    } else { // updated data
      await Promise.all(dataProjectSkills.map(async (dataProjectSkill) => {
        const formData = new FormData();
        formData.append('is_active', `${dataProjectSkill.is_active}`);

        const message = await editProjectSkill(params.id, dataProjectSkill.skill.id, formData);
        if (message === 'SUCCESS') {
          toast.success('skill updated successfully');
        } else {
          toast.error(message);
        }
      }));
    }
    fetchProjectSkills();
  };

  if (loading) {
    // Show skeleton loading while data is being fetched
    return (
      <TableLoading
        itemsPerPage={itemsPerPage}
        columsPerPage={6}
      />
    );
  }

  if (dataProjectSkills?.length === 0) {
    return <>
      {
        resource?.data.includes('create') &&
        <Button
          variant="contained"
          onClick={() => {
            handleAddFields();
          }}
          disabled={loading}
        >
          Create
        </Button>
      }

      <TableDataNotFound />
    </>;
  }

  return (
    <>
      <Typography variant='body2' sx={{ marginBottom: 2 }}>
        Submit will do <br />
        - New data detected will be execute insert <br />
        - Change data will be updated <br />
        - Priority when change and add new data in same time, will ignore updated and do insert
      </Typography>

      {/* create button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {
          resource?.data.includes('create') &&
          <Button
            variant="contained"
            onClick={() => {
              handleAddFields();
            }}
            disabled={loading}
          >
            Create
          </Button>
        }
        {
          resource?.data.includes('create') &&
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
            disabled={loading}
          >
            Submit
          </Button>
        }
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ACTION</TableCell>
              <TableCell align="left">SKILL</TableCell>
              <TableCell align="left">STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataProjectSkills?.map((row: ProjectSkill, index) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center">
                  {resource?.data.includes('delete') &&
                    <Tooltip title="Delete">
                      <Button
                        onClick={() => setIsModalConfirmDelete({
                          id: index,
                          skill_id: row.skill.id,
                          show: true,
                        })}
                        color="error"
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  }
                </TableCell>
                <TableCell align="left">
                  {
                    skills && skills?.length > 0 &&
                    <FormControl fullWidth>
                      <InputLabel id="select-skill_id-label">Skill</InputLabel>
                      <Select
                        labelId="select-skill_id-label"
                        id="select-skill_id"
                        value={row.skill.id ?? ''}
                        label="Skill"
                        required
                        onChange={(event) => handleChangeInput(index, event)}
                      >
                        {
                          skills?.map((data: Skill) => {
                            return <MenuItem value={data.id} key={data.id}>{data.name}</MenuItem>
                          })
                        }
                      </Select>
                    </FormControl>
                  }
                </TableCell>
                <TableCell align="left">
                  <FormGroup>
                    <FormControlLabel control={
                      <Switch
                        name="is_active"
                        value={row.is_active}
                        checked={row.is_active === true}
                        onChange={(event) => handleChangeInputSwitch(index, event)}
                      />
                    } label="Active" />
                  </FormGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* modal confirmation delete */}
      <ModalConfirmation
        title={'Delete Confirmation'}
        description={"Are you sure you want to delete?"}
        confirmationText={'Yes'}
        open={isModalConfirmDelete.show}
        onCancel={() => setIsModalConfirmDelete({
          id: '',
          skill_id: '',
          show: false,
        })}
        onOk={handleDeleteProjectSkill}
        loading={loading}
      />
    </>
  );
};

export default TableProjectSkill;
